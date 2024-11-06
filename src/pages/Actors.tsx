import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { CircularProgress, IconButton, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ActorCard from "../components/Actors/ActorCard";
import ActorForm from "../components/Dialogs/ActorForm";
import { useEffect, useState } from "react";
import axios from "axios";
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
  const [actorToEdit, setActorToEdit] = useState<ActorData>({} as ActorData);
  const [refetch, setRefetch] = useState(false);
  const [urlParams, setUrlParams] = useSearchParams();
  const sort =
    urlParams.get("sort") || localStorage.getItem("actorSort") || "added";
  const sortDirection =
    urlParams.get("sortd") || localStorage.getItem("actorSortD") || "asc";
  const page = parseInt(urlParams.get("p") || "1");
  const [totalPages, setTotalPages] = useState(1);

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
    setActorToEdit({} as ActorData);
    setTimeout(() => {
      setOpenEditDialog(true);
    }, 10);
  };

  useKeyboardShortcut({ modifier: "alt", key: "i", callback: handleAdd });

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/actors?sort=${sort + sortDirection}&page=${page}`,
        );
        setActors(res.data.actors);
        setTotalPages(res.data.totalPages);
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
  }, [refetch, sort, urlParams, setUrlParams, sortDirection, page]);

  return (
    <div className="mb-12 px-[3vw]">
      <div className="my-1 flex px-1">
        <h1 className="text-3xl font-semibold">Actors</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="flex w-full justify-center">
        <div className="mb-4 mt-2 flex w-full max-w-[1660px] gap-2">
          <SortSelect type="actors" setLoaded={setIsLoaded} />
        </div>
      </div>
      {isLoaded ? (
        <div className="grid-fit-1 sm:grid-fit-015 mx-auto grid max-w-[1660px] gap-4 md:gap-6">
          {actors.map((actor) => (
            <ActorCard key={actor._id} actor={actor}>
              <IconButton
                onClick={(e) => {
                  setActorToEdit(actor);
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
      ) : (
        <div className="mb-96 grid h-96 w-full place-content-center">
          <CircularProgress size="4rem" />
        </div>
      )}
      <div className="my-12 flex w-full justify-center">
        <Pagination
          count={totalPages}
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
          actor: actorToEdit,
          id: Math.random().toString(),
        }}
      />
      <DeleteDialog
        type="actors"
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        deleteId={{
          id: actorToEdit.name || "",
          uId: Math.random().toString(),
        }}
        refetch={refetchActors}
      />
    </div>
  );
};

export default Actors;
