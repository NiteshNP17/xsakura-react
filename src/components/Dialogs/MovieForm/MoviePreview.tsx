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
  isForm?: boolean;
}

const MoviePreview: React.FC<MoviePvProps> = ({
  codeToPv,
  overrides,
  isForm,
}) => {
  const [tabValue, setTabValue] = useState("pv");
  const showPv = codeToPv.length > 5;

  return (
    <TabContext value={tabValue}>
      <div className="tabs-container border-b border-zinc-300">
        <TabList onChange={(_e, newVal) => setTabValue(newVal)}>
          <Tab label="Preview" value="pv" />
          <Tab label="Trailer" value="trailer" disabled={!showPv} />
        </TabList>
      </div>
      <TabPanel value="pv">
        <div className="mb-2 overflow-hidden rounded-lg md:mb-0">
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
      </TabPanel>
      <TabPanel value="trailer">
        <div className="mb-2 overflow-hidden rounded-lg md:mb-0">
          <Trailer code={codeToPv} posterSm />
        </div>
      </TabPanel>
    </TabContext>
  );
};

export default MoviePreview;
