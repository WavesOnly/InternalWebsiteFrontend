import React from "react";
import { Typography, Box } from "@mui/material";

function Header({ title, subTitle }) {
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
