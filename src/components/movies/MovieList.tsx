import { Link, useSearchParams } from "react-router-dom";
import MovieCover from "./MovieCover";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import { useRef, useState } from "react";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { Alert, Pagination, Snackbar } from "@mui/material";
import MovieForm from "../Dialogs/MovieForm";
import MovieCastList from "./MovieCastList";
import MutateMenu from "../Dialogs/MutateMenu";
import DeleteDialog from "../Dialogs/DeleteDialog";

interface MovieListProps {
  movies: {
    code: string;
    title: string;
    cast: string[];
    maleCast: string[];
    release: string;
  }[];
  totalPages: number;
  refetch: () => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  totalPages,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const refCodeToEdit = useRef<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") ?? "1");
  const [id, setId] = useState("");

  const handlePageChange = (
    _e: React.ChangeEvent<unknown> | KeyboardEvent | null,
    newPage: number
  ) => {
    if (newPage === 1) {
      searchParams.delete("p");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ p: newPage.toString() });
    }
  };

  return (
    <div className="px-[3vw]">
      <div className="flex px-1 mt-1 mb-4">
        <h1 className="text-3xl font-semibold">Movies</h1>
        <IconButton
          color="primary"
          onClick={() => {
            refCodeToEdit.current = null;
            setId(Math.random().toString(36).substring(6));
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
                  setId(Math.random().toString(36).substring(6));
                  setAnchorEl(e.currentTarget);
                }}
              >
                <MoreVert />
              </IconButton>
            </div>
            <MovieCastList
              movieCast={movie.cast}
              maleCast={movie.maleCast}
              release={movie.release}
              mb
            />
          </article>
        ))}
        <MutateMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          setOpenEditDialog={setOpenEditDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
        />
      </div>
      <div className="flex justify-center w-full mb-12">
        <Pagination
          color="primary"
          count={totalPages}
          size="large"
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <MovieForm
        codeToEdit={refCodeToEdit.current}
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        setOpenSnack={setOpenSnack}
        refetch={refetch}
        id={id}
      />
      <DeleteDialog
        type="movies"
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        deleteId={{ id: refCodeToEdit.current || "", uId: id }}
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
