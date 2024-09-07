import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import config from "../utils/config";
import { AlbumData } from "../utils/customTypes";
import {
  CircularProgress,
  ImageList,
  Pagination,
  useMediaQuery,
} from "@mui/material";
import ImageDialog from "../components/Dialogs/ImageDialog";

const AlbumPage = () => {
  const albumSlug = useParams().slug;
  const [albumData, setAlbumData] = useState<AlbumData>({} as AlbumData);
  const [loading, setLoading] = useState(true);
  const totalPagesRef = useRef<number>(0);
  const [urlParams, setUrlParams] = useSearchParams();
  const page = parseInt(urlParams.get("p") || "1");
  const isMobile = useMediaQuery("(max-width:660px)");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageToShow, setImageToShow] = useState(0);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/albums/${albumSlug}?page=${page}`,
        );
        setAlbumData(res.data.album);
        totalPagesRef.current = res.data.totalPages;
        setLoading(false);
      } catch (err) {
        alert("error fetching album data: " + err);
      }
    };

    fetchAlbumData();
  }, [albumSlug, page]);

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

  return !loading ? (
    <div className="mx-auto mb-24 max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold capitalize">
          Album {albumData.name}
        </h1>
      </div>
      <div className="mx-auto max-w-7xl">
        <ImageList variant="standard" cols={isMobile ? 2 : 5} gap={24}>
          {albumData.images?.map((imageData, index) => (
            <img
              key={imageData.imgCode}
              src={`https://${albumData.domain}/th/${albumData.galleryCode}/${imageData.imgCode}.jpg`}
              alt={"image " + index}
              className="my-auto bg-gray-500"
              onClick={() => {
                setImageToShow(index);
                setOpenImageDialog(true);
              }}
            />
          ))}
        </ImageList>
      </div>
      <div className="my-12 flex w-full justify-center">
        <Pagination
          count={totalPagesRef.current}
          size="large"
          color="primary"
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <ImageDialog
        albumData={albumData}
        open={openImageDialog}
        setOpen={setOpenImageDialog}
        index={imageToShow}
      />
    </div>
  ) : (
    <div className="grid h-96 w-full place-content-center">
      <CircularProgress size="4rem" />
    </div>
  );
};

export default AlbumPage;
