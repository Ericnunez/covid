import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import "leaflet/dist/leaflet.css";
import "./styles/app-styles.css";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import { sortData, accumulateCases } from "./utilities";
import numeral from "numeral";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data
            .map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2,
            }))
            .filter((country) => country.value !== null);
          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const URL =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        countryCode === "Worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="appLeft">
        <div className="header">
          <div className="headerLeft">
            <h1>Coronavirus Tracker</h1>
            <Typography variant="subtitle2">
              Coronavirus Tracker is a project implementing the open api
              provided by disease.sh. The numbers reported are subject to change
              as new data is reported.
            </Typography>
          </div>

          <FormControl size="medium" className="dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem
                  key={country.value + Math.random}
                  value={country.value}
                >
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="stats">
          <InfoBox
            onClick={(event) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
            active={casesType === "cases"}
          ></InfoBox>
          <InfoBox
            onClick={(event) => setCasesType("recovered")}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
            active={casesType === "recovered"}
          ></InfoBox>
          <InfoBox
            onClick={(event) => setCasesType("deaths")}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
            active={casesType === "deaths"}
          ></InfoBox>
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        ></Map>
        <Typography variant="subtitle1">
          Click on a circle to get more information about that country.
        </Typography>
      </div>
      <div className="appRight">
        <Card className="topCard">
          <CardContent>
            <div>
              <h1>
                {country === "Worldwide" ? "Worldwide" : countryInfo.country}{" "}
                Stats
              </h1>
              <hr />
              <Typography variant="h5">
                <strong className="topCardTitle">Population: </strong>
                {numeral(countryInfo.population).format("0,0")}
              </Typography>
              <Typography variant="h5">
                <strong className="topCardTitle">Tests: </strong>
                {numeral(countryInfo.tests).format("0,0")}
              </Typography>
              <Typography variant="h5">
                <strong className="topCardTitle">Tests per million: </strong>
                {numeral(countryInfo.testsPerOneMillion).format("0,0")}
              </Typography>
              <Typography variant="h5">
                <strong className="topCardTitle">Active cases: </strong>
                {numeral(countryInfo.active).format("0,0")}
              </Typography>
              <Typography variant="h5">
                <strong className="topCardTitle">Total cases: </strong>
                {numeral(countryInfo.cases).format("0,0")}
              </Typography>
              <Typography variant="h5">
                <strong className="topCardTitle">Critical cases: </strong>
                {numeral(countryInfo.critical).format("0,0")}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="information">
              <h1>Cases by country</h1>
              <Table countries={tableData}></Table>
              <h1>Worldwide {casesType} </h1>
            </div>
            <LineGraph className="appGraph" casesType={casesType}></LineGraph>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
