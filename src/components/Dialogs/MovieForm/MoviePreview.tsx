import MovieCover from "../../movies/MovieCover";
import { useState } from "react";
import Trailer from "../../movies/Trailer";
import { IconButton, Switch } from "@mui/material";
import { PlayCircleOutline } from "@mui/icons-material";
import axios from "axios";
import config from "../../../utils/config";

interface MoviePvProps {
  codeToPv: string;
  overrides: {
    cover: string;
    preview: string;
  };
  isForm?: boolean;
  setRelease: (release: string) => void;
  setRuntime: (runtime: string) => void;
  setTitle: (title: string) => void;
}

const MoviePreview: React.FC<MoviePvProps> = ({
  codeToPv,
  overrides,
  isForm,
  setRelease,
  setTitle,
  setRuntime,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const showPv = codeToPv.length > 5;

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${config.apiUrl}/lookups/scrape${isChecked ? "-jt" : ""}?code=${codeToPv}`,
      );
      setTitle(res.data.title);
      setRelease(res.data.relDate);
      setRuntime(res.data.runtime);
    } catch (err) {
      alert("Error fetching movie data: " + err);
    }
  };

  return (
    <>
      {!isChecked ? (
        <div className="h-fit overflow-hidden rounded-md">
          {showPv ? (
            <MovieCover
              code={codeToPv}
              overrides={{
                cover: overrides.cover,
                preview: overrides.preview,
              }}
              isForm={isForm}
            />
          ) : (
            <div className="grid aspect-[3/1.98] w-full place-content-center bg-slate-200 text-center text-2xl font-semibold text-slate-400 dark:bg-zinc-600">
              ENTER CODE
              <br />
              TO SEE PREVIEW
            </div>
          )}
        </div>
      ) : (
        <div className="mb-2 overflow-hidden rounded-lg md:mb-0">
          <Trailer code={codeToPv} posterSm />
        </div>
      )}
      <div className="relative mx-auto flex w-full items-center justify-center gap-1">
        <span>Preview</span>
        <Switch checked={isChecked} onChange={handleSwitchChange} />
        <span>Trailer</span>
        <IconButton
          onClick={handleBtnClick}
          sx={{ position: "absolute", right: "0.25rem" }}
        >
          <PlayCircleOutline />
        </IconButton>
      </div>
    </>
  );
};

export default MoviePreview;
