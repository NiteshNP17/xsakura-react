import { useState, useEffect, useCallback } from "react";
// import config from "../../utils/config";
import CircularProgress from "@mui/material/CircularProgress";
import MuxPlayer from "@mux/mux-player-react";
import { LabelData } from "../../utils/customTypes";

interface TrailerProps {
  code: string;
  posterSm?: boolean;
  reload?: boolean;
  title?: string;
  labelData: LabelData;
}

const Trailer: React.FC<TrailerProps> = ({
  code,
  posterSm,
  reload,
  title,
  labelData,
}) => {
  const [codeLabel, codeNum] = code.split("-");
  const codeSuf = codeLabel === "ibw" ? "z" : "";
  const baseUrl = "https://cc3001.dmm.co.jp/litevideo/freepv/";
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isPaddedUrl, setIsPaddedUrl] = useState<boolean>(false);
  // const [prefixData, setPrefixData] = useState<PrefixData>({} as PrefixData);
  const [isLoaded, setLoaded] = useState(false);
  const [posterSrc, setPosterSrc] = useState("");
  const rebdLabels = ["rebd", "naac", "prian"];

  const createVideoSrc = useCallback(
    (num: string, isPadded: boolean, prefixData: LabelData): string => {
      const longCode = `${prefixData.prefix || ""}${codeLabel}`;
      const codeNumPadded: string =
        "0".repeat(Math.max(0, 5 - codeNum.length)) + codeNum;
      let vidSuffix = "mhb";

      if (prefixData.isVr) vidSuffix = "vrlite";
      else if (prefixData.isDmb) vidSuffix = "_dmb_w";
      else if (prefixData.isHq) vidSuffix = "hhb";

      return `${!prefixData.isVr ? baseUrl : "https://cc3001.dmm.co.jp/vrsample/"}${longCode[0]}/${longCode.slice(0, 3)}/${longCode}${isPadded ? codeNumPadded : num}${codeSuf}/${longCode}${isPadded ? codeNumPadded : num}${codeSuf}${vidSuffix}.mp4`;
    },
    [codeLabel, codeNum, codeSuf],
  );

  useEffect(() => {
    const rebdLabels = ["rebd", "naac", "prian"];
    const codeNumInt = parseInt(codeNum);
    const getPrefixData = async (): Promise<void> => {
      try {
        const newVideoSrc = !labelData.isVr
          ? createVideoSrc(codeNum, false, labelData)
          : createVideoSrc(codeNum, true, labelData);
        setVideoSrc(newVideoSrc);

        // Calculate poster URL
        let newPosterSrc;

        if (codeLabel === "rebd") {
          let dlNum = 1;
          if (codeNumInt < 889 && codeNumInt > 500) {
            dlNum = codeNumInt > 873 ? 3 : 2;
          }
          newPosterSrc = `https://file.rebecca-web.com/media/videos/dl0${dlNum}/rebd_${codeNum}/b02_pc2.jpg`;
          setPosterSrc(newPosterSrc);
        } else {
          const longCode = `${labelData.prefix || ""}${codeLabel}`;
          const codeNumPadded: string = codeNum.padStart(5, "0");
          const imgPaddedLongCode: string = `${labelData.imgPre || labelData.prefix || ""}${codeLabel}${codeNumPadded}`;
          newPosterSrc =
            labelData.is3digits || codeLabel === "ibw"
              ? `https://pics.dmm.co.jp/mono/movie/adult/${longCode}${codeNum}${codeSuf}/${longCode}${codeNum}${codeSuf}p${posterSm ? "s" : "l"}.jpg`
              : `https://pics.dmm.co.jp/digital/video/${imgPaddedLongCode}/${imgPaddedLongCode}p${posterSm ? "s" : "l"}.jpg`;

          setPosterSrc(newPosterSrc);
          console.log("Poster link: ", newPosterSrc);
        }

        setLoaded(true);
        setIsPaddedUrl(false);

        console.log("Trailer link: ", newVideoSrc);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    if (rebdLabels.includes(codeLabel)) {
      const dlNum = `dl0${codeNumInt > 873 && codeNumInt < 889 ? "3" : (codeNumInt > 500 && codeNumInt < 874) || codeNumInt > 951 ? "2" : "1"}`;
      const rebdBaseSrc = `https://file.rebecca-web.com/media/videos/${dlNum}/${codeLabel}_${codeNum}${codeLabel === "naac" ? "b" : ""}/`;
      const rebdVidSrc = rebdBaseSrc + "movie.mp4";
      const rebdPoster = rebdBaseSrc + "b02_pc2.jpg";

      console.log("Trailer Link: ", rebdVidSrc);

      setVideoSrc(rebdVidSrc);
      setPosterSrc(rebdPoster);
      setLoaded(true);
    } else if (codeLabel === "kidm") {
      setVideoSrc(
        `https://kingdom.vc/html/upload/sample_video/KIDM-${codeNum}.mp4`,
      );
      setPosterSrc(
        `https://kingdom.vc/html/upload/save_image/${codeNum}VHD-4000.jpg`,
      );
      setLoaded(true);
    } else {
      getPrefixData();
    }
  }, [
    codeLabel,
    codeNum,
    codeSuf,
    createVideoSrc,
    code,
    reload,
    posterSm,
    labelData,
  ]);

  const handleVideoError = (): void => {
    if (!isPaddedUrl && labelData) {
      const paddedVideoSrc: string = createVideoSrc(codeNum, true, labelData);
      setVideoSrc(paddedVideoSrc);
      setIsPaddedUrl(true);
      console.log("Attempting to load padded video URL: ", paddedVideoSrc);
    } else {
      console.log("🎥 A trailer was not found for", code.toUpperCase());
    }
  };

  return isLoaded ? (
    rebdLabels.includes(codeLabel) || codeLabel === "kidm" ? (
      <video
        src={videoSrc}
        poster={posterSrc}
        controls
        className={`${
          posterSm ? "aspect-[3/1.98]" : "aspect-video"
        } flex w-full bg-black object-contain`}
      />
    ) : (
      <MuxPlayer
        src={videoSrc}
        playbackRates={[1, 1.5, 2]}
        poster={posterSrc}
        accentColor="#f76e8c"
        onError={handleVideoError}
        streamType="on-demand"
        className={`${
          posterSm ? "aspect-[3/1.98]" : "aspect-video"
        } flex w-full bg-black object-contain`}
        placeholder={!posterSm ? `https://fourhoi.com/${code}/cover-t.jpg` : ""}
        forwardSeekOffset={5}
        backwardSeekOffset={7}
        title={title}
      />
    )
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
