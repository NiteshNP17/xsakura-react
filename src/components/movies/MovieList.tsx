import { Link, useNavigate } from "react-router-dom";
import MovieCover from "./MovieCover";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import { useRef, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import { Alert, Pagination, Snackbar } from "@mui/material";
import MovieForm from "../Dialogs/MovieForm";

interface MovieListProps {
  movies: { code: string; title: string; cast: string[] }[];
  currentPage: number;
  totalPages: number;
  refetch: () => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  currentPage,
  totalPages,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const refCodeToEdit = useRef<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="px-[3vw]">
      <div className="flex px-1 mt-1 mb-4">
        <h1 className="text-3xl font-semibold">Movies</h1>
        <IconButton
          color="primary"
          onClick={() => {
            refCodeToEdit.current = null;
            setOpenEditDialog(true);
          }}
        >
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="grid-fit-2 max-w-[1660px] gap-6 mx-auto mb-12">
        {movies.map((movie) => (
          <article
            key={movie.code}
            className="group dark:bg-zinc-800 dark:border-zinc-600 grid gap-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md"
          >
            <Link to={`/movie/${movie.code}`}>
              <MovieCover code={movie.code} />
            </Link>
            <div className="flex pl-3">
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
                onClick={(e) => {
                  refCodeToEdit.current = movie.code;
                  setAnchorEl(e.currentTarget);
                }}
              >
                <MoreVert />
              </IconButton>
            </div>
            <div className="flex gap-1 px-2 mt-auto mb-2 overflow-x-scroll">
              {movie.cast.map((actor) => (
                <button
                  key={actor}
                  className="max-h-7 whitespace-nowrap dark:text-pink-500 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 bg-zinc-200 px-2 py-0.5 text-sm text-pink-600 capitalize transition-colors rounded-full"
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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setOpenEditDialog(true);
            }}
          >
            <Edit className="opacity-50" />
            &nbsp;Edit
          </MenuItem>
          <MenuItem>
            <Delete className="opacity-50" />
            &nbsp;Delete
          </MenuItem>
        </Menu>
      </div>
      <div className="flex justify-center w-full mb-12">
        <Pagination
          color="primary"
          count={totalPages}
          size="large"
          page={currentPage}
          onChange={(_e, val) =>
            navigate(val === 1 ? "/movies" : `/movies/${val}`)
          }
        />
      </div>
      <MovieForm
        codeToEdit={refCodeToEdit.current}
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        setOpenSnack={setOpenSnack}
        refetch={refetch}
      />
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: "12px" }}
        onClose={(_e, reason?) => {
          if (reason === "clickaway") return;
          setOpenSnack(false);
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ fontSize: "1.1rem", padding: "0.5rem 3.5rem" }}
        >
          {!refCodeToEdit.current
            ? "Movie Added Successfully!"
            : "Movie Updated Successfully!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MovieList;
