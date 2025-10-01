import React, { useEffect, useRef } from "react";

export default function TestYoutube() {
  const playerRef = useRef(null);

  useEffect(() => {
    const videoId = "Yih-GOSe5Bg"; // ID limpio del short

    // Cargar script solo si no está
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-test-player", {
        videoId,
        playerVars: {
  modestbranding: 1,
  controls: 0,
  rel: 0,
  autoplay: isActive ? 1 : 0,
  mute: 0,
  loop: 1,
  playlist: videoId,
  playsinline: 1,
  disablekb: 1,
  fs: 0,
        },
      });
    };
  }, []);

  return (
    <div>
      <h3>Prueba Short</h3>
      <div id="yt-test-player" style={{ width: "560px", height: "315px" }} />
    </div>
  );
}
