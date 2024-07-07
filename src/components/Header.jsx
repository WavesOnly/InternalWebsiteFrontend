import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { colorTokens } from "../theme";

function Header({ title, subTitle }) {
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h2" fontWeight="bold" sx={{ mb: "5px" }}>
        {title}
      </Typography>
      <Typography
        variant="h4"
        color="secondary"
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {subTitle}
      </Typography>
    </Box>
  );
}

export default Header;
