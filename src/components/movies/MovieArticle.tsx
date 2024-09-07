import { Link } from "react-router-dom";
import { MovieData } from "../../utils/customTypes";
import MovieCover from "./MovieCover";
import {
  FileDownload,
  MoreVert,
  SubtitlesOutlined,
  Vrpano,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import MovieCastList from "./MovieCastList";
import MovieTitleWithSeriesLink from "./MovieTitleWithSeriesLink";

interface MovieArticleProps {
  movie: MovieData;
  setMovieToEdit: (movieToEdit: MovieData) => void;
  setId: (id: string) => void;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}

const MovieArticle: React.FC<MovieArticleProps> = ({
  movie,
  setMovieToEdit,
  setId,
  setAnchorEl,
}) => {
  return (
    <article className="group relative grid gap-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-zinc-600 dark:bg-zinc-800">
      <Link to={`/movie/${movie.code}`}>
        <MovieCover code={movie.code} overrides={movie.overrides} />
        <div className="absolute left-1 top-1 flex gap-1 rounded-md bg-black bg-opacity-60 px-1.5 align-bottom">
          {movie.opt.includes("vr") && (
            <span
              className={
                movie.opt.includes("astvr")
                  ? "text-red-400"
                  : movie.opt.includes("sb")
                    ? "text-fuchsia-400"
                    : "text-sky-400"
              }
            >
              <Vrpano color="inherit" />
            </span>
          )}
          {movie.opt.includes("dn") && (
            <span className="text-green-400">
              <FileDownload color="inherit" />
            </span>
          )}
          {movie.opt?.includes("mr") && (
            <span className="font-semibold text-yellow-400">MR</span>
          )}
          {movie.opt?.includes("un") && (
            <span className="font-black text-rose-500">UN</span>
          )}
          {movie.opt?.includes("en") && (
            <span className="text-xs text-cyan-400">
              <SubtitlesOutlined color="inherit" />
            </span>
          )}
        </div>
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
