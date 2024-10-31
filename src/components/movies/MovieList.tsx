import { useSearchParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import MovieForm from "../Dialogs/MovieForm/MovieForm";
import MutateMenu from "../Dialogs/MutateMenu";
import DeleteDialog from "../Dialogs/DeleteDialog";
import useKeyboardShortcut from "../../utils/useKeyboardShortcut";
import { MovieData } from "../../utils/customTypes";
import MovieArticle from "./MovieArticle";
import TagButtons from "./TagButtons";

interface MovieListProps {
  movies: MovieData[];
  totalPages: number;
  refetch: () => void;
  hideTags?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  totalPages,
  refetch,
  hideTags,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [movieToEdit, setMovieToEdit] = useState<MovieData>({} as MovieData);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") ?? "1");
  const sort = searchParams.get("sort") || "empty";
  const [id, setId] = useState("");

  const handlePageChange = (
    _e: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      newSearchParams.delete("p");
    } else {
      newSearchParams.set("p", newPage.toString());
    }

    setSearchParams(newSearchParams);
  };

  const handleSortChange = (e: SelectChangeEvent) => {
    // setLoaded(false);
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value as string);
    params.delete("p");
    setSearchParams(params);
  };

  const handleAdd = () => {
    if (!openEditDialog) {
      setMovieToEdit({} as MovieData);
      setId(Math.random().toString(36).substring(6));
      setTimeout(() => {
        setOpenEditDialog(true);
      }, 10);
    }
  };

  useKeyboardShortcut({ modifier: "alt", key: "i", callback: handleAdd });

  return (
    <div className="px-[3vw]">
      <div className="my-2 flex items-center px-1">
        <h1 className="text-2xl font-semibold">Movies</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
        <FormControl sx={{ ml: "auto" }}>
          <InputLabel>Sort</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sort}
            size="small"
            label="Sort"
            sx={{ minWidth: "100px" }}
            onChange={handleSortChange}
          >
            <MenuItem value={"added"}>Added</MenuItem>
            <MenuItem value={"release"}>Release</MenuItem>
            <MenuItem value={"codeAsc"}>Code Asc.</MenuItem>
            <MenuItem value={"code"}>Code Desc.</MenuItem>
          </Select>
        </FormControl>
      </div>
      {!hideTags && <TagButtons />}
      <div className="grid-fit-2 mx-auto mb-12 mt-2 max-w-[1660px] gap-6">
        {movies.map((movie) => (
          <MovieArticle
            key={movie.code}
            movie={movie}
            setAnchorEl={setAnchorEl}
            setId={setId}
            setMovieToEdit={setMovieToEdit}
          />
        ))}
        <MutateMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          setOpenEditDialog={setOpenEditDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
        />
      </div>
      <div className="mb-12 flex w-full justify-center">
        <Pagination
          color="primary"
          count={totalPages}
          size="large"
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <MovieForm
        movieToEdit={movieToEdit}
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
        deleteId={{ id: movieToEdit.code || "", uId: id }}
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
          {!movieToEdit.code
            ? "Movie Added Successfully!"
            : "Movie Updated Successfully!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MovieList;
