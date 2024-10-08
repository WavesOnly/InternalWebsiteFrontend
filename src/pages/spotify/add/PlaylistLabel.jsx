import React from "react";
import {
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import PlaylistSelected from "./PlaylistSelected";

function PlaylistLabel(props) {
  const { playlist, newSong, handleSelectChange } = props;
  const theme = useTheme();
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const isPlaylistSelected = newSong.playlists.some(
    (item) => item.id === playlist.id
  );

  return (
    <Box display="flex" alignItems="center" flexDirection="column" width="100%">
      <Tooltip
        title="Command click to open on Spotify"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -65],
                },
              },
            ],
          },
        }}
      >
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          style={{
            width: "90%",
            height: "90%",
            border: isPlaylistSelected
              ? theme.palette.mode === "dark"
                ? "2px solid white"
                : `2px solid ${theme.palette.secondary.main}`
              : "",
          }}
          onClick={(e) => {
            handleSelectChange(playlist.id, "selected", !isPlaylistSelected);
          }}
        />
      </Tooltip>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt="10px"
        width="100%"
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "black",
          textAlign: "center",
        }}
      >
        {isPlaylistSelected ? (
          <PlaylistSelected
            newSong={newSong}
            playlist={playlist}
            handleSelectChange={handleSelectChange}
          />
        ) : (
          !isMedium && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              rowGap="10px"
              width="100%"
            >
              <Typography
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Followers: {playlist?.followers.toLocaleString("en-US")}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Tracks: {playlist?.trackCount}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Last Updated:{" "}
                {new Date(playlist?.lastUpdated).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}

export default PlaylistLabel;
