import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ActorNamesContext } from "../Actors/ActorNamesProvider";

interface MovieCastProps {
  movieCast: string[];
  maleCast: string[];
}

const MovieCastList: React.FC<MovieCastProps> = ({ movieCast, maleCast }) => {
  const { actorsInDb } = useContext(ActorNamesContext);
  const btClasses = {
    txtF: "text-pink-600 dark:text-pink-500",
    txtM: "text-blue-600 dark:text-blue-500",
    bgNoDb:
      "bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600",
    btBase:
      "max-h-7 whitespace-nowrap px-2 py-0.5 text-sm capitalize transition-colors rounded-full",
  };

  useEffect(() => {}, [actorsInDb]);

  return (
    <div className="flex gap-1 px-2 mt-auto mb-2 overflow-x-scroll">
      {movieCast.map((actor) => (
        <button
          key={actor}
          className={`${btClasses.btBase} ${btClasses.txtF} ${btClasses.bgNoDb}`}
        >
          <Link to={`/actor/${actor.replace(/ /g, "-").toLowerCase()}`}>
            {actorsInDb.length > 0 &&
            actorsInDb.some((dbActor) => dbActor.name === actor)
              ? "★"
              : ""}
            {actor}
          </Link>
        </button>
      ))}
      {maleCast.map((actor) => (
        <button
          key={actor}
          className={`${btClasses.btBase} ${btClasses.txtM} ${btClasses.bgNoDb}`}
        >
          <Link to={`/actor-m/${actor.replace(/ /g, "-").toLowerCase()}`}>
            {actorsInDb.length > 0 &&
            actorsInDb.some((dbActor) => dbActor.name === actor)
              ? "★"
              : ""}
            {actor}
          </Link>
        </button>
      ))}
    </div>
  );
};

export default MovieCastList;
