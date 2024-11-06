import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import ActorsInput from "./MovieForm/ActorsInput";
// import { ActorData } from "../../utils/customTypes";
// import MovieCastList from "../movies/MovieCastList";
import axios from "axios";
import config from "../../utils/config";

interface AlbumDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

const AlbumDialog: React.FC<AlbumDialogProps> = ({
  open,
  setOpen,
  refetch,
}) => {
  const [loading, setLoading] = useState(false);
  // const [selectedActors, setSelectedActors] = useState<ActorData[]>([]);
  // const [release, setRelease] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const dataToSubmit = Object.fromEntries(formData);
    // const castArray = selectedActors.map((actorData) => actorData._id);
    // dataToSubmit.models = JSON.stringify(castArray);

    try {
      await axios.post(`${config.apiUrl}/albums`, dataToSubmit);
      refetch();
      setOpen(false);
    } catch (err) {
      alert("error posting album data: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{ component: "form", onSubmit: handleSubmit }}
    >
      <DialogTitle sx={{ pb: 0 }}>Add Album</DialogTitle>
      <DialogContent>
        {/* <div className="col-span-2 flex h-9 w-full items-center gap-1 overflow-x-scroll">
          {selectedActors.length > 0 ? (
            <MovieCastList movieCast={selectedActors} release={release} />
          ) : (
            <span className="w-full pt-4 text-center text-lg opacity-50 md:pt-0">
              Actors
            </span>
          )}
        </div> */}
        <div className="mx-auto my-2 mt-4 grid grid-cols-2 gap-4">
          <ActorsInput />
          <TextField
            name="name"
            type="text"
            autoComplete="off"
            required
            label="Name"
          />
          <TextField
            name="date"
            type="text"
            label="Date"
            autoComplete="off"
            // onBlur={(e) =>
            //   e.target.value.length > 3 && setRelease(e.target.value)
            // }
          />
          <TextField
            name="cover"
            type="text"
            label="Cover"
            autoComplete="off"
          />
          <TextField name="studio" type="text" label="Studio" />
          <TextField
            name="galleryCode"
            type="text"
            label="Gallery Code"
            autoComplete="off"
          />
          <TextField
            name="domain"
            type="text"
            label="Domain"
            autoComplete="off"
          />
          <div className="col-span-2 grid">
            <TextField
              name="images"
              label="Images"
              multiline
              rows={4}
              autoComplete="off"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          loading={loading}
          variant="contained"
          color="success"
          sx={{ px: 3 }}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AlbumDialog;
