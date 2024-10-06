import { CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import config from "../utils/config";
import { MovieData } from "../utils/customTypes";
import MovieList from "../components/movies/MovieList";
import SeriesCard from "../components/series/SeriesCard";
import SeriesDialog from "../components/Dialogs/SeriesDialog";
import Edit from "@mui/icons-material/Edit";

interface MoviesRes {
  movies: MovieData[];
  currentPage: number;
  totalPages: number;
  totalMovies: number;
}

const SeriesPage = () => {
  const { slug } = useParams();
  const [isLoaded, setLoaded] = useState(false);
  const [moviesRes, setMoviesRes] = useState<MoviesRes>({} as MoviesRes);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");
  const [openSeriesDialog, setOpenSeriesDialog] = useState(false);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/movies?series=${slug}&sort=release&page=${page}`,
        );
        setMoviesRes(res.data);
        setLoaded(true);
      } catch (err) {
        console.error("error fetching series data: ", err);
      }
    };

    fetchSeriesData();
  }, [refetchTrigger, page]);

  const refetchMovies = () => {
    setLoaded(true);
    setRefetchTrigger((prev) => !prev);
  };

  return isLoaded ? (
    <>
      {moviesRes.movies[0].series.thumbs && (
        <div className="mx-auto max-w-80 text-lg">
          <SeriesCard
            series={{
              ...moviesRes.movies[0].series,
              movieCount: moviesRes.totalMovies,
            }}
          />
        </div>
      )}
      <div className="mt-2 flex justify-center gap-2 px-[3vw] text-xl capitalize">
        <span className="opacity-50">Series</span>
        <span>{moviesRes.movies[0].series.name}</span>
        <span className="opacity-50">{moviesRes.totalMovies}</span>
        <IconButton size="small" onClick={() => setOpenSeriesDialog(true)}>
          <Edit sx={{ fontSize: "1.18rem" }} />
        </IconButton>
      </div>
      <MovieList
        movies={moviesRes.movies}
        totalPages={moviesRes.totalPages}
        refetch={refetchMovies}
        hideTags
      />
      <SeriesDialog
        open={openSeriesDialog}
        setOpen={setOpenSeriesDialog}
        reload={refetchMovies}
        serieToEdit={moviesRes.movies[0].series}
      />
    </>
  ) : (
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default SeriesPage;