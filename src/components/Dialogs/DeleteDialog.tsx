import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import axios from "axios";
import { useState } from "react";
import config from "../../utils/config";

interface DeleteDialogProps {
  type: "actors" | "movies";
  deleteId: { id: string; uId: string };
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  type,
  deleteId,
  open,
  setOpen,
  refetch,
}) => {
  const [loading, setLoading] = useState(false);

  const deleteItem = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${config.apiUrl}/${type}/${deleteId.id}`);
      console.log(res.data);
      setLoading(false);
      handleClose();
      refetch();
    } catch (err) {
      alert("error deleting item: " + err);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="p-6 text-xl">
        Delete {type.slice(0, -1)}{" "}
        <span
          className={`${
            type === "movies" ? "uppercase" : "capitalize"
          } font-semibold`}
        >
          {deleteId.id}
        </span>
        ?
      </div>
      <div className="grid w-full grid-cols-2 gap-2 p-2">
        <Button color="secondary" variant="contained" onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="error"
          onClick={deleteItem}
        >
          <span className="text-md">Delete</span>
        </LoadingButton>
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
