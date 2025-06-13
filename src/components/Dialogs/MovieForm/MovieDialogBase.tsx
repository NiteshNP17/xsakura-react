import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import MovieDialog from "./MovieDialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import { useContext, useEffect, useState } from "react";
import { MovieContext } from "./MovieContext";
import axios from "axios";
import config from "../../../utils/config";

interface MovieDialogBaseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
  setOpenSnack: (openSnack: boolean) => void;
}

const MovieDialogBase: React.FC<MovieDialogBaseProps> = ({
  open,
  setOpen,
  refetch,
  setOpenSnack,
}) => {
  const isMobile = useMediaQuery("(max-width:660px)");
  const [isDisabled, setDisabled] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const { movieState, isToEdit } = useContext(MovieContext);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!movieState.code) return alert("Code is required!");

    const formData = new FormData(e.target as HTMLFormElement);
    const dataToPost = Object.fromEntries(formData);
    const castArray = movieState.cast.map((actorData) => actorData._id);
    const tagsArray = movieState.tag2.map((tag) => tag._id);

    dataToPost.code = movieState.code;
    dataToPost.cast = JSON.stringify(castArray);
    dataToPost.tag2 = JSON.stringify(tagsArray);
    dataToPost.series = movieState.series ? movieState.series._id : "";

    console.log("dataToPost: ", dataToPost);

    if (!isToEdit) {
      try {
        await axios.post(`${config.apiUrl}/movies`, dataToPost);
        handleClose();
        refetch();
        setOpenSnack(true);
      } catch (err) {
        if (String(err).endsWith("409")) {
          alert("Movie already exists!");
        } else {
          alert("Error adding movie: " + err);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await axios.put(
          `${config.apiUrl}/movies/${movieState.code}`,
          dataToPost,
        );
        handleClose();
        refetch();
        setOpenSnack(true);
      } catch (err) {
        alert("Error saving changes: " + err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (movieState.code?.length > 4) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }

    if (!movieState.code && open) {
      setTimeout(() => {
        document.getElementById("code-input")?.focus();
      }, 25);
    }
  }, [movieState.code, open]);

  return (
    <Dialog
      open={!open ? false : true}
      onClose={handleClose}
      fullScreen={isMobile}
      scroll="body"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      sx={{
        "@media (min-width: 661px)": {
          "& .MuiPaper-root": {
            m: 2,
            borderRadius: "1.3rem",
            maxWidth: "100vw",
            width: "clamp(330px, 95vw, 1000px)",
          },
        },
      }}
    >
      <div className="p-5">
        <DialogTitle sx={{ pt: 0 }}>
          <span className="text-2xl font-semibold">
            {isToEdit ? "Edit" : "Add"} Movie
          </span>
        </DialogTitle>
        <MovieDialog />
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
            disabled={isDisabled}
            loading={isLoading}
            variant="contained"
            color="success"
            size="large"
            type="submit"
            sx={isToEdit ? { px: 4 } : {}}
          >
            {isToEdit ? "Save" : "Add Movie"}
          </LoadingButton>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default MovieDialogBase;
