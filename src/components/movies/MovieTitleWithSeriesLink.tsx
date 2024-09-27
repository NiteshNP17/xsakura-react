import { Link } from "react-router-dom";
import { MovieData } from "../../utils/customTypes";

const MovieTitleWithSeriesLink = ({ movie }: { movie: MovieData }) => {
  if (!movie.title) return null;

  const createRegexPattern = (seriesName: string) => {
    const parts = seriesName.split("*");
    const escapedParts = parts.map((part) =>
      part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\?/g, "."),
    );
    return escapedParts.join("([^]*?)");
  };

  let titleContent;

  if (movie.series) {
    const regexPattern = createRegexPattern(movie.series.name);
    const regex = new RegExp(`(${regexPattern})`, "i");

    const match = movie.title.match(regex);

    if (match) {
      const [fullMatch] = match;
      const index = movie.title.indexOf(fullMatch);
      const before = movie.title.slice(0, index);
      const after = movie.title.slice(index + fullMatch.length);

      titleContent = (
        <>
          {before && <span className="capitalize">{before}</span>}
          <Link
            to={`/series/${movie.series.slug}`}
            className="capitalize text-pink-500"
          >
            {fullMatch}
          </Link>
          {after && <span className="capitalize">{after}</span>}
        </>
      );
    } else {
      titleContent = <span className="capitalize">{movie.title}</span>;
    }
  } else if (movie.code.startsWith("rebd")) {
    const titleParts = movie.title.split(/[-・]/);
    const mainTitle =
      titleParts.slice(0, -1).join("-").trim() || titleParts[0].trim();
    const words = mainTitle.split(" ");
    const firstWord = words[0];
    const restOfTitle = words.slice(1).join(" ");

    titleContent = (
      <span className="capitalize">
        <span className="font-semibold text-fuchsia-700 dark:text-fuchsia-300">
          {firstWord}
        </span>
        {restOfTitle && " " + restOfTitle}
      </span>
    );
  } else {
    titleContent = <span className="capitalize">{movie.title}</span>;
  }

  return <>{titleContent}</>;
};

export default MovieTitleWithSeriesLink;
