import { TabContext, TabList, TabPanel } from "@mui/lab";
import MovieCover from "../../movies/MovieCover";
import { useState } from "react";
import { Tab } from "@mui/material";
import Trailer from "../../movies/Trailer";

interface MoviePvProps {
  codeToPv: string;
  overrides: {
    cover: string;
    preview: string;
  };
}

const MoviePreview: React.FC<MoviePvProps> = ({ codeToPv, overrides }) => {
  const [tabValue, setTabValue] = useState("pv");
  const showPv = codeToPv.length > 5;

  return (
    <TabContext value={tabValue}>
      <div className="tabs-container border-zinc-300 border-b">
        <TabList onChange={(_e, newVal) => setTabValue(newVal)}>
          <Tab label="Preview" value="pv" />
          <Tab label="Trailer" value="trailer" disabled={!showPv} />
        </TabList>
      </div>
      <TabPanel value="pv">
        <div className="md:mb-0 mb-2 overflow-hidden rounded-lg">
          {showPv ? (
            <MovieCover
              code={codeToPv}
              overrides={{
                cover: overrides.cover,
                preview: overrides.preview,
              }}
            />
          ) : (
            <div className="bg-slate-200 dark:bg-zinc-600 w-full aspect-[16/10] grid place-content-center text-2xl font-semibold text-slate-400 text-center">
              ENTER CODE
              <br />
              TO SEE PREVIEW
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel value="trailer">
        <div className="md:mb-0 mb-2 overflow-hidden rounded-lg">
          <Trailer code={codeToPv} posterSm />
        </div>
      </TabPanel>
    </TabContext>
  );
};

export default MoviePreview;
