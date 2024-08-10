import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { timeFormat } from "d3-time-format";

function LineGraph(props) {
  const { data, xAxisLabel, yAxisLabel } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const formatTime = timeFormat("%b %d");

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 25, bottom: 75, left: 75 }}
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
      lineWidth={3}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: isMedium ? 45 : 0, // Rotate labels on small screens
        legend: yAxisLabel,
        legendOffset: 50,
        legendPosition: "middle",
        format: (value) => {
          if (isSmall) {
            return formatTime(value).split(" ")[1];
          }
          return formatTime(value);
        },
        tickValues: isSmall ? "every 2 days" : undefined,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: xAxisLabel,
        legendOffset: -65,
        legendPosition: "middle",
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

export default LineGraph;
