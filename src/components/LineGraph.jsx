import React from "react";
import { useTheme, Box } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { timeFormat } from "d3-time-format";

function LineGraph(props) {
  const { data, xAxisLabel, yAxisLabel } = props;
  const theme = useTheme();
  const formatTime = timeFormat("%b %d");

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 100, bottom: 50, left: 75 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        precision: "day",
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-,.0f"
      curve="cardinal"
      lineWidth={3}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxisLabel,
        legendOffset: 36,
        legendPosition: "middle",
        format: formatTime,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: xAxisLabel,
        legendOffset: -65,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      pointSize={3}
      colors={[theme.palette.secondary.main]}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      theme={{
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

export default LineGraph;
