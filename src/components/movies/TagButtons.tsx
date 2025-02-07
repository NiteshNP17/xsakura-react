import LocalOffer from "@mui/icons-material/LocalOffer";
import { useSearchParams } from "react-router-dom";

const TagButtons = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTags = searchParams.get("tags");
  const tagsList = ["softcore", "ass lover", "lotion", "multi girls", "bbc"];
  const optTags = [
    { val: "vr", label: "VR" },
    { val: "mr", label: "Decensored" },
    { val: "en", label: "Subtitles" },
    { val: "un", label: "Uncensored" },
  ];

  const handleTagClick = (tag: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (selectedTags === tag) {
      newSearchParams.delete("p");
      newSearchParams.delete("tags");
    } else {
      newSearchParams.delete("p");
      newSearchParams.set("tags", tag);
    }

    setSearchParams(newSearchParams);
  };

  return (
    <div className="mx-auto mb-3 flex max-w-[1660px] gap-2 overflow-x-scroll text-nowrap align-middle">
      <LocalOffer />
      {tagsList.map((tag) => (
        <div
          key={tag}
          onClick={() => handleTagClick(tag)}
          className="cursor-pointer rounded-lg bg-zinc-200 px-2 capitalize text-rose-600 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-rose-500 dark:hover:bg-zinc-600"
        >
          {tag} {selectedTags === tag && <>&times;</>}
        </div>
      ))}
      {optTags.map((tag) => (
        <div
          key={tag.val}
          onClick={() => handleTagClick(tag.val)}
          className="cursor-pointer rounded-lg bg-zinc-200 px-2 text-purple-600 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-purple-400 dark:hover:bg-zinc-600"
        >
          {tag.label} {selectedTags === tag.val && <>&times;</>}
        </div>
      ))}
    </div>
  );
};

export default TagButtons;
