import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import { MovieContext } from "./MovieContext";
import { formatCode } from "../../../utils/utils";
import ActorsInput from "./ActorsInput";
import { useSearchParams } from "react-router-dom";
import useKeyboardShortcut from "../../../utils/useKeyboardShortcut";
import axios from "axios";
import config from "../../../utils/config";
import { ActorData, MovieData } from "../../../utils/customTypes";

const CodeTitleInput = () => {
  const { movieState, setMovieState, isToEdit, setToEdit } =
    useContext(MovieContext);
  const [exists, setExists] = useState(false);
  const [searchParams] = useSearchParams();
  const chosenLabel = searchParams.get("label");

  async function movieExists(movieCode: string): Promise<MovieData | false> {
    try {
      const res = await axios.get(
        `${config.apiUrl}/movies/${movieCode.toLowerCase()}`,
      );
      if (res.data) return res.data; // Return the actual data, not the entire response
      return false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 404) return false;
      // Handle other errors appropriately
      console.error("Error checking movie existence:", err);
      return false;
    }
  }

  const handleCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue?.length > 4) {
      const formattedCode = formatCode(inputValue.toLowerCase());

      // Check if movie exists
      const movieData = await movieExists(formattedCode);
      if (movieData) {
        setExists(true);
        setMovieState({ ...movieData, code: formattedCode }); // movieData is already typed as MovieData
        setToEdit(true);
      } else {
        setExists(false);
        setToEdit(false);
        // Optionally clear other movie data when movie doesn't exist
        setMovieState({
          ...movieState,
          code: formattedCode,
        });
      }
    } else {
      // Clear the code and reset exists state
      setMovieState({ ...movieState, code: "" });
      setExists(false);
    }
  };

  const handleNumAdd = async (opera: string) => {
    if (movieState.code?.length > 4) {
      if (isToEdit && !exists) return;
      const codeInput = document.getElementById(
        "code-input",
      ) as HTMLInputElement;
      const [codeLabel, codeNum] = formatCode(codeInput.value).split("-");
      const codeNumInt = parseInt(codeNum);
      if (isNaN(codeNumInt)) return;
      const newCode =
        codeLabel +
        "-" +
        (opera === "add" ? codeNumInt + 1 : codeNumInt - 1)
          .toString()
          .padStart(3, "0");

      codeInput.value = newCode;
      const formattedCode = formatCode(newCode);

      // Check if movie exists
      const movieData = await movieExists(formattedCode);
      if (movieData) {
        setExists(true);
        setMovieState({ ...movieData, code: formattedCode }); // movieData is already typed as MovieData
        setToEdit(true);
      } else {
        setExists(false);
        setToEdit(false);
        // Optionally clear other movie data when movie doesn't exist
        setMovieState({
          code: formattedCode,
          cast: [] as ActorData[],
        } as MovieData);
      }
    }
  };

  useKeyboardShortcut({
    modifier: "alt",
    key: "+",
    callback: () => handleNumAdd("add"),
  });
  useKeyboardShortcut({
    modifier: "alt",
    key: "-",
    callback: () => handleNumAdd("eh"),
  });

  return (
    <div className="mb-5 grid h-20 grid-cols-2 items-baseline gap-x-3 sm:mb-0">
      <TextField
        type="search"
        name="code"
        autoFocus={!movieState.code}
        defaultValue={
          !movieState.code && chosenLabel ? chosenLabel + "-" : movieState.code
        }
        error={exists}
        disabled={isToEdit && !exists}
        // helperText={exists && "Movie already exists."}
        onChange={handleCodeChange}
        label="Code"
        variant="outlined"
        autoComplete="off"
        placeholder="ABC-123"
        required
        inputProps={{
          autoCapitalize: "characters",
          className: "uppercase",
          id: "code-input",
        }}
      />
      <ActorsInput />
    </div>
  );
};

export default CodeTitleInput;
