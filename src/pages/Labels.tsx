import axios from "axios";
import { useEffect, useState } from "react";
import config from "../utils/config";
import { IconButton, Pagination } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import LabelsInput from "../components/Dialogs/LabelsInput";

interface LabelList {
  label: string;
  movieCount: number;
  name: string;
}

const Labels = () => {
  const [dataList, setDataList] = useState<LabelList[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<LabelList>(
    {} as LabelList,
  );
  const [urlParams, setUrlParams] = useSearchParams();
  const page = parseInt(urlParams.get("p") || "1");
  const [totalPages, setTotalPages] = useState(1);
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);

  const refetch = () => {
    setRefetchTrigger((prev) => !prev);
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

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/labels?page=${page}`);
        setDataList(res.data.labels);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching labels: ", err);
      }
    };

    fetchList();
  }, [page, refetchTrigger]);

  return (
    <div className="mx-auto max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase">Labels</h1>
      </div>
      <div className="grid-fit-2 gap-4">
        {dataList.map((label) => (
          <div
            key={label.label}
            className="group items-center text-center align-middle text-lg"
          >
            <Link to={`/movies?label=${label.label}&sort=code`}>
              {label.label.toUpperCase()}{" "}
              {label.name && <span className="opacity-75">{label.name} </span>}
              {label.movieCount}&nbsp;
            </Link>
            <div className="inline text-xs opacity-0 group-hover:opacity-100">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedLabel(label);
                  setOpen(true);
                }}
              >
                <Edit sx={{ fontSize: "1.15rem" }} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
      <div className="my-12 flex w-full justify-center">
        <Pagination
          count={totalPages}
          size="large"
          color="primary"
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <LabelsInput
        open={open}
        setOpen={setOpen}
        refetch={refetch}
        selectedLabel={selectedLabel}
      />
    </div>
  );
};

export default Labels;
