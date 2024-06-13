import { Search } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";

const Searchbar = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = (
      document.getElementById("searchInput") as HTMLInputElement
    )?.value;

    console.log("search query: ", searchQuery);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
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
