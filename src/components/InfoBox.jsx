import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import numeral from "numeral";
import "../styles/infoBox.css";

function InfoBox({ title, cases, total, ...props }) {
  return (
    <Card className="infoBox" onClick={props.onClick}>
      <CardContent>
        <Typography className="infoBoxTitle" color="textSecondary">
          {title}
        </Typography>
        <h2 className="infoBoxCases">{"+" + numeral(cases).format("0.0a")}</h2>
        <Typography className="infoBoxTotal" color="textSecondary">
          Total: {numeral(total).format("0.0a")}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
