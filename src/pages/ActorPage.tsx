import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import ActorCard from "../components/Actors/ActorCard";
import MovieList from "../components/movies/MovieList";
import { Box, CircularProgress, IconButton, Tab } from "@mui/material";
import { ActorData, MovieData } from "../utils/customTypes";
import config from "../utils/config";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Albums from "./Albums";
import ActorForm from "../components/Dialogs/ActorForm";
import Edit from "@mui/icons-material/Edit";

const ActorPage = () => {
  const { name } = useParams<{ name: string }>();
  const actorName = name?.replace(/-/g, " ");
  const path = useLocation().pathname;
  const isMale = path.startsWith("/actor-m");

  const [actorData, setActorData] = useState<ActorData>({} as ActorData);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const totalPagesRef = useRef<number>(0);
  const totalMoviesRef = useRef<number>(0);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");
  const [tabVal, setTabVal] = useState("1");
  const selectedTags = searchParams.get("tags");
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const refetchMovies = () => {
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const fetchActorData = async () => {
      // Fetch actor data
      try {
        const res = await axios.get(`${config.apiUrl}/actors/${actorName}`);
        setActorData(res.data);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/movies?${
            !isMale ? "cast=" + actorName : "mcast=" + actorName
          }&sort=release${selectedTags ? "&tags=" + selectedTags : ""}&page=${page}`,
        );
        setMovies(res.data.movies);
        totalPagesRef.current = res.data.totalPages;
        totalMoviesRef.current = res.data.totalMovies;
        setLoaded(true);
      } catch (err) {
        console.error("error fetching movies: ", err);
      }
    };

    fetchActorData();
    fetchMovies();
  }, [actorName, page, refetchTrigger, isLoaded, isMale, selectedTags]);

  return (
    <>
      <div className="mb-12 px-[3vw]">
        <div className="mb-4 mt-1 flex gap-2 px-1">
          <h1 className="text-3xl font-semibold capitalize">{actorName}</h1>
          <IconButton onClick={() => setOpenEditDialog(true)}>
            <Edit />
          </IconButton>
        </div>
        {actorData.img500 && (
          <div className="mx-auto max-w-80 md:mx-12">
            <ActorCard
              actor={actorData}
              noLink
              movieCount={totalMoviesRef.current}
            />
          </div>
        )}
        <ActorForm
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          refetch={refetchMovies}
          actorToEdit={{
            actor: actorData,
            id: Math.random().toString(),
          }}
        />
      </div>
      {isLoaded ? (
        <TabContext value={tabVal}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              maxWidth: "1660px",
              mx: "auto",
            }}
          >
            <TabList onChange={(_e, newVal) => setTabVal(newVal)}>
              <Tab label="Movies" value="1" />
              <Tab label="Albums" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ p: 0 }}>
            <MovieList
              movies={movies}
              totalPages={totalPagesRef.current}
              refetch={refetchMovies}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            <Albums model={actorData._id} />
          </TabPanel>
        </TabContext>
      ) : (
        <div className="grid h-32 w-full place-content-center">
          <CircularProgress size="4rem" />
        </div>
      )}
    </>
  );
};

export default ActorPage;
