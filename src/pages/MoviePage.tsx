import { useParams } from "react-router-dom";
import Trailer from "../components/movies/Trailer";
import { IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { useState } from "react";
import PrefixDialog from "../components/Dialogs/PrefixDialog";
import useKeyboardShortcut from "../utils/useKeyboardShortcut";

const MoviePage = () => {
  const { code } = useParams();
  const [openPrefixDialog, setOpenPrefixDialog] = useState(false);
  const [reload, setReload] = useState(false);

  useKeyboardShortcut({
    modifier: "alt",
    key: "i",
    callback: () => setOpenPrefixDialog(true),
  });

  // const posterSrc = `https://pics.dmm.co.jp/digital/video/${longCode}/${longCode}pl.jpg`;

  return (
    <div className="mx-auto max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase">{code}</h1>
        <IconButton color="primary" onClick={() => setOpenPrefixDialog(true)}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="cq flex aspect-video max-w-[1024px] items-center justify-center overflow-hidden rounded-xl">
        <Trailer code={code || ""} reload={reload} />
      </div>
      <div className="my-6">
        <a href={`https://sextb.net/${code}`}>SexTB Link</a>
        {/* <iframe
          src="https://drive.google.com/file/d/1KnCdVZt2NaPgAzZdyDjtdpISWMSO-Y6u/preview"
          height={480}
          allow="autoplay"
          className="aspect-video"
        ></iframe> */}
      </div>
      <PrefixDialog
        prefix={code?.split("-")[0] || ""}
        open={openPrefixDialog}
        setOpen={setOpenPrefixDialog}
        reload={() => setReload(!reload)}
      />
    </div>
  );
};

export default MoviePage;
