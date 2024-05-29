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
}

const ActorCard: React.FC<ActorCardProps> = ({ actor, children }) => {
  const myAge = new Date("1997-11-02T00:00:00Z");
  const today = new Date();
  actor.dob = actor.dob ? new Date(actor.dob) : undefined;
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

  return (
    <div className="border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600 cq group overflow-hidden bg-white border rounded-lg shadow-md">
      {/* <button className="right-1 top-1 aspect-square opacity-80 hover:bg-zinc-200 text-zinc-600 absolute p-1 transition-colors duration-150 scale-90 bg-white rounded-full">
        <Edit />
      </button> */}
      {!showBlank ? (
        <Link to={actorLink}>
          <img
            src={actor.img500}
            alt={actor.name}
            width="100%"
            className="object-cover aspect-[3/4] bg-zinc-200"
            onError={() => setShowBlank(true)}
          />
        </Link>
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
          <Link to={actorLink}>
            <p className="w-full text-lg font-semibold text-center capitalize">
              {actor.name}
            </p>
          </Link>
          {children}
        </div>
        <Link to={actorLink}>
          <div className="flex justify-between">
            {actor.dob && (
              <p>
                <span className="opacity-80 font-semibold">
                  {calculateAge(actor.dob, today)}
                </span>
                &nbsp;
                <span className="text-sm opacity-50">
                  {actor.dob.getDate()}-
                  {actor.dob.toLocaleString("default", { month: "short" })}-
                  {actor.dob.getFullYear().toString().slice(-2)}
                  {!actor.isMale && (
                    <span className="my-age">
                      &nbsp;({ageCompare(actor.dob, myAge)})
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
        </Link>
      </div>
    </div>
  );
};

export default ActorCard;
