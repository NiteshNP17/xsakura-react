import { LabelData } from "../../utils/customTypes";
import PreloadingImage from "../PreloadingImage";
import { PhotoProvider, PhotoView } from "react-photo-view";

const MovieImages = ({
  code,
  labelData,
}: {
  code: string;
  labelData: LabelData;
}) => {
  const [codeLabel, codeNum] = code.split("-");
  const codeSuf = codeLabel === "ibw" ? "z" : "";
  const codeNumPadded = codeNum.padStart(5, "0");
  // const [open, setOpen] = useState(false);
  // const [imgToShow, setImgToShow] = useState("");

  const getImgSrc = (i: string, sm?: boolean): string => {
    const prestigeLabels = ["chn", "bgn", "gni", "dlv", "wps", "fit"];
    if (codeLabel.startsWith("ab") || prestigeLabels.includes(codeLabel)) {
      return `https://pics.dmm.co.jp/digital/video/118${codeLabel}${codeNum}/118${codeLabel}${codeNum}${!sm ? "jp" : ""}-${i}.jpg`;
    } else {
      return `https://pics.dmm.co.jp/digital/video/${
        labelData.imgPre || labelData.prefix || ""
      }${codeLabel}${labelData.is3digits ? codeNum : codeNumPadded}${codeSuf}/${
        labelData.imgPre || labelData.prefix || ""
      }${codeLabel}${labelData.is3digits ? codeNum : codeNumPadded}${codeSuf}${!sm ? "jp" : ""}-${i}.jpg`;
    }
  };

  const getRebdSrc = (i: number): string => {
    const codeNumInt = parseInt(codeNum);
    let dlNum = 1;
    if (codeNumInt < 889 && codeNumInt > 500) {
      dlNum = codeNumInt > 873 ? 3 : 2;
    }
    return `https://file.rebecca-web.com/media/videos/dl0${dlNum}/rebd_${codeNum}/b${i.toString().padStart(2, "0")}_pc2.jpg`;
  };

  return (
    <PhotoProvider maskOpacity={0.5}>
      <div className="grid max-h-[55vh] w-full grid-cols-4 items-center overflow-scroll">
        {codeLabel === "rebd" && (
          <>
            <PhotoView src={getRebdSrc(1)}>
              <img src={getRebdSrc(1)} alt={"rebd img 1"} />
            </PhotoView>
            {Array.from({ length: 9 }, (_, i) => (
              <PhotoView key={`rebd-img-${i}`} src={getRebdSrc(i + 3)}>
                <img src={getRebdSrc(i + 3)} alt={`img ${i + 3}`} />
              </PhotoView>
            ))}
            <PreloadingImage
              src={getRebdSrc(12)}
              smSrc={getRebdSrc(12)}
              alt="rebd img 12"
            />
          </>
        )}
        {Array.from({ length: 20 }, (_, i) => (
          <PreloadingImage
            key={`img-${i}`}
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
