import { useEffect, useState } from "react";
// import { Dialog, ImageList, ImageListItem } from "@mui/material";
import { LabelData } from "../../utils/customTypes";
import config from "../../utils/config";
import PreloadingImage from "../PreloadingImage";
import { PhotoProvider, PhotoView } from "react-photo-view";

const MovieImages = ({ code }: { code: string }) => {
  const [codeLabel, codeNum] = code.split("-");
  const codeNumPadded = codeNum.padStart(5, "0");
  const [labelData, setLabelData] = useState<LabelData>({} as LabelData);
  // const [open, setOpen] = useState(false);
  // const [imgToShow, setImgToShow] = useState("");

  useEffect(() => {
    const getLabelData = async (label: string) => {
      // Fetch label data from the API
      const res = await fetch(
        `${config.apiUrl}/lookups/label/${label}?codenum=${codeNum}`,
      );
      const data = await res.json();
      setLabelData(data);
    };

    getLabelData(codeLabel);
  }, [codeLabel]);

  const getImgSrc = (i: string, sm?: boolean): string => {
    const noPadLabels = ["prby", "onex"];
    const prestigeLabels = ["chn", "bgn", "gni", "dlv", "wps", "fit"];
    if (codeLabel.startsWith("ab") || prestigeLabels.includes(codeLabel)) {
      return `https://pics.dmm.co.jp/digital/video/118${codeLabel}${codeNum}/118${codeLabel}${codeNum}${!sm ? "jp" : ""}-${i}.jpg`;
    } else {
      return `https://pics.dmm.co.jp/digital/video/${
        labelData.imgPre || labelData.prefix || ""
      }${codeLabel}${noPadLabels.includes(codeLabel) ? codeNum : codeNumPadded}/${
        labelData.imgPre || labelData.prefix || ""
      }${codeLabel}${noPadLabels.includes(codeLabel) ? codeNum : codeNumPadded}${!sm ? "jp" : ""}-${i}.jpg`;
    }
  };

  return (
    <PhotoProvider maskOpacity={0.5}>
      <div className="grid max-h-[50vh] w-full grid-cols-4 items-center overflow-scroll">
        {codeLabel === "rebd" &&
          Array.from({ length: 12 }, (_, i) => (
            <PhotoView
              key={`rebd-img-${i}`}
              src={`https://file.rebecca-web.com/media/videos/dl02/rebd_${codeNum}/b${(i + 1).toString().padStart(2, "0")}_pc2.jpg`}
            >
              <img
                src={`https://file.rebecca-web.com/media/videos/dl02/rebd_${codeNum}/b${(i + 1).toString().padStart(2, "0")}_pc2.jpg`}
                alt={`img ${i + 1}`}
              />
            </PhotoView>
          ))}
        {Array.from({ length: 20 }, (_, i) => (
          <PreloadingImage
            src={getImgSrc((i + 1).toString())}
            smSrc={getImgSrc((i + 1).toString(), true)}
            alt={`img ${i}`}
          />
        ))}
      </div>
    </PhotoProvider>
  );
};

export default MovieImages;
