import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useMediaQuery,
  Box,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Button,
  TextField,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Link,
  FormHelperText,
  FormControl,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AddCommentIcon from "@mui/icons-material/AddComment";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import { getPlaylists } from "../../../slices/spotify/spotifySlice";
import PageInfo from "../../../components/PageInfo";
import PlaylistLabel from "./PlaylistLabel";

function Add() {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.spotify.playlists);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "radio") {
      setNewSong((prevState) => ({
        ...prevState,
        type: value,
      }));
    } else if (type === "checkbox") {
      if (checked) {
        setNewSong((prevState) => ({
          ...prevState,
          playlists: [
            ...prevState.playlists,
            {
              id: name,
              position: "",
              duration: "",
            },
          ],
        }));
      } else {
        setNewSong((prevState) => ({
          ...prevState,
          playlists: prevState.playlists.filter(
            (playlist) => playlist.id !== name
          ),
        }));
      }
    } else {
      setNewSong((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newSong);

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
      console.log("Form submitted successfully");
    } else {
      console.log("Form has errors, please correct them");
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
    dispatch(getPlaylists());
  }, [dispatch]);

  useEffect(() => {
    setFormValidation((prevState) => ({
      ...prevState,
      link: newSong.link ? false : prevState.link,
      type: newSong.type ? false : prevState.type,
      playlists: newSong.playlists ? false : prevState.playlists,
    }));
  }, [newSong]);

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="Add Song"
        subTitle="Add a song to any of your Spotify playlists"
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
      <form onSubmit={handleSubmit}>
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
              sx={{ flexGrow: 1 }}
            />
            {!isMedium && (
              <FormControl
                component="fieldset"
                error={formValidation.type}
                sx={{ display: "flex", alignItems: "center", ml: 2 }}
              >
                <RadioGroup
                  size="small"
                  color="secondary"
                  name="type"
                  value={newSong.type}
                  onChange={handleChange}
                  row
                  sx={{ ml: 2, mr: -2, pr: 0 }}
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
          </Box>
          <TextField
            name="comment"
            label="Comment"
            multiline
            margin="normal"
            size="small"
            onChange={handleChange}
            color="secondary"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddCommentIcon />
                </InputAdornment>
              ),
            }}
          />
          {isMedium && (
            <FormControl component="fieldset" error={formValidation.type}>
              <RadioGroup
                size="small"
                color="secondary"
                name="type"
                value={newSong.type}
                onChange={handleChange}
                row
                sx={{ mt: 2 }}
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
            <Grid
              container
              spacing={2}
              sx={{ ml: !isSmall ? 0 : "" }}
              width="100%"
            >
              {playlists.map((playlist) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={2}
                  key={playlist.id}
                >
                  <Box display="flex" flexDirection="column">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newSong.playlists.some(
                            (item) => item.id === playlist.id
                          )}
                          onChange={handleChange}
                          name={playlist.id}
                          color="secondary"
                          sx={{ display: "none" }}
                          type="checkbox"
                        />
                      }
                      label={
                        <PlaylistLabel
                          playlist={playlist}
                          newSong={newSong}
                          handleSelectChange={handleSelectChange}
                        />
                      }
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </FormControl>
        </FormGroup>
        <Box display="flex" mt={2} mb={2}>
          <Button
            variant="contained"
            disableElevation
            color="secondary"
            fullWidth
            startIcon={<PlaylistAddIcon />}
            onClick={handleSubmit}
            sx={{ minWidth: "150px" }}
          >
            Add Song
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default Add;
