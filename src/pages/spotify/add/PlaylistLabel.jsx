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
    <Box display="flex" alignItems="center" flexDirection="column">
      <Tooltip
        title="Command click to open playlist on Spotify"
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
        />
      </Tooltip>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt="10px"
        rowGap={isPlaylistSelected ? "10px" : "5px"}
        columnGap="10px"
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
            <>
              <Typography>
                Followers: {playlist?.followers.toLocaleString("en-US")}
              </Typography>
              <Typography>Tracks: {playlist?.trackCount}</Typography>
            </>
          )
        )}
      </Box>
    </Box>
  );
}

export default PlaylistLabel;
