import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import config from "../../../utils/config";
import { SeriesItem } from "../../../utils/customTypes";

interface SeriesInputProps {
  value: SeriesItem | null;
  onChange: (series: SeriesItem | null) => void;
}

const SeriesInput: React.FC<SeriesInputProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState<SeriesItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/series`);
      const resData = await res.json();
      setOptions(resData.data);
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
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      options={options}
      value={value}
      autoHighlight
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderOption={(props, option) => (
        <li {...props}>
          <span className="line-clamp-2 capitalize">{option.name}</span>
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
