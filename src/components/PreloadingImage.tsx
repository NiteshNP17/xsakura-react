import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

const PreloadingImage = ({
  src,
  alt,
  onClick,
}: {
  src: string;
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
    img.src = src;

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
  }, [src]);

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
    <img
      src={src}
      alt={alt}
      width={imageDetails.width}
      height={imageDetails.height}
      onClick={onClick}
      className="h-auto max-w-full"
    />
  );
};

export default PreloadingImage;
