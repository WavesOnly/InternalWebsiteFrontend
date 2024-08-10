import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";

function BarGraph(props) {
  const { data, xAxisLabel, yAxisLabel } = props;
  const theme = useTheme();
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <ResponsiveBar
      data={data}
      keys={["value"]}
      indexBy="month"
      margin={{ top: 10, right: 25, bottom: 75, left: 75 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={[theme.palette.secondary.main]}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: isMedium ? 45 : 0,
        legend: xAxisLabel,
        legendOffset: 50,
        legendPosition: "middle",
        format: (value) => {
          if (isMedium) {
            return value.substring(0, 3) + ".";
          }
          return value;
        },
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
      role="application"
      ariaLabel=""
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
      theme={{
        text: {
          fontSize: 12,
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
              fontSize: 12,
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
