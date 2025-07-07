import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useContext, useEffect } from "react";
import { MovieContext } from "./MovieContext";
import { MovieData } from "../../../utils/customTypes";
import config from "../../../utils/config";

const OverridesInput = () => {
  const { movieState, setMovieState } = useContext(MovieContext);
  const prevOpts = [
    {
      label: "MR",
      value: `https://fourhoi.com/${movieState.code}-uncensored-leak/preview.mp4`,
    },
    {
      label: "Miss",
      value: `https://fourhoi.com/${movieState.code}/preview.mp4`,
    },
  ];
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

  const fhdSrc = async () => {
    const [codeLabel, codeNum] = movieState.code.split("-");
    const codeNumPadded = codeNum.padStart(5, "0");

    if (!codeNum) return "!code";

    // Fetch label data from the API
    const response = await fetch(
      `${config.apiUrl}/labels/${codeLabel}?codenum=${codeNum}`,
    );
    const labelData = await response.json();

    const codeFormat = `${labelData.imgPre || labelData.prefix || ""}${codeLabel}${codeNumPadded}`;

    return `https://pics.pornfhd.com/s/digital/video/${codeFormat}/${codeFormat}pl.jpg`;
  };

  const jjSrc = async () => {
    const [codeLabel, codeNum] = movieState.code.split("-");
    const codeNumPadded = codeNum.padStart(5, "0");
    const actorName = movieState.cast[0]?.name.replace(/ /g, "-");

    if (!codeNum) return "!code";

    // Fetch label data from the API
    const response = await fetch(
      `${config.apiUrl}/labels/${codeLabel}?codenum=${codeNum}`,
    );
    const labelData = await response.json();

    const codeFormat = `${labelData.imgPre || labelData.prefix || ""}${codeLabel}${codeNumPadded}`;

    return `https://j.jjj.cam/fanza/${actorName}/${codeFormat}/${actorName}-0-480.jpg`;
  };

  return (
    <>
      <Autocomplete
        freeSolo
        options={[
          `http://javpop.com/img/${movieState?.code?.split("-")[0]}/${movieState?.code}_poster.jpg`,
          `https://fourhoi.com/${movieState?.code}/cover-t.jpg`,
          "p-fhd",
          `JJ`,
        ]}
        value={movieState.overrides?.cover || ""}
        onChange={(_e, newValue) => {
          if (!newValue) {
            setMovieState({
              ...movieState,
              overrides: { ...movieState.overrides, cover: "" },
            });
          } else if (newValue === "p-fhd") {
            // Handle the async function properly
            fhdSrc().then((url) => {
              setMovieState({
                ...movieState,
                overrides: { ...movieState.overrides, cover: url },
              });
            });
          } else if (newValue === "JJ") {
            // Handle the async function properly
            jjSrc().then((url) => {
              setMovieState({
                ...movieState,
                overrides: { ...movieState.overrides, cover: url },
              });
            });
          } else {
            setMovieState({
              ...movieState,
              overrides: { ...movieState.overrides, cover: newValue },
            });
          }
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
        options={prevOpts}
        value={
          movieState.overrides?.preview
            ? {
                label: movieState.overrides?.preview,
                value: movieState.overrides?.preview,
              }
            : { label: "", value: "" }
        }
        getOptionLabel={(option) => {
          // Handle both string and object cases
          if (typeof option === "string") {
            return option;
          }
          return option.label;
        }}
        onChange={(_e, newValue) => {
          if (newValue) {
            const isString = typeof newValue === "string";
            // Handle both string and object cases
            const newPreviewValue = isString ? newValue : newValue.value;

            // Check if newValue is an object with a label property
            if (
              !isString &&
              newValue.label === "MR" &&
              !movieState.tag2?.some(
                (tag) => tag.name === "67c3f414b4e420283fdcf289",
              )
            ) {
              setMovieState({
                ...movieState,
                overrides: {
                  ...movieState.overrides,
                  preview: newPreviewValue,
                },
                tag2: [
                  ...(movieState.tag2 || []),
                  { _id: "67c3f414b4e420283fdcf289", name: "MR" },
                ],
              });
            } else {
              setMovieState({
                ...movieState,
                overrides: {
                  ...movieState.overrides,
                  preview: newPreviewValue,
                },
              });
            }
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
