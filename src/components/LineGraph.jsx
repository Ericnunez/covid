import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType, ...props }) {
  const [data, setData] = useState({});
  const [graphColor, setGraphColor] = useState("rgba(204, 16, 52, 0.5)");
  const [graphBorderColor, setGraphBorderColor] = useState("#CC1034");

  useEffect(() => {
    changeGraphColor(casesType);
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  const changeGraphColor = (casesType) => {
    if (casesType === "recovered") {
      setGraphColor("rgba(0, 102, 0, 0.5)");
      setGraphBorderColor("#006600");
    } else if (casesType === "deaths") {
      setGraphColor("rgba(251, 68, 67, 0.5)");
      setGraphBorderColor("#fb4443");
    } else {
      setGraphColor("rgba(204, 16, 52, 0.5)");
      setGraphBorderColor("#CC1034");
    }
  };

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: graphColor,
                borderColor: graphBorderColor,
                data: data,
              },
            ],
          }}
        ></Line>
      )}
    </div>
  );
}

export default LineGraph;
