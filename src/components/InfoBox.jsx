import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import numeral from "numeral";
import "../styles/infoBox.css";

function InfoBox({ title, cases, total, active, ...props }) {
  const selectedStyle = (cases) => {
    let selectedStyle = "infoBoxCases";
    switch (cases) {
      case "Recovered":
        selectedStyle = "infoBoxRecovered";
        break;
      case "Deaths":
        selectedStyle = "infoBoxDeaths";
        break;
    }
    return selectedStyle;
  };

  return (
    <Card
      className={`infoBox ${active && selectedStyle(title)} ${
        title === "Recovered" ? "infoBoxNumbersGreen" : "infoBoxNumbers"
      }`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infoBoxTitle" color="textSecondary">
          {title}
        </Typography>
        <h2 className="">{"+" + numeral(cases).format("0.0a")}</h2>
        <Typography className="infoBoxTotal" color="textSecondary">
          Total: {numeral(total).format("0.0a")}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
