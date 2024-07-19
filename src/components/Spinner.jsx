import React from "react";
import { Box, CircularProgress } from "@mui/material";

function Spinner() {
  return (
    <Box
      display="flex"
      sx={{ height: "100%" }}
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
}

export default Spinner;
