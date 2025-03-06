import MovieList from "../components/movies/MovieList";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { ActorData, MovieData } from "../utils/customTypes";
import config from "../utils/config";

const Movies = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [actorStats, setActorStats] = useState<ActorData[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");
  const sort = searchParams.get("sort") || "added";
  const label = searchParams.get("label");
  const studio = searchParams.get("studio");
  const selectedCast = searchParams.get("cast");
  const selectedTags = searchParams.get("tags");
  const isRandom = searchParams.get("random");

  const refetchMovies = () => {
    setLoaded(true);
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/movies?${label ? "label=" + label + "&" : ""}${studio ? "studio=" + studio + "&" : ""}${selectedCast ? "cast=" + selectedCast + "&" : ""}${selectedTags ? "tags=" + selectedTags + "&" : ""}` +
            (!isRandom ? `sort=${sort}&page=${page}` : "random"),
        );

        console.log(
          "api: ",
          `${config.apiUrl}/movies?${label ? "label=" + label + "&" : ""}${studio ? "studio=" + studio + "&" : ""}${selectedCast ? "cast=" + selectedCast + "&" : ""}${selectedTags ? "tags=" + selectedTags + "&" : ""}` +
            (!isRandom ? `sort=${sort}&page=${page}` : "random"),
        );

        setMovies(res.data.movies);
        setTotalPages(res.data.totalPages);
        setActorStats(res.data.actorStats);
        setLoaded(true);
      } catch (err) {
        console.error("error fetching movies: ", err);
      }
    };

    fetchMovies();
  }, [
    page,
    refetchTrigger,
    isLoaded,
    selectedTags,
    sort,
    label,
    isRandom,
    studio,
    selectedCast,
  ]);

  return isLoaded ? (
    <MovieList
      movies={movies}
      totalPages={totalPages}
      refetch={refetchMovies}
      actorStats={actorStats}
    />
  ) : (
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default Movies;
