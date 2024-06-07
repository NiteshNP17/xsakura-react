import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import ActorCard from "../components/Actors/ActorCard";
import MovieList from "../components/movies/MovieList";
import { CircularProgress } from "@mui/material";
import { ActorData, MovieData } from "../utils/customTypes";

const ActorPage = () => {
  const { name } = useParams<{ name: string }>();
  const actorName = name?.replace(/-/g, " ");
  const path = useLocation().pathname;
  const isMale = path.startsWith("/actor-m");

  const [actorData, setActorData] = useState<ActorData>({} as ActorData);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const totalPagesRef = useRef<number>(0);
  const totalMoviesRef = useRef<number>(0);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");

  const refetchMovies = () => {
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const fetchActorData = async () => {
      // Fetch actor data
      try {
        const res = await axios.get(
          `http://localhost:5000/actors/${actorName}`
        );
        setActorData(res.data);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/movies?${
            !isMale ? "cast=" + actorName : "mcast=" + actorName
          }&sort=release&page=${page}`
        );
        setMovies(res.data.movies);
        totalPagesRef.current = res.data.totalPages;
        totalMoviesRef.current = res.data.totalMovies;
        setLoaded(true);
      } catch (err) {
        console.error("error fetching movies: ", err);
      }
    };

    fetchActorData();
    fetchMovies();
  }, [actorName, page, refetchTrigger, isLoaded, isMale]);

  return (
    <>
      <div className="px-[3vw] mb-12">
        <div className="flex px-1 mt-1 mb-4">
          <h1 className="text-3xl font-semibold capitalize">{actorName}</h1>
        </div>
        {actorData.img500 && (
          <div className="max-w-80 md:mx-12 mx-auto">
            <ActorCard
              actor={actorData}
              noLink
              movieCount={totalMoviesRef.current}
            />
          </div>
        )}
      </div>
      {isLoaded ? (
        <MovieList
          movies={movies}
          totalPages={totalPagesRef.current}
          refetch={refetchMovies}
        />
      ) : (
        <div className="place-content-center grid w-full h-32">
          <CircularProgress size="4rem" />
        </div>
      )}
    </>
  );
};

export default ActorPage;
