import { useContext, useState } from "react";
import { Tag } from "../../../utils/customTypes";
import config from "../../../utils/config";
import { MovieContext } from "./MovieContext";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

const TagInput = () => {
  const [options, setOptions] = useState<Tag[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { movieState, setMovieState } = useContext(MovieContext);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/lookups/tags`);
      const resData = await res.json();
      setOptions(resData);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <Autocomplete
      id="f-tags-input"
      open={open}
      onOpen={() => {
        fetchOptions();
        setOpen(true);
      }}
      onClose={() => setOpen(false)}
      loading={loading}
      options={options || []}
      multiple
      fullWidth
      sx={{
        gridColumn: "span 2",
        // margin: "-1rem 0"
      }}
      // autoHighlight
      value={movieState.tag2 || []}
      getOptionLabel={(option) => option.name || ""}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      onChange={(_e, newValue) => {
        if (newValue) {
          setMovieState({ ...movieState, tag2: newValue });
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tags"
          variant="outlined"
          // sx={{ margin: "1rem 0", gridColumn: "span 2" }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default TagInput;
