import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import "leaflet/dist/leaflet.css";
import "./styles/app-styles.css";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import { sortData } from "./utilities";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["Worldwide"]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
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
          <h1>Coronavirus World Tracker</h1>
          <FormControl className="dropdown">
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
          ></InfoBox>
          <InfoBox
            onClick={(event) => setCasesType("recovered")}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            onClick={(event) => setCasesType("deaths")}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          ></InfoBox>
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        ></Map>
      </div>
      <Card className="appRight">
        <CardContent>
          <div className="information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}></Table>
            <h3>Worldwide {casesType} </h3>
          </div>
          <LineGraph className="appGraph" casesType={casesType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
