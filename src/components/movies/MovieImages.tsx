import { useEffect, useState } from "react";
import { Dialog, ImageList, ImageListItem } from "@mui/material";
import { LabelData } from "../../utils/customTypes";
import config from "../../utils/config";
import PreloadingImage from "../PreloadingImage";

const MovieImages = ({ code }: { code: string }) => {
  const [codeLabel, codeNum] = code.split("-");
  const codeNumPadded = codeNum.padStart(5, "0");
  const [labelData, setLabelData] = useState<LabelData>({} as LabelData);
  const [open, setOpen] = useState(false);
  const [imgToShow, setImgToShow] = useState("");

  useEffect(() => {
    const getLabelData = async (label: string) => {
      // Fetch label data from the API
      const res = await fetch(
        `${config.apiUrl}/lookups/pre/${label}?codenum=${codeNum}`,
      );
      const data = await res.json();
      setLabelData(data);
    };

    getLabelData(codeLabel);
  }, [codeLabel]);

  const getImgSrc = (i: string): string => {
    const noPadLabels = ["abc"];
    const prestigeLabels = ["chn", "bgn", "gni", "dlv", "wps", "fit"];
    if (codeLabel.startsWith("ab") || prestigeLabels.includes(codeLabel)) {
      return `https://pics.dmm.co.jp/digital/video/118${codeLabel}${codeNum}/118${codeLabel}${codeNum}jp-${i}.jpg`;
    } else {
      return `https://pics.dmm.co.jp/digital/video/${
        labelData.prePre || ""
      }${codeLabel}${noPadLabels.includes(codeLabel) ? codeNum : codeNumPadded}/${
        labelData.prePre || ""
      }${codeLabel}${noPadLabels.includes(codeLabel) ? codeNum : codeNumPadded}jp-${i}.jpg`;
    }
  };

  return (
    <>
      <ImageList variant="masonry" cols={3} gap={8}>
        {codeLabel === "rebd" &&
          Array.from({ length: 12 }, (_, i) => (
            <ImageListItem key={`img ${i}`}>
              <img
                src={`https://file.rebecca-web.com/media/videos/dl02/rebd_${codeNum}/b${(i + 1).toString().padStart(2, "0")}_pc2.jpg`}
                alt={`img ${i + 1}`}
                onClick={() => {
                  setImgToShow(
                    `https://file.rebecca-web.com/media/videos/dl02/rebd_${codeNum}/b${(i + 1).toString().padStart(2, "0")}_pc2.jpg`,
                  );
                  setOpen(true);
                }}
              />
            </ImageListItem>
          ))}
        {Array.from({ length: 20 }, (_, i) => (
          <ImageListItem key={`img ${i}`}>
            <PreloadingImage
              src={getImgSrc((i + 1).toString())}
              alt={`img ${i}`}
              onClick={() => {
                setImgToShow(getImgSrc((i + 1).toString()));
                setOpen(true);
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <img src={imgToShow} alt="Opened Image" />
      </Dialog>
    </>
  );
};

export default MovieImages;
