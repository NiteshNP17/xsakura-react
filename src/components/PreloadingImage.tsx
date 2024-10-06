import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { PhotoView } from "react-photo-view";

const PreloadingImage = ({
  src,
  smSrc,
  alt,
  onClick,
}: {
  src: string;
  smSrc: string;
  alt: string;
  onClick?: () => void;
}) => {
  const [imageDetails, setImageDetails] = useState({
    loaded: false,
    width: 0,
    height: 0,
    shouldRender: false,
  });

  useEffect(() => {
    const img = new Image();
    img.src = smSrc;

    img.onload = () => {
      setImageDetails({
        loaded: true,
        width: img.width,
        height: img.height,
        shouldRender: img.width > 100,
      });
    };

    img.onerror = () => {
      setImageDetails({
        loaded: true,
        width: 0,
        height: 0,
        shouldRender: false,
      });
    };

    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [smSrc]);

  if (!imageDetails.loaded) {
    return (
      <CircularProgress
        size={"2rem"}
        sx={{ display: "flex", mx: "auto", my: 2 }}
      />
    );
  }

  if (!imageDetails.shouldRender) {
    return;
  }

  return (
    <PhotoView src={src}>
      <img
        src={smSrc}
        alt={alt}
        width={imageDetails.width}
        height={imageDetails.height}
        onClick={onClick}
        loading="lazy"
        className="h-auto"
      />
    </PhotoView>
  );
};

export default PreloadingImage;
