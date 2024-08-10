import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import {
  useTheme,
  Box,
  Typography,
  Modal,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  Button,
  useMediaQuery,
  Link,
  Skeleton,
  Paper,
} from "@mui/material";
import ReactPlayer from "react-player";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CloseIcon from "@mui/icons-material/Close";
import VideoCallIcon from "@mui/icons-material/VideoCall";

import PageInfo from "../../../components/PageInfo";
import {
  getPlaylists,
  uploadVideo,
} from "../../../slices/youtube/youtubeSlice";
import { setAlert } from "../../../slices/user/userSlice";
import Spinner from "../../../components/Spinner";
import { LoadingButton } from "@mui/lab";

function Upload() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.youtube.playlists);
  const loading = useSelector((state) => state.youtube.loading);
  const [newUpload, setNewUpload] = useState({
    file: "",
    throwbackThursday: false,
    playlists: [],
    comment: "",
  });
  const [formValidation, setFormValidation] = useState({
    file: false,
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
    const videoURL = URL.createObjectURL(file);
    cleanupPreviousVideo();
    setSelectedFile(videoURL);
    setNewUpload((prevState) => {
      return {
        ...prevState,
        file: file,
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

    if (name === playlistId) {
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

  const handlePaperClick = (playlistId) => {
    const event = {
      target: {
        name: playlistId,
        type: "checkbox",
        checked: !newUpload.playlists.includes(playlistId),
      },
    };
    handleChange(event);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUpload.file) {
      setFormValidation({ file: true });
      return;
    }

    try {
      const result = await dispatch(uploadVideo(newUpload)).unwrap();
      cleanupAfterSubmit();
      dispatch(setAlert({ alert: result.message, severity: "success" }));
    } catch (err) {
      dispatch(
        setAlert({
          alert: `Upload failed: ${err.message || "Unknown error"}`,
          severity: "error",
        })
      );
    }
  };

  const cleanupAfterSubmit = () => {
    setThumbnail(null);
    setSelectedFile(null);
    setNewUpload({
      file: "",
      throwbackThursday: false,
      playlists: [],
      comment: "",
    });
    setIsDragActive(false);
    setFormValidation({ file: false });
    inputRef.current.value = "";
  };

  useEffect(() => {
    !playlists.length && dispatch(getPlaylists());
  }, []);

  useEffect(() => {
    setFormValidation((prevState) => ({
      ...prevState,
      file: newUpload.file ? false : prevState.file,
    }));
  }, [newUpload]);

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
                border: formValidation.file
                  ? "2px dashed #f44336"
                  : theme.palette.mode === "dark"
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
                      : theme.palette.layer.default
                    : isDragActive
                    ? "#ccc"
                    : theme.palette.layer.default,
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
                disabled={loading && !playlists.length}
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
                      disabled={loading && playlists.length > 0 ? true : false}
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
                      <Spinner />
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
                  {formValidation?.file
                    ? "Please upload a video"
                    : isDragActive
                    ? "Drop video here"
                    : "Click or drag a video to upload"}
                </Typography>
              )}
            </Box>
          )}
        </Dropzone>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={2}
          width="100%"
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {loading && !playlists.length
              ? Array.from(new Array(14)).map((_, index) => (
                  <Grid
                    item
                    justifyContent="center"
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    key={index}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="41.656px"
                      animation="wave"
                    />
                  </Grid>
                ))
              : playlists.map((playlist) => (
                  <Grid item lg={4} md={6} sm={6} xs={12} key={playlist?.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: newUpload?.playlists.includes(
                          playlist?.id
                        )
                          ? theme.palette.secondary.main
                          : theme.palette.layer.default,
                        padding: "10px",
                        cursor: loading ? "not-allowed" : "pointer",
                        color: newUpload?.playlists.includes(playlist?.id)
                          ? "white"
                          : "",
                        border:
                          theme.palette.mode === "dark"
                            ? "1px solid #2d2d2d"
                            : "1px solid #ccc",
                      }}
                      onClick={() => {
                        if (!loading) {
                          handlePaperClick(playlist?.id);
                        }
                      }}
                    >
                      <Typography sx={{ ml: 0.5 }}>{playlist?.name}</Typography>
                    </Paper>
                  </Grid>
                ))}
          </Grid>
          <TextField
            name="comment"
            label="Comment"
            multiline
            margin="normal"
            onChange={handleChange}
            sx={{
              width: isLarge ? "80%" : "45%",
              mt: 2,
              backgroundColor: theme.palette.layer.default,
            }}
            size="small"
            color="secondary"
            value={newUpload.comment}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddCommentIcon />
                </InputAdornment>
              ),
            }}
            disabled={loading && playlists.length > 0 ? true : false}
          />
          <LoadingButton
            variant="contained"
            disableElevation
            color="secondary"
            onClick={handleSubmit}
            startIcon={<VideoCallIcon />}
            sx={{ mt: 1, width: isLarge ? "80%" : "45%" }}
            loading={
              (loading && newUpload.file) || (loading && !playlists.length)
                ? true
                : false
            }
            disabled={loading && playlists.length > 0 ? true : false}
          >
            Upload Video
          </LoadingButton>
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
