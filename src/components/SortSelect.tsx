import { North, South } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface SortSelectProps {
  type: string;
}

const SortSelect: React.FC<SortSelectProps> = ({ type }) => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const sort =
    urlParams.get("sort") || localStorage.getItem("actorSort") || "added";

  const handleSortChange = (e: SelectChangeEvent) => {
    const params = new URLSearchParams(urlParams);
    params.set("sort", e.target.value as string);
    setUrlParams(params);
    if (type === "actors")
      localStorage.setItem("actorSort", e.target.value as string);
  };
  return (
    <>
      <FormControl>
        <InputLabel>Sort</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sort}
          size="small"
          label="Sort"
          sx={{ minWidth: "100px" }}
          onChange={handleSortChange}
        >
          <MenuItem value={"added"}>Added</MenuItem>
          <MenuItem value={"age"}>Age</MenuItem>
          <MenuItem value={"height"}>Height</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => {
          sortDirection === "asc"
            ? setSortDirection("desc")
            : setSortDirection("asc");
        }}
        sx={{ px: 0, color: "gray" }}
      >
        {sortDirection === "asc" ? <South /> : <North />}
      </Button>
    </>
  );
};

export default SortSelect;
