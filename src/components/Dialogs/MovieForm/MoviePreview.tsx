import MovieCover from "../../movies/MovieCover";
import { useContext, useState } from "react";
import Trailer from "../../movies/Trailer";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import axios from "axios";
import config from "../../../utils/config";
import { MovieContext } from "./MovieContext";

const MoviePreview = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { movieState, setMovieState } = useContext(MovieContext);

  const handleBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${config.apiUrl}/lookups/scrape${!isChecked ? "-jt" : ""}?code=${movieState.code}`,
      );
      setMovieState({
        ...movieState,
        title: res.data.title,
        release: res.data.relDate,
        runtime: res.data.runtime,
        overrides: {
          ...movieState.overrides,
          cover: res.data.posterUrl,
        },
      });
    } catch (err) {
      alert("Error fetching movie data: " + err);
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
    </>
  );
};

export default MoviePreview;
