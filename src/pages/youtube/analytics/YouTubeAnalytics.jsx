import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useTheme, Box, Grid, Link, Skeleton } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import YouTubeIcon from "@mui/icons-material/YouTube";

import { getAnalytics } from "../../../slices/youtube/youtubeSlice";
import DashboardCard from "../../../components/DashboardCard";
import PageInfo from "../../../components/PageInfo";
import BarGraph from "../../../components/BarGraph";
import LineGraph from "../../../components/LineGraph";
import Spinner from "../../../components/Spinner";

function YouTubeAnalytics() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const analytics = useSelector((state) => state.youtube?.analytics);
  const loading = useSelector((state) => state.youtube?.loading);

  useEffect(() => {
    dispatch(getAnalytics());
  }, []);

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="YouTube Analytics"
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
            title={
              loading && !analytics?.viewCountPrevious28Days ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.viewCountPrevious28Days?.toLocaleString("en-US")
              )
            }
            subtitle="Views (28 Days)"
            icon={<YouTubeIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={
              loading && !analytics?.subscribersCountPrevious28Days ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.subscribersCountPrevious28Days?.toLocaleString(
                  "en-US"
                )
              )
            }
            subtitle="Subscribers (28 Days)"
            icon={<GroupIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={
              loading && !analytics?.estimatedRevenuePrevious28Days ? (
                <Skeleton width="35%" />
              ) : (
                `$${analytics?.estimatedRevenuePrevious28Days?.toLocaleString(
                  "en-US"
                )}`
              )
            }
            subtitle="Revenue (28 days)"
            icon={<AttachMoneyIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={
              loading && !analytics?.watchTimePrevious28Days ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.watchTimePrevious28Days?.toLocaleString("en-US")
              )
            }
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
            {analytics?.subscribersByDay?.length > 0 ? (
              <LineGraph
                data={analytics?.subscribersByDay}
                xAxisLabel="Subscribers"
                yAxisLabel="Date"
              />
            ) : (
              <Spinner />
            )}
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
            {analytics?.revenueByMonth?.length > 0 ? (
              <BarGraph
                data={analytics?.revenueByMonth}
                xAxisLabel="Month"
                yAxisLabel="Revenue ($)"
              />
            ) : (
              <Spinner />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <DashboardCard
            title={
              loading && !analytics?.viewCount ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.viewCount?.toLocaleString("en-US")
              )
            }
            subtitle="Total Views"
            icon={<YouTubeIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <DashboardCard
            title={
              loading && !analytics?.subscriberCount ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.subscriberCount?.toLocaleString("en-US")
              )
            }
            subtitle="Total Subscribers"
            icon={<GroupIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
export default YouTubeAnalytics;
