import { useState, useEffect } from "react";
import config from "../../utils/config";

interface TrailerProps {
  code: string;
  posterSm?: boolean;
  reload?: boolean;
}

interface PrefixData {
  prePre?: string;
  isDmb: boolean;
}

const Trailer: React.FC<TrailerProps> = ({ code, posterSm, reload }) => {
  const [codePrefix, codeNum] = code.split("-");
  const baseUrl = "https://cc3001.dmm.co.jp/litevideo/freepv/";
  const posterSrc = `https://fivetiu.com/${code}/cover-${
    posterSm ? "t" : "n"
  }.jpg`;

  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isPaddedUrl, setIsPaddedUrl] = useState<boolean>(false);
  const [prefixData, setPrefixData] = useState<PrefixData | null>(null);

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
          `${baseUrl}${longCode[0]}/${longCode.slice(
            0,
            3,
          )}/${longCode}${num}/${longCode}${num}${data.isDmb ? "_dmb_w" : "mhb"}.mp4`;

        const newVideoSrc = createVideoSrc(codeNum);
        setVideoSrc(newVideoSrc);
        setIsPaddedUrl(false);

        console.log("Trailer link: ", newVideoSrc);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    getPrefixData();
  }, [codePrefix, codeNum, code, reload]);

  const handleVideoError = (): void => {
    if (!isPaddedUrl && prefixData) {
      const codeNumPadded: string =
        "0".repeat(Math.max(0, 5 - codeNum.length)) + codeNum;
      const longCode: string = `${prefixData.prePre || ""}${codePrefix}`;
      const paddedVideoSrc: string = `${baseUrl}${longCode[0]}/${longCode.slice(
        0,
        3,
      )}/${longCode}${codeNumPadded}/${longCode}${codeNumPadded}${prefixData.isDmb ? "_dmb_w" : "mhb"}.mp4`;

      setVideoSrc(paddedVideoSrc);
      setIsPaddedUrl(true);
      console.log("Attempting to load padded video URL: ", paddedVideoSrc);
    } else {
      console.log("🎥 A trailer was not found for", code.toUpperCase());
      // Here you can set a default image or show an error message
    }
  };

  return (
    <video
      src={videoSrc}
      controls
      poster={posterSrc}
      className={`${
        posterSm ? "aspect-[16/10]" : "aspect-video"
      } w-full bg-black object-contain`}
      onError={handleVideoError}
    />
  );
};

export default Trailer;
