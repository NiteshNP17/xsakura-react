import MovieCover from "../../movies/MovieCover";
import { useContext, useState } from "react";
import Trailer from "../../movies/Trailer";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import axios from "axios";
import config from "../../../utils/config";
import { MovieContext } from "./MovieContext";
import { Alert, Snackbar } from "@mui/material";
import useKeyboardShortcut from "../../../utils/useKeyboardShortcut";

const MoviePreview = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { movieState, setMovieState } = useContext(MovieContext);
  const [openSnack, setOpenSnack] = useState(false);
  const isFc2 =
    movieState.code?.startsWith("fc2") || movieState.code?.startsWith("kb");

  useKeyboardShortcut({
    modifier: "alt",
    key: "d",
    callback: () => handleBtnClick(),
  });

  const handleBtnClick = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    try {
      const res = await axios.get(
        `${config.apiUrl}/lookups/scrape${!isChecked && !isFc2 ? "-jt" : ""}?code=${movieState.code}`,
      );
      setMovieState({
        ...movieState,
        title: res.data.title,
        release: res.data.relDate,
        runtime: res.data.runtime,
        overrides: {
          // ...movieState.overrides,
          cover: `http://javpop.com/img/${movieState.code.split("-")[0]}/${movieState.code}_poster.jpg`,
          preview: `https://fourhoi.com/${movieState.code}-uncensored-leak/preview.mp4`,
        },
      });
      (document.getElementById("opt-input") as HTMLInputElement).value = "mr";

      if (movieState.cast.length === 0) {
        (document.getElementById("f-actor-opts") as HTMLInputElement).focus();
      } else {
        (document.getElementById("tags-input") as HTMLInputElement).focus();
      }
    } catch (err) {
      setOpenSnack(true);
    }
  };

  return (
    <>
      {!isChecked ? (
        <div className="h-fit overflow-hidden rounded-md">
          {movieState.code ? (
            <MovieCover
              code={movieState.code}
              overrides={movieState.overrides}
              isForm
            />
          ) : (
            <div className="grid aspect-[3/1.98] w-full place-content-center bg-slate-200 text-center text-2xl font-semibold text-slate-400 dark:bg-zinc-600">
              ENTER CODE
              <br />
              TO SEE PREVIEW
            </div>
          )}
        </div>
      ) : (
        <div className="mb-2 overflow-hidden rounded-lg md:mb-0">
          <Trailer code={movieState.code} posterSm title={movieState.title} />
        </div>
      )}
      <div className="relative mx-auto flex w-full items-center justify-center gap-1">
        <span>Preview</span>
        <Switch
          disabled={isFc2}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <span>Trailer</span>
        <IconButton
          onClick={handleBtnClick}
          sx={{ position: "absolute", right: "0.25rem" }}
        >
          <PlayCircleOutline />
        </IconButton>
      </div>
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ maxWidth: "450px" }}
        onClose={(_e, reason?) => {
          if (reason === "clickaway") return;
          setOpenSnack(false);
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ fontSize: "1.1rem", padding: "0.5rem 3.5rem" }}
        >
          Movie data not found
        </Alert>
      </Snackbar>
    </>
  );
};

export default MoviePreview;
