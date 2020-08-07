import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import "./InfoBox.css";
function InfoBox({ title, cases,isRed,active,total, ...props }) {
    return (
        <Card 
           onClick={props.onClick} 
           className={`infoBox && ${active && "infoBox--selected"}
           ${isRed && 'infoBox--red'}`}
          >
            <CardContent>
                {/*Card title like Corona cases */} 
             <Typography className="infoBox__title" color="textSecondary">
                  {title}
             </Typography> 
                
            <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>{/*1.200 cases */}              
            <Typography className="infoBox__total" color="textSecondary">{/*1.2m */} 
                {total}Total
            </Typography>                     
      
            </CardContent>
          </Card>
    )
}

export default InfoBox
