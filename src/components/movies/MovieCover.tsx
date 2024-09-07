import { useEffect, useState } from "react";
// import { useState } from "react";
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
    const prestigeLabels = ["ab", "chn", "bgn", "gni", "dlv"];
    const noPreLabels = ["waaa", "mih"];
    let dmmSrc;

    if (prestigeLabels.some((sub) => codeLabel.startsWith(sub))) {
      dmmSrc = `https://pics.dmm.co.jp/mono/movie/adult/118${codeLabel}${codeNum}/118${codeLabel}${codeNum}pl.jpg`;
    } else if (noPreLabels.includes(codeLabel)) {
      dmmSrc = `https://pics.dmm.co.jp/mono/movie/adult/${codeLabel}${codeNum}/${codeLabel}${codeNum}pl.jpg`;
    } else {
      const codeNumPadded = codeNum.padStart(5, "0");

      // Fetch label data from the API
      const response = await fetch(
        `${config.apiUrl}/lookups/pre/${codeLabel}?codenum=${codeNum}`,
      );
      const labelData = await response.json();

      // Construct the correct image URL based on the codeLabel
      dmmSrc = `https://pics.dmm.co.jp/digital/video/${
        labelData.prePre || ""
      }${codeLabel}${codeNumPadded}/${
        labelData.prePre || ""
      }${codeLabel}${codeNumPadded}pl.jpg`;
    }
    setImgSrc(dmmSrc);
  };

  return imgLoaded ? (
    // return (
    <div
      onMouseEnter={() => handlePointerEnter(code)}
      onTouchStart={() => handlePointerEnter(code)}
      onMouseLeave={() => handlePointerEnter(null)}
      className="relative flex aspect-[3/1.98] max-w-full justify-center overflow-hidden"
    >
      {hoverCode === code && (
        <video
          autoPlay
          loop
          muted
          preload="none"
          className={`absolute ${overrides?.preview && overrides.preview.includes("sexlikereal") ? "h-[120%]" : "h-full"} object-cover opacity-0 transition-opacity duration-300 hover:opacity-100`}
          height="100%"
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
        className="bg-slate-200 object-cover dark:bg-zinc-600"
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
