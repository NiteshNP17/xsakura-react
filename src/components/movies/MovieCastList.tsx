import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { calculateAge } from "../../utils/utils";
import { ActorData } from "../../utils/customTypes";

interface MovieCastProps {
  movieCast: ActorData[];
  maleCast?: string[];
  release?: string | Date;
  mb?: boolean;
}

const MovieCastList: React.FC<MovieCastProps> = ({
  movieCast,
  maleCast,
  release,
  mb,
}) => {
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

  const renderActressName = (actor: ActorData) => {
    return `${actor.name} ${actor.dob && releaseDate ? calculateAge(new Date(actor.dob), releaseDate) : ""}`;
  };

  interface ActorLinkProps {
    children: ReactNode;
    actor?: string;
    isMale?: boolean;
    endpoint?: string;
  }

  const ActorLink: React.FC<ActorLinkProps> = ({
    children,
    actor,
    isMale,
    endpoint,
  }) => {
    return mb ? (
      <Link
        to={`/actor${isMale ? "-m" : ""}/${
          isMale ? actor?.replace(/ /g, "-").toLowerCase() : endpoint
        }`}
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
          key={actor.slug}
          className={`${btClasses.btBase} ${
            btClasses.txtF
          } ${btClasses.bgNoDb}`}
        >
          <ActorLink
            endpoint={actor.name ? actor.name.replace(" ", "-") : "aa"}
          >
            {renderActressName(actor)}
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
              {actor}
            </ActorLink>
          </button>
        ))}
    </div>
  );
};

export default MovieCastList;
