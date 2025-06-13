import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import config from "../../utils/config";
import {
  ExitToApp,
  Face3TwoTone,
  LabelTwoTone,
  LocalOfferTwoTone,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

// Define types for our options
type OptionType = "cast" | "tag" | "code";

interface FilterOption {
  id: string;
  type: OptionType;
}

const FiltersAC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const defOpt: FilterOption[] = [
    { id: "Softcore", type: "tag" },
    { id: "Ass Lover", type: "tag" },
  ];
  const [options, setOptions] = useState<FilterOption[]>(defOpt);
  const [searchParams, setSearchParams] = useSearchParams();
  const goTo = useNavigate();

  // Get current params
  const currentCastNames =
    searchParams.get("cast")?.split(",").filter(Boolean) || [];
  const currentTagIds =
    searchParams.get("tags")?.split(",").filter(Boolean) || [];

  // Create selected options based on URL parameters
  const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([
    ...currentCastNames.map((name) => ({
      id: name,
      type: "cast" as OptionType,
    })),
    ...currentTagIds.map((id) => ({ id, type: "tag" as OptionType })),
  ]);

  // Keep selected options in sync with URL params
  useEffect(() => {
    const castNames =
      searchParams.get("cast")?.split(",").filter(Boolean) || [];
    const tagIds = searchParams.get("tags")?.split(",").filter(Boolean) || [];

    const newSelectedOptions = [
      ...castNames.map((name) => ({ id: name, type: "cast" as OptionType })),
      ...tagIds.map((id) => ({ id, type: "tag" as OptionType })),
    ];

    // Only update if the options have actually changed
    if (
      JSON.stringify(newSelectedOptions) !== JSON.stringify(selectedOptions)
    ) {
      setSelectedOptions(newSelectedOptions);
    }
  }, [searchParams, selectedOptions]);

  // Update URL params whenever selected options change
  const updateUrlParams = (options: FilterOption[]) => {
    const castIds = options
      .filter((option) => option.type === "cast")
      .map((option) => option.id);

    const tagIds = options
      .filter((option) => option.type === "tag")
      .map((option) => option.id);

    // Create new search params object
    const newSearchParams = new URLSearchParams(searchParams);

    // Update or remove the parameters
    if (castIds.length > 0) {
      newSearchParams.set("cast", castIds.join(","));
      newSearchParams.delete("p");
    } else {
      newSearchParams.delete("cast");
    }

    if (tagIds.length > 0) {
      newSearchParams.set("tags", tagIds.join(","));
      newSearchParams.delete("p");
    } else {
      newSearchParams.delete("tags");
    }

    // Update URL with new search params
    setSearchParams(newSearchParams);
  };

  // Fetch options from the database using unified API endpoint
  const fetchOptions = async (q: string): Promise<void> => {
    if (q.length < 2) {
      setOptions(defOpt);
      return;
    }

    setLoading(true);
    try {
      // Use the new unified API endpoint
      const response = await fetch(`${config.apiUrl}/movies/filter?q=${q}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // If we have results, use them
        setOptions(data);
      } else {
        // If no results or invalid format, fall back to default options
        setOptions(defOpt);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptions(defOpt);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change to fetch options
  const handleInputChange = (
    _event: React.SyntheticEvent,
    value: string,
  ): void => {
    // Only fetch when we have at least 2 characters
    if (value.length >= 2) {
      fetchOptions(value);
    } else {
      setOptions(defOpt);
    }
  };

  // Handle option selection or removal
  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: FilterOption[],
  ): void => {
    // Check if the last added option is a code type
    const lastOption = newValue[newValue.length - 1];
    if (lastOption && lastOption.type === "code") {
      goTo(`/movie/${lastOption.id}`);
      return;
    }

    setSelectedOptions(newValue);
    updateUrlParams(newValue);
  };

  return (
    <Autocomplete<FilterOption, true>
      id="f-movie-filters"
      open={open}
      loading={loading}
      onOpen={() => {
        setOpen(true);
        setOptions(defOpt);
      }}
      onClose={() => setOpen(false)}
      options={options}
      multiple
      value={selectedOptions}
      autoHighlight
      sx={{ mb: 2 }}
      filterOptions={(options) => options}
      getOptionLabel={(option) => option.id}
      isOptionEqualToValue={(option, value) =>
        option.id === value.id && option.type === value.type
      }
      onChange={handleChange}
      onInputChange={handleInputChange}
      renderOption={(props, option) => (
        <li {...props}>
          {option.type === "cast" ? (
            <>
              <div className="mr-2">
                <Face3TwoTone color="primary" />
              </div>
              <span className="capitalize">{option.id}</span>
              <IconButton
                component={Link}
                to={`/actor/${option.id.toLowerCase().replace(/ /g, "-")}`}
                sx={{ ml: 1, p: 0.75 }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ExitToApp />
              </IconButton>
            </>
          ) : option.type === "tag" ? (
            <>
              <div className="mr-1 text-red-400">
                <LocalOfferTwoTone color="inherit" />
              </div>
              <span className="capitalize">{option.id}</span>
            </>
          ) : (
            <>
              <div className="mr-1 text-blue-400">
                <LabelTwoTone color="inherit" />
              </div>
              <span className="uppercase">{option.id}</span>
            </>
          )}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label="Filters"
          variant="outlined"
          placeholder="Search actors or tags (type at least 2 characters)"
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
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            // key={`${option.type}-${option.id}`}
            label={option.id}
            {...getTagProps({ index })}
            color={option.type === "cast" ? "primary" : "secondary"}
            size="small"
            className="capitalize"
            onDelete={() => {
              const newOptions = selectedOptions.filter(
                (item) => !(item.id === option.id && item.type === option.type),
              );
              setSelectedOptions(newOptions);
              updateUrlParams(newOptions);
            }}
          />
        ))
      }
    />
  );
};

export default FiltersAC;
