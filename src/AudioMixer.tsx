import { useEffect, useRef, useState } from "react";
import raf from "raf"; // requestAnimationFrame polyfill
import { Player } from "./Player";

const AudioMixer = () => {
  const [seek, setSeek] = useState(0.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  let _raf = useRef<any>(null);

  const clearRAF = () => {
    if (_raf.current != null) {
      raf.cancel(_raf.current);
    }
  };

  const onPlay = () => {
    setIsPlaying(true);
  };

  const onStop = () => {
    setIsPlaying(false);
  };

  const handleMouseDownSeek = () => {
    setIsSeeking(true);
  };

  const handleMouseUpSeek = (_: React.MouseEvent<HTMLInputElement>) => {
    setIsSeeking(false);
  };

  const renderSeekPos = () => {
    if (isPlaying) {
      setSeek((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.015;
      });
      _raf.current = raf(renderSeekPos);
    } else {
      clearRAF();
    }
  };

  useEffect(() => {
    return () => {
      clearRAF();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      renderSeekPos();
    } else {
      clearRAF();
    }
  }, [isPlaying]);

  return (
    <>
      <button
        style={{
          display: "flex",
          gap: "10px",
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "space-between",
          width: "8rem",
        }}
        onClick={() => (isPlaying ? onStop() : onPlay())}
      >
        {isPlaying ? "Stop" : "Play"}{" "}
        <span
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "gray",
          }}
        >
          ({seek.toFixed(2)})
        </span>
      </button>

      <input
        type="range"
        min="0"
        max="150"
        value={seek}
        onChange={(e) => setSeek(parseFloat(e.target.value))}
        onMouseDown={handleMouseDownSeek}
        onMouseUp={handleMouseUpSeek}
      />

      <div
        style={{
          display: "flex",
          gap: "30px",
        }}
      >
        <Player
          source="/1.mp3"
          seek={seek}
          isPlaying={isPlaying}
          isSeeking={isSeeking}
        />
        <Player
          source="/2.mp3"
          seek={seek}
          isPlaying={isPlaying}
          isSeeking={isSeeking}
        />
        <Player
          source="/3.mp3"
          seek={seek}
          isPlaying={isPlaying}
          isSeeking={isSeeking}
        />
        <Player
          source="/4.mp4"
          seek={seek}
          isPlaying={isPlaying}
          isSeeking={isSeeking}
        />
      </div>
    </>
  );
};

export { AudioMixer };
