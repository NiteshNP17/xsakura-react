import { Link } from "react-router-dom";
import MovieCover from "./MovieCover";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import { useRef, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Delete, Edit } from "@mui/icons-material";

interface MovieListProps {
  movies: { code: string; title: string; cast: string[] }[];
  openEditDialog: (code: string) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, openEditDialog }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const refCodeToEdit = useRef<string | null>(null);

  const handleEdit = () => {
    openEditDialog(refCodeToEdit.current!);
    setAnchorEl(null);
  };

  const openMenu = (e: React.MouseEvent<HTMLElement>, code: string) => {
    refCodeToEdit.current = code;
    setAnchorEl(e.currentTarget);
  };

  return (
    <div className="grid-fit-2 max-w-screen-2xl gap-6 mx-auto mb-12">
      {movies.map((movie) => (
        <article
          key={movie.code}
          className="group dark:bg-zinc-800 dark:border-zinc-600 grid gap-1 overflow-hidden bg-white border rounded-lg shadow-lg"
        >
          <Link to={`/movie/${movie.code}`}>
            <MovieCover code={movie.code} />
          </Link>
          <div className="flex pl-2">
            <p className="line-clamp-2">
              <span className="text-lg font-semibold uppercase">
                {movie.code}
              </span>
              {movie.title && (
                <span className="capitalize"> {movie.title}</span>
              )}
            </p>
            <IconButton
              sx={{ p: 0, ml: "auto", maxHeight: "24px", mt: "1px" }}
              className="sm:opacity-0 group-hover:opacity-100"
              onClick={(e) => openMenu(e, movie.code)}
            >
              <MoreVert />
            </IconButton>
          </div>
          <div className="flex gap-1 px-2 mt-auto mb-2 overflow-x-scroll">
            {movie.cast.map((actor) => (
              <button
                key={actor}
                className="max-h-7 whitespace-nowrap dark:text-pink-400 dark:border-zinc-500 hover:text-pink-400 dark:hover:text-pink-300 hover:border-pink-400 dark:hover:border-pink-300 border-zinc-300 px-2 text-sm text-pink-700 capitalize transition-colors border border-solid rounded-full"
              >
                <Link to={`/actor/${actor.replace(/ /g, "-").toLowerCase()}`}>
                  {actor}
                </Link>
              </button>
            ))}
          </div>
        </article>
      ))}
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit className="opacity-50" />
          &nbsp;Edit
        </MenuItem>
        <MenuItem>
          <Delete className="opacity-50" />
          &nbsp;Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MovieList;
