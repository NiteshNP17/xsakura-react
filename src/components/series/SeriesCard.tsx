import { MoreVert } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import SeriesImage from "./SeriesImage";
import { SeriesItem } from "../../utils/customTypes";
import { Link } from "react-router-dom";

interface SeriesCardProps {
  series: SeriesItem;
  setSerieToEdit?: (serieToEdit: SeriesItem) => void;
  setAnchorEl?: (anchorEl: null | HTMLElement) => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({
  series,
  setSerieToEdit,
  setAnchorEl,
}) => {
  return (
    <div
      key={series.slug}
      className="group relative grid gap-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-zinc-600 dark:bg-zinc-800"
    >
      <Link to={`/series/${series.slug}`} className="capitalize">
        <div className="flex justify-evenly">
          {series.thumbs
            ? series.thumbs
                .split(" ")
                .map((code) => (
                  <SeriesImage key={code.trim()} code={code.trim()} />
                ))
            : series.movieCodes?.map((code) => (
                <SeriesImage key={code} code={code} />
              ))}
          {/* <SerieImage
                  thumbs={
                    series.thumbs
                      ? series.thumbs.split(" ")
                      : series.movieCodes
                        ? series.movieCodes
                        : ["abc-123"]
                  }
                /> */}
        </div>
        <p className="mr-4 flex gap-1 p-2">
          <span className="line-clamp-1 text-ellipsis">{series.name}</span>
          {`(${series.movieCount})`}
        </p>
      </Link>
      {setSerieToEdit && (
        <IconButton
          onClick={(e) => {
            setSerieToEdit(series);
            setAnchorEl && setAnchorEl(e.currentTarget);
          }}
          sx={{
            px: 0,
            py: 2,
            ml: "auto",
            maxHeight: "24px",
            position: "absolute",
            right: "0",
            bottom: "0.25rem",
          }}
          className="group-hover:opacity-100 sm:opacity-0"
        >
          <MoreVert />
        </IconButton>
      )}
    </div>
  );
};

export default SeriesCard;
