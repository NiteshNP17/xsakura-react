import { useEffect, useState } from "react";
import { ActorData } from "../../utils/customTypes";
import { Divider } from "@mui/material";
// import { calculateAge, formatHeight, getRainbowColor } from "../../utils/utils";
import ActorDataTable from "./ActorDataTable";

interface ActorCardLargeProps {
  actor: ActorData;
  noLink?: boolean;
  movieCount?: number;
}

const ActorCardLarge: React.FC<ActorCardLargeProps> = ({
  actor,
  movieCount,
}) => {
  const blankImg =
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Blank_woman_placeholder.svg";

  const [showBlank, setShowBlank] = useState<boolean>(false);

  useEffect(() => {
    if (actor.img500) {
      setShowBlank(false);
    }
  }, [actor.img500]);

  return (
    <div className="cq group relative flex aspect-[5/3.4] max-h-96 overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-md dark:border-zinc-600 dark:bg-zinc-800">
      <div className="flex w-full">
        {!showBlank && actor.img500 ? (
          <img
            src={actor.img500}
            alt={actor.name}
            // width="100%"
            className="aspect-3/4 rounded-r-lg border-r bg-zinc-200 object-cover object-[50%_25%] shadow-lg dark:border-zinc-600"
            onError={() => setShowBlank(true)}
          />
        ) : (
          <img
            src={blankImg}
            alt="blank"
            // width="100%"
            className="aspect-3/4 rounded-r-lg bg-zinc-200 object-cover"
          />
        )}
        {!showBlank && (
          <div className="absolute right-1 bottom-1 aspect-square place-content-center rounded-full bg-zinc-700 px-1.5 text-sm">
            <span className="font-semibold text-white">
              {movieCount || actor.numMovies}
            </span>
          </div>
        )}
        <div className="w-full capitalize">
          <p className="py-2 text-center text-2xl font-semibold">
            {actor.name}
          </p>
          <Divider />
          {/* <div className="mt-2 grid grid-cols-2 gap-2 px-4 text-lg">
              <span className="font-semibold">Age</span>
              <p className="text-right">
                <span className="font-semibold">
                  {calculateAge(
                    new Date(actor.dob),
                    new Date(actor.latestMovieDate),
                  )}
                </span>{" "}
                {actor.dob.toString()} 
              </p>
            </div>*/}
          <ActorDataTable actor={actor} />
        </div>
      </div>
    </div>
  );
};

export default ActorCardLarge;
