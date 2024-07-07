import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";

function BarGraph(props) {
  const {
    // data
    xAxisLabel,
    yAxisLabel,
  } = props;
  const theme = useTheme();
  const data = [
    {
      month: "January",
      Revenue: 50,
    },
    {
      month: "February",
      Revenue: 60,
    },
    {
      month: "March",
      Revenue: 70,
    },
    {
      month: "April",
      Revenue: 80,
    },
    {
      month: "May",
      Revenue: 90,
    },
    {
      month: "June",
      Revenue: 100,
    },
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={["Revenue"]}
      indexBy="month"
      margin={{ top: 10, right: 110, bottom: 50, left: 75 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={[theme.palette.secondary.main]}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: xAxisLabel,
        legendPosition: "middle",
        legendOffset: 45,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxisLabel,
        legendPosition: "middle",
        legendOffset: -65,
        truncateTickAt: 0,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          // itemOpacity: 0.85,
          symbolSize: 15,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel=""
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
      theme={{
        text: {
          fontSize: 14,
          fill: "white",
        },
        axis: {
          ticks: {
            line: {
              stroke: theme.palette.mode === "dark" ? "white" : "",
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.mode === "dark" ? "white" : "",
            },
          },
          legend: {
            text: {
              fill: theme.palette.mode === "dark" ? "white" : "",
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.mode === "dark" ? "white" : "",
          },
        },
        tooltip: {
          container: {
            color: "black",
          },
        },
      }}
    />
  );
}

export default BarGraph;
