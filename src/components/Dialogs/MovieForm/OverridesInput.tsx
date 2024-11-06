import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { MovieContext } from "./MovieContext";

const OverridesInput = () => {
  const { movieState, setMovieState } = useContext(MovieContext);

  return (
    <>
      <TextField
        type="search"
        name="cover"
        autoComplete="off"
        value={movieState.overrides?.cover || ""}
        label="Cover"
        variant="outlined"
        sx={{ my: "1rem" }}
        onChange={(e) =>
          setMovieState({
            ...movieState,
            overrides: { ...movieState.overrides, cover: e.target.value },
          })
        }
      />
      <Autocomplete
        freeSolo
        options={[
          `https://fivetiu.com/${movieState.code}-uncensored-leak/preview.mp4`,
        ]}
        value={movieState.overrides?.preview || ""}
        onChange={(_e, newValue) => {
          newValue
            ? setMovieState({
                ...movieState,
                overrides: { ...movieState.overrides, preview: newValue },
              })
            : setMovieState({
                ...movieState,
                overrides: { ...movieState.overrides, preview: "" },
              });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            type="text"
            name="preview"
            label="Preview"
            variant="outlined"
            sx={{ my: "1rem" }}
            onChange={(e) =>
              setMovieState({
                ...movieState,
                overrides: { ...movieState.overrides, preview: e.target.value },
              })
            }
          />
        )}
      />
    </>
  );
};

export default OverridesInput;
