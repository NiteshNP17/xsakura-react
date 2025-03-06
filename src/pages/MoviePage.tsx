import { Link, useParams } from "react-router-dom";
import Trailer from "../components/movies/Trailer";
import { IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import PrefixDialog from "../components/Dialogs/PrefixDialog";
import useKeyboardShortcut from "../utils/useKeyboardShortcut";
import MovieImages from "../components/movies/MovieImages";
import { MovieData } from "../utils/customTypes";
import config from "../utils/config";

const MoviePage = () => {
  const { code } = useParams();
  const [codeLabel, codeNum] = code ? code.split("-") : ["a", "b"];
  const [openPrefixDialog, setOpenPrefixDialog] = useState(false);
  const [reload, setReload] = useState(false);
  const [movieData, setMovieData] = useState<MovieData>({} as MovieData);

  useEffect(() => {
    const getMovieData = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/movies/${code}`);
        const resData = await res.json();
        setMovieData(resData);
      } catch (err) {
        console.error("Error fetching movie data: ", err);
      }
    };

    getMovieData();
  }, [code]);

  useKeyboardShortcut({
    modifier: "alt",
    key: "i",
    callback: () => setOpenPrefixDialog(true),
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
        <IconButton color="primary" onClick={() => setOpenPrefixDialog(true)}>
          <AddCircleOutline />
        </IconButton>
        <h2 className="overflow-x-scroll text-xl">{movieData.title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-6">
        <div className="col-span-6 sm:col-span-4">
          <div className="cq flex aspect-video max-w-[1024px] items-center justify-center overflow-hidden rounded-lg">
            {code?.startsWith("fc2") ? (
              <div>No Trailer</div>
            ) : (
              <Trailer code={code || ""} reload={reload} />
            )}
          </div>
          <div className="my-6 flex flex-wrap gap-4">
            <a href={`https://javct.net/v/${code}`} target="_blank">
              JavCT
            </a>
            <a href={`https://njav.tv/en/v/${code}`} target="_blank">
              Njav
            </a>
            <a
              href={`https://njav.tv/en/v/${code}-uncensored-leak`}
              target="_blank"
            >
              Njav MR
            </a>
            <a target="_blank" href={`https://missav.ws/en/${code}`}>
              MissAV
            </a>
            <a
              target="_blank"
              href={`https://missav.ws/en/${code}-uncensored-leak`}
            >
              MissAV MR
            </a>
            <a
              target="_blank"
              href={`https://www4.javhdporn.net/video/${code}`}
            >
              JavHDPorn
            </a>
          </div>
        </div>
        {!code?.startsWith("fc2") && (
          <div className="col-span-6 px-3 sm:col-span-2">
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
