import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface MutateMenuProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  setOpenEditDialog: (open: boolean) => void;
}

const MutateMenu: React.FC<MutateMenuProps> = ({
  anchorEl,
  setAnchorEl,
  setOpenEditDialog,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={anchorEl !== null}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setOpenEditDialog(true);
        }}
      >
        <Edit className="opacity-50" />
        &nbsp;Edit
      </MenuItem>
      <MenuItem>
        <Delete className="opacity-50" />
        &nbsp;Delete
      </MenuItem>
    </Menu>
  );
};

export default MutateMenu;
