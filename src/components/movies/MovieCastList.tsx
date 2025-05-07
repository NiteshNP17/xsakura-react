import { ReactNode, useState, DragEvent, Fragment } from "react";
import { Link } from "react-router-dom";
import { calculateAge } from "../../utils/utils";
import { ActorData } from "../../utils/customTypes";
import IconButton from "@mui/material/IconButton";

interface MovieCastProps {
  movieCast: ActorData[];
  setMovieCast?: React.Dispatch<React.SetStateAction<ActorData[]>>;
  maleCast?: string[];
  release?: string | Date;
  mb?: boolean;
}

const MovieCastList: React.FC<MovieCastProps> = ({
  movieCast,
  setMovieCast,
  maleCast,
  release,
  mb,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<number | null>(null);

  const btClasses = {
    txtF: "text-pink-600 dark:text-pink-500",
    txtM: "text-blue-600 dark:text-blue-500",
    bgNoDb: `bg-zinc-200 dark:bg-zinc-700 ${
      mb ? "hover:bg-zinc-300 dark:hover:bg-zinc-600" : ""
    }`,
    btBase: `max-h-7 whitespace-nowrap ${setMovieCast ? "pl-2 pr-0.5" : "px-2"} py-0.5 text-sm capitalize transition-colors rounded-full`,
  };
  const releaseDate = release ? new Date(release) : null;

  const renderActressName = (actor: ActorData) => {
    return `${actor.name}${actor.dob && releaseDate ? " " + calculateAge(new Date(actor.dob), releaseDate) : ""}`;
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
        }?sort=release`}
      >
        {children}
      </Link>
    ) : (
      <>{children}</>
    );
  };

  // Drag handling functions
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    // Only enable dragging when we have the setter function
    if (!setMovieCast) return;

    e.dataTransfer.effectAllowed = "move";
    setDraggedIndex(index);

    // Setting some data is required for Firefox
    e.dataTransfer.setData("text/plain", index.toString());

    // Add a delay to give visual feedback
    setTimeout(() => {
      if (e.currentTarget) {
        e.currentTarget.classList.add("opacity-50");
      }
    }, 0);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDraggedIndex(null);
    setIsDraggingOver(null);
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setIsDraggingOver(index);
    return false;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setIsDraggingOver(index);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || !setMovieCast) return;

    // Create a new array with the dragged item moved to the new position
    const newCast = [...movieCast];
    const draggedItem = newCast[draggedIndex];

    // Remove the dragged item
    newCast.splice(draggedIndex, 1);
    // Insert at the new position
    newCast.splice(dropIndex, 0, draggedItem);

    setMovieCast(newCast);
    setDraggedIndex(null);
    setIsDraggingOver(null);
  };

  return (
    <div
      className={`mt-auto flex gap-1 px-2 ${mb ? "mb-2" : ""} overflow-x-scroll`}
    >
      {movieCast.map((actor, index) => (
        <Fragment key={actor._id}>
          {isDraggingOver === index && !!setMovieCast && (
            <div
              className={`rounded-full bg-blue-400 px-0.5 text-slate-700 opacity-45`}
            >
              &gt;
            </div>
          )}
          <div
            key={actor._id}
            className={`${btClasses.btBase} ${btClasses.txtF} ${btClasses.bgNoDb} ${draggedIndex === index ? "opacity-40" : ""} ${setMovieCast ? "c3da cursor-grab active:cursor-grabbing" : ""}`}
            draggable={!!setMovieCast}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <ActorLink
              endpoint={actor.name ? actor.name.replace(" ", "-") : "aa"}
            >
              {renderActressName(actor)}
            </ActorLink>
            {setMovieCast && (
              <IconButton
                size="small"
                sx={{
                  py: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.15)",
                  ml: "0.25rem",
                }}
                onClick={() =>
                  setMovieCast((prevCast: ActorData[]) =>
                    prevCast.filter(
                      (castMember) => castMember._id !== actor._id,
                    ),
                  )
                }
              >
                <span className="dark:text-zinc-400">&times;</span>
              </IconButton>
            )}
          </div>
        </Fragment>
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
