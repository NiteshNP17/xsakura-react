import MovieList from "../components/movies/MovieList";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { MovieData } from "../utils/customTypes";
// import { Autocomplete, TextField } from "@mui/material";

const Movies = () => {
  const totalPagesRef = useRef<number>(0);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");

  const refetchMovies = () => {
    setLoaded(true);
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

  return (
    <>
      {/* <div className="w-full max-w-[1660px] mb-3 grid gap-1 place-items-center"></div>
        <div className="place-items-center grid w-full px-[3vw]">
        <Autocomplete
          id="search-tags"
          options={searchCast}
          sx={{ width: 300 }}
          freeSolo
          multiple
          limitTags={2}
          clearOnEscape
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              size="small"
              className="w-full max-w-xl"
            />
          )}
        />
      </div>*/}
      {isLoaded ? (
        <MovieList
          movies={movies}
          totalPages={totalPagesRef.current}
          refetch={refetchMovies}
        />
      ) : (
        <div className="place-content-center h-96 grid w-full">
          <CircularProgress size="4rem" />
        </div>
      )}
    </>
  );
};

export default Movies;
