import { useSearchParams } from "react-router-dom";
import { ActorData } from "../../utils/customTypes";
import Face3TwoTone from "@mui/icons-material/Face3TwoTone";

const CastButtons = ({ castList }: { castList: ActorData[] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCast = searchParams.get("cast");

  const handleTagClick = (tag: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (selectedCast === tag) {
      newSearchParams.delete("p");
      newSearchParams.delete("cast");
    } else {
      newSearchParams.delete("p");
      newSearchParams.set("cast", tag);
    }

    setSearchParams(newSearchParams);
  };

  return (
    <div className="mx-auto mb-3 flex max-w-[1660px] gap-2 overflow-x-scroll text-nowrap align-middle">
      <Face3TwoTone />
      {castList.map((actor) => (
        <div
          key={actor._id}
          onClick={() => handleTagClick(actor.name)}
          className="cursor-pointer rounded-lg bg-zinc-200 px-2 capitalize text-rose-600 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-rose-500 dark:hover:bg-zinc-600"
        >
          {actor.numMovies} {actor.name}{" "}
          {selectedCast === actor.name && <>&times;</>}
        </div>
      ))}
    </div>
  );
};

export default CastButtons;
