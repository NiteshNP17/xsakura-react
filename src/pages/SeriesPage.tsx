import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import config from "../utils/config";
import { MovieData } from "../utils/customTypes";
import MovieList from "../components/movies/MovieList";

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
      <div className="flex justify-center gap-2 px-[3vw] text-2xl font-semibold capitalize">
        <span className="opacity-50">Series</span>
        <span>{moviesRes.movies[0].series.name}</span>
        <span className="opacity-50">{moviesRes.totalMovies}</span>
      </div>
      <MovieList
        movies={moviesRes.movies}
        totalPages={moviesRes.totalPages}
        refetch={refetchMovies}
        hideTags
      />
    </>
  ) : (
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default SeriesPage;
