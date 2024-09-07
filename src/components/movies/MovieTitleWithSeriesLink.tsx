import { Link } from "react-router-dom";
import { MovieData } from "../../utils/customTypes";

const MovieTitleWithSeriesLink = ({ movie }: { movie: MovieData }) => {
  if (!movie.title) return null;

  let titleContent;

  if (
    movie.series &&
    movie.title.toLowerCase().includes(movie.series.name.toLowerCase())
  ) {
    const parts = movie.title.split(new RegExp(`(${movie.series.name})`, "i"));
    titleContent = parts.map((part, index) =>
      part.toLowerCase() === movie.series.name.toLowerCase() ? (
        <Link
          key={index}
          to={`/series/${movie.series.slug}`}
          className="capitalize text-pink-500"
        >
          {movie.series.name}
        </Link>
      ) : (
        <span key={index} className="capitalize">
          {part}
        </span>
      ),
    );
  } else {
    titleContent = (
      <>
        {movie.series && (
          <Link
            to={`/series/${movie.series.slug}`}
            className="capitalize text-pink-500"
          >
            {movie.series.name}
          </Link>
        )}
        <span className="capitalize">
          {movie.series
            ? " " + movie.title.replace(movie.series.name.toLowerCase(), "")
            : movie.title}
        </span>
      </>
    );
  }

  return <>{titleContent}</>;
};

export default MovieTitleWithSeriesLink;
