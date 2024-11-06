import { useContext } from "react";
import ActorsInput from "./ActorsInput";
import CodeTitleInput from "./CodeTitleInput";
import MoviePreview from "./MoviePreview";
import { MovieContext } from "./MovieContext";
import { TextField } from "@mui/material";
import { formatNames } from "../../../utils/utils";
import SeriesInput from "./SeriesInput";
import { SeriesItem } from "../../../utils/customTypes";
import OverridesInput from "./OverridesInput";

const MovieDialog = () => {
  const { movieState, setMovieState } = useContext(MovieContext);

  return (
    <div className="grid justify-center md:grid-cols-2 md:gap-6">
      <div className="grid gap-4">
        <MoviePreview />
        <CodeTitleInput />
      </div>
      <div className="grid grid-cols-2 items-center gap-x-3">
        <ActorsInput />
        <TextField
          type="text"
          name="maleCast"
          label="Male Actor(s)"
          defaultValue={movieState.maleCast && formatNames(movieState.maleCast)}
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
          value={movieState.release || ""}
          onChange={(e) =>
            setMovieState({ ...movieState, release: e.target.value })
          }
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          id="runtime-input"
          type="number"
          name="runtime"
          label="Runtime"
          placeholder="Runtime (minutes)"
          // defaultValue={movieState.runtime}
          value={movieState.runtime || 0}
          onChange={(e) =>
            setMovieState({ ...movieState, runtime: parseInt(e.target.value) })
          }
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          type="text"
          name="tags"
          label="Tags"
          defaultValue={movieState.tags && formatNames(movieState.tags)}
          variant="outlined"
          fullWidth
          sx={{ margin: "1rem 0", gridColumn: "span 2" }}
        />
        <TextField
          type="text"
          name="opt"
          label="Opt"
          defaultValue={movieState.opt}
          variant="outlined"
          inputProps={{ autoCapitalize: "none" }}
        />
        <SeriesInput
          value={movieState.series}
          onChange={(series) =>
            setMovieState({ ...movieState, series: series as SeriesItem })
          }
        />
        <OverridesInput />
      </div>
    </div>
  );
};

export default MovieDialog;
