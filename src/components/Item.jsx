import React from "react";
import { MenuItem } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

import { colorTokens } from "../theme";

function Item({ title, to, icon, selected, setSelected }) {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      icon={icon}
      onClick={() => setSelected(title)}
      sx={{
        color:
          theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900],
      }}
    >
      <Typography
        color={
          theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900]
        }
      >
        {title}
      </Typography>
      <Link to={to} />
    </MenuItem>
  );
}

export default Item;
