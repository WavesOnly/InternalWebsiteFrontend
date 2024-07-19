import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import {
  useTheme,
  Box,
  Typography,
  Modal,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid,
  TextField,
  InputAdornment,
  Button,
  useMediaQuery,
  Link,
  FormControl,
  Switch,
} from "@mui/material";
import ReactPlayer from "react-player";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CloseIcon from "@mui/icons-material/Close";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import Header from "../../../components/Header";
import PageInfo from "../../../components/PageInfo";
import { getPlaylists } from "../../../slices/youtube/youtubeSlice";

function Upload() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.youtube.playlists);
  const [newUpload, setNewUpload] = useState({
    file: "",
    throwbackThursday: false,
    playlists: [],
    comment: "",
  });
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const isLarge = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const handleFileSelect = (file) => {
    cleanupPreviousVideo();
    const videoURL = URL.createObjectURL(file);
    setSelectedFile(videoURL);
    setNewUpload((prevState) => {
      return {
        ...prevState,
        file: videoURL,
      };
    });
    generateThumbnail(videoURL);
  };

  const cleanupPreviousVideo = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile);
      setSelectedFile(null);
      setNewUpload((prevState) => {
        return {
          ...prevState,
          file: "",
        };
      });
      setThumbnail(null);
      setIsVideoPlaying(false);
    }
  };

  const generateThumbnail = (videoURL) => {
    setIsThumbnailLoading(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    video.src = "";
    video.load();

    video.onloadedmetadata = () => {
      video.currentTime = 2;
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL("image/png"));
      setIsThumbnailLoading(false);
    };

    video.src = videoURL;
    video.load();
  };

  const handleRemoveFile = () => {
    cleanupPreviousVideo();
    inputRef.current.value = "";
  };

  const handleBoxClick = () => {
    if (!selectedFile) {
      inputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const playlistId = "PLgksssmjuag7v25rbAmD7wFdsrcsoFaWV";

    if (name === "throwbackThursday") {
      setNewUpload((prevState) => {
        const updatedPlaylists = !prevState?.throwbackThursday
          ? [...prevState.playlists, playlistId]
          : prevState.playlists.filter((playlist) => playlist !== playlistId);
        return {
          ...prevState,
          throwbackThursday: !prevState?.throwbackThursday,
          playlists: updatedPlaylists,
        };
      });
    } else if (type === "checkbox") {
      setNewUpload((prevState) => {
        let updatedPlaylists;
        let throwbackThursdayState = prevState?.throwbackThursday;

        if (name === playlistId) {
          if (checked) {
            updatedPlaylists = [...prevState.playlists, name];
            throwbackThursdayState = true;
          } else {
            updatedPlaylists = prevState.playlists.filter(
              (playlist) => playlist !== name
            );
            throwbackThursdayState = false;
          }
        } else {
          updatedPlaylists = checked
            ? [...prevState.playlists, name]
            : prevState.playlists.filter((playlist) => playlist !== name);
        }

        return {
          ...prevState,
          playlists: updatedPlaylists,
          throwbackThursday: throwbackThursdayState,
        };
      });
    } else {
      setNewUpload((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };

  useEffect(() => {
    dispatch(getPlaylists());
  }, []);

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="Upload Video"
        subTitle="Upload a new video to the WavesOnly channel"
        buttonWidth="200px"
        LinkComponent={() => (
          <Link
            href="https://studio.youtube.com/channel/UC9RKqI3GeK_fdHdQyaB5laQ"
            target="_blank"
            color="inherit"
            style={{ textDecoration: "none" }}
          >
            Open YouTube Studio
          </Link>
        )}
      />
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Dropzone
          onDrop={(acceptedFiles) => {
            setIsDragActive(false);
            handleFileSelect(acceptedFiles[0]);
          }}
          onDragEnter={() => setIsDragActive(true)}
          onDragLeave={() => setIsDragActive(false)}
        >
          {({ getRootProps }) => (
            <Box
              {...getRootProps()}
              sx={{
                display: "flex",
                aspectRatio: "16 / 9",
                width: isLarge ? "80%" : "45%",
                border:
                  theme.palette.mode === "dark"
                    ? "2px dashed #2d2d2d"
                    : "2px dashed #ccc",
                boxSizing: "border-box",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#2d2d2d" : "#ccc",
                },

                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "background-color 0.2s",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? isDragActive
                      ? "#2d2d2d"
                      : "#1d1d1d"
                    : isDragActive
                    ? "#ccc"
                    : "#fafafa",
                borderRadius: "4px",
                position: "relative",
              }}
              onClick={handleBoxClick}
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/x-m4v,video/*"
                style={{ display: "none" }}
                onChange={(event) => {
                  handleFileSelect(event.target.files[0]);
                }}
              />
              {selectedFile ? (
                <>
                  {!isThumbnailLoading && (
                    <IconButton
                      aria-label="close"
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 1,
                      }}
                      onClick={handleRemoveFile}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {isThumbnailLoading ? (
                      <CircularProgress
                        size={40}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ) : (
                      <img
                        src={thumbnail}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          margin: 0,
                          borderRadius: "4px",
                        }}
                        onClick={() => setIsVideoPlaying(true)}
                      />
                    )}
                  </Box>
                </>
              ) : (
                <Typography variant="h4">
                  {isDragActive
                    ? "Drop video here"
                    : "Click or drag a video to upload"}
                </Typography>
              )}
            </Box>
          )}
        </Dropzone>
        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
          <FormControlLabel
            control={
              <Switch
                name="throwbackThursday"
                checked={newUpload?.throwbackThursday}
                onChange={handleChange}
                color="secondary"
              />
            }
            label="Throwback Thursday"
          />
          <Grid container spacing={1}>
            {playlists.map((playlist) => (
              <Grid
                item
                justifyContent="center"
                lg={4}
                md={6}
                sm={6}
                xs={12}
                key={playlist?.id}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newUpload?.playlists.includes(playlist?.id)}
                      name={playlist?.id}
                      onChange={handleChange}
                      color="secondary"
                    />
                  }
                  sx={{ m: "auto" }}
                  label={playlist?.name}
                />
              </Grid>
            ))}
          </Grid>
          <TextField
            name="comment"
            label="Comment"
            multiline
            onChange={handleChange}
            sx={{ width: isLarge ? "80%" : "45%" }}
            margin="normal"
            size="small"
            color="secondary"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddCommentIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            disableElevation
            color="secondary"
            startIcon={<VideoCallIcon />}
            sx={{ mt: 1, width: isLarge ? "80%" : "45%" }}
          >
            Upload Video
          </Button>
        </Box>
      </Box>
      <Modal
        open={isVideoPlaying}
        onClose={() => setIsVideoPlaying(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <ReactPlayer url={selectedFile} playing={isVideoPlaying} controls />
        </Box>
      </Modal>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Box>
  );
}

export default Upload;
