import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import {
  ButtonGroup,
  CircularProgress,
  IconButton,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ActorCard from "../components/Actors/ActorCard";
import ActorForm from "../components/Dialogs/ActorForm/ActorForm";
import { useEffect, useState } from "react";
import axios from "axios";
import MutateMenu from "../components/Dialogs/MutateMenu";
import MoreVert from "@mui/icons-material/MoreVert";
import DeleteDialog from "../components/Dialogs/DeleteDialog";
import useKeyboardShortcut from "../utils/useKeyboardShortcut";
import { ActorData } from "../utils/customTypes";
import SortSelect from "../components/SortSelect";
import config from "../utils/config";
import { ArrowBack, Shuffle } from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableActorCard } from "../components/Actors/SortableActorCard";

// Store dragged actor in sessionStorage
const DRAGGED_ACTOR_KEY = "draggedActor";
const DRAGGING_ACTIVE_KEY = "dragActive";

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
  const isRandom = urlParams.get("random");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  // State for drag and drop
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeActor, setActiveActor] = useState<ActorData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSourcePage, setDragSourcePage] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // Configure dnd-kit sensors - only using PointerSensor (removed KeyboardSensor)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

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

  useKeyboardShortcut({
    key: "arrowRight",
    callback: () => {
      if (page < totalPages && !openEditDialog)
        handlePageChange(null, page + 1);
    },
  });
  useKeyboardShortcut({
    key: "arrowLeft",
    callback: () => {
      if (page > 1 && !openEditDialog) handlePageChange(null, page - 1);
    },
  });

  const handleAdd = () => {
    setActorToEdit({} as ActorData);
    setTimeout(() => {
      setOpenEditDialog(true);
    }, 10);
  };

  useKeyboardShortcut({ modifier: "alt", key: "i", callback: handleAdd });

  // Check for cross-page drag operation on component mount
  useEffect(() => {
    const dragActive = sessionStorage.getItem(DRAGGING_ACTIVE_KEY);
    if (dragActive === "true") {
      const storedActorData = sessionStorage.getItem(DRAGGED_ACTOR_KEY);
      if (storedActorData) {
        try {
          const parsedActor = JSON.parse(storedActorData) as ActorData;
          setActiveActor(parsedActor);
          setActiveId(parsedActor._id);
          setIsDragging(true);
          setDragSourcePage(
            parseInt(sessionStorage.getItem("dragSourcePage") || "1"),
          );
        } catch (err) {
          console.error("Error parsing dragged actor data:", err);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/actors?${isRandom ? "random" : `sort=${sort}&dir=${sortDirection}&page=${page}`}`,
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
  }, [refetch, sort, urlParams, setUrlParams, sortDirection, page, isRandom]);

  const handleRandom = () => {
    if (isRandom) {
      refetchActors();
    } else {
      const newSearchParams = new URLSearchParams(urlParams.toString());
      newSearchParams.set("random", "true");
      newSearchParams.delete("p");
      setUrlParams(newSearchParams);
    }
  };

  const handleRandomBack = () => {
    const newSearchParams = new URLSearchParams(urlParams.toString());
    newSearchParams.delete("random");
    setUrlParams(newSearchParams);
  };

  // Function to update actor order in the backend using existing API
  const updateActorOrder = async (
    actorId: string,
    prevOrder: number | undefined,
    nextOrder: number | undefined,
  ) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {};

      if (prevOrder !== undefined) {
        payload.prevOrder = prevOrder;
      }

      if (nextOrder !== undefined) {
        payload.nextOrder = nextOrder;
      }

      await axios.patch(`${config.apiUrl}/actors/order/${actorId}`, payload);

      // Show success notification
      setSnackbarMessage("Actor order updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating actor order:", error);
      setSnackbarMessage("Failed to update actor order");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setIsDragging(true);
    const draggedActor = actors.find((actor) => actor._id === active.id);

    if (draggedActor) {
      setActiveActor(draggedActor);
      setDragSourcePage(page);

      // Store information for cross-page dragging
      sessionStorage.setItem(DRAGGED_ACTOR_KEY, JSON.stringify(draggedActor));
      sessionStorage.setItem(DRAGGING_ACTIVE_KEY, "true");
      sessionStorage.setItem("dragSourcePage", page.toString());
    }
  };

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    // Clear session storage
    sessionStorage.removeItem(DRAGGED_ACTOR_KEY);
    sessionStorage.removeItem(DRAGGING_ACTIVE_KEY);
    sessionStorage.removeItem("dragSourcePage");

    const { active, over } = event;

    if (!activeActor) {
      setActiveId(null);
      setIsDragging(false);
      return;
    }

    // Handle drop on specific target
    if (over && active.id !== over.id) {
      const newIndex = actors.findIndex((item) => item._id === over.id);

      // Determine the orders of adjacent actors for placement
      let prevOrder: number | undefined;
      // let nextOrder: number | undefined;

      // Get previous actor's order if not at the beginning
      if (newIndex > 0) {
        prevOrder = actors[newIndex - 1].order;
      }

      // Get next actor's order (which is the actor we're hovering over)
      const nextOrder = actors[newIndex].order;

      // Update actor order in the backend
      await updateActorOrder(activeActor._id, prevOrder, nextOrder);

      // If dropping on same page, update UI optimistically
      if (dragSourcePage === page) {
        const oldIndex = actors.findIndex((item) => item._id === active.id);

        if (oldIndex !== -1) {
          const updatedActors = [...actors];
          const movedActor = { ...activeActor };

          // Estimate the new order locally
          if (prevOrder !== undefined && nextOrder !== undefined) {
            movedActor.order = prevOrder + (nextOrder - prevOrder) / 2;
          } else if (prevOrder !== undefined) {
            movedActor.order = prevOrder + 1000;
          } else if (nextOrder !== undefined) {
            movedActor.order = nextOrder - 1000;
          }

          // Remove the actor from its old position
          updatedActors.splice(oldIndex, 1);

          // Insert the actor at its new position
          updatedActors.splice(
            newIndex > oldIndex ? newIndex - 1 : newIndex,
            0,
            movedActor,
          );

          // Update the state
          setActors(updatedActors);
        }
      } else {
        // Coming from another page, refresh to show updated data
        refetchActors();
      }
    }
    // Handle drop on empty space or when coming from another page
    else if (dropTargetIndex !== null && (dragSourcePage !== page || !over)) {
      let prevOrder: number | undefined;
      let nextOrder: number | undefined;

      // Get orders of adjacent actors
      if (dropTargetIndex > 0) {
        prevOrder = actors[dropTargetIndex - 1].order;
      }

      if (dropTargetIndex < actors.length) {
        nextOrder = actors[dropTargetIndex].order;
      }

      // If dropping at the end
      if (dropTargetIndex >= actors.length) {
        if (actors.length > 0) {
          prevOrder = actors[actors.length - 1].order;
          nextOrder = undefined;
        }
      }

      // Update the database
      await updateActorOrder(activeActor._id, prevOrder, nextOrder);

      // Always refetch when dropping across pages
      if (dragSourcePage !== page) {
        refetchActors();
      }
    }

    setActiveId(null);
    setActiveActor(null);
    setIsDragging(false);
    setDragSourcePage(null);
    setDropTargetIndex(null);
  };

  return (
    <div className="mb-12 px-[3vw]">
      <div className="my-1 flex px-1">
        <h1 className="text-3xl font-semibold">Actors</h1>
        <IconButton color="primary" onClick={handleAdd}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="flex w-full justify-center">
        <div className="mt-2 mb-4 flex w-full max-w-[1660px] gap-2">
          <SortSelect type="actors" setLoaded={setIsLoaded} />
          <ButtonGroup>
            <IconButton onClick={handleRandom}>
              <Shuffle />
            </IconButton>
            <IconButton onClick={handleRandomBack} disabled={!isRandom}>
              <ArrowBack />
            </IconButton>
          </ButtonGroup>
        </div>
      </div>
      {isLoaded ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={actors.map((actor) => actor._id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid-fit-1 sm:grid-fit-015 mx-auto grid max-w-[1660px] gap-4 md:gap-6">
              {actors.map((actor, index) => (
                <div
                  key={actor._id}
                  data-actor-card
                  className={`relative ${dropTargetIndex === index && isDragging && dragSourcePage !== page ? "rounded-lg ring-2 ring-blue-500" : ""}`}
                >
                  <SortableActorCard
                    key={actor._id}
                    actor={actor}
                    isDragging={isDragging}
                    onEdit={(e) => {
                      setActorToEdit(actor);
                      setAnchorEl(e.currentTarget);
                    }}
                  />
                  {/* Insert indicator line when dragging from another page */}
                  {dropTargetIndex === index &&
                    isDragging &&
                    dragSourcePage !== page && (
                      <div className="absolute top-0 left-0 z-10 h-1 w-full bg-blue-500"></div>
                    )}
                </div>
              ))}

              {/* Add a final drop zone at the end of the list */}
              {isDragging && dragSourcePage !== page && actors.length > 0 && (
                <div
                  data-actor-card
                  className={`relative h-24 rounded-lg border-2 border-dashed ${dropTargetIndex === actors.length ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                  style={{ gridColumn: "span 1" }}
                >
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Drop here to place at end
                  </div>
                </div>
              )}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId && activeActor ? (
              <ActorCard actor={activeActor}>
                <IconButton
                  onClick={(e) => {
                    setActorToEdit(activeActor);
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
            ) : null}
          </DragOverlay>
        </DndContext>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Actors;
