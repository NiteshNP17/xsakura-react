import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SeriesInput = ({ defaultValue }: { defaultValue: string }) => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/lookups/series");
      const resData = await res.json();
      setOptions(resData);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOptions();
    }
  }, [open]);

  return (
    <Autocomplete
      open={open}
      loading={loading}
      options={options}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      defaultValue={defaultValue}
      freeSolo
      renderOption={(props, option) => (
        <li {...props}>
          <span className="line-clamp-2 capitalize">{option}</span>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          name="series"
          label="Series"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SeriesInput;
