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
  const [noPrev, setNoPrev] = useState<boolean>(false);
  const isLocal = window.location.href.startsWith("http://");
  const [imageDetails, setImageDetails] = useState({
    loaded: false,
    width: 0,
    height: 0,
    shouldRender: false,
  });
  const [imgSrc, setImgSrc] = useState(() =>
    isLocal
      ? `http://javpop.com/img/${code.split("-")[0]}/${code}_poster.jpg`
      : `https://fourhoi.com/${code}/cover-t.jpg`,
  );

  let img2show = imgSrc;
  if (overrides?.cover) {
    img2show = overrides?.cover;
  } else if (isForm || code.startsWith("fc2")) {
    img2show = `https://fourhoi.com/${code}/cover-t.jpg`;
  } else if (code.includes("vr")) {
    const [codeLabel, codeNum] = code.split("-");
    const codeNumPadded = codeNum.padStart(5, "0");

    img2show = `https://pics.pornfhd.com/s/digital/video/${codeLabel}${codeNumPadded}/${codeLabel}${codeNumPadded}pl.jpg`;
  }

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

    const img = new Image();
    img.src = img2show;

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

    isForm && setNoPrev(false);

    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [code, overrides, isForm, img2show]);

  const fetchDmmSrc = async (code: string) => {
    const [codeLabel, codeNum] = code.split("-");
    const prestigeLabels = ["ab", "chn", "bgn", "gni", "dlv", "fit"];
    const noPreLabels = ["waaa", "mih"];
    let dmmSrc;

    if (codeLabel === "fc2") {
      return;
    } else if (codeLabel === "rebd") {
      dmmSrc = `https://file.rebecca-web.com/media/videos/dl01/rebd_${codeNum}/b01_pc2.jpg`;
    } else if (prestigeLabels.some((sub) => codeLabel.startsWith(sub))) {
      dmmSrc = `https://image.mgstage.com/images/prestige/${codeLabel}/${codeNum}/pb_e_${codeLabel}-${codeNum}.jpg`;
    } else if (noPreLabels.includes(codeLabel)) {
      dmmSrc = `https://pics.dmm.co.jp/mono/movie/adult/${codeLabel}${codeNum}/${codeLabel}${codeNum}pl.jpg`;
    } else {
      const codeNumPadded = codeNum.padStart(5, "0");

      // Fetch label data from the API
      const response = await fetch(
        `${config.apiUrl}/labels/${codeLabel}?codenum=${codeNum}`,
      );
      const labelData = await response.json();

      // Construct the correct image URL based on the codeLabel
      dmmSrc = `https://pics.dmm.co.jp/digital/video/${
        labelData.imgPre || labelData.prefix || ""
      }${codeLabel}${labelData.is3digits ? codeNum : codeNumPadded}/${
        labelData.imgPre || labelData.prefix || ""
      }${codeLabel}${labelData.is3digits ? codeNum : codeNumPadded}pl.jpg`;
    }
    setImgSrc(dmmSrc);
  };

  const vidClassesBuilder = () => {
    let classes =
      "absolute left-1/2 -translate-x-1/2 object-cover opacity-0 transition-opacity duration-300 hover:opacity-100 ";
    if (
      overrides?.preview &&
      overrides?.preview?.toString().includes("sexlikereal")
    ) {
      classes += "h-[120%]";
    } else if (
      (overrides?.preview &&
        overrides?.preview?.toString().includes("vrsample")) ||
      (!overrides?.preview && code.includes("vr"))
    ) {
      classes += "h-[152%] object-left";
    } else if (
      overrides?.preview &&
      overrides?.preview?.toString().includes("sweet-angels")
    ) {
      classes += "h-[175%] object-[20px_40px]";
    } else {
      classes += "h-[101%]";
    }
    return classes;
  };

  return imgLoaded ? (
    // return (
    <div
      onMouseEnter={() => handlePointerEnter(code)}
      onTouchStart={() => handlePointerEnter(code)}
      onMouseLeave={() => handlePointerEnter(null)}
      className="relative flex aspect-[3/1.9] max-w-full items-center justify-center overflow-hidden"
    >
      {isForm && noPrev && (
        <div className="absolute rounded-lg bg-red-600 px-2 text-xl font-semibold">
          NO
        </div>
      )}
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
          onError={() => {
            isForm && setNoPrev(true);
          }}
        >
          <source
            src={
              overrides?.preview || `https://fourhoi.com/${code}/preview.mp4`
            }
            type="video/mp4"
          />
        </video>
      )}
      <img
        className={`h-full bg-slate-200 object-cover ${imageDetails.height > imageDetails.width * 1.25 ? "object-top" : "object-right"} dark:bg-zinc-600`}
        src={img2show}
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
    <div className="grid aspect-[3/1.9] w-full place-content-center bg-slate-200 text-center text-2xl font-semibold text-slate-400 dark:bg-zinc-600">
      IMAGE NOT FOUND
      <br />
      {code.toUpperCase()}
    </div>
  );
  // );
};

export default MovieCover;
