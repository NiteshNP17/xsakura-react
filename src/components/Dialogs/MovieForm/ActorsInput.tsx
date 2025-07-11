import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ActorData } from "../../../utils/customTypes";
import { useContext, useState } from "react";
import config from "../../../utils/config";
import { CircularProgress } from "@mui/material";
import ActorQuickAddDialog from "./ActorQuickAddDialog";
import MovieCastList from "../../movies/MovieCastList";
import { MovieContext } from "./MovieContext";

const ActorsInput = () => {
  const [options, setOptions] = useState<ActorData[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openQuickAdd, setOpenQuickAdd] = useState(false);
  const [actorToAdd, setActorToAdd] = useState("");
  const { movieState, setMovieState } = useContext(MovieContext);
  // const [selectedActorsF, setSelectedActorsF] = useState<ActorData[]>(
  //   movieState.cast || [],
  // );

  const fetchOptions = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${config.apiUrl}/actors?sort=numMovies&dir=desc&list&q=${q}`,
      );
      const resData = await res.json();
      setOptions(resData.actors);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleAddOption = (inputValue: string) => {
    setActorToAdd(inputValue);
    setOpenQuickAdd(true);
  };

  return (
    <>
      <Autocomplete
        id="f-actor-opts"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        loading={loading}
        options={options || []}
        multiple
        autoHighlight
        limitTags={1}
        value={movieState.cast}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onChange={(_e, newValue) => {
          if (newValue && newValue?.length > 0) {
            const lastSelected = newValue[newValue?.length - 1];
            if (lastSelected.name.startsWith('Add "')) {
              handleAddOption(lastSelected.name.slice(5, -1)); // Remove 'Add "' and '"'
            } else {
              setMovieState({ ...movieState, cast: newValue });
            }
          } else {
            setMovieState({ ...movieState, cast: newValue });
          }
        }}
        onInputChange={(_e, val) => val?.length > 2 && fetchOptions(val)}
        // disableCloseOnSelect // Add this prop
        filterOptions={(options, params) => {
          const val = params.inputValue;

          const filtered = options?.sort((a, b) => {
            if (a.name.startsWith(val) && !b.name.startsWith(val)) return -1;
            if (!a.name.startsWith(val) && b.name.startsWith(val)) return 1;
            return 0;
          });

          const { inputValue } = params;
          // Suggest the creation of a new value
          // const isExisting = options?.some(
          //   (option) => inputValue === option.name,
          // );
          // if (inputValue?.length > 3 && !isExisting) {
          if (inputValue?.length > 3) {
            filtered.push({
              name: `Add "${inputValue}"`,
            } as ActorData);
          }

          return filtered;
        }}
        renderOption={(props, option) => (
          <li {...props}>
            <span className="capitalize">{option.name}</span>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Actor(s)"
            variant="outlined"
            placeholder="Select Actresses"
            sx={{ margin: "-1rem 0" }}
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
        renderTags={() => <></>}
      />
      <div className="col-span-2 my-1 flex h-8 w-full flex-row-reverse items-center gap-1 overflow-x-scroll">
        {movieState.cast?.length > 0 ? (
          <MovieCastList
            movieCast={movieState.cast}
            release={movieState.release?.length > 7 ? movieState.release : ""}
          />
        ) : (
          <span className="w-full pt-4 text-center text-lg opacity-50 md:pt-0">
            Actors
          </span>
        )}
      </div>
      <ActorQuickAddDialog
        open={openQuickAdd}
        setOpen={setOpenQuickAdd}
        actorToAdd={actorToAdd}
      />
    </>
  );
};

export default ActorsInput;
