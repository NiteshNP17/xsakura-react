import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { MovieData } from "../../../utils/customTypes";
// import MoviePreview from "./MoviePreview";
// import { useState } from "react";

interface MovieDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  movieToEdit: MovieData;
}

const MovieDialog: React.FC<MovieDialogProps> = ({
  open,
  setOpen,
  movieToEdit,
}) => {
  const isMobile = useMediaQuery("(max-width:660px)");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
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
      <DialogTitle>{movieToEdit.code ? "Edit" : "Add"} Movie</DialogTitle>
      <DialogContent>
        <div className="grid justify-center md:grid-cols-2 md:gap-6">
          <div className="grid gap-4">
            {/* <MoviePreview
              codeToPv={movieToEdit.code || previewCode || ""}
              overrides={{
                cover: overrides.cover
                  ? overrides.cover
                  : movieData.overrides?.cover,
                preview: overrides.preview
                  ? overrides.preview
                  : movieData.overrides?.preview,
              }}
              isForm
              setRelease={setRelease}
              setRuntime={setRuntime}
              setTitle={setTitle}
            /> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDialog;
