import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { ActorData } from "../../../utils/customTypes";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../utils/config";
import { LoadingButton } from "@mui/lab";

interface ActorQADProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedActors: ActorData[];
  setSelectedActors: (selectedActors: ActorData[]) => void;
  actorToAdd: string;
}

const ActorQuickAddDialog: React.FC<ActorQADProps> = ({
  open,
  setOpen,
  selectedActors,
  setSelectedActors,
  actorToAdd,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${config.apiUrl}/actors`, {
        name: actorToAdd,
      });
      const newActor = res.data;
      setSelectedActors([...selectedActors, newActor]);
      setOpen(false);
    } catch (err) {
      alert("failed adding actor: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        document.getElementById("aqd-save-btn")?.focus();
      }, 50);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      // PaperProps={{ component: "form", onSubmit: handleSubmit }}
    >
      <DialogTitle className="capitalize">
        Add "<b>{actorToAdd}</b>"?
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          variant="contained"
          color="success"
          id="aqd-save-btn"
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ActorQuickAddDialog;
