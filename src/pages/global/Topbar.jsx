import React from "react";
import { Box, IconButton, useTheme, InputBase } from "@mui/material";
import { colorTokens } from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";

function Topbar(props) {
  const { toggleColorMode } = props;
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex" bgcolor={colors.primary[400]} borderRadius="4px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search"></InputBase>
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box display="flex">
        <IconButton onClick={toggleColorMode} sx={{ p: 1 }}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        <IconButton
          type="button"
          sx={{
            p: 1,
          }}
        >
          <SettingsOutlined />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Topbar;
