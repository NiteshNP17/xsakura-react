import { useSearchParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useRef, useState } from "react";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { Alert, Pagination, Snackbar } from "@mui/material";
import MovieForm from "../Dialogs/MovieForm/MovieForm";
import MutateMenu from "../Dialogs/MutateMenu";
import DeleteDialog from "../Dialogs/DeleteDialog";
import useKeyboardShortcut from "../../utils/useKeyboardShortcut";
import { MovieData } from "../../utils/customTypes";
import MovieArticle from "./MovieArticle";

interface MovieListProps {
  movies: MovieData[];
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

  const handleAdd = () => {
    if (!openEditDialog) {
      refCodeToEdit.current = null;
      setId(Math.random().toString(36).substring(6));
      setOpenEditDialog(true);
    }
  };

  useKeyboardShortcut({ modifier: "alt", key: "i", callback: handleAdd });

  return (
    <div className="px-[3vw]">
      <div className="mb-4 mt-1 flex px-1">
        <h1 className="text-3xl font-semibold">Movies</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="grid-fit-2 mx-auto mb-12 max-w-[1660px] gap-6">
        {movies.map((movie) => (
          <MovieArticle
            key={movie.code}
            movie={movie}
            setAnchorEl={setAnchorEl}
            setId={setId}
            refCodeToEdit={refCodeToEdit}
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
