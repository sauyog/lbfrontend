import React, { Component } from 'react'
import Select from 'react-select'; 
import './counties.xlsx';
import background from "./img/1.jpg";
import CardComponent from "./card";
//import  text  from './data'; // Relative path to your File
// import { colors } from 'react-select/src/theme';
import axios from 'axios'
// const filestream = require("fs");
//var file = require('file-system');
//var fs = require('fs');



export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectOptions : [{value:'Santa Clara',label:'Santa Clara'},
       {value:'Alameda',label:'Alameda'}],
      id: '',
      name: '',
      status:'',
      predictionTime:'',
      response:{current_status: "moderate",
      prediction_vc: "Tue, 31 Aug 2021 00:00:00 GMT"}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getResponse = this.getResponse.bind(this)
  }

  handleChange(e){
   this.setState({id:e.value, name:e.label})
  }

  getResponse(){
    axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(res => {
        let response = res
        this.setState({status:response.current_status,
          predictionTime:response.prediction_vc})
      })

      // axios.post(`https://jsonplaceholder.typicode.com/users`, this.state.name)
      // .then(res => {
      //   let response = res
      //   this.setState({status:response.current_status,
      //     predictionTime:response.prediction_vc})
      // })
  }

  handleSubmit(e){
    e.preventDefault(); 
    let response = this.state.response
   this.setState({status:response.current_status,
    predictionTime:response.prediction_vc})
    // this.getResponse()
  }

  render() {
    const mystyle = {
      backgroundImage: `url(${background})`, 
      display:"block",
      height:100,
      padding: "30px",
      fontFamily: "Arial"
    };

    return (
      <div style = {{width: '1278px',textAlign: 'center', background:"whitesmoke",height:600}}>
        <image style={mystyle} > 
          <h2 style = {{textAlign: 'center', fontSize:40, padding:0, WebkitTextFillColor:"white"}} > 
            Lockdown Buster 
          </h2> 
        </image>

        <label>
            <p style = {{WebkitTextFillColor: "darkblue", textAlign: 'center', fontSize:25, fontWeight:"bolder"}}> COUNTY </p>
        </label>

        <form onSubmit={this.handleSubmit} >
              
          <div style={{width: 300, paddingLeft:'489px'}}>
            <Select options={this.state.selectOptions} onChange={this.handleChange.bind(this)} /> 
          </div>

          <div style={{paddingtop:20} }>
            <button style={{width:100, height:35, marginTop:20, backgroundColor:"blue", WebkitTextFillColor:"white"}} type="submit"> Status </button>
              <div>
                {this.state.status !== '' ?
                (<CardComponent title={this.state.name}
                    status={this.state.status}
                    time={this.state.predictionTime}/>):
                (<></>)}
              </div>
          </div>
        </form>
     </div> 
    )
  }
}