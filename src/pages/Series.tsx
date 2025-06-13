import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import config from "../utils/config";
import { SeriesItem } from "../utils/customTypes";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import SeriesDialog from "../components/Dialogs/SeriesDialog";
import useKeyboardShortcut from "../utils/useKeyboardShortcut";
import MutateMenu from "../components/Dialogs/MutateMenu";
import SeriesCard from "../components/series/SeriesCard";
// import SerieImage from "../components/series/SerieImage";

// Main Series component
const Series = () => {
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [openSeriesDialog, setOpenSeriesDialog] = useState(false);
  const [reload, setReload] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [urlParams, setUrlParams] = useSearchParams();
  const page = parseInt(urlParams.get("p") || "1");
  const [serieToEdit, setSerieToEdit] = useState<SeriesItem>({} as SeriesItem);
  const [totalPages, setTotalPages] = useState(1);
  const [studio, setStudio] = useState("All");

  const handlePageChange = (
    _e: React.ChangeEvent<unknown> | KeyboardEvent | null,
    newPage: number,
  ) => {
    const params = new URLSearchParams(urlParams);
    if (newPage === 1) {
      params.delete("p");
    } else {
      params.set("p", newPage.toString());
    }
    setUrlParams(params.toString(), { replace: true });
  };

  useEffect(() => {
    const fetchAllSeries = async () => {
      try {
        const res = await fetch(
          `${config.apiUrl}/series?${studio !== "All" ? "studio=" + studio + "&" : ""}page=${page}`,
        );
        const resData = await res.json();
        setSeriesList(resData.data);
        setTotalPages(resData.totalPages);
      } catch (err) {
        console.error("internal server error: ", err);
      }
    };

    fetchAllSeries();
  }, [reload, page, studio]);

  const handleAdd = () => {
    setSerieToEdit({} as SeriesItem);
    setTimeout(() => {
      setOpenSeriesDialog(true);
    }, 10);
  };

  useKeyboardShortcut({ modifier: "alt", key: "i", callback: handleAdd });

  return (
    <div className="mx-auto max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase">Series</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
        <FormControl sx={{ ml: "auto", minWidth: 120 }}>
          <InputLabel>Studio</InputLabel>
          <Select
            label="Studio"
            value={studio}
            onChange={(e) => setStudio(e.target.value)}
            size="small"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Prestige">Prestige</MenuItem>
            <MenuItem value="Madonna">Madonna</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="grid-fit-2 gap-4">
        {seriesList.map((series) => (
          <SeriesCard
            key={series._id}
            series={series}
            setSerieToEdit={setSerieToEdit}
            setAnchorEl={setAnchorEl}
          />
        ))}
      </div>
      <div className="my-12 flex w-full justify-center">
        <Pagination
          count={totalPages}
          size="large"
          color="primary"
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <MutateMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        setOpenEditDialog={setOpenSeriesDialog}
        // setOpenDeleteDialog={setOpenDeleteDialog}
      />
      <SeriesDialog
        open={openSeriesDialog}
        setOpen={setOpenSeriesDialog}
        reload={() => setReload(!reload)}
        serieToEdit={serieToEdit}
      />
    </div>
  );
};

export default Series;
