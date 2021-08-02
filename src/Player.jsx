import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const Player = (props) => {
  const videoRef = React.useRef(null);
  

  // This seperate functional component fixes the removal of the videoelement
  // from the DOM when calling the dispose() method on a player
  const VideoPlayer = (props) => (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );

  React.useEffect(() => {
    const options = {
      fill: true,
      fluid: true,
      preload: "auto",
      mute: true,
      nativeControlsForTouch: false, 
      playsinline: true, 
      controlBar: {
        timeDivider: false,
        durationDisplay: false,
        remainingTimeDisplay: false,
        customControlSpacer: true,
        pictureInPictureToggle: false,
        captionsButton: false,
        fullscreenToggle: true,
        subsCapsButton: false,
      },
      html5: {
        hls: {
          withCredentials: true,
        },
      },
      sources: [
        {
          src: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
        },
      ],
    };
    const videoElement = videoRef.current;
    let player;
    if (videoElement) {
      player = videojs(videoElement, options, () => {
        console.log("player is ready");
      });
    }
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  return <VideoPlayer />;
};
export default Player;
