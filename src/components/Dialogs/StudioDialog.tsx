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
import { StudioItem } from "../../utils/customTypes";

interface StudioDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reload?: () => void;
  studioToEdit: StudioItem;
}

const StudioDialog: React.FC<StudioDialogProps> = ({
  open,
  setOpen,
  reload,
  studioToEdit,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const dataToSubmit = Object.fromEntries(formData);

    try {
      if (studioToEdit.name) {
        await axios.patch(
          `${config.apiUrl}/studios/${studioToEdit.slug}`,
          dataToSubmit,
        );
      } else {
        await axios.post(`${config.apiUrl}/studios`, dataToSubmit);
      }
      handleClose();
      reload && reload();
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
      <DialogTitle>Add Studio</DialogTitle>
      <DialogContent>
        <div className="mx-auto my-2 grid w-80 gap-4">
          <TextField
            name="name"
            type="text"
            autoComplete="off"
            defaultValue={studioToEdit.name}
            required
            label="Name"
          />
          <TextField
            type="text"
            name="labels"
            required
            autoComplete="off"
            defaultValue={studioToEdit.labels}
            label="Labels"
          />
          <TextField
            type="text"
            name="web"
            autoComplete="off"
            label="Web"
            defaultValue={studioToEdit.web}
          />
          <TextField
            type="text"
            name="logo"
            autoComplete="off"
            label="Logo"
            defaultValue={studioToEdit.logo}
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

export default StudioDialog;
