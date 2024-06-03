import {
  Autocomplete,
  Button,
  CircularProgress,
  DialogActions,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import MovieCover from "../movies/MovieCover";
import { LoadingButton } from "@mui/lab";
import { formatCode, formatNames } from "../../utils/utils";
import { ActorNamesContext } from "../Actors/ActorNamesProvider";
import MovieCastList from "../movies/MovieCastList";
import { MovieData } from "../../utils/customTypes";

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
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [movieData, setMovieData] = useState<MovieData>({} as MovieData);
  const [loading, setLoading] = useState(false);
  const isClearRef = useRef(false);
  const isMobile = useMediaQuery("(max-width:660px)");
  const [overrides, setOverrides] = useState<{ [key: string]: string }>({});
  const { actorsInDb } = useContext(ActorNamesContext);
  const fActorNames = actorsInDb
    .filter((actor) => !actor.isMale)
    .map((actor) => actor.name);

  const [selectedActorsF, setSelectedActorsF] = useState<string[]>([]);
  const [release, setRelease] = useState(movieData.release || "");

  const fetchMovieData = async (movieCode: string, shouldSetData: boolean) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/movies/${movieCode.toLowerCase()}`
      );
      if (shouldSetData) {
        setMovieData(res.data);
        setRelease(res.data.release);
        setSelectedActorsF(res.data.cast);
      } else alert("movie already exists");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response.status === 404) {
        isClearRef.current = true;
        return "clear";
      } else {
        console.log("Error: ", err);
      }
    }
  };

  const validateData = async (dataToPost: {
    [x: string]: FormDataEntryValue;
  }) => {
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

    if (!isClearRef.current && !codeToEdit)
      await fetchMovieData(dataToPost.code.toString(), false);

    if (!codeToEdit && !isClearRef.current) {
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
    if (!codeToEdit && openEditDialog) {
      setTimeout(() => {
        document.getElementById("code-input")?.focus();
      }, 50);
    }
  }, [codeToEdit, id, openEditDialog]);

  const handleClose = () => {
    setLoading(false);
    setOpenEditDialog(false);
    setPreviewCode(null);
    setTimeout(() => {
      setRelease("");
      setSelectedActorsF([]);
      setOverrides({});
      setMovieData({} as MovieData);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const dataToPost = Object.fromEntries(formData);

    dataToPost.code = previewCode || dataToPost.code;
    dataToPost.cast = JSON.stringify(selectedActorsF).toLowerCase();

    const isValid = await validateData(dataToPost);

    if (!isValid) return;
    else {
      if (!codeToEdit) {
        try {
          await axios.post("http://localhost:5000/movies", dataToPost);
          handleClose();
          refetch();
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
          refetch();
          setOpenSnack(true);
        } catch (err) {
          alert("Error updating movie: " + err);
          setLoading(false);
        }
      }
    }
  };

  const handleOverrides = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    setOverrides((prevOverrides) => ({
      ...prevOverrides,
      [property]: e.target.value,
    }));
  };

  return (
    <Dialog
      open={!openEditDialog ? false : true}
      onClose={handleClose}
      fullScreen={isMobile}
      // TransitionComponent={SlideUp}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      sx={
        !isMobile
          ? {
              "& .MuiPaper-root": {
                m: 2,
                borderRadius: "1.3rem",
                maxWidth: "100vw",
                width: "clamp(330px, 95vw, 992px)",
              },
            }
          : {}
      }
    >
      <div className="p-5">
        {!codeToEdit || movieData.code ? (
          <>
            <DialogTitle>{codeToEdit ? "Edit" : "Add"} Movie</DialogTitle>
            <div className="md:grid-cols-2 grid items-center gap-6">
              <div className="md:mb-0 mb-2 overflow-hidden rounded-lg">
                {codeToEdit || (previewCode && previewCode.length > 5) ? (
                  <MovieCover
                    code={codeToEdit || previewCode || ""}
                    overrides={{
                      cover: overrides.cover
                        ? overrides.cover
                        : movieData.overrides?.cover,
                      preview: overrides.preview
                        ? overrides.preview
                        : movieData.overrides?.preview,
                    }}
                  />
                ) : (
                  <div className="bg-slate-200 dark:bg-zinc-600 w-full aspect-[16/10] grid place-content-center text-2xl font-semibold text-slate-400 text-center">
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
                    e.target.value.length > 4 &&
                      setPreviewCode(formatCode(e.target.value.toLowerCase()));
                  }}
                  onBlur={(e) =>
                    e.target.value.length > 4 &&
                    fetchMovieData(formatCode(e.target.value), false)
                  }
                  label="Code"
                  variant="outlined"
                  autoComplete="off"
                  placeholder="ABC-123"
                  required
                  inputProps={{
                    autoCapitalize: "characters",
                    readOnly: codeToEdit && true,
                    className: "uppercase",
                    id: "code-input",
                  }}
                />
                <TextField
                  type="text"
                  name="release"
                  label="Release Date"
                  placeholder="YYYY-MM-DD"
                  defaultValue={movieData.release}
                  onBlur={(e) => setRelease(e.target.value)}
                  variant="outlined"
                  autoComplete="off"
                />
                <div className="h-9 flex items-center w-full col-span-2 gap-1 overflow-x-scroll">
                  {selectedActorsF.length > 0 ? (
                    <MovieCastList
                      movieCast={selectedActorsF}
                      maleCast={[]}
                      release={release}
                    />
                  ) : (
                    <span className="w-full pt-4 text-lg text-center opacity-50">
                      Actors
                    </span>
                  )}
                </div>
                <Autocomplete
                  id="f-actor-opts"
                  options={fActorNames}
                  freeSolo
                  multiple
                  autoHighlight
                  limitTags={1}
                  value={selectedActorsF}
                  onChange={(_e, newValue) => {
                    setSelectedActorsF(newValue);
                  }}
                  disableCloseOnSelect // Add this prop
                  renderOption={(props, option) => (
                    <li {...props}>
                      <span className="capitalize">{option}</span>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Actor(s)"
                      variant="outlined"
                      placeholder="Girls"
                    />
                  )}
                  renderTags={() => <></>}
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
                <TextField
                  type="text"
                  name="cover"
                  label="Cover"
                  defaultValue={movieData.overrides?.cover}
                  variant="outlined"
                  sx={{ my: "1rem" }}
                  onBlur={(e) => handleOverrides(e, "cover")}
                />
                <TextField
                  type="text"
                  name="preview"
                  label="Preview"
                  defaultValue={movieData.overrides?.preview}
                  variant="outlined"
                  sx={{ my: "1rem" }}
                  onBlur={(e) => handleOverrides(e, "preview")}
                />
              </div>
            </div>
            {/* <div className="md:mb-0 justify-self-end grid grid-cols-2 col-span-2 gap-2 mt-6 md:w-[calc(50%-0.75rem)] ml-auto"> */}
            <DialogActions>
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
            </DialogActions>
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
