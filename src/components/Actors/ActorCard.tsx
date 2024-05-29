import { useEffect, useState } from "react";
import { ageCompare, calculateAge, formatHeight } from "../../utils/utils";
import { Link } from "react-router-dom";

interface ActorCardProps {
  actor: {
    _id?: string;
    name: string;
    dob?: string | Date;
    height?: number;
    isMale?: boolean;
    img500?: string;
  };
  children?: React.ReactNode;
  noLink?: boolean;
}

const ActorCard: React.FC<ActorCardProps> = ({ actor, children, noLink }) => {
  const myAge = new Date("1997-11-02T00:00:00Z");
  const today = new Date();
  const dobDate = actor.dob ? new Date(actor.dob) : undefined;
  const blankImg =
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Blank_woman_placeholder.svg";
  const [showBlank, setShowBlank] = useState<boolean>(false);
  const actorLink = `/actor${actor.isMale ? "-m" : ""}/${actor.name.replace(
    / /g,
    "-"
  )}`;

  useEffect(() => {
    if (actor.img500) {
      setShowBlank(false);
    }
  }, [actor.img500]);

  const ActorLink = ({ children }: { children: React.ReactNode }) =>
    !noLink ? <Link to={actorLink}>{children}</Link> : <>{children}</>;

  return (
    <div className="border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600 cq group overflow-hidden bg-white border rounded-lg shadow-md">
      {!showBlank ? (
        <ActorLink>
          <img
            src={actor.img500}
            alt={actor.name}
            width="100%"
            className="object-cover aspect-[3/4] bg-zinc-200"
            onError={() => setShowBlank(true)}
          />
        </ActorLink>
      ) : (
        <img
          src={blankImg}
          alt="blank"
          width="100%"
          className="object-cover aspect-[3/4] bg-zinc-200"
        />
      )}
      <div className="relative grid px-2">
        <div>
          <ActorLink>
            <p className="w-full text-lg font-semibold text-center capitalize">
              {actor.name}
            </p>
          </ActorLink>
          {children}
        </div>
        <ActorLink>
          <div className="flex justify-between">
            {dobDate && (
              <p>
                <span className="opacity-80 font-semibold">
                  {calculateAge(dobDate, today)}
                </span>{" "}
                <span className="text-sm opacity-50">
                  {dobDate.getDate()}-
                  {dobDate.toLocaleString("default", { month: "short" })}-
                  {dobDate.getFullYear().toString().slice(-2)}
                  {!actor.isMale && (
                    <span className="my-age">
                      &nbsp;({ageCompare(dobDate, myAge)})
                    </span>
                  )}
                </span>
              </p>
            )}
            {actor.height && (
              <p>
                <span className="opacity-80 font-semibold">
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
