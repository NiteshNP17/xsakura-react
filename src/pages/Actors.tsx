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
import config from "../utils/config";

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
    newPage: number,
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
          `${config.apiUrl}/actors?sort=${sort + sortDirection}${
            isMale ? "&male" : ""
          }&page=${page}`,
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
    <div className="mb-12 px-[3vw]">
      <div className="my-1 flex px-1">
        <h1 className="text-3xl font-semibold">Actors</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="flex w-full justify-center">
        <div className="mb-4 mt-2 flex w-full max-w-[1660px] gap-2">
          <SortSelect type="actors" />
          <ActorListSwitch checked={isMale} onChange={handleSwitchChange} />
        </div>
      </div>
      <div className="grid-fit-1 sm:grid-fit-015 mx-auto grid max-w-[1660px] gap-4 md:gap-6">
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
              className="group-hover:opacity-100 sm:opacity-0"
            >
              <MoreVert />
            </IconButton>
          </ActorCard>
        ))}
      </div>
      <div className="my-12 flex w-full justify-center">
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
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default Actors;
