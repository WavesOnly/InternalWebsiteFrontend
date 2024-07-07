import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useTheme, Box, Grid, Link, CircularProgress } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import YouTubeIcon from "@mui/icons-material/YouTube";

import LineGraph from "../../../components/LineGraph";
import BarGraph from "../../../components/BarGraph";
import DashboardCard from "../../../components/DashboardCard";
import { getAnalytics } from "../../../slices/youtube/youtubeSlice";

import PageInfo from "../../../components/PageInfo";

function YouTubeAnalytics() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const analytics = useSelector((state) => state.youtube?.analytics);

  useEffect(() => {
    dispatch(getAnalytics());
  }, []);

  return (
    <Box m="20px">
      <PageInfo
        title="YOUTUBE ANALYTICS"
        subTitle="Dive into your YouTube dashboard"
        buttonWidth="200px"
        LinkComponent={() => (
          <Link
            href="https://studio.youtube.com/channel/UC9RKqI3GeK_fdHdQyaB5laQ/analytics/tab-overview/period-default"
            target="_blank"
            color="inherit"
            style={{ textDecoration: "none" }}
          >
            Open YouTube Analytics
          </Link>
        )}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={analytics?.viewCountPrevious28Days?.toLocaleString("en-US")}
            subtitle="Views (28 Days)"
            icon={<YouTubeIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={analytics?.subscribersCountPrevious28Days?.toLocaleString(
              "en-US"
            )}
            subtitle="Subscribers (28 Days)"
            icon={<GroupIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={`$${analytics?.estimatedRevenuePrevious28Days}`}
            subtitle="Revenue (28 days)"
            icon={<AttachMoneyIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={(analytics?.watchTimePrevious28Days / 60)?.toLocaleString(
              "en-US"
            )}
            subtitle="Watch Time (28 days)"
            icon={<HourglassBottomIcon />}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={6}
          sx={{ height: "50vh", p: 0, m: 0 }}
        >
          <Box
            sx={{
              height: "100%",
              p: "15px",
              backgroundColor: theme?.palette.layer.default,
              border:
                theme.palette.mode === "dark"
                  ? ""
                  : "1px solid rgba(0, 0, 0, 0.23);",
              borderRadius: "4px",
            }}
          >
            <BarGraph xAxisLabel="Month" yAxisLabel="Revenue ($)" />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={6}
          sx={{ height: "50vh", p: 0, m: 0 }}
        >
          <Box
            sx={{
              height: "100%",
              p: "15px",
              backgroundColor: theme?.palette.layer.default,
              border:
                theme.palette.mode === "dark"
                  ? ""
                  : "1px solid rgba(0, 0, 0, 0.23);",
              borderRadius: "4px",
            }}
          >
            {analytics?.subscribersByDay ? (
              <LineGraph
                data={analytics?.subscribersByDay}
                xAxisLabel="Subscribers"
                yAxisLabel="Date"
              />
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <DashboardCard
            title={analytics?.viewCount?.toLocaleString("en-US")}
            subtitle="Total Views"
            icon={<YouTubeIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <DashboardCard
            title={analytics?.subscriberCount?.toLocaleString("en-US")}
            subtitle="Total Subscribers"
            icon={<GroupIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
export default YouTubeAnalytics;
