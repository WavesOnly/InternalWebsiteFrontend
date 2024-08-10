import React from "react";
import {
  useTheme,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

function PlaylistSelected(props) {
  const { newSong, playlist, handleSelectChange } = props;
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      rowGap="10px"
      sx={{ width: "90%" }}
    >
      <FormControl
        variant="outlined"
        size="small"
        onClick={(e) => e.stopPropagation()}
      >
        <InputLabel
          id={`position-select-${playlist.id}`}
          sx={{
            "&.Mui-focused": {
              color: theme.palette.mode === "dark" ? "white" : "",
            },
          }}
        >
          Position
        </InputLabel>
        <Select
          labelId={`position-select-${playlist.id}`}
          defaultValue=""
          value={
            newSong.playlists.find((item) => item.id === playlist.id)?.position
          }
          onChange={(e) =>
            handleSelectChange(playlist.id, "position", e.target.value)
          }
          label="Position"
          sx={{
            minWidth: "150px",
            backgroundColor: theme.palette.layer.default,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.secondary.main,
            },
          }}
        >
          {[...Array(playlist?.trackCount).keys()].map((number) => (
            <MenuItem key={number} value={number + 1}>
              {number + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        size="small"
        onClick={(e) => e.stopPropagation()}
      >
        <InputLabel
          id={`duration-select-${playlist.id}`}
          sx={{
            "&.Mui-focused": {
              color: theme.palette.mode === "dark" ? "white" : "",
            },
          }}
        >
          Duration
        </InputLabel>
        <Select
          labelId={`duration-select-${playlist.id}`}
          defaultValue=""
          value={
            newSong.playlists.find((item) => item.id === playlist.id)?.duration
          }
          onChange={(e) =>
            handleSelectChange(playlist.id, "duration", e.target.value)
          }
          label="Duration"
          sx={{
            minWidth: "150px",
            backgroundColor: theme.palette.layer.default,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.secondary.main,
            },
          }}
        >
          <MenuItem value={30}>1 Month</MenuItem>
          <MenuItem value={60}>2 Months</MenuItem>
          <MenuItem value={90}>3 Months</MenuItem>
          <MenuItem value="Indefinite">Indefinite</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default PlaylistSelected;
