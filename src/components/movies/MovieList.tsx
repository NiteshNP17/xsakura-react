import { useSearchParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import {
  Alert,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import MutateMenu from "../Dialogs/MutateMenu";
import DeleteDialog from "../Dialogs/DeleteDialog";
import useKeyboardShortcut from "../../utils/useKeyboardShortcut";
import { ActorData, MovieData, SeriesItem, Tag } from "../../utils/customTypes";
import MovieArticle from "./MovieArticle";
import MovieDialogBase from "../Dialogs/MovieForm/MovieDialogBase";
import { MovieContext } from "../Dialogs/MovieForm/MovieContext";
import { ArrowBack, Refresh, Shuffle } from "@mui/icons-material";
import CastButtons from "./CastButtons";
import BatchAddDialog from "../Dialogs/BatchAddDialog";
import FiltersAC from "./FiltersAC";

interface MovieListProps {
  movies: MovieData[];
  totalPages: number;
  refetch: () => void;
  actorData?: ActorData;
  actorStats?: ActorData[];
  serieData?: SeriesItem;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  totalPages,
  refetch,
  actorData,
  actorStats,
  serieData,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [movieToEdit, setMovieToEdit] = useState<MovieData>({} as MovieData);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openBatchDialog, setOpenBatchDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") ?? "1");
  const sort = searchParams.get("sort") || "release";
  const [id, setId] = useState("");
  const [isToEdit, setToEdit] = useState(false);
  const isRandom = searchParams.get("random");

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
      setMovieToEdit({
        cast: actorData ? [actorData] : [],
        series: serieData,
        tag2: [] as Tag[],
      } as MovieData);
      setToEdit(false);
      const scrollPos = window.scrollY;
      setTimeout(() => {
        setOpenEditDialog(true);
        window.scrollTo(0, scrollPos);
      }, 5);
    }
  };

  useKeyboardShortcut({ modifier: "alt", key: "i", callback: handleAdd });

  const handleRandom = () => {
    if (isRandom) {
      refetch();
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("random", "true");
      newSearchParams.delete("p");
      setSearchParams(newSearchParams);
    }
  };

  const handleRandomBack = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("random");
    setSearchParams(newSearchParams);
  };

  return (
    <div className="px-[3vw]">
      <div className="my-2 flex items-center px-1">
        <h1 className="text-2xl font-semibold">Movies</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => {
            setMovieToEdit({
              cast: actorData ? [actorData] : [],
            } as MovieData);
            setOpenBatchDialog(true);
          }}
        >
          <AddCircleOutline />
        </IconButton>
        <IconButton color="inherit" onClick={refetch}>
          <Refresh />
        </IconButton>
        <div className="ml-auto flex items-center gap-2">
          <ButtonGroup>
            <IconButton onClick={handleRandom}>
              <Shuffle />
            </IconButton>
            <IconButton onClick={handleRandomBack} disabled={!isRandom}>
              <ArrowBack />
            </IconButton>
          </ButtonGroup>
          {/* <FormControl sx={{ ml: "auto" }}> */}
          <FormControl>
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
      </div>
      {actorStats && <CastButtons castList={actorStats} />}
      <FiltersAC />
      <MovieContext.Provider
        value={{
          movieState: movieToEdit,
          setMovieState: setMovieToEdit,
          isToEdit,
        }}
      >
        <MovieDialogBase
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          refetch={refetch}
          setOpenSnack={setOpenSnack}
        />
        <BatchAddDialog
          openBatchDialog={openBatchDialog}
          setOpenBatchDialog={setOpenBatchDialog}
          refetch={refetch}
        />
      </MovieContext.Provider>
      <div className="grid-fit-2 mx-auto mt-2 mb-12 max-w-[1660px] gap-6">
        {movies.map((movie) => (
          <MovieArticle
            key={movie.code}
            movie={movie}
            setAnchorEl={setAnchorEl}
            setToEdit={setToEdit}
            setMovieToEdit={setMovieToEdit}
            setId={setId}
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
          {!isToEdit
            ? "Movie Added Successfully!"
            : "Movie Updated Successfully!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MovieList;
