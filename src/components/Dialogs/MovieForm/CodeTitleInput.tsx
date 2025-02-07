import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import { MovieContext } from "./MovieContext";
import { formatCode, movieExists } from "../../../utils/utils";
import ActorsInput from "./ActorsInput";
import { useSearchParams } from "react-router-dom";
import useKeyboardShortcut from "../../../utils/useKeyboardShortcut";

const CodeTitleInput = () => {
  const { movieState, setMovieState, isToEdit } = useContext(MovieContext);
  const [exists, setExists] = useState(false);
  const [searchParams] = useSearchParams();
  const chosenLabel = searchParams.get("label");

  const handleCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) {
      setMovieState({
        ...movieState,
        code: formatCode(e.target.value.toLowerCase()),
      });
      const isExists = await movieExists(formatCode(e.target.value));
      if (isExists) {
        setExists(true);
      } else setExists(false);
    } else {
      setMovieState({ ...movieState, code: "" });
    }
  };

  const handleNumAdd = async (opera: string) => {
    if (!isToEdit && movieState.code.length > 4) {
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

      setMovieState({
        ...movieState,
        code: formatCode(newCode),
      });
      const isExists = await movieExists(formatCode(newCode));
      if (isExists) {
        setExists(true);
      } else setExists(false);
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
    <div className="grid h-20 grid-cols-2 items-baseline gap-x-3">
      <TextField
        type="search"
        name="code"
        autoFocus={!movieState.code}
        defaultValue={
          !movieState.code && chosenLabel ? chosenLabel + "-" : movieState.code
        }
        error={exists}
        disabled={isToEdit}
        helperText={exists && "Movie already exists."}
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
