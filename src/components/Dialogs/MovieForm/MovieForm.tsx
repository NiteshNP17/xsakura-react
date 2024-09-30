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
import { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { formatCode, formatNames } from "../../../utils/utils";
import MovieCastList from "../../movies/MovieCastList";
import { ActorData, MovieData, SeriesItem } from "../../../utils/customTypes";
import ActorsInput from "./ActorsInput";
import MoviePreview from "./MoviePreview";
import SeriesInput from "./SeriesInput";
import config from "../../../utils/config";

interface MovieFormProps {
  movieToEdit: MovieData;
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
  setOpenSnack: (open: boolean) => void;
  refetch: () => void;
  id?: string;
}

const MovieForm: React.FC<MovieFormProps> = ({
  movieToEdit,
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
  const [selectedActorsF, setSelectedActorsF] = useState<ActorData[]>([]);
  const [release, setRelease] = useState(movieData.release || "");
  const [selectedSeries, setSelectedSeries] = useState<SeriesItem | null>(null);

  const fetchMovieData = async (movieCode: string) => {
    try {
      const res = await axios.get(
        `${config.apiUrl}/movies/${movieCode.toLowerCase()}`,
      );
      if (res) alert("movie already exists");
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

    if (!isClearRef.current && !movieToEdit.code)
      await fetchMovieData(dataToPost.code.toString());

    if (!movieToEdit.code && !isClearRef.current) {
      setLoading(false);
      alert("Movie already exists!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const purgeData = () => {
      // setLoading(false);
      // setPreviewCode(null);
      setRelease("");
      setSelectedActorsF([]);
      setOverrides({});
      setMovieData({} as MovieData);
      setSelectedSeries(null);
    };

    purgeData();
  }, [openEditDialog]);

  useEffect(() => {
    if (movieToEdit.code) {
      setMovieData(movieToEdit);
      setSelectedActorsF(movieToEdit.cast);
      setRelease(movieToEdit.release);
      setSelectedSeries(movieToEdit.series);
    } else setMovieData({} as MovieData);

    if (!movieToEdit.code && openEditDialog) {
      setTimeout(() => {
        document.getElementById("code-input")?.focus();
      }, 50);
    }
  }, [movieToEdit, id, openEditDialog]);

  const handleClose = () => {
    setLoading(false);
    setOpenEditDialog(false);
    setPreviewCode(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const dataToPost = Object.fromEntries(formData);
    const castArray = selectedActorsF.map((actorData) => actorData._id);

    dataToPost.code = previewCode || dataToPost.code;
    dataToPost.cast = JSON.stringify(castArray);
    dataToPost.series = selectedSeries ? selectedSeries._id : "";

    console.log(dataToPost);

    const isValid = await validateData(dataToPost);

    if (!isValid) return;
    else {
      if (!movieToEdit.code) {
        try {
          await axios.post(`${config.apiUrl}/movies`, dataToPost);
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
            `${config.apiUrl}/movies/${movieToEdit.code}`,
            dataToPost,
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
    property: string,
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
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      sx={{
        "@media (min-width: 661px)": {
          "& .MuiPaper-root": {
            m: 2,
            borderRadius: "1.3rem",
            maxWidth: "100vw",
            width: "clamp(330px, 95vw, 1000px)",
          },
        },
      }}
    >
      <div className="p-5">
        {!movieToEdit.code || movieData.code ? (
          <>
            <DialogTitle sx={{ pt: 0 }}>
              <span className="text-2xl font-semibold">
                {movieToEdit.code ? "Edit" : "Add"} Movie
              </span>
            </DialogTitle>
            <div className="grid justify-center md:grid-cols-2 md:gap-6">
              <div className="grid gap-4">
                <MoviePreview
                  codeToPv={movieToEdit.code || previewCode || ""}
                  overrides={{
                    cover: overrides.cover
                      ? overrides.cover
                      : movieData.overrides?.cover,
                    preview: overrides.preview
                      ? overrides.preview
                      : movieData.overrides?.preview,
                  }}
                  isForm
                  setRelease={setRelease}
                />
                <div className="grid grid-cols-2 items-center gap-x-3">
                  <TextField
                    type="search"
                    name="code"
                    autoFocus={!movieToEdit.code}
                    defaultValue={movieToEdit.code}
                    onChange={(e) => {
                      e.target.value.length > 4 &&
                        setPreviewCode(
                          formatCode(e.target.value.toLowerCase()),
                        );
                    }}
                    onBlur={(e) =>
                      e.target.value.length > 4 &&
                      fetchMovieData(formatCode(e.target.value))
                    }
                    label="Code"
                    variant="outlined"
                    autoComplete="off"
                    placeholder="ABC-123"
                    required
                    inputProps={{
                      autoCapitalize: "characters",
                      readOnly: movieToEdit.code && true,
                      className: "uppercase",
                      id: "code-input",
                    }}
                  />
                  <TextField
                    id="title-input"
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
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-x-3">
                <div className="col-span-2 flex h-9 w-full items-center gap-1 overflow-x-scroll">
                  {selectedActorsF.length > 0 ? (
                    <MovieCastList
                      movieCast={selectedActorsF}
                      release={release.length > 9 ? release : ""}
                      setMovieCast={setSelectedActorsF}
                    />
                  ) : (
                    <span className="w-full pt-4 text-center text-lg opacity-50 md:pt-0">
                      Actors
                    </span>
                  )}
                </div>
                <ActorsInput
                  selectedActorsF={selectedActorsF}
                  setSelectedActorsF={setSelectedActorsF}
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
                  value={release}
                  onChange={(e) => setRelease(e.target.value)}
                  variant="outlined"
                  autoComplete="off"
                />
                <TextField
                  id="runtime-input"
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
                <SeriesInput
                  value={selectedSeries}
                  onChange={(series) => setSelectedSeries(series)}
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
                <Autocomplete
                  freeSolo
                  options={[
                    `https://fivetiu.com/${movieToEdit.code || previewCode}-uncensored-leak/preview.mp4`,
                  ]}
                  defaultValue={movieData.overrides?.preview}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      type="text"
                      name="preview"
                      label="Preview"
                      variant="outlined"
                      sx={{ my: "1rem" }}
                      onBlur={(e) => handleOverrides(e, "preview")}
                    />
                  )}
                />
              </div>
            </div>
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="success"
                size="large"
                type="submit"
                sx={movieToEdit.code ? { px: 4 } : {}}
              >
                {movieToEdit.code ? "Save" : "Add Movie"}
              </LoadingButton>
            </DialogActions>
          </>
        ) : (
          <div className="grid h-96 w-full place-content-center">
            <CircularProgress size="4rem" />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default MovieForm;
