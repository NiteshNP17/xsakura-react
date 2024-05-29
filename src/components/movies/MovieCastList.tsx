import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface MovieCastProps {
  movieCast: string[];
  maleCast: string[];
}

const MovieCastList: React.FC<MovieCastProps> = ({ movieCast, maleCast }) => {
  const [actorsInDb, setActorsInDb] = useState<string[]>([]);
  const [maleActorsInDb, setMaleActorsInDb] = useState<string[]>([]);

  useEffect(() => {
    const checkActorsInDb = async () => {
      const actorsInDbPromises: Promise<string | null>[] = movieCast.map(
        async (actor) => {
          const response = await axios.get(
            `http://localhost:5000/actors/${actor}`
          );
          const data = response.data;

          if (data.message === "notFound") {
            return null;
          } else {
            return actor;
          }
        }
      );

      const maleActorsInDbPromises: Promise<string | null>[] = maleCast.map(
        async (actor) => {
          const response = await axios.get(
            `http://localhost:5000/actors/${actor}`
          );
          const data = response.data;

          if (data.message === "notFound") {
            return null;
          } else {
            return actor;
          }
        }
      );

      const actorsInDbData: (string | null)[] = await Promise.all(
        actorsInDbPromises
      );
      const maleActorsInDbData: (string | null)[] = await Promise.all(
        maleActorsInDbPromises
      );

      setActorsInDb(
        actorsInDbData.filter((actor): actor is string => Boolean(actor))
      );
      setMaleActorsInDb(
        maleActorsInDbData.filter((actor): actor is string => Boolean(actor))
      );
    };

    checkActorsInDb();
  }, [movieCast, maleCast]);

  return (
    <div className="flex gap-1 px-2 mt-auto mb-2 overflow-x-scroll">
      {movieCast.map((actor) => (
        <button
          key={actor}
          className="max-h-7 whitespace-nowrap dark:text-pink-500 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 bg-zinc-200 px-2 py-0.5 text-sm text-pink-600 capitalize transition-colors rounded-full"
        >
          <Link to={`/actor/${actor.replace(/ /g, "-").toLowerCase()}`}>
            {actorsInDb.includes(actor) ? "★" : ""}
            {actor}
          </Link>
        </button>
      ))}
      {maleCast.map((actor) => (
        <button
          key={actor}
          className="max-h-7 whitespace-nowrap dark:text-blue-500 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 bg-zinc-200 px-2 py-0.5 text-sm text-blue-600 capitalize transition-colors rounded-full"
        >
          <Link to={`/actor-m/${actor.replace(/ /g, "-").toLowerCase()}`}>
            {maleActorsInDb.includes(actor) ? "★" : ""}
            {actor}
          </Link>
        </button>
      ))}
    </div>
  );
};

export default MovieCastList;
