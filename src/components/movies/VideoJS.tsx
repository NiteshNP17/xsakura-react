import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

// Import VR plugin
import * as VideojsVr from "videojs-vr";
import "videojs-vr/dist/videojs-vr.css";

// Add type declaration for vr options
interface VROptions {
  projection: string;
  debug: boolean;
  forceCardboard: boolean;
  enableVR: boolean;
}

// Extend VideoJS Player type
declare module "video.js" {
  interface Player {
    vr: (options?: VROptions) => void;
  }
}

export const VideoJS = ({
  src,
  onError,
}: {
  src: string;
  onError: () => void;
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isVRInitialized, setIsVRInitialized] = useState(false);

  // Initialize VR plugin
  useEffect(() => {
    if (typeof window !== "undefined" && !isVRInitialized) {
      try {
        // Register VR plugin
        const vrPlugin = VideojsVr.default || VideojsVr;
        // @ts-ignore
        videojs.registerPlugin("vr", vrPlugin);
        setIsVRInitialized(true);
        console.log("VR plugin registered successfully");
      } catch (error) {
        console.error("Error registering VR plugin:", error);
      }
    }
  }, []);

  const videoJsOpt = {
    controls: true,
    fluid: true,
    sources: [
      {
        src,
        type: "video/mp4",
      },
    ],
    // Remove VR options from initial config
    responsive: true,
    playbackRates: [1, 1.5, 2],
  };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });

    player.on("error", () => {
      videojs.log("player encountered an error");
      onError();
    });

    // Initialize VR after player is ready
    try {
      console.log("Attempting to initialize VR mode...");
      // @ts-ignore
      if (player.vr && typeof player.vr === "function") {
        // @ts-ignore
        player.vr({
          projection: "180_LR",
          debug: true,
          forceCardboard: false,
          enableVR: true,
        });
        console.log("VR mode initialized successfully");
      } else {
        console.error("VR plugin not found on player instance");
      }
    } catch (error) {
      console.error("Error initializing VR plugin:", error);
    }
  };

  useEffect(() => {
    // Only initialize player when VR plugin is ready
    if (!playerRef.current && src && isVRInitialized) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoElement.classList.add("vjs-16-9");

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);

        try {
          console.log("Initializing video.js player...");
          const player = videojs(videoElement, videoJsOpt);

          player.ready(() => {
            console.log("player is ready");
            handlePlayerReady(player);
          });
        } catch (error) {
          console.error("Error initializing video.js:", error);
        }
      }
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.src(videoJsOpt.sources);
    }
  }, [src, videoRef, isVRInitialized]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
          playerRef.current = null;
        } catch (error) {
          console.error("Error disposing player:", error);
        }
      }
    };
  }, []);

  // Debug: Log available plugins
  useEffect(() => {
    console.log("Available plugins:", videojs.getPlugins());
  }, [isVRInitialized]);

  return (
    <div data-vjs-player className="flex h-full w-full bg-black">
      <div ref={videoRef} className="my-auto w-full" />
    </div>
  );
};

export default VideoJS;
