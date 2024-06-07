import { useContext } from "react";
import { ActorNamesContext } from "../../Actors/ActorNamesProvider";
import { Autocomplete, TextField } from "@mui/material";

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
      limitTags={1}
      value={selectedActorsF}
      onChange={(_e, newValue) => {
        setSelectedActorsF(newValue);
      }}
      disableCloseOnSelect // Add this prop
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
          placeholder="Girls"
        />
      )}
      renderTags={() => <></>}
    />
  );
};

export default ActorsInput;
