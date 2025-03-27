import {
  AutoAwesomeMosaicTwoTone,
  FileDownload,
  HdrStrongTwoTone,
  SubtitlesOutlined,
  VideoCameraFrontTwoTone,
  VrpanoTwoTone,
  WaterDropTwoTone,
} from "@mui/icons-material";
import { Tag } from "../../utils/customTypes";
import { Icon } from "@mui/material";

const DisplayTags = ({ tags }: { tags: Tag[] }) => {
  const tagNames = tags.map((obj) => obj.name);

  return (
    <div className="absolute left-1 top-1 flex gap-1 rounded-md bg-black bg-opacity-60 px-1.5 align-bottom">
      {tagNames.includes("VR") && (
        <span
          className={
            tagNames.includes("astvr") ? "text-red-400" : "text-sky-400"
          }
        >
          <VrpanoTwoTone color="inherit" />
        </span>
      )}
      {tagNames.includes("DN") && (
        <span className="text-green-400">
          <FileDownload color="inherit" />
        </span>
      )}
      {tagNames?.includes("MR") && (
        <span className="font-semibold text-amber-500">
          <AutoAwesomeMosaicTwoTone color="inherit" />
        </span>
      )}
      {tagNames?.includes("POV") && (
        <span className="font-semibold text-red-400">
          <VideoCameraFrontTwoTone color="inherit" />
        </span>
      )}
      {tagNames?.includes("UN") && (
        <span className="font-black text-rose-500">
          <AutoAwesomeMosaicTwoTone color="inherit" />
        </span>
      )}
      {tagNames?.includes("Ass Lover") && (
        <span className="text-xs">
          <Icon>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/f4/Twemoji_1f351.svg"
              alt="butt"
            />
          </Icon>
        </span>
      )}
      {tagNames?.includes("EN") && (
        <span className="text-xs text-cyan-400">
          <SubtitlesOutlined color="inherit" />
        </span>
      )}
      {tagNames?.includes("Lotion") && (
        <span className="text-xs text-blue-400">
          <WaterDropTwoTone color="inherit" />
        </span>
      )}
      {tagNames?.includes("Softcore") && (
        <span className="text-xs text-indigo-300">
          <HdrStrongTwoTone color="inherit" />
        </span>
      )}
    </div>
  );
};

export default DisplayTags;
