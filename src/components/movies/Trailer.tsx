import { useState, useEffect } from "react";
import config from "../../utils/config";
import CircularProgress from "@mui/material/CircularProgress";

interface TrailerProps {
  code: string;
  posterSm?: boolean;
  reload?: boolean;
}

interface PrefixData {
  prefix: string;
  imgPre: string;
  isDmb: boolean;
  isHq: boolean;
  isVr: boolean;
}

const Trailer: React.FC<TrailerProps> = ({ code, posterSm, reload }) => {
  const [codeLabel, codeNum] = code.split("-");
  const baseUrl = "https://cc3001.dmm.co.jp/litevideo/freepv/";
  // posterSm ? "t" : "n"

  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isPaddedUrl, setIsPaddedUrl] = useState<boolean>(false);
  const [prefixData, setPrefixData] = useState<PrefixData>({} as PrefixData);
  const [isLoaded, setLoaded] = useState(false);
  const [posterSrc, setPosterSrc] = useState("");
  const absLabels = [
    "ab",
    "mbr",
    "chn",
    "bgn",
    "gni",
    "dlv",
    "t38",
    "wps",
    "fit",
    "prby",
  ];

  const createVideoSrc = (
    num: string,
    isPadded: boolean,
    prefixData: PrefixData,
  ): string => {
    const longCode = `${prefixData.prefix || ""}${codeLabel}`;
    const codeNumPadded: string =
      "0".repeat(Math.max(0, 5 - codeNum.length)) + codeNum;
    let vidSuffix = "mhb";

    if (prefixData.isVr) vidSuffix = "vrlite";
    else if (prefixData.isDmb) vidSuffix = "_dmb_w";
    else if (prefixData.isHq) vidSuffix = "hhb";

    return `${!prefixData.isVr ? baseUrl : "//cc3001.dmm.co.jp/vrsample/"}${longCode[0]}/${longCode.slice(0, 3)}/${longCode}${isPadded ? codeNumPadded : num}/${longCode}${isPadded ? codeNumPadded : num}${vidSuffix}.mp4`;
  };

  useEffect(() => {
    const getPrefixData = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${config.apiUrl}/lookups/label/${codeLabel}?codenum=${codeNum}`,
        );
        const data: PrefixData = await res.json();
        setPrefixData(data);

        const newVideoSrc = !prefixData.isVr
          ? createVideoSrc(codeNum, false, data)
          : createVideoSrc(codeNum, true, data);
        setVideoSrc(newVideoSrc);

        // Calculate poster URL
        const longCode = `${data.prefix || ""}${codeLabel}`;
        const codeNumPadded: string = codeNum.padStart(5, "0");
        const imgPaddedLongCode: string = `${data.imgPre || data.prefix || ""}${codeLabel}${codeNumPadded}`;
        const newPosterSrc = absLabels.some((sub) => codeLabel.startsWith(sub))
          ? `https://pics.dmm.co.jp/mono/movie/adult/${longCode}${codeNum}/${longCode}${codeNum}p${posterSm ? "s" : "l"}.jpg`
          : `https://pics.dmm.co.jp/digital/video/${imgPaddedLongCode}/${imgPaddedLongCode}p${posterSm ? "s" : "l"}.jpg`;

        setPosterSrc(newPosterSrc);
        console.log("Poster link: ", newPosterSrc);

        setLoaded(true);
        setIsPaddedUrl(false);

        console.log("Trailer link: ", newVideoSrc);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    getPrefixData();
  }, [codeLabel, codeNum, code, reload, posterSm]);

  const handleVideoError = (): void => {
    if (!isPaddedUrl && prefixData) {
      const paddedVideoSrc: string = createVideoSrc(codeNum, true, prefixData);
      setVideoSrc(paddedVideoSrc);
      setIsPaddedUrl(true);
      console.log("Attempting to load padded video URL: ", paddedVideoSrc);
    } else {
      console.log("🎥 A trailer was not found for", code.toUpperCase());
      // Here you can set a default image or show an error message
    }
  };

  return isLoaded ? (
    <video
      src={videoSrc}
      controls
      poster={posterSrc}
      className={`${
        posterSm ? "aspect-[3/1.98]" : "aspect-video"
      } w-full bg-black object-contain`}
      onError={handleVideoError}
    />
  ) : (
    <div
      className={`${
        posterSm ? "aspect-[3/1.98]" : "aspect-video"
      } grid h-full w-full place-content-center bg-black text-white`}
    >
      <CircularProgress size="4rem" color="inherit" />
    </div>
  );
};

export default Trailer;
