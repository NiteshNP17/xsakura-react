import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import config from "../../utils/config";
import { useState } from "react";

interface LabelsInputProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
  selectedLabel: LabelList;
}

interface StudioList {
  _id: string;
  name: string;
}

interface LabelList {
  label: string;
  name: string;
}

const LabelsInput: React.FC<LabelsInputProps> = ({
  open,
  setOpen,
  refetch,
  selectedLabel,
}) => {
  const [openList, setOpenList] = useState(false);
  const [studList, setStudList] = useState<StudioList[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<StudioList | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const nameInput = document.getElementById(
        "name-input",
      ) as HTMLInputElement;

      await axios.patch(`${config.apiUrl}/labels/${selectedLabel.label}`, {
        name: nameInput?.value,
        studio: selectedStudio?._id,
      });
      refetch();
      setOpen(false);
    } catch (err) {
      alert("Failed to update label data: " + err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudList = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/studios/list`);
      setStudList(res.data);
    } catch (err) {
      console.error("Error fetching studios: ", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{ component: "form", onSubmit: handleSubmit }}
    >
      <DialogTitle>
        Set name for {selectedLabel.label?.toUpperCase()}
      </DialogTitle>
      <DialogContent>
        <TextField
          id="name-input"
          type="text"
          autoComplete="off"
          label="Name"
          sx={{ my: 0.75 }}
          defaultValue={selectedLabel.name}
        />
        <Autocomplete
          open={openList}
          onOpen={() => {
            fetchStudList();
            setOpenList(true);
          }}
          onClose={() => setOpenList(false)}
          loading={loading}
          options={studList || []}
          autoHighlight
          getOptionLabel={(Option) => Option.name}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          onChange={(_, newValue) => {
            setSelectedStudio(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Studio" />}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          size="large"
          type="submit"
          sx={{ px: 4 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabelsInput;
