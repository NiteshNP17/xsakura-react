import { useContext, useState } from "react";
// import ActorsInput from "./ActorsInput";
import CodeTitleInput from "./CodeTitleInput";
import MoviePreview from "./MoviePreview";
import { MovieContext } from "./MovieContext";
import TextField from "@mui/material/TextField";
import { formatNames } from "../../../utils/utils";
import SeriesInput from "./SeriesInput";
import { SeriesItem } from "../../../utils/customTypes";
import OverridesInput from "./OverridesInput";

const MovieDialog = () => {
  const { movieState, setMovieState } = useContext(MovieContext);
  const [titleInFocus, setTitleInFocus] = useState(false);

  return (
    <div className="grid justify-center md:grid-cols-2 md:gap-6">
      <div className="grid gap-4">
        <MoviePreview />
        <CodeTitleInput />
      </div>
      <div className="-mt-4 grid max-h-[470px] grid-cols-2 items-center gap-x-3 gap-y-0">
        <TextField
          type="text"
          name="maleCast"
          label="Male Actor(s)"
          defaultValue={movieState.maleCast && formatNames(movieState.maleCast)}
          variant="outlined"
          fullWidth
          // sx={{ maxHeight: "20px" }}
          inputProps={{ autoCapitalize: "words" }}
        />
        <SeriesInput
          value={movieState.series}
          onChange={(series) =>
            setMovieState({ ...movieState, series: series as SeriesItem })
          }
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
          inputProps={{ id: "tags-input" }}
          // fullWidth
          // sx={{ margin: "1rem 0", gridColumn: "span 2" }}
        />
        <TextField
          type="text"
          name="opt"
          label="Opt"
          defaultValue={movieState.opt}
          variant="outlined"
          inputProps={{ autoCapitalize: "none", id: "opt-input" }}
        />
        <OverridesInput />
        <TextField
          id="title-input"
          type="search"
          name="title"
          value={movieState.title || ""}
          onFocus={() => setTitleInFocus(true)}
          onBlur={() => setTitleInFocus(false)}
          onChange={(e) =>
            setMovieState({ ...movieState, title: e.target.value })
          }
          label="Title"
          variant="outlined"
          autoComplete="off"
          fullWidth
          inputProps={{
            autoCapitalize: "words",
          }}
          sx={{
            gridColumn: "span 2",
            direction: !titleInFocus ? "rtl" : "ltr",
          }}
        />
      </div>
    </div>
  );
};

export default MovieDialog;
