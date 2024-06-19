import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieData } from "../utils/customTypes";
import axios from "axios";
import config from "../utils/config";
import MovieList from "../components/movies/MovieList";
import { CircularProgress } from "@mui/material";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const totalPagesRef = useRef<number>(0);
  const page = parseInt(searchParams.get("p") || "1");

  const refetchMovies = () => {
    setLoaded(true);
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/movies/search?q=${query?.toLowerCase()}&page=${page}`,
        );

        console.log(
          `${config.apiUrl}/movies/search?q=${query?.toLowerCase()}&page=${page}`,
        );

        console.log(res.data);

        setMovies(res.data.searchResults);
        totalPagesRef.current = res.data.totalPages;
        setLoaded(true);
      } catch (err) {
        console.error("error fetching movies: ", err);
      }
    };

    fetchMovies();
  }, [query, page, refetchTrigger, isLoaded]);

  return isLoaded ? (
    <>
      <h1 className="mx-[3vw] text-2xl">
        Search Results for <b>{query}</b>
      </h1>
      <MovieList
        movies={movies}
        totalPages={totalPagesRef.current}
        refetch={refetchMovies}
      />
    </>
  ) : (
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default SearchPage;
