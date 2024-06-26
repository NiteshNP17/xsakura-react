import { useEffect, useState } from "react";

interface MovieCoverProps {
  code: string;
  overrides?: {
    cover?: string;
    preview?: string;
  };
}

const MovieCover: React.FC<MovieCoverProps> = ({ code, overrides }) => {
  const [hoverCode, setHoverCode] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState<boolean>(true);

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

  return imgLoaded ? (
    <div
      onMouseEnter={() => handlePointerEnter(code)}
      onTouchStart={() => handlePointerEnter(code)}
      onMouseLeave={() => handlePointerEnter(null)}
      className="relative overflow-hidden max-w-full flex justify-center aspect-[16/10]"
    >
      {hoverCode === code && (
        <video
          autoPlay
          loop
          muted
          preload="none"
          className="hover:opacity-100 absolute object-cover h-full transition-opacity duration-300 opacity-0"
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
        className="bg-slate-200 dark:bg-zinc-600"
        src={overrides?.cover || `https://fivetiu.com/${code}/cover-t.jpg`}
        alt={code.toUpperCase()}
        width="100%"
        loading="lazy"
        onError={() => setImgLoaded(false)}
      />
    </div>
  ) : (
    <div className="bg-slate-200 dark:bg-zinc-600 w-full aspect-[16/10] grid place-content-center text-2xl font-semibold text-slate-400 text-center">
      IMAGE NOT FOUND
      <br />
      {code.toUpperCase()}
    </div>
  );
};

export default MovieCover;
