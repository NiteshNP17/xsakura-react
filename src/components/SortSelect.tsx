import North from "@mui/icons-material/North";
import South from "@mui/icons-material/South";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface SortSelectProps {
  type: "actors" | "movies";
  setLoaded: (isLoaded: boolean) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ type, setLoaded }) => {
  const [urlParams, setUrlParams] = useSearchParams();
  const sort =
    urlParams.get("sort") || localStorage.getItem("actorSort") || "added";
  const sortDirection =
    urlParams.get("sortd") || localStorage.getItem("actorSortD") || "asc";

  const handleSortChange = (e: SelectChangeEvent) => {
    setLoaded(false);
    const params = new URLSearchParams(urlParams);
    params.set("sort", e.target.value as string);
    setUrlParams(params);
    if (type === "actors")
      localStorage.setItem("actorSort", e.target.value as string);
  };

  const handleDirectionChange = () => {
    setLoaded(false);
    const params = new URLSearchParams(urlParams);
    if (params.get("sortd") !== "desc") {
      params.set("sortd", "desc");
      type === "actors" && localStorage.setItem("actorSortD", "desc");
    } else {
      params.set("sortd", "asc");
      localStorage.removeItem("actorSortD");
    }
    setUrlParams(params);
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
          <MenuItem value={"name"}>Name</MenuItem>
          <MenuItem value={"_id"}>Added</MenuItem>
          <MenuItem value={"numMovies"}>Movie Count</MenuItem>
          {/* <MenuItem value={"ageAtLatestRelease"}>Age</MenuItem> */}
          <MenuItem value={"dob"}>DOB</MenuItem>
          <MenuItem value={"ageAtLatestRel"}>Age</MenuItem>
          <MenuItem value={"height"}>Height</MenuItem>
          {/* <MenuItem value={"yearsActive"}>Active</MenuItem> */}
          <MenuItem value={"cup"}>Cup</MenuItem>
          <MenuItem value={"sizes.bust"}>Bust</MenuItem>
          <MenuItem value={"sizes.waist"}>Waist</MenuItem>
          <MenuItem value={"sizes.hips"}>Hips</MenuItem>
          <MenuItem value={"order"}>Custom</MenuItem>
          <MenuItem value={"came"}>Came</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleDirectionChange}
        sx={{ px: 0, color: "gray" }}
      >
        {sortDirection === "asc" ? <South /> : <North />}
      </Button>
    </>
  );
};

export default SortSelect;
