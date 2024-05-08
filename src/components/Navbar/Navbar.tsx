import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import DarkModeSwitch from "./DarkModeSwitch";
import NavMenu from "./NavMenu";

interface NavbarProps {
  setMode: () => void;
  themeMode: "light" | "dark";
}

const Navbar: React.FC<NavbarProps> = ({ setMode, themeMode }) => {
  const isMobile = useMediaQuery("(max-width:660px)");
  const path = useLocation().pathname;

  return (
    <header className="flex items-center gap-2 px-[2.5vw]">
      {!isMobile ? (
        <>
          <Link to="/" className="logoText">
            Xsakura
          </Link>
          <nav>
            <Button
              component={Link}
              to="/"
              color={path === "/" ? "primary" : "secondary"}
              size="large"
              disableRipple
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/movies"
              color={path === "/movies" ? "primary" : "secondary"}
              size="large"
              disableRipple
            >
              Movies
            </Button>
            <Button
              component={Link}
              to="/actors"
              color={path === "/actors" ? "primary" : "secondary"}
              size="large"
              disableRipple
            >
              Actors
            </Button>
          </nav>
        </>
      ) : (
        <NavMenu />
      )}
      <DarkModeSwitch toggleMode={setMode} mode={themeMode} />
    </header>
  );
};

export default Navbar;
