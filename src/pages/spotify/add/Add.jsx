import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useMediaQuery,
  Box,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Link,
  FormHelperText,
  FormControl,
  Skeleton,
  Paper,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AddCommentIcon from "@mui/icons-material/AddComment";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import { getPlaylists, addSong } from "../../../slices/spotify/spotifySlice";
import { setAlert } from "../../../slices/user/userSlice";
import PageInfo from "../../../components/PageInfo";
import PlaylistLabel from "./PlaylistLabel";
import { openExternalLink } from "../../../utils/openExternalLink";
import { useTheme } from "@emotion/react";

function Add() {
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const theme = useTheme();
  const playlists = useSelector((state) => state.spotify.playlists);
  const loading = useSelector((state) => state.spotify.loading);
  const [newSong, setNewSong] = useState({
    link: "",
    type: "",
    playlists: [],
    comment: "",
  });
  const [formValidation, setFormValidation] = useState({
    link: false,
    type: false,
    playlists: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (e?.nativeEvent?.ctrlKey || e?.nativeEvent?.metaKey) {
      openExternalLink(`https://open.spotify.com/playlist/${name}`);
    } else {
      updatePlaylists(name, checked);
    }
  };

  const handleInputChange = (name, value) => {
    setNewSong((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRadioChange = (value) => {
    setNewSong((prevState) => ({
      ...prevState,
      type: value,
    }));
  };

  const updatePlaylists = (playlistId, checked) => {
    setNewSong((prevState) => ({
      ...prevState,
      playlists: checked
        ? [
            ...prevState.playlists,
            { id: playlistId, position: "", duration: "" },
          ]
        : prevState.playlists.filter((playlist) => playlist.id !== playlistId),
    }));
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    switch (type) {
      case "radio":
        handleRadioChange(value);
        break;
      case "checkbox":
        handleCheckboxChange(e);
        break;
      default:
        handleInputChange(name, value);
    }
  };

  const handlePaperClick = (event, playlistId) => {
    if (event.ctrlKey || event.metaKey) {
      openExternalLink(`https://open.spotify.com/playlist/${playlistId}`);
    } else {
      const changeEvent = {
        target: {
          name: playlistId,
          type: "checkbox",
          checked: !newSong.playlists.some((item) => item.id === playlistId),
        },
      };
      handleChange(changeEvent);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const playlistsValid = newSong.playlists.every(
      (playlist) =>
        playlist.duration &&
        playlist.position !== "" &&
        playlist.position !== null
    );

    const newFormValidation = {
      link: !newSong.link,
      type: !newSong.type,
      playlists: newSong.playlists.length === 0 || !playlistsValid,
    };

    setFormValidation(newFormValidation);

    const isFormValid =
      !newFormValidation.link &&
      !newFormValidation.type &&
      !newFormValidation.playlists;

    if (isFormValid) {
      try {
        const result = await dispatch(addSong(newSong)).unwrap();
        setNewSong({ link: "", type: "", playlists: [], comment: "" });
        dispatch(setAlert({ alert: result.message, severity: "success" }));
      } catch (err) {
        dispatch(
          setAlert({
            alert: `Add failed: ${err.detail.message || "Unknown error"}`,
            severity: "error",
          })
        );
      } finally {
        dispatch(getPlaylists());
      }
    }
  };

  const handleSelectChange = (playlistId, key, value) => {
    setNewSong((prevState) => ({
      ...prevState,
      playlists: prevState.playlists.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, [key]: value } : playlist
      ),
    }));
  };

  useEffect(() => {
    !playlists.length && dispatch(getPlaylists());
  }, []);

  useEffect(() => {
    setFormValidation((prevState) => ({
      ...prevState,
      link: newSong.link ? false : prevState.link,
      type: newSong.type ? false : prevState.type,
      playlists: newSong.playlists ? false : prevState.playlists,
    }));
  }, [newSong]);

  return (
    <Box
      mt="0px"
      ml="20px"
      mr="20px"
      mb="20px"
      display="flex"
      flexDirection="column"
    >
      <PageInfo
        title="Add Song"
        subTitle="Add a song to any of the WavesOnly playlists"
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
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <FormGroup>
          <Box display="flex" alignItems="center">
            <TextField
              label="Spotify Link"
              variant="outlined"
              name="link"
              type="text"
              size="small"
              margin="normal"
              autoComplete="off"
              value={newSong.link}
              onChange={handleChange}
              error={formValidation.link}
              color="secondary"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MusicNoteIcon />
                  </InputAdornment>
                ),
              }}
              disabled={loading && !playlists.length}
              sx={{
                flexGrow: 1,
                backgroundColor: theme.palette.layer.default,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.secondary.main,
                },
              }}
            />
            {!isMedium && (
              <FormControl
                component="fieldset"
                error={formValidation.type}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RadioGroup
                  size="small"
                  color="secondary"
                  name="type"
                  value={newSong.type}
                  onChange={handleChange}
                  row
                  sx={{ ml: 2, mr: -2 }}
                >
                  <FormControlLabel
                    value="Curation"
                    control={
                      <Radio
                        size="small"
                        color="secondary"
                        disabled={loading && !playlists.length}
                      />
                    }
                    label="Curation"
                  />
                  <FormControlLabel
                    value="Promotion"
                    control={
                      <Radio
                        size="small"
                        color="secondary"
                        disabled={loading && !playlists.length}
                      />
                    }
                    label="Promotion"
                  />
                </RadioGroup>
                {formValidation.type && (
                  <FormHelperText>Please select an option</FormHelperText>
                )}
              </FormControl>
            )}
          </Box>
          <TextField
            name="comment"
            value={newSong.comment}
            label="Comment"
            multiline
            margin="normal"
            size="small"
            color="secondary"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddCommentIcon />
                </InputAdornment>
              ),
            }}
            disabled={loading && !playlists.length}
            sx={{
              backgroundColor: theme.palette.layer.default,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.main,
              },
            }}
          />
          {isMedium && (
            <FormControl
              component="fieldset"
              error={formValidation.type}
              sx={{ display: "flex", alignItems: "flex-start" }}
            >
              <RadioGroup
                size="small"
                color="secondary"
                name="type"
                value={newSong.type}
                onChange={handleChange}
                row
              >
                <FormControlLabel
                  value="Curation"
                  control={<Radio size="small" color="secondary" />}
                  label="Curation"
                />
                <FormControlLabel
                  value="Promotion"
                  control={<Radio size="small" color="secondary" />}
                  label="Promotion"
                />
              </RadioGroup>
              {formValidation.type && (
                <FormHelperText>Please select an option</FormHelperText>
              )}
            </FormControl>
          )}
          <FormControl component="fieldset" error={formValidation.playlists}>
            <FormLabel sx={{ mt: 1, mb: 2 }}>Select Playlist(s)</FormLabel>
            <Grid container spacing={2}>
              {loading && !playlists.length
                ? Array.from(new Array(9)).map((_, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={2}
                      key={index}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        sx={{
                          width: "100%",
                          paddingTop: !isMedium ? `calc(100%)` : "90%",
                          position: "relative",
                        }}
                      >
                        <Skeleton
                          variant="rectangular"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </Box>
                    </Grid>
                  ))
                : playlists.map((playlist) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={2}
                      key={playlist.id}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Paper
                        // elevation={0}
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: newSong.playlists.some(
                            (item) => item.id === playlist.id
                          )
                            ? theme.palette.secondary.main
                            : theme.palette.layer.default,
                          padding: "10px",
                          cursor: "pointer",
                          border:
                            theme.palette.mode === "dark"
                              ? "1px solid #2d2d2d"
                              : "1px solid #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                        onClick={(event) =>
                          handlePaperClick(event, playlist?.id)
                        }
                      >
                        <PlaylistLabel
                          playlist={playlist}
                          newSong={newSong}
                          handleSelectChange={handleSelectChange}
                        />
                      </Paper>
                    </Grid>
                  ))}
            </Grid>
          </FormControl>
        </FormGroup>
        <Box display="flex" mt={2} mb={2}>
          <LoadingButton
            disabled={loading && !playlists.length}
            loading={loading && playlists.length && newSong.link ? true : false}
            variant="contained"
            disableElevation
            color="secondary"
            fullWidth
            sx={{
              minWidth: "150px",
              display: loading && !playlists.length ? "none" : "",
            }}
            startIcon={<PlaylistAddIcon />}
            onClick={handleSubmit}
          >
            Add Song
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}

export default Add;
