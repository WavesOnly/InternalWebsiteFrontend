import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Link,
  Skeleton,
} from "@mui/material";

import { getSongHistory } from "../../../slices/spotify/spotifySlice";
import PageInfo from "../../../components/PageInfo";
import TablePaginationActions from "./TablePaginationActions";

function History() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.spotify.loading);
  const songHistory = useSelector((state) => state.spotify.songHistory);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const colorStyle = `${
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main
      : theme.palette.neutral.dark
  } !important`;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    dispatch(getSongHistory());
  }, []);

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="History"
        subTitle="Here's a glimpse of the songs you've added to your playlists"
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
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={rowsPerPage * 51.297 + 52 + 53.063}
          animation="wave"
        />
      ) : (
        <Table
          sx={{
            minWidth: 650,
            backgroundColor: theme.palette.layer.default,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Song
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Artist(s)
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Playlist
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Date Added
              </TableCell>
              <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                Comment
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {songHistory.length > 0 &&
              (rowsPerPage > 0
                ? songHistory.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : songHistory
              ).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: colorStyle,
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontSize: ".8rem" }}
                  >
                    <Link
                      href={`https://open.spotify.com/track/${row?.song?.id}`}
                      target="_blank"
                      color="inherit"
                    >
                      {row?.song?.name}
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
                  <TableCell sx={{ fontSize: ".8rem" }}>
                    <Link
                      key={row?.playlist?.id}
                      href={`https://open.spotify.com/playlist/${row?.playlist?.id}`}
                      target="_blank"
                      color="inherit"
                    >
                      {row?.playlist?.name}
                    </Link>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: ".8rem" }}>
                    {new Date(row?.dateAdded).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell sx={{ fontSize: ".8rem" }}>
                    {row?.comment}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                colSpan={6}
                count={songHistory.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Box>
  );
}

export default History;
