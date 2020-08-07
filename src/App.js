import React, { useState, useEffect  } from 'react';
import InfoBox from './InfoBox';
import './App.css';
import{ MenuItem , FormControl , Select, Card, CardContent} from "@material-ui/core" ;
import Map from './Map';
import Table from './Table';
import './Table.css';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";



function App() {
   const [countries,setCountries] =useState ([]);
   const [country, setCountry] =useState('worldwide');
   const [countryInfo, setCountryInfo] =useState({});
   const [tableData , setTableData] =useState([]);
   const [mapCenter,setMapCenter] =useState({lat:34.80746,lng:-40.4796});
   const [mapZoom,setMapZoom] =useState(2);
   const [mapCountries,setMapCountries] = useState([]);
   const [casesType, setCasesType] = useState("cases");
   

       useEffect(() => {
         fetch("https://disease.sh/v3/covid-19/all")
         .then(response => response.json())
         .then (data => {
           setCountryInfo (data);

         });
       }, []);
    
    
   useEffect(() => {     
     const getCountriesData =async () => {
      await fetch("//disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map((country) =>(
          {
            name:country.country,//full name of country
            value:country.countryInfo.iso2//just 2 letter of countrys
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
     });
    };
      getCountriesData();
   }, []);

     const onCountryChange=async (event) => {
     const countryCode =event.target.value;
     setCountry(countryCode);
     
     const url = countryCode === "worldwide"
      ?"https://disease.sh/v3/covid-19/all"
      :`https://disease.sh/v3/covid-19/countries/${countryCode}`;
     
     await fetch(url)
      .then (response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
   };


   //all the infos-> console.log('countryInfo>>>', countryInfo);
  return (
    <div className="app">
     <div className="app__left">    
      <div className="app__header">
      
                  <h1 className="cov">Cov-20</h1>
       <h5>Epic Covid-19 tracker globally<br />Created by &copy; <a title=" click to send a mail to knock "  href="mailto:https://freelancerrabiul24@gmail.com" target="_blank"> Md Rabiul </a><br/>
         <i>All datas are based on Worldometers, updated in every 10 minutes</i></h5>
        
       <FormControl className="app__dropdown">
        <Select
          variant="outlined"
          onChange={onCountryChange}
          value={country}>


        <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map(country =>( 
           <MenuItem value={country.value}>{country.name}</MenuItem>
              
            ))
          }
        

        </Select>

      </FormControl>
    </div>

     <div className="app__stats">
       

             <InfoBox
               isRed
               active={casesType ==="cases"}
               onClick={(e) =>setCasesType('cases')}
               title="Coronavirus Cases"
               cases={prettyPrintStat(countryInfo.todayCases)}
               total={prettyPrintStat(countryInfo.cases)}
              />

             <InfoBox
               active={casesType==="recovered"}
               onClick={(e) =>setCasesType("recovered")}
               title="Recovered"
               cases={prettyPrintStat(countryInfo.todayRecovered)} 
               total={prettyPrintStat(countryInfo.recovered)}
              />

             <InfoBox 
               isRed
               active={casesType==="deaths"}
               onClick={(e) =>setCasesType("deaths")}
               title="Deaths"
               cases={prettyPrintStat(countryInfo.todayDeaths)} 
               total={prettyPrintStat(countryInfo.deaths)}
              />
                 
    </div>

      <Map casesType={casesType}
           countries={mapCountries}
           center={mapCenter}
           zoom={mapZoom}

        />

     </div>
     <Card className="app_right">
       <CardContent>
         <h3 >Live Cases by country</h3>
          <Table countries ={tableData}/>

        <h4 >Worldwide new {casesType}</h4>
        <h6> in last 30Days</h6>
         <LineGraph className="app__graph" casesType={casesType} />
        
       </CardContent>      
     </Card>
     <Card>
       <p>
         
       </p>
     </Card>
     
    </div>   
       
  )};   


export default App;
