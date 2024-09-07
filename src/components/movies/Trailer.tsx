import { useState, useEffect } from "react";
import config from "../../utils/config";
import CircularProgress from "@mui/material/CircularProgress";

interface TrailerProps {
  code: string;
  posterSm?: boolean;
  reload?: boolean;
}

interface PrefixData {
  prePre?: string;
  isDmb: boolean;
  isHq: boolean;
}

const Trailer: React.FC<TrailerProps> = ({ code, posterSm, reload }) => {
  const [codePrefix, codeNum] = code.split("-");
  const baseUrl = "https://cc3001.dmm.co.jp/litevideo/freepv/";
  // posterSm ? "t" : "n"

  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isPaddedUrl, setIsPaddedUrl] = useState<boolean>(false);
  const [prefixData, setPrefixData] = useState<PrefixData | null>(null);
  const [isLoaded, setLoaded] = useState(false);
  const [posterSrc, setPosterSrc] = useState("");
  const absLabels = ["ab", "mbr", "chn", "bgn", "gni", "dlv", "t38"];

  useEffect(() => {
    const getPrefixData = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${config.apiUrl}/lookups/pre/${codePrefix}?codenum=${codeNum}`,
        );
        const data: PrefixData = await res.json();
        setPrefixData(data);

        const longCode = `${data.prePre || ""}${codePrefix}`;

        const createVideoSrc = (num: string): string =>
          `${baseUrl}${longCode[0]}/${longCode.slice(0, 3)}/${longCode}${num}/${longCode}${num}${data.isDmb ? "_dmb_w" : data.isHq ? "hhb" : "mhb"}.mp4`;
        const newVideoSrc = createVideoSrc(codeNum);
        setVideoSrc(newVideoSrc);

        // Calculate poster URL
        const codeNumPadded: string = codeNum.padStart(5, "0");
        const paddedLongCode: string = `${data.prePre || ""}${codePrefix}${codeNumPadded}`;
        const newPosterSrc = absLabels.some((sub) => codePrefix.startsWith(sub))
          ? `https://pics.dmm.co.jp/mono/movie/adult/${longCode}${codeNum}/${longCode}${codeNum}pl.jpg`
          : `https://pics.dmm.co.jp/digital/video/${paddedLongCode}/${paddedLongCode}pl.jpg`;

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
  }, [codePrefix, codeNum, code, reload, posterSm]);

  const handleVideoError = (): void => {
    if (!isPaddedUrl && prefixData) {
      const codeNumPadded: string =
        "0".repeat(Math.max(0, 5 - codeNum.length)) + codeNum;
      const longCode: string = `${prefixData.prePre || ""}${codePrefix}`;
      const paddedVideoSrc: string = `${baseUrl}${longCode[0]}/${longCode.slice(
        0,
        3,
      )}/${longCode}${codeNumPadded}/${longCode}${codeNumPadded}${prefixData.isDmb ? "_dmb_w" : prefixData.isHq ? "hhb" : "mhb"}.mp4`;

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
        posterSm
          ? "aspect-[3/1.98] object-cover"
          : "aspect-video object-contain"
      } w-full bg-black`}
      onError={handleVideoError}
    />
  ) : (
    <div
      className={`${
        posterSm ? "aspect-[16/10]" : "aspect-video"
      } grid h-full w-full place-content-center bg-black text-white`}
    >
      <CircularProgress size="4rem" color="inherit" />
    </div>
  );
};

export default Trailer;
