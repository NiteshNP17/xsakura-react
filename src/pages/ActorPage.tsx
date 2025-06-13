import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
// import ActorCard from "../components/Actors/ActorCard";
import MovieList from "../components/movies/MovieList";
// import { Box, CircularProgress, IconButton, Tab } from "@mui/material";
import { CircularProgress, IconButton } from "@mui/material";
import { ActorData, MovieData } from "../utils/customTypes";
import config from "../utils/config";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import Albums from "./Albums";
import ActorForm from "../components/Dialogs/ActorForm/ActorForm";
import Edit from "@mui/icons-material/Edit";
import ActorCardLarge from "../components/Actors/ActorCardLarge";
import { AddCircleOutline, DatasetLinked, Delete } from "@mui/icons-material";
import DeleteDialog from "../components/Dialogs/DeleteDialog";
import VideoInf from "../components/Actors/VideoInf";
import ScrapeActorMoviesDialog from "../components/Dialogs/ActorForm/ScrapeActorMoviesDialog";

const ActorPage = () => {
  const { name } = useParams<{ name: string }>();
  const actorName = name?.replace(/-/g, " ");
  const path = useLocation().pathname;
  const isMale = path.startsWith("/actor-m");

  const [actorData, setActorData] = useState<ActorData>({} as ActorData);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("p") || "1");
  const sort = searchParams.get("sort") || "release";
  // const [tabVal, setTabVal] = useState("1");
  const selectedTags = searchParams.get("tags");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openScrapeDialog, setOpenScrapeDialog] = useState(false);
  const isRandom = searchParams.get("random");
  const selectedCast = searchParams.get("cast");

  const refetchMovies = () => {
    setRefetchTrigger((prev) => !prev);
  };

  useEffect(() => {
    const fetchActorData = async () => {
      // Fetch actor data
      try {
        const res = await axios.get(`${config.apiUrl}/actors/${actorName}`);
        setActorData(res.data[0]);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/movies?${
            !isMale
              ? `cast=${actorName}${selectedCast ? "," + selectedCast : ""}`
              : "mcast=" + actorName
          }${selectedTags ? "&tags=" + selectedTags : ""}` +
            (!isRandom ? `&sort=${sort}&page=${page}` : "&random"),
        );
        setMovies(res.data.movies);
        console.log("res ov: ", res.data.movies[0].overrides);

        setTotalPages(res.data.totalPages);
        setTotalMovies(res.data.totalMovies);
      } catch (err) {
        console.error("error fetching movies: ", err);
      } finally {
        setLoaded(true);
      }
    };

    fetchActorData();
    fetchMovies();
  }, [
    actorName,
    page,
    refetchTrigger,
    isLoaded,
    isMale,
    selectedTags,
    sort,
    isRandom,
    selectedCast,
  ]);

  return (isLoaded && actorData?._id) || (isLoaded && isMale) ? (
    <>
      <div className="mb-12 px-[3vw]">
        <div className="mx-4 mt-1 mb-2 flex gap-2 px-1">
          {!actorData?.img500 && (
            <h1 className="text-3xl font-semibold capitalize">{actorName}</h1>
          )}
          {!isMale && (
            <>
              {actorData.jpName && (
                <p className="my-auto text-2xl font-semibold">
                  {actorData.jpName}
                </p>
              )}
              <IconButton onClick={() => setOpenEditDialog(true)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => setOpenDeleteDialog(true)}>
                <Delete color="error" />
              </IconButton>
              <IconButton
                component="a"
                href={`https://www.javdatabase.com/idol/${name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DatasetLinked />
              </IconButton>
              <IconButton onClick={() => setOpenScrapeDialog(true)}>
                <AddCircleOutline color="primary" />
              </IconButton>
            </>
          )}
        </div>
        {actorData?.img500 && (
          <div className="flex overflow-y-visible">
            {actorData?.rebdSrc ? (
              <VideoInf actor={actorData} movieCount={totalMovies} />
            ) : (
              <div className="block w-96 min-w-[35%]">
                <ActorCardLarge actor={actorData} movieCount={totalMovies} />
              </div>
            )}
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
        <DeleteDialog
          type="actors"
          deleteId={{ id: actorData?.name, uId: Math.random().toString() }}
          refetch={refetchMovies}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
        />
        {!isMale && (
          <ScrapeActorMoviesDialog
            open={openScrapeDialog}
            setOpen={setOpenScrapeDialog}
            actorName={name || "noName :("}
            actorId={actorData._id}
          />
        )}
      </div>
      <MovieList
        movies={movies}
        totalPages={totalPages}
        refetch={refetchMovies}
        actorData={actorData}
      />
      {/* <TabContext value={tabVal}>
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
        <TabPanel value="1" sx={{ p: 0 }}></TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          {actorData?._id && <Albums model={actorData._id} />}
        </TabPanel>
      </TabContext> */}
    </>
  ) : isLoaded && !actorData?._id ? (
    <div className="grid h-96 items-center justify-center">
      <p className="text-xl opacity-90">
        Actor <span className="font-semibold capitalize">{actorName}</span> not
        found.
      </p>
    </div>
  ) : (
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default ActorPage;
