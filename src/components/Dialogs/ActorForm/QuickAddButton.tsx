import { Add, Check } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useState } from "react";
import config from "../../../utils/config";

const QuickAddButton = ({
  code,
  actorId,
}: {
  code: string;
  actorId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const quickAdd = async (code: string) => {
    const dataToPost = {
      cast: JSON.stringify([actorId]),
      codes: code,
    };

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${config.apiUrl}/movies/batch-create`,
        dataToPost,
      );

      // Handle both response formats - direct results or nested results
      const results = res.data.results || res.data;

      if (results.success && results.success.includes(code)) {
        setIsDisabled(true);
      } else {
        const failureReason =
          results.failures &&
          results.failures.find(
            (f: { code: string; reason: string }) => f.code === code,
          )?.reason;
        console.error(
          `Error adding code ${code} - ${failureReason || "Unknown error"}`,
        );
      }
    } catch (err) {
      console.error(`error adding code ${code} - ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      // variant="contained"
      loading={isLoading}
      disabled={isDisabled}
      size="small"
      color={isDisabled ? "success" : "inherit"}
      onClick={() => quickAdd(code)}
    >
      {isDisabled ? <Check /> : <Add />}
    </LoadingButton>
  );
};

export default QuickAddButton;
