import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";
import Home from "@mui/icons-material/Home";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import { colorTokens } from "../../theme";
import { setCollapsed } from "../../slices/user/userSlice";
import Logo from "../../assets/Logo.png";
import Item from "../../components/Item";

function Sidebar() {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.user?.collapsed);
  const [selected, setSelected] = useState("Home");
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch(setCollapsed(isMedium));
  }, [isMedium, dispatch]);

  return (
    <Box
      sx={{
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-icon-wrapper": {
          color:
            theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900],
          backgroundColor: "transparent !important",
        },
        "& .pro-menu-item.active": {
          color: `${colors.greenAccent[100]} !important`,
        },
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <ProSidebar collapsed={collapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => dispatch(setCollapsed(!collapsed))}
            sx={{
              color: "white",
            }}
            icon={
              isSmall ? undefined : collapsed ? <MenuOutlinedIcon /> : undefined
            }
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-evenly"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  variant="h3"
                  color={
                    theme.palette.mode === "dark"
                      ? colors.grey[100]
                      : colors.grey[900]
                  }
                >
                  WavesOnly
                </Typography>
                <IconButton
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? colors.grey[100]
                        : colors.grey[900],
                  }}
                  onClick={() => dispatch(setCollapsed(!collapsed))}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!collapsed && (
            <Box
              mt="20px"
              mb="20px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <img
                alt="WavesOnly Logo"
                width="150"
                height="150"
                src={Logo}
                style={{ cursor: "pointer", borderRadius: "50%" }}
              />
            </Box>
          )}
          <Box
            paddingLeft={collapsed ? undefined : "10%"}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Item
              title="Home"
              to="/"
              icon={<Home />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              sx={{
                m: collapsed ? "" : "15px 0 5px 20px",
              }}
              align={collapsed ? "center" : "inherit"}
            >
              YouTube
            </Typography>
            <Item
              title="Upload"
              to="/upload-video"
              icon={<VideoCallOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Analytics"
              to="/youtube-analytics"
              icon={<TrendingUpOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              sx={{
                m: collapsed ? "" : "15px 0 5px 20px",
              }}
              align={collapsed ? "center" : "inherit"}
            >
              Spotify
            </Typography>
            <Item
              title="Add"
              to="/add-song"
              icon={<PlaylistAddOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage"
              to="/manage-playlist"
              icon={<LibraryMusicOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="History"
              to="/spotify-history"
              icon={<ListOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Monetization"
              to="/monetization-tool"
              icon={<MonetizationOnOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Analytics"
              to="/spotify-analytics"
              icon={<TrendingUpOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              sx={{
                m: collapsed ? "" : "15px 0 5px 20px",
              }}
              align={collapsed ? "center" : "inherit"}
            >
              General
            </Typography>
            <Item
              title="Meetings"
              to="/meetings"
              icon={<GroupsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
}

export default Sidebar;
