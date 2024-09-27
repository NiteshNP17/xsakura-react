import { useEffect, useState } from "react";
import { ageCompare, calculateAge, formatHeight } from "../../utils/utils";
import { Link } from "react-router-dom";
import { ActorData } from "../../utils/customTypes";

interface ActorCardProps {
  actor: ActorData;
  children?: React.ReactNode;
  noLink?: boolean;
  movieCount?: number;
}

const ActorCard: React.FC<ActorCardProps> = ({
  actor,
  children,
  noLink,
  movieCount,
}) => {
  const myAge = new Date("1997-11-02T00:00:00Z");
  const today = new Date();
  const dobDate = actor.dob ? new Date(actor.dob) : undefined;
  const blankImg =
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Blank_woman_placeholder.svg";
  const [showBlank, setShowBlank] = useState<boolean>(false);

  useEffect(() => {
    if (actor.img500) {
      setShowBlank(false);
    }
  }, [actor.img500]);

  const ActorLink = ({ children }: { children: React.ReactNode }) =>
    !noLink ? (
      <Link to={`/actor/${actor.name && actor.name.replace(/ /g, "-")}`}>
        {children}
      </Link>
    ) : (
      <>{children}</>
    );

  return (
    <div className="cq group relative overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-md dark:border-zinc-600 dark:bg-zinc-800">
      <ActorLink>
        {!showBlank && actor.img500 ? (
          <img
            src={actor.img500}
            alt={actor.name}
            width="100%"
            className="aspect-[3/4] bg-zinc-200 object-cover" //object-top
            onError={() => setShowBlank(true)}
          />
        ) : (
          <img
            src={blankImg}
            alt="blank"
            width="100%"
            className="aspect-[3/4] bg-zinc-200 object-cover"
          />
        )}
        {!showBlank && (
          <div className="absolute right-1 top-1 aspect-square place-content-center rounded-full bg-gray-800 bg-opacity-50 px-1.5 text-sm">
            <span className="font-semibold text-white">
              {movieCount || actor.numMovies}
            </span>
          </div>
        )}
      </ActorLink>
      <div className="relative grid px-2">
        <div>
          <ActorLink>
            <p className="w-full text-center text-lg font-semibold capitalize">
              {actor.name || "⠀"}
            </p>
          </ActorLink>
          {children}
        </div>
        <ActorLink>
          <div className="flex justify-between">
            {dobDate && (
              <p>
                <span className="font-semibold opacity-80">
                  {calculateAge(dobDate, today)}
                </span>{" "}
                <span className="text-sm opacity-50">
                  {dobDate.getDate()}-
                  {dobDate.toLocaleString("default", { month: "short" })}-
                  {dobDate.getFullYear().toString().slice(-2)}
                  <span className="my-age">
                    &nbsp;({ageCompare(dobDate, myAge)})
                  </span>
                </span>
              </p>
            )}
            {actor.height && (
              <p>
                <span className="font-semibold opacity-80">
                  {formatHeight(actor.height)}
                </span>
                <span className="text-sm opacity-50"> {actor.height}</span>
              </p>
            )}
          </div>
        </ActorLink>
      </div>
    </div>
  );
};

export default ActorCard;
