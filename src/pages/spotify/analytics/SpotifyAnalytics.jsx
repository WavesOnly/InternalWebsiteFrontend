import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  useTheme,
  Box,
  InputLabel,
  FormControl,
  Grid,
  Link,
  Select,
  MenuItem,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

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
  const playlistFollowerHistoryId = useSelector(
    (state) => state.spotify?.playlistFollowerHistoryId
  );
  const followerData = useSelector(
    (state) => state.spotify.playlistFollowerHistory
  );
  const loading = useSelector((state) => state.spotify.loading);

  const handleSelectChange = (event) => {
    const playlistId = event.target.value;
    dispatch(setPlaylistFollowerHistoryId(playlistId));
  };

  useEffect(() => {
    dispatch(getPlaylists());
  }, []);

  useEffect(() => {
    dispatch(getPlaylistFollowerHistory({ playlistId: null }));
  }, []);

  useEffect(() => {
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
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={
              !loading && analytics?.playlistFollowers?.toLocaleString("en-US")
            }
            subtitle="Total Playlist Followers"
            icon={<QueueMusicIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={
              !loading && analytics?.accountFollowers?.toLocaleString("en-US")
            }
            subtitle="Total Account Followers"
            icon={<GroupIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={
              !loading &&
              analytics?.playlistFollowersPrevious28Days?.toLocaleString(
                "en-US"
              )
            }
            subtitle="New Playlist Followers (28 days)"
            icon={<PlaylistAddIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            title={
              !loading &&
              analytics?.accountFollowersPrevious28Days?.toLocaleString("en-US")
            }
            subtitle="New Account Followers (28 days)"
            icon={<PersonAddIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl sx={{ minWidth: 250 }} size="small">
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
        <Grid item xs={0} sm={6} lg={9}></Grid>
        <Grid item xs={12} sx={{ height: "50vh", p: 0, mb: "20px" }}>
          <Box
            sx={{
              height: "50vh",
              p: "15px",
              backgroundColor: theme?.palette.layer.default,
              border:
                theme.palette.mode === "dark"
                  ? ""
                  : "1px solid rgba(0, 0, 0, 0.23);",
              borderRadius: "4px",
            }}
          >
            {!loading ? (
              <LineGraph
                data={followerData}
                xAxisLabel="Followers"
                yAxisLabel="Date"
              />
            ) : (
              <Spinner />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SpotifyAnalytics;
