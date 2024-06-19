import { ReactNode, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ActorNamesContext } from "../Actors/ActorNamesProvider";
import { calculateAge } from "../../utils/utils";

interface MovieCastProps {
  movieCast: string[];
  maleCast: string[];
  release?: string;
  mb?: boolean;
}

const MovieCastList: React.FC<MovieCastProps> = ({
  movieCast,
  maleCast,
  release,
  mb,
}) => {
  const { actorsInDb } = useContext(ActorNamesContext);
  const btClasses = {
    txtF: "text-pink-600 dark:text-pink-500",
    txtM: "text-blue-600 dark:text-blue-500",
    bgNoDb: `bg-zinc-200 dark:bg-zinc-700 ${
      mb ? "hover:bg-zinc-300 dark:hover:bg-zinc-600" : ""
    }`,
    btBase:
      "max-h-7 whitespace-nowrap px-2 py-0.5 text-sm capitalize transition-colors rounded-full",
  };
  const releaseDate = release ? new Date(release) : null;

  const renderActorName = (
    actor: string,
    dbActor?: { _id: string; name: string; dob?: string | Date },
  ) => {
    return `★${actor} ${
      dbActor?.dob && releaseDate
        ? calculateAge(new Date(dbActor.dob), releaseDate)
        : ""
    }`;
  };

  useEffect(() => {}, [actorsInDb]);

  interface ActorLinkProps {
    children: ReactNode;
    actor: string;
    isMale?: boolean;
  }

  const ActorLink: React.FC<ActorLinkProps> = ({ children, actor, isMale }) => {
    return mb ? (
      <Link
        to={`/actor${isMale ? "-m" : ""}/${actor
          .replace(/ /g, "-")
          .toLowerCase()}`}
      >
        {children}
      </Link>
    ) : (
      <>{children}</>
    );
  };

  return (
    <div
      className={`mt-auto flex gap-1 px-2 ${
        mb ? "mb-2" : ""
      } overflow-x-scroll`}
    >
      {movieCast.map((actor) => (
        <div
          key={actor}
          className={`${btClasses.btBase} ${
            maleCast?.includes(actor) ? btClasses.txtM : btClasses.txtF
          } ${btClasses.bgNoDb}`}
        >
          <ActorLink actor={actor}>
            {actorsInDb.length > 0 &&
            actorsInDb.some((dbActor) => dbActor.name === actor)
              ? actorsInDb
                  .filter((dbActor) => dbActor.name === actor)
                  .map((dbActor) => renderActorName(actor, dbActor))
              : actor}
          </ActorLink>
        </div>
      ))}
      {maleCast &&
        maleCast.map((actor) => (
          <button
            key={actor}
            className={`${btClasses.btBase} ${btClasses.txtM} ${btClasses.bgNoDb}`}
          >
            <ActorLink actor={actor} isMale>
              {actorsInDb.length > 0 &&
              actorsInDb.some((dbActor) => dbActor.name === actor)
                ? actorsInDb
                    .filter((dbActor) => dbActor.name === actor)
                    .map((dbActor) => renderActorName(actor, dbActor))
                : actor}
            </ActorLink>
          </button>
        ))}
    </div>
  );
};

export default MovieCastList;
