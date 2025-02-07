import { AddCircleOutline, MoreVert } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import config from "../utils/config";
import { Link } from "react-router-dom";
import StudioDialog from "../components/Dialogs/StudioDialog";
import { StudioItem } from "../utils/customTypes";

const Studio = () => {
  const [studList, setStudList] = useState<StudioItem[]>([]);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [studioToEdit, setStudioToEdit] = useState<StudioItem>(
    {} as StudioItem,
  );

  useEffect(() => {
    const fetchAllStudios = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/studios`);
        const data = await res.json();
        setStudList(data);
      } catch (err) {
        console.error("Error fetching Studios list: ", err);
      }
    };

    fetchAllStudios();
  }, [reload]);

  return (
    <div className="mx-auto max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase">Studios</h1>
        <IconButton
          color="primary"
          onClick={() => {
            setStudioToEdit({} as StudioItem);
            setOpen(true);
          }}
        >
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="grid-fit-2 gap-4">
        {studList.map((studio) => (
          <div
            key={studio.slug}
            className="group relative items-center overflow-hidden rounded-lg border border-gray-200 bg-white text-center align-middle text-lg shadow-md dark:border-zinc-600 dark:bg-zinc-800"
          >
            <Link
              key={studio.slug}
              to={`/movies?studio=${studio.slug}&sort=release`}
            >
              {studio.logo && (
                <div className="h-24 w-full bg-white">
                  <img
                    src={studio.logo}
                    alt={studio.name + " logo"}
                    className="mx-auto h-full px-4 py-2"
                  />
                </div>
              )}
              <p>
                {studio.name}{" "}
                <span className="opacity-65">{studio.movieCount}</span>
              </p>
            </Link>
            <IconButton
              onClick={() => {
                setStudioToEdit(studio);
                setOpen(true);
              }}
              sx={{
                px: 0,
                py: 2,
                ml: "auto",
                maxHeight: "24px",
                position: "absolute",
                right: "0",
                bottom: "0.25rem",
              }}
              className="group-hover:opacity-100 sm:opacity-0"
            >
              <MoreVert />
            </IconButton>
          </div>
        ))}
      </div>
      <StudioDialog
        open={open}
        setOpen={setOpen}
        reload={() => setReload(!reload)}
        studioToEdit={studioToEdit}
      />
    </div>
  );
};

export default Studio;
