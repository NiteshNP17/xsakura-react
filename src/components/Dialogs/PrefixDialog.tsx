import {
  Button,
  // Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import config from "../../utils/config";

interface LabelDialogProps {
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  reload: () => void;
}

const PrefixDialog: React.FC<LabelDialogProps> = ({
  label,
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
    dataToSubmit.label = label;

    console.log(dataToSubmit);

    try {
      await axios.post(`${config.apiUrl}/labels`, dataToSubmit);
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
        Add label data for{" "}
        <span className="font-semibold uppercase">{label}</span>
      </DialogTitle>
      <DialogContent>
        <div className="mx-auto my-2 grid max-w-80 grid-cols-2 gap-4">
          <TextField
            name="prefix"
            type="text"
            autoComplete="off"
            label="Prefix"
            size="small"
          />
          <TextField
            name="name"
            type="text"
            autoComplete="off"
            label="Name"
            size="small"
          />
          <TextField
            name="imgPre"
            type="text"
            autoComplete="off"
            label="Img Prefix"
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
        <div className="mx-auto mt-4 w-full justify-center text-center">
          <FormControl>
            <FormLabel>Suffix</FormLabel>
            <RadioGroup row>
              <FormControlLabel control={<Radio />} label="None" />
              <FormControlLabel
                value="isHq"
                control={<Radio name="isHq" />}
                label="HQ"
              />
              <FormControlLabel
                value="isDmb"
                control={<Radio name="isDmb" />}
                label="DMB"
              />
              <FormControlLabel
                value="isVr"
                control={<Radio name="isVr" />}
                label="VR"
              />
            </RadioGroup>
            <FormLabel>3 Digits</FormLabel>
            <Switch name="is3digits" sx={{ mx: "auto" }} />
          </FormControl>
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
