import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Face3Outlined,
  ExpandMore,
  Face3,
  Home,
  HomeOutlined,
  Movie,
  MovieOutlined,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

export default function NavMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const path = useLocation().pathname;
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        color="secondary"
        sx={{ lineHeight: "inherit", padding: 0, color: "secondary.600" }}
      >
        <h1 className="logoText">XSAKURA</h1>
        <ExpandMore
          sx={{
            transform: anchorEl ? "rotate(180deg)" : "",
            transition: "transform 200ms",
          }}
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose} selected={path === "/"}>
          <Link to="/" className="menuLink">
            <ListItemIcon>
              {path !== "/" ? <HomeOutlined /> : <Home />}
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose} selected={path === "/movies"}>
          <Link to="/movies?sort=added" className="menuLink">
            <ListItemIcon>
              {path !== "/movies" ? <MovieOutlined /> : <Movie />}
            </ListItemIcon>
            <ListItemText>Movies</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose} selected={path === "/actors"}>
          <Link to="/actors" className="menuLink">
            <ListItemIcon>
              {path !== "/actors" ? <Face3Outlined /> : <Face3 />}
            </ListItemIcon>
            <ListItemText>Actors</ListItemText>
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
