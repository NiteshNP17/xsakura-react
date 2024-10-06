// App.jsx
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./utils/theme";
import * as pages from "./pages";
import "react-photo-view/dist/react-photo-view.css";

const App = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(
    (): "light" | "dark" => {
      const storedMode = localStorage.getItem("themeMode");
      return storedMode ? (storedMode as "light" | "dark") : "light";
    },
  );

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);

    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  const toggleMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Navbar setMode={toggleMode} themeMode={themeMode} />
      <Routes>
        <Route path="/" Component={pages.Home} />
        <Route path="/actors" Component={pages.Actors} />
        <Route path="/actor/:name" Component={pages.ActorPage} />
        <Route path="/actor-m/:name" Component={pages.ActorPage} />
        <Route path="/movies" Component={pages.Movies} />
        <Route path="/movie/:code" Component={pages.MoviePage} />
        <Route path="/search" Component={pages.SearchPage} />
        <Route path="/series" Component={pages.Series} />
        <Route path="/studio" Component={pages.Studio} />
        <Route path="/studio/:slug" Component={pages.StudioPage} />
        <Route path="/series/:slug" Component={pages.SeriesPage} />
        <Route path="/albums" Component={pages.Albums} />
        <Route path="/album/:slug" Component={pages.AlbumPage} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
