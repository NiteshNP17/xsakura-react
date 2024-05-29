import { Button, CircularProgress, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import MovieCover from "../movies/MovieCover";
import { LoadingButton } from "@mui/lab";
import { useLocation, useNavigate } from "react-router-dom";
import { formatCode, formatNames } from "../../utils/utils";

interface MovieFormProps {
  codeToEdit: string | null;
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
  setOpenSnack: (open: boolean) => void;
  refetch: () => void;
  id?: string;
}

const MovieForm: React.FC<MovieFormProps> = ({
  codeToEdit,
  openEditDialog,
  setOpenEditDialog,
  setOpenSnack,
  refetch,
  id,
}) => {
  interface MovieData {
    code?: string;
    title?: string;
    cast?: string[];
    maleCast?: string[];
    release?: Date;
    runtime?: number;
    tags?: string[];
    opt?: string[];
    series?: string;
  }

  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [movieData, setMovieData] = useState<MovieData>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const fetchMovieData = async (movieCode: string, shouldSetData: boolean) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/movies/${movieCode.toLowerCase()}`
      );
      shouldSetData && setMovieData(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response.status === 404) {
        return "clear";
      } else {
        console.log("Error: ", err);
      }
    }
  };

  const validateData = async (dataToPost: MovieData) => {
    if (!dataToPost.code) {
      setLoading(false);
      alert("Code is required!");
      return false;
    }

    if (String(dataToPost.code).length < 6) {
      setLoading(false);
      alert("Invalid Code!");
      return false;
    }

    const checkIfExists = await fetchMovieData(
      dataToPost.code.toString(),
      false
    );

    if (!codeToEdit && checkIfExists !== "clear") {
      setLoading(false);
      alert("Movie already exists!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (codeToEdit) {
      fetchMovieData(codeToEdit, true);
    }
  }, [codeToEdit, id]);

  const handleClose = () => {
    setLoading(false);
    setOpenEditDialog(false);
    setPreviewCode(null);
    setTimeout(() => {
      setMovieData({});
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const dataToPost = Object.fromEntries(formData);

    dataToPost.code = previewCode || dataToPost.code;

    const isValid = await validateData(dataToPost as MovieData);

    if (!isValid) return;
    else {
      if (!codeToEdit) {
        try {
          await axios.post("http://localhost:5000/movies", dataToPost);
          handleClose();
          path === "/movies" || codeToEdit ? refetch() : navigate("/movies");
          setOpenSnack(true);
        } catch (err) {
          alert("Error adding movie: " + err);
          setLoading(false);
        }
      } else {
        try {
          await axios.put(
            `http://localhost:5000/movies/${codeToEdit}`,
            dataToPost
          );
          handleClose();
          path === "/movies" || codeToEdit ? refetch() : navigate("/movies");
          setOpenSnack(true);
        } catch (err) {
          alert("Error updating movie: " + err);
          setLoading(false);
        }
      }
    }
  };

  return (
    <Dialog
      open={!openEditDialog ? false : true}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          m: 2,
          borderRadius: "1.3rem",
          maxWidth: "100vw",
          width: "clamp(330px, 95vw, 992px)",
        },
      }}
    >
      <div className="p-5">
        {!codeToEdit || movieData.code ? (
          <>
            <h1 className="w-full mb-3 text-2xl font-semibold">
              {codeToEdit ? "Edit" : "Add"} Movie
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="md:grid-cols-2 grid items-center gap-6">
                <div className="md:mb-0 mb-2 overflow-hidden rounded-lg">
                  {codeToEdit || (previewCode && previewCode.length > 6) ? (
                    <MovieCover code={codeToEdit || previewCode || ""} />
                  ) : (
                    <div className="bg-slate-200 w-full aspect-[16/10] grid place-content-center text-2xl font-semibold text-slate-400 text-center">
                      ENTER CODE
                      <br />
                      TO SEE PREVIEW
                    </div>
                  )}
                </div>
                <div className="gap-x-3 grid items-center grid-cols-2">
                  <TextField
                    type="search"
                    name="code"
                    autoFocus={!codeToEdit}
                    defaultValue={codeToEdit}
                    onChange={(e) => {
                      e.target.value.length > 5 &&
                        setPreviewCode(
                          formatCode(e.target.value.toLowerCase())
                        );
                    }}
                    label="Code"
                    variant="outlined"
                    autoComplete="off"
                    placeholder="ABC-123"
                    required
                    inputProps={{
                      autoCapitalize: "characters",
                      readOnly: codeToEdit && true,
                      className: "uppercase",
                    }}
                  />
                  <TextField
                    type="search"
                    name="title"
                    defaultValue={movieData.title}
                    label="Title"
                    variant="outlined"
                    autoComplete="off"
                    inputProps={{
                      autoCapitalize: "words",
                    }}
                  />
                  <TextField
                    type="text"
                    name="cast"
                    label="Actor(s)"
                    defaultValue={movieData.cast && formatNames(movieData.cast)}
                    variant="outlined"
                    fullWidth
                    sx={{ margin: "1rem 0" }}
                    inputProps={{ autoCapitalize: "words" }}
                  />
                  <TextField
                    type="text"
                    name="maleCast"
                    label="Male Actor(s)"
                    defaultValue={
                      movieData.maleCast && formatNames(movieData.maleCast)
                    }
                    variant="outlined"
                    fullWidth
                    sx={{ margin: "1rem 0" }}
                    inputProps={{ autoCapitalize: "words" }}
                  />
                  <TextField
                    type="text"
                    name="release"
                    label="Release Date"
                    placeholder="YYYY-MM-DD"
                    defaultValue={movieData.release?.toString().split("T")[0]}
                    variant="outlined"
                    autoComplete="off"
                  />
                  <TextField
                    type="number"
                    name="runtime"
                    label="Runtime"
                    placeholder="Runtime (minutes)"
                    defaultValue={movieData.runtime}
                    variant="outlined"
                    autoComplete="off"
                  />
                  <TextField
                    type="text"
                    name="tags"
                    label="Tags"
                    defaultValue={movieData.tags && formatNames(movieData.tags)}
                    variant="outlined"
                    fullWidth
                    sx={{ margin: "1rem 0", gridColumn: "span 2" }}
                  />
                  <TextField
                    type="text"
                    name="opt"
                    label="Opt"
                    defaultValue={movieData.opt}
                    variant="outlined"
                    inputProps={{ autoCapitalize: "none" }}
                  />
                  <TextField
                    type="text"
                    name="series"
                    label="Series"
                    defaultValue={movieData.series}
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="md:mb-0 justify-self-end grid grid-cols-2 col-span-2 gap-2 mt-6 md:w-[calc(50%-0.75rem)] ml-auto">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleClose}
                  disableElevation
                >
                  Cancel
                </Button>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color="success"
                  size="large"
                  type="submit"
                  disableElevation
                >
                  {codeToEdit ? "Save" : "Add Movie"}
                </LoadingButton>
              </div>
            </form>
          </>
        ) : (
          <div className="place-content-center h-96 grid w-full">
            <CircularProgress size="4rem" />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default MovieForm;
