import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import { MovieContext } from "./MovieContext";
import { formatCode, movieExists } from "../../../utils/utils";

const CodeTitleInput = () => {
  const { movieState, setMovieState, isToEdit } = useContext(MovieContext);
  const [exists, setExists] = useState(false);

  const handleCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) {
      setMovieState({ ...movieState, code: formatCode(e.target.value) });
      const isExists = await movieExists(formatCode(e.target.value));
      if (isExists) {
        setExists(true);
      } else setExists(false);
    } else {
      setMovieState({ ...movieState, code: "" });
    }
  };

  return (
    <div className="grid h-20 grid-cols-2 items-baseline gap-x-3">
      <TextField
        type="search"
        name="code"
        autoFocus={!movieState.code}
        defaultValue={movieState.code}
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
      <TextField
        id="title-input"
        type="search"
        name="title"
        value={movieState.title || ""}
        onChange={(e) =>
          setMovieState({ ...movieState, title: e.target.value })
        }
        label="Title"
        variant="outlined"
        autoComplete="off"
        inputProps={{
          autoCapitalize: "words",
        }}
      />
    </div>
  );
};

export default CodeTitleInput;
