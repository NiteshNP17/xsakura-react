import MovieList from "../components/movies/MovieList";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { MovieData } from "../utils/customTypes";
import config from "../utils/config";
// import { Autocomplete, TextField } from "@mui/material";

const Movies = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");
  const sort = searchParams.get("sort") || "added";
  const label = searchParams.get("label");
  const selectedTags = searchParams.get("tags");

  const refetchMovies = () => {
    setLoaded(true);
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/movies?${label ? "label=" + label + "&" : ""}${selectedTags ? "&tags=" + selectedTags + "&" : ""}sort=${sort}&page=${page}`,
        );

        console.log(
          `movies?${selectedTags ? "&tags=" + selectedTags + "&" : ""}sort=${sort === "empty" ? "added" : sort}&page=${page}`,
        );

        setMovies(res.data.movies);
        setTotalPages(res.data.totalPages);
        setLoaded(true);
      } catch (err) {
        console.error("error fetching movies: ", err);
      }
    };

    fetchMovies();
  }, [page, refetchTrigger, isLoaded, selectedTags, sort, label]);

  return isLoaded ? (
    <MovieList
      movies={movies}
      totalPages={totalPages}
      refetch={refetchMovies}
    />
  ) : (
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default Movies;
