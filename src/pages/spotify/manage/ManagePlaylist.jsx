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
  Button,
  Link,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import {
  getPlaylists,
  getPlaylistItems,
  setPlaylistManageId,
  setPlaylistItems,
  updatePlaylistItems,
  deletePlaylistItems,
} from "../../../slices/spotify/spotifySlice";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PageInfo from "../../../components/PageInfo";
import { setAlert } from "../../../slices/user/userSlice";

function ManagePlaylist() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [selectedItems, setSelectedItems] = useState([]);
  const playlists = useSelector((state) => state.spotify?.playlists);
  const playlistItems = useSelector((state) => state.spotify.playlistItems);
  const playlistManageId = useSelector(
    (state) => state.spotify?.playlistManageId
  );
  const alert = useSelector((state) => state.user?.alert);
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
    dispatch(setPlaylistManageId(playlistId));
  };

  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let playlistItemsCopy = Array.from(playlistItems);
    let [data] = playlistItemsCopy.splice(e.source.index, 1);
    playlistItemsCopy.splice(e.destination.index, 0, data);
    dispatch(setPlaylistItems(playlistItemsCopy));
    // dispatch(updatePlaylistItems(playlistItemsCopy))
    // .then(() => dispatch(getPlaylistItems({ playlistId: playlistManageId })))
    // .then(() => dispatch(setAlert("Playlist updated")));
    dispatch(setAlert({ alert: "Playlist updated", severity: "success" }));
  };

  const handleCheckboxClick = (e, songId) => {
    const { checked } = e.target;
    setSelectedItems((prevState) => {
      const updatedSelectIems = checked
        ? [...prevState, songId]
        : prevState.filter((id) => id !== songId);
      return updatedSelectIems;
    });
  };

  const handleRemoveSongs = () => {
    dispatch(deletePlaylistItems(playlistManageId, selectedItems))
      .then(() => dispatch(getPlaylistItems({ playlistId: playlistManageId })))
      .then(() => {
        const countSongsDeleted = selectedItems?.length;
        const alertText =
          countSongsDeleted > 1
            ? `${countSongsDeleted} songs deleted`
            : `${countSongsDeleted} song deleted`;
        dispatch(setAlert({ alert: alertText, severity: "info" }));
      })
      .then(() => setSelectedItems([]));
  };

  useEffect(() => {
    dispatch(getPlaylists());
  }, []);

  useEffect(() => {
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
              // "& .MuiInputBase-input": {
              //   backgroundColor: theme.palette.background.paper,
              // },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.main,
              },
            }}
          >
            {playlists.map((playlist) => (
              <MenuItem key={playlist?.id} value={playlist?.id}>
                {playlist?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
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
        >
          Remove Songs
        </Button>
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
              <TableCell align="center">Position</TableCell>
              <TableCell align="center">Song</TableCell>
              <TableCell align="center">Artist(s)</TableCell>
              <TableCell align="center">Date Added</TableCell>
              <TableCell align="center">Added By Curation</TableCell>
              <TableCell align="center">Select</TableCell>
            </TableRow>
          </TableHead>
          {playlistManageId && (
            <Droppable droppableId="droppable">
              {(provider) => (
                <TableBody ref={provider.innerRef} {...provider.droppableProps}>
                  {playlistItems &&
                    playlistItems.map((row, index) => (
                      <Draggable
                        key={row.name}
                        draggableId={row.name}
                        index={index}
                      >
                        {(provider) => (
                          <TableRow
                            hover
                            key={row.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
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
                            >
                              <DragIndicatorIcon />
                            </TableCell>
                            <TableCell align="center" color="inherit">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`https://open.spotify.com/track/${row?.id}`}
                                target="_blank"
                                color="inherit"
                              >
                                {row?.name}
                              </Link>
                            </TableCell>
                            <TableCell>
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
                            <TableCell align="center">
                              {new Date(row?.dateAdded).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {row?.addedByCuration ? (
                                <CheckIcon />
                              ) : (
                                <CloseIcon />
                              )}
                            </TableCell>
                            <TableCell padding="checkbox" align="center">
                              <Box
                                sx={{
                                  "& .MuiCheckbox-root": {
                                    "& .MuiSvgIcon-root": {
                                      color:
                                        theme.palette.mode === "dark"
                                          ? "white"
                                          : theme.palette.secondary.main, // Default border color
                                    },
                                  },
                                }}
                              >
                                <Checkbox
                                  // color={checkBoxColor}
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
                        )}
                      </Draggable>
                    ))}

                  {provider.placeholder}
                </TableBody>
              )}
            </Droppable>
          )}
        </Table>
      </DragDropContext>
    </Box>
  );
}

export default ManagePlaylist;
