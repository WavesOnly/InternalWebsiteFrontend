import React from "react";
import { useDisplayMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import PersistLogin from "./auth/PersistLogin";
import RequireAuth from "./auth/RequireAuth";
import Sidebar from "./pages/global/Sidebar";
import Topbar from "./pages/global/Topbar";
import Home from "./pages/home/Home";
import History from "./pages/spotify/history/History";
import Upload from "./pages/youtube/upload/Upload";
import YouTubeAnalytics from "./pages/youtube/analytics/YouTubeAnalytics";
import Monetization from "./pages/spotify/monetization/Monetization";
import Add from "./pages/spotify/add/Add";
import SpotifyAnalytics from "./pages/spotify/analytics/SpotifyAnalytics";
import ManagePlaylist from "./pages/spotify/manage/ManagePlaylist";
import AlertUser from "./components/AlertUser";
import Meetings from "./pages/general/Meetings";
import Login from "./pages/global/Login";
import NotFound from "./pages/global/NotFound";

function App() {
  const [theme, displayColorMode] = useDisplayMode();
  const alert = useSelector((state) => state.user?.alert);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <main className="content" style={{ flex: 1, overflowY: "auto" }}>
          <Topbar toggleColorMode={displayColorMode.toggleColorMode} />
          {alert && <AlertUser alert={alert} />}
          <Routes>
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route path="/home" element={<Home />} />
                <Route path="/upload-video" element={<Upload />} />
                <Route
                  path="/youtube-analytics"
                  element={<YouTubeAnalytics />}
                />
                <Route path="/add-song" element={<Add />} />
                <Route path="/manage-playlist" element={<ManagePlaylist />} />
                <Route path="/spotify-history" element={<History />} />
                <Route path="/monetization-tool" element={<Monetization />} />
                <Route
                  path="/spotify-analytics"
                  element={<SpotifyAnalytics />}
                />
                <Route path="/meetings" element={<Meetings />} />
              </Route>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
