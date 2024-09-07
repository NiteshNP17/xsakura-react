import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DarkModeSwitch from "./DarkModeSwitch";
import NavMenu from "./NavMenu";
import useKeyboardShortcut from "../../utils/useKeyboardShortcut";
import Searchbar from "./Searchbar";

interface NavbarProps {
  setMode: () => void;
  themeMode: "light" | "dark";
}

const Navbar: React.FC<NavbarProps> = ({ setMode, themeMode }) => {
  const isMobile = useMediaQuery("(max-width:660px)");
  const path = useLocation().pathname;
  const navigate = useNavigate();

  useKeyboardShortcut({
    modifier: "alt",
    key: "m",
    callback: () => navigate("/movies"),
  });
  useKeyboardShortcut({
    modifier: "alt",
    key: "a",
    callback: () => navigate("/actors"),
  });
  useKeyboardShortcut({
    modifier: "alt",
    key: "s",
    callback: () => navigate("/series"),
  });

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
              color={path.includes("/movies") ? "primary" : "secondary"}
              size="large"
              disableRipple
            >
              Movies
            </Button>
            <Button
              component={Link}
              to="/actors"
              color={path.includes("/actors") ? "primary" : "secondary"}
              size="large"
              disableRipple
            >
              Actors
            </Button>
            <Button
              component={Link}
              to="/series"
              color={path.includes("/series") ? "primary" : "secondary"}
              size="large"
              disableRipple
            >
              Series
            </Button>
            <Button
              component={Link}
              to="/studio"
              color={path.includes("/studio") ? "primary" : "secondary"}
              size="large"
              disableRipple
            >
              Studios
            </Button>
            <Button
              component={Link}
              to="/albums"
              color={path.includes("/albums") ? "primary" : "secondary"}
              size="large"
              disableRipple
            >
              Albums
            </Button>
          </nav>
        </>
      ) : (
        <NavMenu />
      )}
      <div className="ml-auto flex items-center gap-4">
        {!isMobile && <Searchbar />}
        <DarkModeSwitch toggleMode={setMode} mode={themeMode} />
      </div>
    </header>
  );
};

export default Navbar;
