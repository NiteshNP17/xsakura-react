import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import { IconButton, InputAdornment } from "@mui/material";
import config from "../../../utils/config";
import { ActorData } from "../../../utils/customTypes";

type EditData = Omit<ActorData, "sizes"> & {
  sizes: string;
};

interface FADBProps {
  type: "dob" | "cup" | "sizes" | "height";
  formFields: EditData;
  cachedData: EditData;
  setFormFields: (formFields: EditData) => void;
  setCachedData: (cachedData: EditData) => void;
}

const FetchActorDataButton: React.FC<FADBProps> = ({
  type,
  formFields,
  setFormFields,
  cachedData,
  setCachedData,
}) => {
  // Function to handle fetching and setting data
  const handleFetchData = async (type: "dob" | "cup" | "sizes" | "height") => {
    // If we already have cached data, use it
    if (cachedData && cachedData[type]) {
      setFormFields({
        ...formFields,
        [type]: cachedData[type],
      });

      console.log("data exists: ", cachedData);

      return;
    }

    // Otherwise fetch from API
    try {
      const response = await fetch(
        `${config.apiUrl}/lookups/scrape-actor-data?actor=${formFields.name.replace(" ", "-")}`,
      );
      const data = await response.json();

      // Store in cache
      setCachedData(data.data);

      if (!data.data[type]) {
        return alert("no data exists for this type");
      }

      // Update form field
      setFormFields({
        ...formFields,
        [type]: data.data[type],
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("actor data not found");
    }
  };

  return (
    <InputAdornment position="end">
      <IconButton edge="end" onClick={() => handleFetchData(type)}>
        <PlayCircleOutline />
      </IconButton>
    </InputAdornment>
  );
};

export default FetchActorDataButton;
