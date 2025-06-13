import { Divider } from "@mui/material";
import { ActorData } from "../../utils/customTypes";
import ActorDataTable from "./ActorDataTable";

interface VideoInfProps {
  actor: ActorData;
  movieCount: number;
}

const VideoInf: React.FC<VideoInfProps> = ({ actor, movieCount }) => {
  return (
    <div className="relative -z-10 mx-auto -mt-12 -mb-34 hidden overflow-y-visible rounded-lg border border-zinc-300 bg-white shadow-md md:flex dark:border-zinc-600 dark:bg-zinc-800">
      <div className="relative">
        <div className="absolute -right-4 h-full bg-gradient-to-r from-transparent to-zinc-900 to-88% py-10 pl-4 capitalize text-shadow-black/40 text-shadow-xs">
          <p className="py-2 text-center text-2xl font-semibold">
            {actor.name}
          </p>
          <Divider />
          <ActorDataTable actor={actor} />
        </div>
        <video
          src={actor.rebdSrc}
          className="aspect-[16/9.2] max-h-[30rem] min-h-[360px] rounded-l-lg object-cover"
          autoPlay
          muted
          loop
          poster="https://www.solidbackgrounds.com/images/851x315/851x315-davys-grey-solid-color-background.jpg"
        />
      </div>
      <div className="absolute right-4 bottom-2 aspect-square place-content-center rounded-full bg-black/35 px-1.5 text-sm">
        <span className="font-semibold text-white">
          {movieCount || actor.numMovies}
        </span>
      </div>
      <div className="h-full w-8 rounded-r-lg bg-zinc-900" />
    </div>
  );
};

export default VideoInf;
