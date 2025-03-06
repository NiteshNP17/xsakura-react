import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import ActorsInput from "./MovieForm/ActorsInput";
import { LoadingButton } from "@mui/lab";
import { useContext, useState } from "react";
import { MovieContext } from "./MovieForm/MovieContext";
import { MovieData } from "../../utils/customTypes";
import axios from "axios";
import config from "../../utils/config";
import { useSearchParams } from "react-router-dom";

interface BatchAddDialogProps {
  openBatchDialog: boolean;
  setOpenBatchDialog: (openBatchDialog: boolean) => void;
  refetch: () => void;
}

const BatchAddDialog: React.FC<BatchAddDialogProps> = ({
  openBatchDialog,
  setOpenBatchDialog,
  refetch,
}) => {
  const [loading, setLoading] = useState(false);
  const { movieState, setMovieState } = useContext(MovieContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "release";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const codes = (
      document.getElementById("batch-input") as HTMLInputElement
    ).value
      .trim()
      .toLowerCase();

    const castArray = movieState.cast.map((actorData) => actorData._id);

    const dataToPost = {
      cast: JSON.stringify(castArray),
      codes,
    };

    console.log("dataToPost: ", dataToPost);

    try {
      await axios.post(`${config.apiUrl}/movies/batch-create`, dataToPost);
      handleClose();
      if (sort !== "added") {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("sort", "added");
        setSearchParams(newSearchParams);
      } else refetch();
      // setOpenSnack(true);
    } catch (err) {
      alert("Error adding movie: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenBatchDialog(false);
    setMovieState({} as MovieData);
  };

  return (
    <Dialog
      open={openBatchDialog}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Batch Add</DialogTitle>
      <DialogContent>
        <div className="grid gap-2 pt-5">
          <ActorsInput />
          <TextField
            id="batch-input"
            type="text"
            name="codes"
            variant="outlined"
            autoComplete="off"
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={!movieState.cast}
          loading={loading}
          variant="contained"
          color="success"
          size="large"
          type="submit"
          sx={{ px: 4 }}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default BatchAddDialog;
