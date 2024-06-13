import { useState, useEffect } from "react";
import config from "../../utils/config";

interface TrailerProps {
  code: string;
  posterSm?: boolean;
  reload?: boolean;
}

const Trailer: React.FC<TrailerProps> = ({ code, posterSm, reload }) => {
  const [codePrefix, codeNum] = code.split("-");
  const baseUrl = "https://cc3001.dmm.co.jp/litevideo/freepv/";
  const posterSrc = `https://fivetiu.com/${code}/cover-${
    posterSm ? "t" : "n"
  }.jpg`;

  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const getPrefixData = async () => {
      try {
        const res = await fetch(
          `${config.apiUrl}/lookups/pre/${codePrefix}?codenum=${codeNum}`,
        );
        const data = await res.json();

        const codeNumPadded =
          "0".repeat(Math.max(0, (data.is3Digits ? 3 : 5) - codeNum.length)) +
          codeNum;
        const longCode = `${data.prePre || ""}${codePrefix}${codeNumPadded}`;

        const newVideoSrc = `${baseUrl}${longCode[0]}/${longCode.slice(
          0,
          3,
        )}/${longCode}/${longCode}${data.isDmb ? "_dmb_w" : "mhb"}.mp4`;

        setVideoSrc(newVideoSrc);

        console.log("Trailer link: ", newVideoSrc);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    getPrefixData();
  }, [codePrefix, codeNum, code, reload]);

  return videoSrc ? (
    <video
      src={videoSrc}
      controls
      poster={posterSrc}
      className={`${
        posterSm ? "aspect-[16/10]" : "aspect-video"
      } w-full bg-black object-contain`}
      // md:h-[60cqh]
      onError={() =>
        console.log("🎥 A trailer was not found for", code.toUpperCase())
      }
    />
  ) : (
    <p>Loading video...</p>
  );
};

export default Trailer;
