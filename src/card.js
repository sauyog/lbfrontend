import React from "react"
import Card from '@material-ui/core/Card';
import { Box } from "@material-ui/core";



const CardComponent = ({ title, status, time}) => {
    return (
        <>
            <Box display="flex" flexDirection="row" mt="30px">
                <Box ml={30} p="10px" mb="10px" width="30%">
                    <Card style={{backgroundColor:'whitesmoke', height:"180px", display: 'flex', flexDirection:"column", justifyContent: 'center', alignItems: 'center'}}>
                        <p style={{fontSize:20, fontWeight:"bolder", WebkitTextFillColor:"darkblue"}}>{title}</p>
                        <Card style={{borderRadius:"8%", width:"120px", height:"40px", backgroundColor:"orange", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <p>{status}</p>
                        </Card>
                    </Card>
                </Box>
                <Box p="10px" mb="10px" width="30%">
                    <Card style={{backgroundColor: 'whitesmoke', height:"180px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p>{time}</p>
                    </Card >
                </Box>
            </Box>
         </>
    );
};

export default CardComponent