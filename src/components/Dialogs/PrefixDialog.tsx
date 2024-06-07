import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import axios from "axios";

interface PrefixDialogProps {
  prefix: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  reload: () => void;
}

const PrefixDialog: React.FC<PrefixDialogProps> = ({
  prefix,
  open,
  setOpen,
  reload,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataToSubmit = Object.fromEntries(formData);
    dataToSubmit.pre = prefix;

    console.log(dataToSubmit);

    try {
      await axios.post("http://localhost:5000/lookups/pre", dataToSubmit);
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
        Add prefix data for{" "}
        <span className="font-semibold uppercase">{prefix}</span>
      </DialogTitle>
      <DialogContent>
        <div className="max-w-80 grid grid-cols-2 gap-4 mx-auto my-2">
          <TextField
            name="prePre"
            type="text"
            autoComplete="off"
            label="PrePre"
            size="small"
          />
          <TextField
            name="maxNum"
            type="number"
            autoComplete="off"
            label="Max Num"
            size="small"
          />
        </div>
        <div className="place-items-center grid w-full grid-cols-3 mx-auto">
          <FormControlLabel
            control={<Checkbox name="is3Digits" />}
            label="3 Digits"
          />
          <FormControlLabel control={<Checkbox name="isDmb" />} label="DMB" />
          <FormControlLabel
            control={<Checkbox name="isPrestige" />}
            label="Prestige?"
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

export default PrefixDialog;
