import { Link, useParams } from "react-router-dom";
import Trailer from "../components/movies/Trailer";
import { Alert, IconButton, Menu, MenuItem, Snackbar } from "@mui/material";
import { DatasetLinked, Face3TwoTone, MoreVert } from "@mui/icons-material";
import { useEffect, useState } from "react";
import PrefixDialog from "../components/Dialogs/PrefixDialog";
import useKeyboardShortcut from "../utils/useKeyboardShortcut";
import MovieImages from "../components/movies/MovieImages";
import { LabelData, MovieData } from "../utils/customTypes";
import config from "../utils/config";
import MovieCastList from "../components/movies/MovieCastList";
import { MovieContext } from "../components/Dialogs/MovieForm/MovieContext";
import MovieDialogBase from "../components/Dialogs/MovieForm/MovieDialogBase";
import LabelsInput from "../components/Dialogs/LabelsInput";

const MoviePage = () => {
  const { code } = useParams();
  const [codeLabel, codeNum] = code ? code.split("-") : ["a", "b"];
  const [openPrefixDialog, setOpenPrefixDialog] = useState(false);
  const [openLabelDialog, setOpenLabelDialog] = useState(false);
  const [reload, setReload] = useState(false);
  const [movieData, setMovieData] = useState<MovieData>({} as MovieData);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [labelData, setLabelData] = useState<LabelData>({} as LabelData);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const refetchMovies = () => {
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const getMovieData = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/movies/${code}`);
        const resData = await res.json();
        setMovieData(resData);

        const resLabel = await fetch(
          `${config.apiUrl}/labels/${codeLabel}?codenum=${codeNum}`,
        );
        const resLabeldata: LabelData = await resLabel.json();
        setLabelData(resLabeldata);
      } catch (err) {
        console.error("Error fetching movie data: ", err);
      }
    };

    getMovieData();
  }, [code, refetchTrigger, codeLabel, codeNum]);

  useKeyboardShortcut({
    modifier: "alt",
    key: "i",
    callback: () => setOpenEditDialog(true),
  });

  return (
    <div className="mx-auto max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase">
          <Link to={`/movies?label=${codeLabel}&sort=code`}>
            <span className="text-rose-800 dark:text-rose-200">
              {codeLabel}
            </span>
            -{codeNum}
          </Link>
        </h1>
        <IconButton
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ py: 0.5, px: 0.25 }}
        >
          <MoreVert />
        </IconButton>
        <IconButton
          component="a"
          href={`https://www.javdatabase.com/movies/${code}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ p: 0.75 }}
        >
          <DatasetLinked />
        </IconButton>
        <h2 className="overflow-x-scroll text-xl text-nowrap">
          {movieData.title}
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-6">
        <div className="col-span-6 sm:col-span-4">
          <div className="cq flex aspect-video max-w-[1024px] items-center justify-center overflow-hidden rounded-lg">
            {code?.startsWith("fc2") ? (
              <div>No Trailer</div>
            ) : (
              <Trailer
                code={code || ""}
                reload={reload}
                labelData={labelData}
              />
            )}
          </div>
          <div className="my-6 flex flex-wrap gap-4">
            <a
              href={`https://sextb.net/${code}`}
              target="_blank"
              rel="noreferrer"
            >
              SexTB
            </a>
            <a
              href={`https://njav.tv/en/v/${code}`}
              target="_blank"
              rel="noreferrer"
            >
              Njav
            </a>
            <a
              href={`https://njav.tv/en/v/${code}-uncensored-leak`}
              target="_blank"
              rel="noreferrer"
            >
              Njav MR
            </a>
            <a
              target="_blank"
              href={`https://missav.ws/en/${code}`}
              rel="noreferrer"
            >
              MissAV
            </a>
            <a
              target="_blank"
              href={`https://missav.ws/en/${code}-uncensored-leak`}
              rel="noreferrer"
            >
              MissAV MR
            </a>
            <a
              target="_blank"
              href={`https://www4.javhdporn.net/video/${code}`}
              rel="noreferrer"
            >
              JavHDPorn
            </a>
          </div>
        </div>
        {!code?.startsWith("fc2") && (
          <div className="col-span-6 px-3 sm:col-span-2">
            <MovieImages code={code ? code : ""} labelData={labelData} />
          </div>
        )}
      </div>
      {movieData.cast && (
        <div className="flex">
          <Face3TwoTone color="primary" />
          <MovieCastList
            movieCast={movieData.cast}
            release={movieData.release}
            mb
          />
        </div>
      )}
      {movieData.series && (
        <div className="flex capitalize">
          <p>Series:&nbsp;</p>
          <Link to={`/series/${movieData.series.slug}`}>
            {movieData.series.name}
          </Link>
        </div>
      )}
      {labelData.studio?.name && (
        <div className="flex">
          <p>Studio:&nbsp;</p>
          <Link to={`/movies?studio=${labelData.studio?.slug}&sort=release`}>
            {labelData.studio?.name}
          </Link>
        </div>
      )}
      <PrefixDialog
        label={code?.split("-")[0] || ""}
        open={openPrefixDialog}
        setOpen={setOpenPrefixDialog}
        reload={() => setReload(!reload)}
      />
      <LabelsInput
        open={openLabelDialog}
        setOpen={setOpenLabelDialog}
        refetch={refetchMovies}
        selectedLabel={labelData}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setOpenEditDialog(true);
            setAnchorEl(null);
          }}
        >
          Edit Movie
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenPrefixDialog(true);
            setAnchorEl(null);
          }}
        >
          Add Label
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenLabelDialog(true);
            setAnchorEl(null);
          }}
        >
          Edit Label
        </MenuItem>
      </Menu>
      <MovieContext.Provider
        value={{
          movieState: movieData,
          setMovieState: setMovieData,
          isToEdit: true,
        }}
      >
        <MovieDialogBase
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          refetch={refetchMovies}
          setOpenSnack={setOpenSnack}
        />
      </MovieContext.Provider>
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: "12px" }}
        onClose={(_e, reason?) => {
          if (reason === "clickaway") return;
          setOpenSnack(false);
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ fontSize: "1.1rem", padding: "0.5rem 3.5rem" }}
        >
          Movie Updated Successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MoviePage;
