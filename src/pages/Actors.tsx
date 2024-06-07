import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { CircularProgress, IconButton, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ActorCard from "../components/Actors/ActorCard";
import ActorForm from "../components/Dialogs/ActorForm";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ActorListSwitch } from "../components/Actors/ActorListSwitch";
import MutateMenu from "../components/Dialogs/MutateMenu";
import MoreVert from "@mui/icons-material/MoreVert";
import DeleteDialog from "../components/Dialogs/DeleteDialog";
import useKeyboardShortcut from "../utils/useKeyboardShortcut";
import { ActorData } from "../utils/customTypes";
import SortSelect from "../components/SortSelect";

const Actors = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [actors, setActors] = useState<ActorData[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [urlParams, setUrlParams] = useSearchParams();
  const isMale = urlParams.get("list") === "male";
  const sort =
    urlParams.get("sort") || localStorage.getItem("actorSort") || "added";
  const sortDirection =
    urlParams.get("sortd") || localStorage.getItem("actorSortD") || "asc";
  const page = parseInt(urlParams.get("p") || "1");
  const actorToEditRef = useRef(null as string | null);
  const totalPagesRef = useRef<number>(0);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(urlParams);
    if (event.target.checked) {
      params.set("list", "male");
    } else {
      params.delete("list");
    }
    setUrlParams(params);
  };

  const refetchActors = () => {
    setRefetch((prev) => !prev);
  };

  const handlePageChange = (
    _e: React.ChangeEvent<unknown> | KeyboardEvent | null,
    newPage: number
  ) => {
    const params = new URLSearchParams(urlParams);
    if (newPage === 1) {
      params.delete("p");
    } else {
      params.set("p", newPage.toString());
    }
    setUrlParams(params.toString(), { replace: true });
  };

  const handleAdd = () => {
    actorToEditRef.current = null;
    setOpenEditDialog(true);
  };

  useKeyboardShortcut({ modifier: "alt", key: "i", callback: handleAdd });

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/actors?sort=${sort + sortDirection}${
            isMale ? "&male" : ""
          }&page=${page}`
        );
        setActors(res.data.actors);
        totalPagesRef.current = res.data.totalPages;
        setIsLoaded(true);
      } catch (err) {
        console.error("error fetching actors: ", err);
      }
    };

    const actorSortLocal = localStorage.getItem("actorSort");

    if (actorSortLocal) {
      const params = new URLSearchParams(urlParams);
      params.set("sort", actorSortLocal);
      setUrlParams(params);
    }

    fetchActors();
  }, [refetch, isMale, sort, urlParams, setUrlParams, sortDirection, page]);

  return isLoaded ? (
    <div className="px-[3vw] mb-12">
      <div className="flex px-1 mt-1 mb-4">
        <h1 className="text-3xl font-semibold">Actors</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
        <div className="flex gap-2 ml-auto">
          <SortSelect type="actors" />
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
      <div className="flex justify-center w-full my-12">
        <Pagination
          count={totalPagesRef.current}
          size="large"
          color="primary"
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <MutateMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        setOpenEditDialog={setOpenEditDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
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
      <DeleteDialog
        type="actors"
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        deleteId={{
          id: actorToEditRef.current || "",
          uId: Math.random().toString(),
        }}
        refetch={refetchActors}
      />
    </div>
  ) : (
    <div className="place-content-center h-96 grid w-full">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default Actors;
