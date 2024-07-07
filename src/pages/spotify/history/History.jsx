import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, useTheme } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";

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
    <Box m="20px">
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
      {loading && <CircularProgress />}
      <Table
        sx={{
          minWidth: 650,
          backgroundColor: theme.palette.layer.default,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Song</TableCell>
            <TableCell align="center">Artist(s)</TableCell>
            <TableCell align="center">Playlist</TableCell>
            <TableCell align="center">Date Added</TableCell>
            <TableCell align="center">Comment</TableCell>
          </TableRow>
        </TableHead>
        {!loading && (
          <TableBody>
            {(rowsPerPage > 0
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
                <TableCell component="th" scope="row">
                  <Link
                    href={`https://open.spotify.com/track/${row?.song?.id}`}
                    target="_blank"
                    color="inherit"
                  >
                    {row?.song?.name}
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
                <TableCell>
                  <Link
                    key={row?.playlist?.id}
                    href={`https://open.spotify.com/playlist/${row?.playlist?.id}`}
                    target="_blank"
                    color="inherit"
                  >
                    {row?.playlist?.name}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  {new Date(row?.dateAdded).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{row?.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
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
    </Box>
  );
}

export default History;
