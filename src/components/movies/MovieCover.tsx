import { useEffect, useRef, useState } from "react";
import config from "../../utils/config";

interface MovieCoverProps {
  code: string;
  overrides?: {
    cover?: string;
    preview?: string;
  };
  isForm?: boolean;
}

const MovieCover: React.FC<MovieCoverProps> = ({ code, overrides, isForm }) => {
  const [hoverCode, setHoverCode] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState<boolean>(true);
  const [imgSrc, setImgSrc] = useState(
    `https://fivetiu.com/${code}/cover-t.jpg`,
  );
  const vidRef = useRef<HTMLVideoElement>(null);

  const handlePointerEnter = (code: string | null) => {
    code
      ? setHoverCode(code)
      : setTimeout(() => {
          setHoverCode(null);
        }, 350);
  };

  useEffect(() => {
    setImgLoaded(true);
  }, [code, overrides]);

  const fetchDmmSrc = async (code: string) => {
    const [codeLabel, codeNum] = code.split("-");
    const prestigeLabels = ["ab", "chn", "bgn", "gni", "dlv", "fit"];
    const noPreLabels = ["waaa", "mih"];
    let dmmSrc;

    if (codeLabel === "rebd") {
      dmmSrc = `https://file.rebecca-web.com/media/videos/dl03/rebd_${codeNum}/b01_pc2.jpg`;
    } else if (prestigeLabels.some((sub) => codeLabel.startsWith(sub))) {
      dmmSrc = `https://image.mgstage.com/images/prestige/${codeLabel}/${codeNum}/pb_e_${codeLabel}-${codeNum}.jpg`;
    } else if (noPreLabels.includes(codeLabel)) {
      dmmSrc = `https://pics.dmm.co.jp/mono/movie/adult/${codeLabel}${codeNum}/${codeLabel}${codeNum}pl.jpg`;
    } else {
      const codeNumPadded = codeNum.padStart(5, "0");

      // Fetch label data from the API
      const response = await fetch(
        `${config.apiUrl}/${codeLabel}?codenum=${codeNum}`,
      );
      const labelData = await response.json();

      // Construct the correct image URL based on the codeLabel
      dmmSrc = `https://pics.dmm.co.jp/digital/video/${
        labelData.prefix || ""
      }${codeLabel}${labelData.is3digits ? codeNum : codeNumPadded}/${
        labelData.prefix || ""
      }${codeLabel}${labelData.is3digits ? codeNum : codeNumPadded}pl.jpg`;
    }
    setImgSrc(dmmSrc);
  };

  const vidClassesBuilder = () => {
    let classes =
      "absolute object-cover opacity-0 transition-opacity duration-300 hover:opacity-100 ";
    if (overrides?.preview?.includes("sexlikereal")) {
      classes += "h-[120%]";
    } else if (
      overrides?.preview?.includes("vrsample") ||
      (!overrides?.preview && code.includes("vr"))
    ) {
      classes += "h-[152%] object-left";
    } else if (overrides?.preview?.includes("sweet-angels")) {
      classes += "h-[175%] object-[20px_40px]";
    } else {
      classes += "h-full";
    }
    return classes;
  };

  return imgLoaded ? (
    // return (
    <div
      onMouseEnter={() => handlePointerEnter(code)}
      onTouchStart={() => handlePointerEnter(code)}
      onMouseLeave={() => handlePointerEnter(null)}
      className="relative flex aspect-[3/1.98] max-w-full items-center justify-center overflow-hidden"
    >
      {hoverCode === code && (
        <video
          ref={vidRef}
          autoPlay
          loop
          muted
          preload="none"
          className={vidClassesBuilder()}
          height="100%"
          onCanPlay={() => {
            if (
              vidRef.current &&
              (overrides?.preview?.startsWith("https://cc3001") ||
                overrides?.preview?.startsWith("https://file.rebecca"))
            )
              vidRef.current.playbackRate = 1.5;
          }}
        >
          <source
            src={
              overrides?.preview || `https://fivetiu.com/${code}/preview.mp4`
            }
            type="video/mp4"
          />
        </video>
      )}
      <img
        className="h-full bg-slate-200 object-cover object-right dark:bg-zinc-600"
        src={
          overrides?.cover
            ? overrides?.cover
            : isForm
              ? `https://fivetiu.com/${code}/cover-t.jpg`
              : imgSrc
        }
        alt={code.toUpperCase()}
        width="100%"
        loading="lazy"
        onError={() => {
          if (isForm) setImgLoaded(false);
          else fetchDmmSrc(code);
        }}
      />
    </div>
  ) : (
    <div className="grid aspect-[3/1.98] w-full place-content-center bg-slate-200 text-center text-2xl font-semibold text-slate-400 dark:bg-zinc-600">
      IMAGE NOT FOUND
      <br />
      {code.toUpperCase()}
    </div>
  );
  // );
};

export default MovieCover;
