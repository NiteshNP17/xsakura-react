import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import MovieList from "../components/movies/MovieList";
import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Pagination } from "@mui/material";
import MovieForm from "../components/Dialogs/MovieForm";

const Movies = () => {
  interface Movie {
    code: string;
    cast: string[];
    title: string;
  }

  const totalPagesRef = useRef<number>(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const page = parseInt(useParams().page ?? "1");
  const navigate = useNavigate();
  const [isLoaded, setLoaded] = useState<boolean>(false);
  //const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const refCodeToEdit = useRef<string | null>(null);

  /*const refetchMovies = () => {
    setRefetchTrigger((prev) => !prev);
  };*/

  const handlePageChange = (_event: ChangeEvent<unknown>, val: number) => {
    navigate(val === 1 ? "/movies" : `/movies/${val}`);
  };

  const handleEdit = (code: string) => {
    refCodeToEdit.current = code;
    setOpenEditDialog(true);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/movies?sort=latest&page=${page}`
        );
        setMovies(res.data.movies);
        totalPagesRef.current = res.data.totalPages;
        setLoaded(true);
      } catch (err) {
        console.error("error fetching movies: ", err);
      }
    };

    fetchMovies();
  }, [page, /*refetchTrigger,*/ isLoaded]);

  return isLoaded ? (
    <div className="w-full m-0 px-[3vw]">
      <div className="flex mt-1 mb-4">
        <h1 className="text-3xl font-semibold">Movies</h1>
        <IconButton color="primary" onClick={() => setOpenEditDialog(true)}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <MovieList movies={movies} openEditDialog={handleEdit} />
      <div className="flex justify-center w-full mb-12">
        <Pagination
          color="primary"
          count={totalPagesRef.current}
          size="large"
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <MovieForm
        codeToEdit={refCodeToEdit.current}
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
      />
    </div>
  ) : (
    <div className="place-content-center h-96 grid w-full">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default Movies;
