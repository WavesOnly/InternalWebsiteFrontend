import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useTheme,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import YouTubeIcon from "@mui/icons-material/YouTube";

import {
  getPlaylists,
  getPlaylistFollowerHistory,
  setPlaylistFollowerHistoryId,
} from "../../slices/spotify/spotifySlice";
import { getSubscribersByDay } from "../../slices/youtube/youtubeSlice";
import LineGraph from "../../components/LineGraph";
import PageInfo from "../../components/PageInfo";
import DashboardCard from "../../components/DashboardCard";
import Spinner from "../../components/Spinner";

function Home() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.spotify?.playlists);
  const loadingSpotify = useSelector((state) => state.spotify.loading);
  const loadingYouTube = useSelector((state) => state.youtube.loading);
  const playlistFollowerHistoryId = useSelector(
    (state) => state.spotify?.playlistFollowerHistoryId
  );
  const followerData = useSelector(
    (state) => state.spotify.playlistFollowerHistory
  );
  const analytics = useSelector((state) => state.youtube?.analytics);

  const handleSelectChange = (event) => {
    const playlistId = event.target.value;
    dispatch(setPlaylistFollowerHistoryId(playlistId));
  };

  useEffect(() => {
    !playlists.length && dispatch(getPlaylists());
    dispatch(getSubscribersByDay());
  }, []);

  useEffect(() => {
    dispatch(
      getPlaylistFollowerHistory({ playlistId: playlistFollowerHistoryId })
    );
  }, [playlistFollowerHistoryId]);

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="Welcome Alex & Daniel"
        subTitle="This is your personal dashboard"
        buttonWidth="200px"
        LinkComponent={null}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <DashboardCard
            title="Open SubmitHub"
            subtitle=""
            icon={<HubIcon />}
            navigateUrl="https://submithub.com"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <DashboardCard
            title="Open YouTube Studio"
            subtitle=""
            icon={<YouTubeIcon />}
            navigateUrl="https://studio.youtube.com/channel/UC9RKqI3GeK_fdHdQyaB5laQ"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard
            title="Open Spotify"
            subtitle=""
            icon={<LibraryMusicIcon />}
            navigateUrl="https://open.spotify.com/user/w5sxze6rmcbs22r6w22ks8zme"
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
              disabled={loadingSpotify && !playlists.length}
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
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={6}
          sx={{
            height: "50vh",
            p: 0,
            mb: {
              xl: "20px",
            },
          }}
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
            {loadingSpotify ? (
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
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={6}
          sx={{ height: "50vh", p: 0, mb: "20px" }}
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
            {loadingYouTube ? (
              <Spinner />
            ) : (
              <LineGraph
                data={analytics?.subscribersByDay}
                xAxisLabel="Subscribers"
                yAxisLabel="Date"
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
