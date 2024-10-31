import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import config from "../../../utils/config";
import { SeriesItem } from "../../../utils/customTypes";
import SeriesDialog from "../SeriesDialog";

interface SeriesInputProps {
  value: SeriesItem | null;
  onChange: (series: SeriesItem | null) => void;
}

const SeriesInput: React.FC<SeriesInputProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState<SeriesItem[]>([]);
  const [serieToAdd, setSerieToAdd] = useState<SeriesItem>({} as SeriesItem);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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
    <>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        loading={loading}
        options={options}
        value={value}
        autoHighlight
        onChange={(_e, newValue) => {
          if (newValue && newValue.name.startsWith('Add "')) {
            newValue.name = newValue.name.slice(5, -1);
            setSerieToAdd({ name: newValue.name } as SeriesItem);
            setOpenDialog(true);
          } else {
            onChange(newValue);
          }
        }}
        // onChange={(_, newValue) => onChange(newValue)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        renderOption={(props, option) => (
          <li {...props}>
            <span className="line-clamp-2 capitalize">{option.name}</span>
          </li>
        )}
        filterOptions={(options, params) => {
          const val = params.inputValue;

          const filtered = options.filter((option) =>
            option.name.toLowerCase().includes(val.toLowerCase()),
          );

          val.length > 2 &&
            filtered.push({
              name: `Add "${params.inputValue}"`,
            } as SeriesItem);

          return filtered;
        }}
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
      <SeriesDialog
        open={openDialog}
        setOpen={setOpenDialog}
        serieToEdit={serieToAdd}
        setSelectedSerie={onChange}
      />
    </>
  );
};

export default SeriesInput;
