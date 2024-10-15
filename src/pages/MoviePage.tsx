import { useParams } from "react-router-dom";
import Trailer from "../components/movies/Trailer";
import { IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { useState } from "react";
import PrefixDialog from "../components/Dialogs/PrefixDialog";
import useKeyboardShortcut from "../utils/useKeyboardShortcut";
import MovieImages from "../components/movies/MovieImages";

const MoviePage = () => {
  const { code } = useParams();
  const [openPrefixDialog, setOpenPrefixDialog] = useState(false);
  const [reload, setReload] = useState(false);

  useKeyboardShortcut({
    modifier: "alt",
    key: "i",
    callback: () => setOpenPrefixDialog(true),
  });

  return (
    <div className="mx-auto max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase">{code}</h1>
        <IconButton color="primary" onClick={() => setOpenPrefixDialog(true)}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="grid gap-4 sm:grid-cols-6">
        <div className="col-span-4">
          <div className="cq flex aspect-video max-w-[1024px] items-center justify-center overflow-hidden rounded-xl">
            {code?.startsWith("fc2") ? (
              <div>No Trailer</div>
            ) : (
              <Trailer code={code || ""} reload={reload} />
            )}
          </div>
          <div className="my-6 flex gap-4">
            <a href={`https://javct.net/v/${code}`}>JavCT</a>
            <a href={`https://njav.tv/en/v/${code}`}>Njav</a>
            <a href={`https://missav.com/en/${code}`}>MissAV</a>
            <a href={`https://missav.com/en/${code}-uncensored-leak`}>
              MissAV MR
            </a>
            <a href={`https://www4.javhdporn.net/video/${code}`}>JavHDPorn</a>
          </div>
        </div>
        {!code?.startsWith("fc2") && (
          <div className="col-span-2">
            <MovieImages code={code ? code : ""} />
          </div>
        )}
      </div>
      <PrefixDialog
        label={code?.split("-")[0] || ""}
        open={openPrefixDialog}
        setOpen={setOpenPrefixDialog}
        reload={() => setReload(!reload)}
      />
    </div>
  );
};

export default MoviePage;
