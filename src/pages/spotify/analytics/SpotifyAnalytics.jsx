import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useTheme,
  useMediaQuery,
  Box,
  InputLabel,
  FormControl,
  Grid,
  Link,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import UpdateIcon from "@mui/icons-material/Update";

import {
  getPlaylists,
  getPlaylistFollowerHistory,
  setPlaylistFollowerHistoryId,
  getAnalytics,
} from "../../../slices/spotify/spotifySlice";
import PageInfo from "../../../components/PageInfo";
import DashboardCard from "../../../components/DashboardCard";
import LineGraph from "../../../components/LineGraph";
import Spinner from "../../../components/Spinner";

function SpotifyAnalytics() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const analytics = useSelector((state) => state.spotify?.analytics);
  const playlists = useSelector((state) => state.spotify?.playlists);
  const loading = useSelector((state) => state.spotify.loading);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const playlistFollowerHistoryId = useSelector(
    (state) => state.spotify?.playlistFollowerHistoryId
  );
  const followerData = useSelector(
    (state) => state.spotify.playlistFollowerHistory
  );
  const playlistObject = playlists.find(
    (playlist) => playlist.id === playlistFollowerHistoryId
  );

  const handleSelectChange = (event) => {
    const playlistId = event.target.value;
    dispatch(setPlaylistFollowerHistoryId(playlistId));
  };

  useEffect(() => {
    !playlists.length && dispatch(getPlaylists());
    dispatch(getAnalytics());
  }, []);

  useEffect(() => {
    dispatch(
      getPlaylistFollowerHistory({ playlistId: playlistFollowerHistoryId })
    );
  }, [playlistFollowerHistoryId]);

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="Spotify Analytics"
        subTitle="Dive into your Spotify dashboard"
        buttonWidth="200px"
        LinkComponent={() => (
          <Link
            href="https://open.spotify.com/user/w5sxze6rmcbs22r6w22ks8zme"
            target="_blank"
            color="inherit"
            style={{ textDecoration: "none" }}
          >
            Open Spotify Account
          </Link>
        )}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <DashboardCard
            title={
              loading && !analytics?.playlistFollowers ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.playlistFollowers?.toLocaleString("en-US")
              )
            }
            subtitle="Total Playlist Followers"
            icon={<QueueMusicIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <DashboardCard
            title={
              loading && !analytics?.accountFollowers ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.accountFollowers?.toLocaleString("en-US")
              )
            }
            subtitle="Total Account Followers"
            icon={<GroupIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <DashboardCard
            title={
              loading && !analytics?.playlistFollowersPrevious28Days ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.playlistFollowersPrevious28Days?.toLocaleString(
                  "en-US"
                )
              )
            }
            subtitle="New Playlist Followers (28 days)"
            icon={<PlaylistAddIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <DashboardCard
            title={
              loading && !analytics?.accountFollowersPrevious28Days ? (
                <Skeleton width="35%" />
              ) : (
                analytics?.accountFollowersPrevious28Days?.toLocaleString(
                  "en-US"
                )
              )
            }
            subtitle="New Account Followers (28 days)"
            icon={<PersonAddIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControl
            sx={{ minWidth: 250 }}
            size="small"
            fullWidth={isSmall ? true : false}
          >
            <InputLabel
              id="playlist-select"
              sx={{
                "&.Mui-focused": {
                  color: theme.palette.mode === "dark" ? "white" : "",
                },
              }}
            >
              Playlist
            </InputLabel>
            <Select
              labelId="playlist-select"
              value={playlistFollowerHistoryId}
              onChange={handleSelectChange}
              label="Playlist"
              sx={{
                backgroundColor: theme.palette.layer.default,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.secondary.main,
                },
              }}
              disabled={loading && !playlists.length}
            >
              <MenuItem value="">All Playlists</MenuItem>
              {playlists.map((playlist) => (
                <MenuItem key={playlist?.id} value={playlist?.id}>
                  {playlist?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ height: "50vh", p: 0, mb: "20px" }}>
          <Box
            sx={{
              borderRadius: "8px",
              height: "50vh",
              p: "15px",
              backgroundColor: theme?.palette.layer.default,
              border:
                theme.palette.mode === "dark"
                  ? ""
                  : "1px solid rgba(0, 0, 0, 0.23);",
            }}
          >
            {loading ? (
              <Spinner />
            ) : (
              <LineGraph
                data={followerData}
                xAxisLabel="Followers"
                yAxisLabel="Date"
              />
            )}
          </Box>
        </Grid>
        {playlistFollowerHistoryId && (
          <>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
              <DashboardCard
                title={
                  loading && !followerData ? (
                    <Skeleton width="35%" />
                  ) : (
                    followerData[0]["data"][
                      followerData[0]["data"].length - 1
                    ]?.y?.toLocaleString("en-US")
                  )
                }
                subtitle="Follower Count"
                icon={<QueueMusicIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
              <DashboardCard
                title={
                  loading && !followerData ? (
                    <Skeleton width="35%" />
                  ) : (
                    playlistObject?.averageGrowth
                      .toFixed(2)
                      ?.toLocaleString("en-us")
                  )
                }
                subtitle="Avg. Growth per Day"
                icon={<TrendingUpIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
              <DashboardCard
                title={
                  loading && !followerData ? (
                    <Skeleton width="35%" />
                  ) : (
                    new Date(playlistObject?.lastUpdated).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  )
                }
                subtitle="Last Updated"
                icon={<UpdateIcon />}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default SpotifyAnalytics;
