import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { ActorData } from "../../utils/customTypes";
import { formatHeight, getRainbowColor } from "../../utils/utils";

const ActorDataTable = ({ actor }: { actor: ActorData }) => {
  const tbFontLg = { fontSize: "1.1rem", fontWeight: 600 };
  const isMobile = useMediaQuery("(max-width:660px)");

  return (
    <Table>
      <TableBody>
        {actor.dob && (
          <TableRow>
            <TableCell align="right" sx={tbFontLg}>
              {actor.ageAtLatestRel || ""}
            </TableCell>
            <TableCell>
              {isMobile ? actor.dob.toString().slice(2) : actor.dob.toString()}
            </TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell align="right" sx={tbFontLg}>
            <span
              className={
                actor.cup ? getRainbowColor(actor.cup) : "" + " text-xl"
              }
            >
              {actor.cup || ""}
            </span>
          </TableCell>
          {actor.sizes?.bust ? (
            <TableCell>
              {actor.sizes.bust}-{actor.sizes.waist}-{actor.sizes.hips}
            </TableCell>
          ) : (
            <TableCell> </TableCell>
          )}
        </TableRow>
        {actor.height && (
          <TableRow>
            <TableCell align="right" sx={tbFontLg}>
              {formatHeight(actor.height)}
            </TableCell>
            <TableCell>{actor.height}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ActorDataTable;
