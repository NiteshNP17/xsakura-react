import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useContext, useEffect } from "react";
import { MovieContext } from "./MovieContext";
import { MovieData } from "../../../utils/customTypes";

const OverridesInput = () => {
  const { movieState, setMovieState } = useContext(MovieContext);
  // const optInput = document.getElementById("opt-input") as HTMLInputElement;

  useEffect(() => {
    setMovieState((prevState: MovieData): MovieData => {
      if (prevState.overrides?.cover?.startsWith("http://")) {
        return {
          ...prevState,
          overrides: { cover: "", preview: "" },
        };
      }
      return prevState;
    });
  }, [movieState.code, setMovieState]);

  return (
    <>
      <Autocomplete
        freeSolo
        options={[
          `http://javpop.com/img/${movieState?.code?.split("-")[0]}/${movieState?.code}_poster.jpg`,
          `https://fourhoi.com/${movieState?.code}/cover-t.jpg`,
          `https://pics.pornfhd.com/s/digital/video/${movieState?.code?.split("-")[0]}00${movieState?.code?.split("-")[1]}/${movieState?.code?.split("-")[0]}00${movieState?.code?.split("-")[1]}pl.jpg`,
        ]}
        value={movieState.overrides?.cover || ""}
        onChange={(_e, newValue) => {
          newValue
            ? setMovieState({
                ...movieState,
                overrides: { ...movieState.overrides, cover: newValue },
              })
            : setMovieState({
                ...movieState,
                overrides: { ...movieState.overrides, cover: "" },
              });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            type="text"
            name="cover"
            autoComplete="off"
            label="Cover"
            variant="outlined"
            // sx={{ my: "1rem" }}
            onChange={(e) =>
              setMovieState({
                ...movieState,
                overrides: { ...movieState.overrides, cover: e.target.value },
              })
            }
          />
        )}
      />
      <Autocomplete
        freeSolo
        options={[
          `https://fourhoi.com/${movieState.code}-uncensored-leak/preview.mp4`,
        ]}
        value={movieState.overrides?.preview || ""}
        onChange={(_e, newValue) => {
          if (newValue) {
            setMovieState({
              ...movieState,
              overrides: { ...movieState.overrides, preview: newValue },
              tag2: [
                ...(movieState.tag2 || []),
                { _id: "67c3f414b4e420283fdcf289", name: "MR" },
              ],
            });
          } else {
            setMovieState({
              ...movieState,
              overrides: { ...movieState.overrides, preview: "" },
              tag2: movieState.tag2.filter(
                (tag) => tag._id !== "67c3f414b4e420283fdcf289",
              ),
            });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            type="text"
            name="preview"
            label="Preview"
            variant="outlined"
            // sx={{ my: "1rem" }}
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
