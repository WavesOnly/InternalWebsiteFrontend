import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  useTheme,
  useMediaQuery,
  Box,
  InputLabel,
  FormControl,
  Link,
  Select,
  MenuItem,
  Checkbox,
  Skeleton,
} from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import {
  getPlaylists,
  getPlaylistItems,
  setPlaylistManageId,
  updatePlaylistItems,
  deletePlaylistItems,
  setPlaylistItems,
} from "../../../slices/spotify/spotifySlice";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PageInfo from "../../../components/PageInfo";
import { setAlert } from "../../../slices/user/userSlice";
import { LoadingButton } from "@mui/lab";

function ManagePlaylist() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [selectedItems, setSelectedItems] = useState([]);
  const playlists = useSelector((state) => state.spotify?.playlists);
  const loading = useSelector((state) => state.spotify.loading);
  const playlistItems = useSelector((state) => state.spotify.playlistItems);
  const playlistManageId = useSelector(
    (state) => state.spotify?.playlistManageId
  );
  const colorStyle = `${
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main
      : theme.palette.neutral.dark
  } !important`;
  const checkBoxColor =
    theme.palette.mode === "dark"
      ? theme.palette.neutral.dark
      : theme.palette.secondary.main;

  const handleSelectChange = (event) => {
    const playlistId = event.target.value;
    dispatch(setPlaylistItems([]));
    dispatch(setPlaylistManageId(playlistId));
  };

  const handleDragEnd = async (e) => {
    if (!e.destination) return;
    let playlistItemsCopy = Array.from(playlistItems);
    let [data] = playlistItemsCopy.splice(e.source.index, 1);
    playlistItemsCopy.splice(e.destination.index, 0, data);
    const songIds = playlistItemsCopy.map(({ id }) => id);
    try {
      dispatch(setPlaylistItems(playlistItemsCopy));
      const result = await dispatch(
        updatePlaylistItems({
          playlistId: playlistManageId,
          songIds: songIds,
        })
      ).unwrap();

      dispatch(setAlert({ alert: result.message, severity: "success" }));
    } catch (err) {
      dispatch(
        setAlert({
          alert: `Add failed: ${err.message || "Unknown error"}`,
          severity: "error",
        })
      );
    } finally {
      dispatch(getPlaylistItems({ playlistId: playlistManageId }));
    }
  };

  const handleCheckboxClick = (e, songId) => {
    const { checked } = e.target;
    setSelectedItems((prevState) => {
      const updatedSelectIems = checked
        ? [...prevState, songId]
        : prevState.filter((id) => id !== songId);
      return updatedSelectIems;
    });
    console.log(selectedItems);
  };

  const handleRemoveSongs = async () => {
    try {
      await dispatch(
        deletePlaylistItems({
          playlistId: playlistManageId,
          songIds: selectedItems,
        })
      ).unwrap();
      const countSongsDeleted = selectedItems?.length;
      const alertText =
        countSongsDeleted > 1
          ? `${countSongsDeleted} songs deleted`
          : `${countSongsDeleted} song deleted`;
      dispatch(setAlert({ alert: alertText, severity: "info" }));
    } catch (err) {
      dispatch(
        setAlert({
          alert: `Add failed: ${err.message || "Unknown error"}`,
          severity: "error",
        })
      );
    } finally {
      dispatch(getPlaylistItems({ playlistId: playlistManageId }));
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    !playlists.length && dispatch(getPlaylists());
  }, []);

  useEffect(() => {
    playlistManageId &&
      dispatch(getPlaylistItems({ playlistId: playlistManageId }));
  }, [playlistManageId]);

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="Manage Playlists"
        subTitle="Manage all your playlists in one place"
        buttonWidth="200px"
        LinkComponent={() => (
          <Link
            href={
              playlistManageId
                ? `https://open.spotify.com/playlist/${playlistManageId}`
                : "https://open.spotify.com/user/w5sxze6rmcbs22r6w22ks8zme"
            }
            target="_blank"
            color="inherit"
            style={{ textDecoration: "none" }}
          >
            {playlistManageId
              ? "Open Spotify Playlist"
              : "Open Spotify Account"}
          </Link>
        )}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={isMedium ? "flex-start" : "center"}
        flexDirection={isMedium ? "column" : "row"}
        mb="10px"
      >
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
            value={playlistManageId}
            onChange={handleSelectChange}
            label="Playlist"
            sx={{
              minWidth: 335,
              backgroundColor: theme.palette.layer.default,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.main,
              },
            }}
            disabled={loading && !playlists.length}
          >
            {playlists.map((playlist) => (
              <MenuItem key={playlist?.id} value={playlist?.id}>
                {playlist?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LoadingButton
          variant="contained"
          disableElevation
          color="secondary"
          endIcon={<PlaylistRemoveIcon />}
          disabled={selectedItems.length > 0 ? false : true}
          onClick={handleRemoveSongs}
          sx={{
            minWidth: isMedium ? 335 : 200,
            mt: isMedium ? "10px" : "0px",
          }}
          size="medium"
          loading={
            loading && playlistItems.length > 0 && selectedItems.length > 0
          }
        >
          Remove Songs
        </LoadingButton>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Table
          size="small"
          sx={{
            minWidth: 650,

            backgroundColor: theme.palette.layer.default,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Position
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Song
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Artist(s)
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Date Added
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Promotion
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Select
              </TableCell>
            </TableRow>
          </TableHead>

          <Droppable droppableId="droppable">
            {(provider) => (
              <TableBody ref={provider.innerRef} {...provider.droppableProps}>
                {loading && !playlistItems.length
                  ? Array.from(new Array(50)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ height: "45px" }}>
                          <Skeleton
                            variant="rectangular"
                            width={24}
                            height={24}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Skeleton variant="square" width={24} height={24} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Skeleton variant="square" width={24} height={24} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  : playlistItems.map((row, index) => (
                      <Draggable
                        key={`${row.name}-${index}`}
                        draggableId={row.name}
                        index={index}
                      >
                        {(provider) =>
                          loading &&
                          playlistItems.length > 0 &&
                          selectedItems.includes(row.id) ? (
                            <TableRow key={index}>
                              <TableCell sx={{ height: "45px" }}>
                                <Skeleton
                                  variant="rectangular"
                                  width={24}
                                  height={24}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Skeleton variant="text" />
                              </TableCell>
                              <TableCell>
                                <Skeleton variant="text" />
                              </TableCell>
                              <TableCell>
                                <Skeleton variant="text" />
                              </TableCell>
                              <TableCell align="center">
                                <Skeleton variant="text" />
                              </TableCell>
                              <TableCell align="center">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Skeleton
                                    variant="square"
                                    width={24}
                                    height={24}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Skeleton
                                    variant="square"
                                    width={24}
                                    height={24}
                                  />
                                </Box>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow
                              hover
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                "&:hover": {
                                  backgroundColor: colorStyle,
                                },
                              }}
                              {...provider.draggableProps}
                              ref={provider.innerRef}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                {...provider.dragHandleProps}
                                sx={{ fontSize: ".8rem" }}
                              >
                                <DragIndicatorIcon />
                              </TableCell>
                              <TableCell
                                align="center"
                                color="inherit"
                                sx={{ fontSize: ".8rem" }}
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell sx={{ fontSize: ".8rem" }}>
                                <Link
                                  href={`https://open.spotify.com/track/${row?.id}`}
                                  target="_blank"
                                  color="inherit"
                                >
                                  {row?.name}
                                </Link>
                              </TableCell>
                              <TableCell sx={{ fontSize: ".8rem" }}>
                                {row?.artists.map((artist, i) => {
                                  return (
                                    <Link
                                      key={artist?.id}
                                      href={`https://open.spotify.com/artist/${artist?.id}`}
                                      target="_blank"
                                      color="inherit"
                                    >
                                      {i === row?.artists?.length - 1
                                        ? artist.name
                                        : `${artist?.name}, `}
                                    </Link>
                                  );
                                })}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontSize: ".8rem" }}
                              >
                                {new Date(row?.dateAdded).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontSize: ".8rem" }}
                              >
                                {row?.addedForPromotion ? (
                                  <CheckIcon />
                                ) : (
                                  <CloseIcon />
                                )}
                              </TableCell>
                              <TableCell
                                padding="checkbox"
                                align="center"
                                sx={{ fontSize: ".8rem" }}
                              >
                                <Box
                                  sx={{
                                    "& .MuiCheckbox-root": {
                                      "& .MuiSvgIcon-root": {
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "white"
                                            : theme.palette.secondary.main,
                                      },
                                    },
                                  }}
                                >
                                  <Checkbox
                                    sx={{
                                      color: checkBoxColor,
                                    }}
                                    checked={selectedItems.includes(row?.id)}
                                    onClick={(event) =>
                                      handleCheckboxClick(event, row.id)
                                    }
                                  />
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        }
                      </Draggable>
                    ))}
                {provider.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </Box>
  );
}

export default ManagePlaylist;
