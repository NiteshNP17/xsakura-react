import { Dialog } from "@mui/material";
import { AlbumData } from "../../utils/customTypes";

interface ImageDialogProps {
  albumData: AlbumData;
  index: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  albumData,
  index,
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <img
        src={`https://${albumData.domain}/i/${albumData.galleryCode}/${albumData.images[index].imgCode}.jpg/${albumData.images[index].fileName}`}
        alt={albumData.images[index].fileName}
      />
    </Dialog>
  );
};

export default ImageDialog;
