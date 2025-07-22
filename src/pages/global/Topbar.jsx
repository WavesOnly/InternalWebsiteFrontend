import { useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  InputBase,
  Autocomplete,
  Menu,
  MenuItem,
} from "@mui/material";
import { rolePagesMap } from "../../utils/rolePagesMap";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { logoutUser, setPersistLogin } from "../../slices/user/userSlice";
import {
  setPlaylistFollowerHistoryId, setPlaylistManageId, setPlaylistItems, setPlaylists
} from "../../slices/spotify/spotifySlice"


function Topbar(props) {
  const { toggleColorMode } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPagesByRole = (roles) => {
    const pages = [{ name: "Home", to: "/home" }];

    roles.forEach(role => {
      if (rolePagesMap[role]) {
        pages.push(...rolePagesMap[role]);
      }
    });
    return pages;
  };

  const logout = () => {
    googleLogout();
    dispatch(logoutUser());
    dispatch(setPlaylists([]));
    dispatch(setPlaylistItems([]));
    dispatch(setPlaylistManageId(""));
    dispatch(setPlaylistFollowerHistoryId(""));
    dispatch(setPersistLogin(false));
  };

  const handleOptionChange = (event, newValue) => {
    setValue(newValue);
    if (newValue) {
      navigate(newValue.to);
      setValue(null);
      setInputValue("");
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        bgcolor={theme.palette.layer.default}
        borderRadius="4px"
      >
        <Autocomplete
          id="search-bar"
          options={user?.idToken ? getPagesByRole(user.user.roles) : []}
          getOptionLabel={(option) => option.name}
          value={value}
          onChange={handleOptionChange}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <InputBase
              {...params.InputProps}
              sx={{
                ml: 2,
                minWidth: "200px",
                display: "flex",
                alignItems: "center",
                padding: "6px 0",
              }}
              placeholder="Search"
              inputProps={{ ...params.inputProps }}
            />
          )}
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box display="flex" alignItems="center">
        <IconButton onClick={toggleColorMode} sx={{ p: 1 }}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        <IconButton
          type="button"
          sx={{ p: 1 }}
          onClick={handleClick}
          disabled={!user?.idToken ? true : false}
        >
          <SettingsOutlined />
        </IconButton>
        {user?.idToken && (
          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        )}
      </Box>
    </Box>
  );
}

export default Topbar;
