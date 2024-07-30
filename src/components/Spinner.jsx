import React from "react";
import { Box, CircularProgress, useTheme } from "@mui/material";

function Spinner() {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      sx={{ height: "100%" }}
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress
        sx={{ color: theme.palette.mode === "dark" ? "white" : "" }}
      />
    </Box>
  );
}

export default Spinner;
