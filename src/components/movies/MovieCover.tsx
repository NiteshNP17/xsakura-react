import { useState } from "react";

const MovieCover = ({ code }: { code: string }) => {
  const [hoverCode, setHoverCode] = useState<string | null>(null);

  const handlePointerEnter = (code: string | null) => {
    code
      ? setHoverCode(code)
      : setTimeout(() => {
          setHoverCode(null);
        }, 350);
  };

  return (
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
          className="absolute object-cover h-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          height="100%"
        >
          <source
            src={`https://fivetiu.com/${code}/preview.mp4`}
            type="video/mp4"
          />
        </video>
      )}
      <img
        src={`https://fivetiu.com/${code}/cover-t.jpg`}
        alt={code}
        width="100%"
        loading="lazy"
      />
    </div>
  );
};

export default MovieCover;
