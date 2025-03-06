import { Link } from "react-router-dom";
import { MovieData } from "../../utils/customTypes";
import MovieCover from "./MovieCover";
import MoreVert from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import MovieCastList from "./MovieCastList";
import MovieTitleWithSeriesLink from "./MovieTitleWithSeriesLink";
import DisplayTags from "./DisplayTags";

interface MovieArticleProps {
  movie: MovieData;
  setMovieToEdit: (movieToEdit: MovieData) => void;
  setId: (id: string) => void;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
  setToEdit: (isToEdit: boolean) => void;
}

const MovieArticle: React.FC<MovieArticleProps> = ({
  movie,
  setMovieToEdit,
  setId,
  setAnchorEl,
  setToEdit,
}) => {
  return (
    <article className="group relative grid gap-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-zinc-600 dark:bg-zinc-800">
      <Link to={`/movie/${movie.code}`}>
        <MovieCover code={movie.code} overrides={movie.overrides} />
        <DisplayTags tags={movie.tag2} />
      </Link>
      <div className="flex pl-3">
        <p className="line-clamp-2">
          <span className="text-lg font-semibold uppercase">{movie.code} </span>
          <MovieTitleWithSeriesLink movie={movie} />
        </p>
        <IconButton
          sx={{ p: 0, ml: "auto", maxHeight: "24px", mt: "1px" }}
          className="group-hover:opacity-100 sm:opacity-0"
          onClick={(e) => {
            setMovieToEdit(movie);
            setId(Math.random().toString(36).substring(6));
            setToEdit(true);
            setAnchorEl(e.currentTarget);
          }}
        >
          <MoreVert />
        </IconButton>
      </div>
      <MovieCastList
        movieCast={movie.cast}
        maleCast={movie.maleCast}
        release={movie.release}
        mb
      />
    </article>
  );
};

export default MovieArticle;
