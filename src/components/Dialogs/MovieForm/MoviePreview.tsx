import MovieCover from "../../movies/MovieCover";
import { useContext, useEffect, useState } from "react";
import Trailer from "../../movies/Trailer";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import axios from "axios";
import config from "../../../utils/config";
import { MovieContext } from "./MovieContext";
import {
  Alert,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import useKeyboardShortcut from "../../../utils/useKeyboardShortcut";
import { DatasetLinked } from "@mui/icons-material";
import { ActorData, LabelData, Tag } from "../../../utils/customTypes";

const MoviePreview = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { movieState, setMovieState } = useContext(MovieContext);
  const [openSnack, setOpenSnack] = useState(false);
  const [scrapeSource, setScrapeSource] = useState(() => {
    return localStorage.getItem("scrapeSource") || "jd";
  });
  const isFc2 =
    movieState.code?.startsWith("fc2") || movieState.code?.startsWith("kb");
  const [codeLabel, codeNum] = movieState.code?.split("-") || ["abc", "001"];
  const [labelData, setLabelData] = useState<LabelData>({} as LabelData);

  useKeyboardShortcut({
    modifier: "alt",
    key: "d",
    callback: () => handleBtnClick(),
  });

  const handleBtnClick = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    try {
      const res = await axios.get(
        `${config.apiUrl}/lookups/scrape${scrapeSource !== "nj" && !isFc2 ? "-" + scrapeSource : ""}?code=${movieState.code}`,
      );

      const isVr = res.data.tags?.some((tag: Tag) => tag.name === "VR");
      const tag2Data = res.data.tags || [];

      const actorData: ActorData[] = res.data.cast as ActorData[];

      /*if (movieState.cast?.length === 0) {
        const shortTitleArr = res.data.title
          .slice(-20)
          .toLowerCase()
          .replace(/['"]/g, "")
          .trim()
          .split(" ")
          .slice(-2);

        const res1 = await axios.get(
          `${config.apiUrl}/actors/${shortTitleArr.join("%20")}`,
        );
        actorData = res1.data[0];
        if (!actorData?.name) {
          console.log(
            `didn't find ${config.apiUrl}/actors/${shortTitleArr.join("%20")}`,
          );

          const res2 = await axios.get(
            `${config.apiUrl}/actors/${shortTitleArr.reverse().join("%20")}`,
          );
          actorData = res2.data[0];
        }

        if (!actorData?.name)
          console.log(
            `didn't find ${config.apiUrl}/actors/${shortTitleArr.join("%20")}`,
          );

        console.log("AtorData: ", actorData);
      }*/

      const mrUrl = `https://fourhoi.com/${movieState.code}-uncensored-leak/preview.mp4`;
      setMovieState({
        ...movieState,
        title: res.data.title,
        cast: actorData.length > 0 ? actorData : [...movieState.cast],
        release: res.data.relDate,
        runtime: res.data.runtime,
        tag2: tag2Data,
        overrides: {
          cover: !isVr
            ? `http://javpop.com/img/${movieState.code.split("-")[0]}/${movieState.code}_poster.jpg`
            : "",
          preview: res.data.tags?.some((tag: Tag) => tag.name === "MR")
            ? mrUrl
            : "",
        },
      });

      if (movieState.cast?.length === 0 && !actorData[0]?.name) {
        (document.getElementById("f-actor-opts") as HTMLInputElement).focus();
      } else {
        (document.getElementById("f-tags-input") as HTMLInputElement).focus();
      }
    } catch (err) {
      console.error("scraping error: ", err);
      setOpenSnack(true);
    }
  };

  useEffect(() => {
    const getLabelData = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/labels/${codeLabel}?codenum=${codeNum}`,
        );
        setLabelData(res.data);
      } catch (err) {
        console.error("failed to get label data: ", err);
      }
    };

    isChecked && getLabelData();
  }, [codeLabel, codeNum, isChecked]);

  const handleChangeScrapeSrc = (e: SelectChangeEvent) => {
    const newValue = e.target.value;
    setScrapeSource(newValue);
    localStorage.setItem("scrapeSource", newValue);
  };

  return (
    <>
      {!isChecked ? (
        <div className="h-fit overflow-hidden rounded-md">
          {movieState.code ? (
            <MovieCover
              code={movieState.code}
              overrides={movieState.overrides}
              isForm
            />
          ) : (
            <div className="grid aspect-[3/1.9] w-full place-content-center bg-slate-200 text-center text-2xl font-semibold text-slate-400 dark:bg-zinc-600">
              ENTER CODE
              <br />
              TO SEE PREVIEW
            </div>
          )}
        </div>
      ) : (
        <div className="mb-2 overflow-hidden rounded-lg md:mb-0">
          <Trailer
            code={movieState.code}
            posterSm
            title={movieState.title}
            labelData={labelData}
          />
        </div>
      )}
      <div className="relative mx-auto flex w-full items-center justify-center gap-1">
        <IconButton
          sx={{ position: "absolute", left: "0.25rem" }}
          component="a"
          href={`https://www.javdatabase.com/movies/${movieState.code}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DatasetLinked />
        </IconButton>
        <span>Preview</span>
        <Switch
          disabled={isFc2}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <span>Trailer</span>
        <Select
          variant="standard"
          value={scrapeSource}
          onChange={handleChangeScrapeSrc}
          sx={{ position: "absolute", right: "3rem", px: 1 }}
        >
          <MenuItem value="jt">JT</MenuItem>
          <MenuItem value="jd">JD</MenuItem>
          {/* <MenuItem value="nj">NJ</MenuItem> */}
        </Select>
        <IconButton
          onClick={handleBtnClick}
          sx={{ position: "absolute", right: "0.25rem" }}
        >
          <PlayCircleOutline />
        </IconButton>
      </div>
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ maxWidth: "450px" }}
        onClose={(_e, reason?) => {
          if (reason === "clickaway") return;
          setOpenSnack(false);
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ fontSize: "1.1rem", padding: "0.5rem 3.5rem" }}
        >
          Movie data not found
        </Alert>
      </Snackbar>
    </>
  );
};

export default MoviePreview;
