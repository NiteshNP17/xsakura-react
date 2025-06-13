import axios from "axios";
import { useEffect, useState } from "react";
import { AlbumData } from "../utils/customTypes";
import config from "../utils/config";
import { CircularProgress, IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import MovieCastList from "../components/movies/MovieCastList";
import AlbumDialog from "../components/Dialogs/AlbumDialog";

const Albums = ({ model }: { model?: string }) => {
  const [albumsList, setAlbumsList] = useState<AlbumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAlbumDialog, setOpenAlbumDialog] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/albums${model ? "?model=" + model + "&sort=release" : ""}`,
        );
        setAlbumsList(res.data);
      } catch (err) {
        alert("error fetching albums: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [refetchTrigger]);

  const handleAdd = () => setOpenAlbumDialog(true);

  return !loading ? (
    <div className="mx-auto mb-24 max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase">Albums</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="grid-fit-1 sm:grid-fit-015 mx-auto grid max-w-[1660px] gap-4 md:gap-6">
        {albumsList.map((album) => (
          <div
            key={album.slug}
            className="cq group grid overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-md dark:border-zinc-600 dark:bg-zinc-800"
          >
            <Link to={`/album/${album.slug}`}>
              <img
                src={album.cover}
                alt={album.name}
                width="100%"
                className="aspect-3/4 bg-zinc-200 object-cover object-top"
              />
              <p className="mx-auto mb-0.5 mt-1 px-2">
                {/* <span className="opacity-65">{album.studio}</span> {album.name} */}
                {album.name}
              </p>
              <div className="absolute right-1 top-1 aspect-square place-content-center rounded-full bg-gray-800 bg-opacity-50 px-1.5 text-sm">
                <span className="font-semibold text-white">
                  {album.imageCount}
                </span>
              </div>
            </Link>
            <MovieCastList movieCast={album.models} release={album.date} mb />
          </div>
        ))}
      </div>
      <AlbumDialog
        open={openAlbumDialog}
        setOpen={setOpenAlbumDialog}
        refetch={() => setRefetchTrigger(!refetchTrigger)}
      />
    </div>
  ) : (
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default Albums;
