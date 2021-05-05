from flask import Flask, render_template, request,json
import requests
import pandas as pd
from fbprophet import Prophet
app = Flask(__name__)

def getPrediction(county_name):
    county = pd.read_csv("dataset/CountyWiseCases.csv")
    county['date'] = pd.DatetimeIndex(county['date'])
    df = county.loc[(county["area"] == county_name)]

    #getting current status
    curr = get_current_status(df)

    #getting active case prediction
    apr = get_active_case_prediction(df,df.population.unique()[0])

    #getting vaccination prediction
    vpr = get_vaccination_prediction(county_name,df.population.unique()[0])
    return {"prediction_ac" : apr,"prediction_vc" : vpr,"current_status":curr}

def get_vaccination_prediction(county_name, population):
    df = pd.read_csv("dataset/covid19vaccinesbycounty.csv", usecols=[0, 1, 13])
    df['administered_date'] = pd.DatetimeIndex(df['administered_date'])
    # Getting the county wise data
    df = df.loc[(df["county"] == county_name)]
    del df['county']
    df = df.iloc[::-1]
    df['ds'] = pd.DatetimeIndex(df['administered_date'])
    df.drop('administered_date', axis=1, inplace=True)
    df_train = df[0:]
    df_train.columns = ['y', 'ds']
    vp = vac_predMod(df_train);
    date_op = "2021-07-19"
    for index, row in vp.iterrows():
        if(row['yhat'] > population):
            date_op = row['ds']
            break;

    return date_op;



def get_active_case_prediction(df, population):
    df = df[df['date'] > '2020-12-01']
    df = df[["date", "reported_cases"]]
    df['ds'] = pd.DatetimeIndex(df['date'])
    df.drop('date', axis=1, inplace=True)
    df_train = df[0:]
    df_train.columns = ['y', 'ds']
    pr = ac_preMod(df_train)
    fc = pr[['ds', 'yhat']].tail(7)
    c_sum = 0;
    div = population/ 100000
    for index, row in fc.iterrows():
        if (row['yhat'] > 0):
            t_a = row['yhat'] / div
            c_sum += t_a
    pos = c_sum / 7;
    return pos


def vac_predMod(df_train):
    m = Prophet(interval_width=0.95)
    model = m.fit(df_train)
    future = m.make_future_dataframe(periods=360, freq='D')
    forecast = m.predict(future)
    return forecast

def ac_preMod(df_train):
    m = Prophet(interval_width=0.95, changepoint_prior_scale=0.5)
    model = m.fit(df_train)
    future = m.make_future_dataframe(periods=180, freq='D')
    forecast = m.predict(future)
    return forecast

def get_current_status(df):
    cs = df[df['date'] > '2021-04-16']
    cs = cs[1:]

    # calculating current number of cases per 100k
    mean = cs.agg({'reported_cases': ['mean']})
    population = cs.population.unique()
    div = population[0] / 100000
    curr_cases = mean['reported_cases'] / div
    curr_cases = curr_cases['mean']
    print(curr_cases)

    # calculating average positive tests
    c_sum = 0;
    for index, row in cs.iterrows():
        t_avg = (row['positive_tests'] / row['reported_tests']) * 100
        c_sum += t_avg
    pos = c_sum / 7;
    print(pos)

    if curr_cases < 2.0 and pos <2.0:
        status = 'minimal'
    elif (curr_cases > 2.0 and  curr_cases < 5.9) and (pos <4.9):
        status = 'moderate'
    elif (curr_cases > 6.0 and  curr_cases < 10) and (pos <8):
        status = 'substantial'
    else:
        status = 'widespread'
    return status




    
@app.route('/')
def hello_world():
    return "Predictor"	

@app.route("/predict", methods=['POST'])
def predict():
    Fuel_Type_Diesel=0
    if request.method == 'POST':
        county = json.loads(request.data)['county']
        return getPrediction(county)


if __name__ == '__main__':
    app.run()


