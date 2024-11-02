import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MovieData } from "../utils/customTypes";
import config from "../utils/config";
import MovieList from "../components/movies/MovieList";
import { CircularProgress } from "@mui/material";

const StudioPage = () => {
  const { slug } = useParams();
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");
  const sort = searchParams.get("sort") || "release";
  const selectedTags = searchParams.get("tags");

  const refetchMovies = () => {
    setLoaded(true);
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/movies?studio=${slug}&sort=${sort === "empty" ? "release" : sort}${selectedTags ? "&tags=" + selectedTags : ""}&page=${page}`,
        );
        setMovies(res.data.movies);
        setTotalPages(res.data.totalPages);
        setLoaded(true);
      } catch (err) {
        console.error("error fetching movies: ", err);
      }
    };

    fetchMovies();
  }, [page, refetchTrigger, isLoaded, selectedTags, sort, slug]);

  return (
    <>
      {isLoaded ? (
        <MovieList
          movies={movies}
          totalPages={totalPages}
          refetch={refetchMovies}
        />
      ) : (
        <div className="grid h-96 w-full place-content-center">
          <CircularProgress size="4rem" />
        </div>
      )}
    </>
  );
};

export default StudioPage;
