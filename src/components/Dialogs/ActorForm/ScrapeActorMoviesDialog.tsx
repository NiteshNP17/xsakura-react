import { Add, Check, Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  // Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import axios from "axios";
import config from "../../../utils/config";
import { useState } from "react";
import MovieCover from "../../movies/MovieCover";

interface ScrapeActorMoviesDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  actorName: string;
  actorId: string;
}

interface ResData {
  total: number;
  data: string[];
  labelsIgnored: string[];
}

const ScrapeActorMoviesDialog: React.FC<ScrapeActorMoviesDialogProps> = ({
  open,
  setOpen,
  actorName,
  actorId,
}) => {
  const [resData, setResData] = useState<ResData>({} as ResData);
  const [showLoading, setShowLoading] = useState(false);
  const [insertedCodes, setInsertedCodes] = useState<string[]>([""]);
  // Track loading state for each code individually
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  const handleClose = () => {
    setOpen(false);
  };

  const scrapeSubmit = async () => {
    const startPage =
      (document.getElementById("sam-start-page") as HTMLInputElement).value ||
      "1";
    const endPage =
      (document.getElementById("sam-end-page") as HTMLInputElement).value ||
      "1";

    try {
      setShowLoading(true);
      const res = await axios.get(
        `${config.apiUrl}/lookups/scrape-actor-page?actor=${actorName}&startPage=${startPage}&endPage=${endPage}`,
      );
      setResData(res.data);
    } catch (err) {
      console.error("Scraping error:", err);
    } finally {
      setShowLoading(false);
    }
  };

  const quickAdd = async (code: string) => {
    // Don't process if already inserted or loading
    if (insertedCodes.includes(code) || loadingStates[code]) {
      return;
    }

    const dataToPost = {
      cast: JSON.stringify([actorId]),
      codes: code,
    };

    // Set loading state for this specific code
    setLoadingStates((prev) => ({ ...prev, [code]: true }));

    try {
      const res = await axios.post(
        `${config.apiUrl}/movies/batch-create`,
        dataToPost,
      );

      // Check response for success
      const success =
        (res.data.success && res.data.success.includes(code)) ||
        (res.data.results &&
          res.data.results.success &&
          res.data.results.success.includes(code));

      if (success) {
        setInsertedCodes((prev) => [...prev, code]);
      } else {
        // Find the failure reason if available
        const failures =
          res.data.failures ||
          (res.data.results && res.data.results.failures) ||
          [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const failure = failures.find((f: any) => f.code === code);
        console.error(
          `Error adding code ${code} - ${failure?.reason || "Unknown error"}`,
        );
      }
    } catch (err) {
      console.error(`Error adding code ${code} - ${err}`);
    } finally {
      // Clear loading state for this specific code
      setLoadingStates((prev) => ({ ...prev, [code]: false }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Batch Add for{" "}
        <span className="font-semibold text-rose-400 capitalize">
          {actorName.replace("-", " ")}
        </span>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div className="mb-4 flex gap-4">
          <TextField
            id="sam-start-page"
            type="number"
            name="startPage"
            variant="outlined"
            autoComplete="off"
            defaultValue={1}
            sx={{ maxWidth: "5rem" }}
            size="small"
          />
          <TextField
            id="sam-end-page"
            type="number"
            name="endPage"
            variant="outlined"
            autoComplete="off"
            defaultValue={1}
            sx={{ maxWidth: "5rem" }}
            size="small"
          />
          <LoadingButton
            color="info"
            variant="contained"
            size="small"
            onClick={scrapeSubmit}
            loading={showLoading}
          >
            <Search />
          </LoadingButton>
          {resData.total !== undefined && <p>found: {resData.total}</p>}
        </div>
        {resData.total !== undefined && (
          <>
            <Divider />
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 uppercase">
                {resData.data &&
                  resData.data.map((code) => (
                    <div key={code} className="">
                      <div className="overflow-hidden rounded">
                        <MovieCover code={code} />
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-1">
                        <p className="text-center">{code}</p>
                        <LoadingButton
                          loading={loadingStates[code] === true}
                          disabled={insertedCodes.includes(code)}
                          size="small"
                          color={
                            insertedCodes.includes(code) ? "success" : "inherit"
                          }
                          onClick={() => quickAdd(code)}
                        >
                          {insertedCodes.includes(code) ? <Check /> : <Add />}
                        </LoadingButton>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <Divider />
            <div className="p-4">
              Labels Ignored:{" "}
              <span className="uppercase">
                {resData.labelsIgnored.map((label) => label + " ")}
              </span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScrapeActorMoviesDialog;
