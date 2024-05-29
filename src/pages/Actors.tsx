import { AddCircleOutline } from "@mui/icons-material";
import { CircularProgress, IconButton } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ActorCard from "../components/Actors/ActorCard";
import ActorForm from "../components/Dialogs/ActorForm";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ActorListSwitch } from "../components/Actors/ActorListSwitch";
import MutateMenu from "../components/Dialogs/MutateMenu";
import MoreVert from "@mui/icons-material/MoreVert";

const Actors = () => {
  interface ActorData {
    _id: string;
    name: string;
    dob?: Date;
    height?: number;
    isMale?: boolean;
    img500?: string;
  }

  const [isLoaded, setIsLoaded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [actors, setActors] = useState<ActorData[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [urlParams, setUrlParams] = useSearchParams();
  const isMale = urlParams.get("list") === "male";
  const actorToEditRef = useRef(null as string | null);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setUrlParams({ list: "male" });
    } else {
      urlParams.delete("list");
      setUrlParams(urlParams);
    }
  };

  const refetchActors = () => {
    setRefetch((prev) => !prev);
  };

  useEffect(() => {
    const fetchActors = async () => {
      setIsLoaded(false);
      try {
        const res = await axios.get(
          `http://localhost:5000/actors${isMale ? "?male" : ""}`
        );
        setActors(res.data.actors);
        setIsLoaded(true);
      } catch (err) {
        console.error("error fetching actors: ", err);
      }
    };

    fetchActors();
  }, [refetch, isMale]);

  return isLoaded ? (
    <div className="px-[3vw] mb-12">
      <div className="flex px-1 mt-1 mb-4">
        <h1 className="text-3xl font-semibold">Actors</h1>
        <IconButton
          color="primary"
          onClick={() => {
            actorToEditRef.current = null;
            setOpenEditDialog(true);
          }}
        >
          <AddCircleOutline />
        </IconButton>
        <div className="ml-auto">
          <ActorListSwitch checked={isMale} onChange={handleSwitchChange} />
        </div>
      </div>
      <div className="grid-fit-1 sm:grid-fit-015 max-w-[1660px] mx-auto md:gap-6 grid gap-4">
        {actors.map((actor) => (
          <ActorCard key={actor._id} actor={actor}>
            <IconButton
              onClick={(e) => {
                actorToEditRef.current = actor.name;
                setAnchorEl(e.currentTarget);
              }}
              sx={{
                p: 0,
                ml: "auto",
                maxHeight: "24px",
                mt: "1px",
                position: "absolute",
                right: "0",
                top: "0",
              }}
              className="sm:opacity-0 group-hover:opacity-100"
            >
              <MoreVert />
            </IconButton>
          </ActorCard>
        ))}
      </div>
      <MutateMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        setOpenEditDialog={setOpenEditDialog}
      />
      <ActorForm
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        refetch={refetchActors}
        actorToEdit={{
          name: actorToEditRef.current,
          id: Math.random().toString(),
        }}
      />
    </div>
  ) : (
    <div className="place-content-center h-96 grid w-full">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default Actors;
