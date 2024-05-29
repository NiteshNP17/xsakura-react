import MovieList from "../components/movies/MovieList";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Movies = () => {
  interface Movie {
    code: string;
    cast: string[];
    maleCast: string[];
    title: string;
  }

  const totalPagesRef = useRef<number>(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");

  const refetchMovies = () => {
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/movies?page=${page}`
        );
        setMovies(res.data.movies);
        totalPagesRef.current = res.data.totalPages;
        setLoaded(true);
      } catch (err) {
        console.error("error fetching movies: ", err);
      }
    };

    fetchMovies();
  }, [page, refetchTrigger, isLoaded]);

  return isLoaded ? (
    <MovieList
      movies={movies}
      totalPages={totalPagesRef.current}
      refetch={refetchMovies}
    />
  ) : (
    <div className="place-content-center h-96 grid w-full">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default Movies;
