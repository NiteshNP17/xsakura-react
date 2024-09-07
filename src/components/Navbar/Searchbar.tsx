import { Search } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = (
      document.getElementById("searchInput") as HTMLInputElement
    )?.value;

    console.log("search query: ", searchQuery);

    searchQuery.length > 1 && navigate(`/search?q=${searchQuery}`);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "clamp(100px, 30vw, 280px)",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        id="searchInput"
      />
      <IconButton type="submit">
        <Search />
      </IconButton>
    </Paper>
  );
};

export default Searchbar;
