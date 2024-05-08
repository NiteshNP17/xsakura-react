import Dialog from "@mui/material/Dialog";

interface MovieFormProps {
  codeToEdit: string | null;
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
}

const MovieForm: React.FC<MovieFormProps> = ({
  codeToEdit,
  openEditDialog,
  setOpenEditDialog,
}) => {
  return (
    <Dialog
      open={!openEditDialog ? false : true}
      onClose={() => setOpenEditDialog(false)}
    >
      <div>
        <h1 className="text-2xl font-semibold">
          {codeToEdit ? "Edit" : "Add"} Movie
        </h1>
        {codeToEdit && codeToEdit}
      </div>
    </Dialog>
  );
};

export default MovieForm;
