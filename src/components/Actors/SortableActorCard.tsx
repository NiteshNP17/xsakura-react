import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButton } from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import ActorCard from "./ActorCard";
import { ActorData } from "../../utils/customTypes";

interface SortableActorCardProps {
  actor: ActorData;
  isDragging?: boolean;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SortableActorCard({
  actor,
  isDragging: globalDragging,
  onEdit,
}: SortableActorCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: actor._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: globalDragging ? (isDragging ? "grabbing" : "default") : "grab",
    position: "relative" as const,
    touchAction: "none" as const,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative"
    >
      <ActorCard actor={actor}>
        <IconButton
          onClick={onEdit}
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
      {isDragging && (
        <div className="absolute inset-0 rounded bg-gray-200 opacity-10 dark:bg-gray-800"></div>
      )}
    </div>
  );
}
