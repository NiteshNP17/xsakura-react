import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import config from "../../utils/config";
import { Face3TwoTone, LocalOfferTwoTone } from "@mui/icons-material";
import { Tag } from "../../utils/customTypes";

// Define types for our options
type OptionType = "cast" | "tag";

interface FilterOption {
  id: string;
  type: OptionType;
}

// Define type for cast API response
interface CastMember {
  id: string;
  name: string;
  // Add other properties your API returns
}

const FiltersAC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<FilterOption[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial selected options from URL params
  const initialCastNames =
    searchParams.get("cast")?.split(",").filter(Boolean) || [];
  const initialTagIds =
    searchParams.get("tags")?.split(",").filter(Boolean) || [];

  // Create initial cast options directly from the URL parameter
  const initialCastOptions: FilterOption[] = initialCastNames.map((name) => ({
    id: name, // Use name as ID for simplicity
    type: "cast",
  }));

  // Create initial tag options directly from the URL parameter
  const initialTagOptions: FilterOption[] = initialTagIds.map((id) => ({
    id: id,
    type: "tag",
  }));

  // Combine initial selections
  const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([
    ...initialCastOptions,
    ...initialTagOptions,
  ]);

  // Fetch options from the database
  const fetchOptions = async (q: string): Promise<void> => {
    setLoading(true);
    try {
      // Parallel API calls for both cast and tags
      let castResponse, tagResponse;

      try {
        // Only fetch cast if query is 3+ characters
        if (q.length >= 3) {
          castResponse = await fetch(
            `${config.apiUrl}/actors?sort=numMovies&dir=desc&list&q=${q}`,
          );
        }
      } catch (error) {
        console.error("Error fetching cast options:", error);
        castResponse = null;
      }

      try {
        // Fetch tags if query is 2+ characters
        if (q.length >= 2) {
          tagResponse = await fetch(`${config.apiUrl}/lookups/tags?q=${q}`);
        }
      } catch (error) {
        console.error("Error fetching tag options:", error);
        tagResponse = null;
      }

      let castOptions: FilterOption[] = [];
      let tagOptions: FilterOption[] = [];

      // Process cast response if we got one
      if (castResponse) {
        const castData = await castResponse.json();

        // Check if actors array exists before mapping
        if (castData && Array.isArray(castData.actors)) {
          const actorData: CastMember[] = castData.actors;

          // Transform the API responses to match our option format
          castOptions = actorData.map((actor) => ({
            id: actor.name,
            type: "cast",
          }));
        }
      }

      // Process tag response if we got one
      if (tagResponse) {
        const tagData = await tagResponse.json();

        // Check if tags array exists before mapping
        if (tagData && Array.isArray(tagData)) {
          const tagsData: Tag[] = tagData;

          // Transform the API responses to match our option format
          tagOptions = tagsData.map((tag) => ({
            id: tag.name,
            type: "tag",
          }));
        }
      }

      // Combine cast options with tag options
      setOptions([...castOptions, ...tagOptions]);
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change to fetch options
  const handleInputChange = (
    _event: React.SyntheticEvent,
    value: string,
  ): void => {
    if (value.length >= 2) {
      // Fetch options when query is at least 2 characters
      fetchOptions(value);
    } else {
      // Clear options if input is too short
      setOptions([]);
    }
  };

  // Handle option selection
  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: FilterOption[],
  ): void => {
    setSelectedOptions(newValue);

    // Extract cast and tag IDs
    const castIds = newValue
      .filter((option) => option.type === "cast")
      .map((option) => option.id);

    const tagIds = newValue
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

  return (
    <Autocomplete<FilterOption, true>
      id="f-movie-filters"
      open={open}
      loading={loading}
      onOpen={() => {
        setOpen(true);
        // Initialize with empty options when opening
        setOptions([]);
      }}
      onClose={() => setOpen(false)}
      options={options}
      multiple
      value={selectedOptions}
      autoHighlight
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filterOptions={(options, _state) => options}
      getOptionLabel={(option) => option.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={handleChange}
      onInputChange={handleInputChange}
      groupBy={(option) => (option.type === "cast" ? "Cast" : "Tags")}
      renderOption={(props, option) => (
        <li {...props}>
          {option.type === "cast" ? (
            <div className="mr-2">
              <Face3TwoTone color="primary" />
            </div>
          ) : (
            <div className="mr-1 text-red-400">
              <LocalOfferTwoTone color="inherit" />
            </div>
          )}
          <span className="capitalize">{option.id}</span>
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
            label={option.id}
            {...getTagProps({ index })}
            color={option.type === "cast" ? "primary" : "secondary"}
            size="small"
            className="capitalize"
          />
        ))
      }
    />
  );
};

export default FiltersAC;
