import { useEffect, useState } from "react";
import { ImageList, ImageListItem } from "@mui/material";
import { LabelData } from "../../utils/customTypes";
import config from "../../utils/config";
import PreloadingImage from "../PreloadingImage";

const MovieImages = ({ code }: { code: string }) => {
  const [codeLabel, codeNum] = code.split("-");
  const codeNumPadded = codeNum.padStart(5, "0");
  const [labelData, setLabelData] = useState<LabelData>({} as LabelData);
  const max10Labels = ["chn", "bgn", "gni", "dlv", "fway"];
  const length =
    codeLabel.startsWith("ab") || max10Labels.includes(codeLabel) ? 10 : 20;

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
    const prestigeLabels = ["chn", "bgn", "gni", "dlv"];
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
    <ImageList variant="masonry" cols={3} gap={8}>
      {codeLabel === "rebd" &&
        Array.from({ length: 12 }, (_, i) => (
          <ImageListItem key={`img ${i}`}>
            <img
              src={`https://file.rebecca-web.com/media/videos/dl02/rebd_${codeNum}/b${(i + 1).toString().padStart(2, "0")}_pc2.jpg`}
              alt={`img ${i + 1}`}
            />
          </ImageListItem>
        ))}
      {Array.from({ length }, (_, i) => (
        <ImageListItem key={`img ${i}`}>
          <PreloadingImage
            src={getImgSrc((i + 1).toString())}
            alt={`img ${i}`}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default MovieImages;
