import { useContext } from "react";
import { ActorNamesContext } from "../../Actors/ActorNamesProvider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface ActorsInputProps {
  selectedActorsF: string[];
  setSelectedActorsF: (selectedActorsF: string[]) => void;
}

const ActorsInput: React.FC<ActorsInputProps> = ({
  selectedActorsF,
  setSelectedActorsF,
}) => {
  const { actorsInDb } = useContext(ActorNamesContext);
  const fActorNames = actorsInDb.map((actor) => actor.name);

  return (
    <Autocomplete
      id="f-actor-opts"
      options={fActorNames}
      freeSolo
      multiple
      autoHighlight
      clearOnBlur
      limitTags={1}
      value={selectedActorsF}
      onChange={(_e, newValue) => {
        const processedValue = newValue.map((item) => {
          if (item.startsWith('Add "') && item.endsWith('"')) {
            return item.slice(5, -1); // Remove 'Add "' and the closing quotation mark
          }
          return item;
        });
        setSelectedActorsF(processedValue);
      }}
      // disableCloseOnSelect // Add this prop
      filterOptions={(options, params) => {
        const inputValue = params.inputValue.toLowerCase();
        const filtered = options
          .filter((option) => option.includes(inputValue))
          .sort((a, b) => {
            // Exact matches first
            if (a.toLowerCase() === inputValue) return -1;
            if (b.toLowerCase() === inputValue) return 1;
            // Then, options starting with the input
            if (
              a.toLowerCase().startsWith(inputValue) &&
              !b.toLowerCase().startsWith(inputValue)
            )
              return -1;
            if (
              !a.toLowerCase().startsWith(inputValue) &&
              b.toLowerCase().startsWith(inputValue)
            )
              return 1;
            // Finally, alphabetical order
            return a.localeCompare(b);
          });

        if (inputValue !== "") {
          filtered.push(`Add "${params.inputValue}"`);
        }

        return filtered;
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <span className="capitalize">{option}</span>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Actor(s)"
          variant="outlined"
          placeholder="Select Actresses"
        />
      )}
      renderTags={() => <></>}
    />
  );
};

export default ActorsInput;
