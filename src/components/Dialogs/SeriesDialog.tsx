import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import config from "../../utils/config";
import { formatCode } from "../../utils/utils";
import { useEffect } from "react";
import { SeriesItem } from "../../utils/customTypes";

interface PrefixDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reload: () => void;
  serieToEdit: SeriesItem;
}

const SeriesDialog: React.FC<PrefixDialogProps> = ({
  open,
  setOpen,
  reload,
  serieToEdit,
}) => {
  useEffect(() => {
    if (!serieToEdit.slug && open) {
      setTimeout(() => {
        document.getElementById("name-input")?.focus();
      }, 50);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataToSubmit = Object.fromEntries(formData);

    // Get the 'thumbs' value
    const thumbsValue = formData.get("thumbs") as string;

    // Process 'thumbs' only if it's not empty
    if (thumbsValue && thumbsValue.trim() !== "") {
      const processedThumbs = thumbsValue
        .split(" ")
        .map((thumb) => formatCode(thumb)) // This is equivalent to formatCode('abc'), etc.
        .join(" ");

      // Update the dataToSubmit object with the processed thumbs
      dataToSubmit.thumbs = processedThumbs;
    }

    try {
      if (!serieToEdit.slug) {
        await axios.post(`${config.apiUrl}/series`, dataToSubmit);
      } else {
        await axios.patch(
          `${config.apiUrl}/series/${serieToEdit.slug}`,
          dataToSubmit,
        );
      }
      handleClose();
      reload();
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ component: "form", onSubmit: handleSubmit }}
    >
      <DialogTitle>
        {!serieToEdit.slug ? "Add" : "Edit"} Series {serieToEdit.slug}
      </DialogTitle>
      <DialogContent>
        <div className="mx-auto my-2 grid w-80 gap-4">
          <TextField
            name="name"
            type="text"
            autoComplete="off"
            required
            label="Name"
            defaultValue={serieToEdit.name}
            inputProps={{ id: "name-input" }}
          />
          <TextField
            name="studio"
            type="text"
            label="Studio"
            defaultValue={serieToEdit.studio}
          />
          <TextField
            name="thumbs"
            type="text"
            autoComplete="off"
            label="Thumbs"
            defaultValue={serieToEdit.thumbs}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ px: 3 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeriesDialog;
