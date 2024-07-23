import React, { useState, useRef, useEffect } from "react";
import ReactHowler from "react-howler";
import raf from "raf"; // requestAnimationFrame polyfill
import { usePrevious } from "./usePrevious";

interface PlayerProps {
  source: string;
  seek: number;
  isPlaying: boolean;
  isSeeking: boolean;
}

const Player: React.FC<PlayerProps> = ({
  source,
  seek: propSeek = 0.0,
  isPlaying,
  isSeeking,
}) => {
  const [playing, setPlaying] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loop, setLoop] = useState(false);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(0.05);
  const [seek, setSeek] = useState(0);
  const [rate, setRate] = useState(1);
  const [duration, setDuration] = useState<number>(0);
  const [delay, setDelay] = useState<number>(0);

  const playerRef = useRef<ReactHowler | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevIsSeeking = usePrevious(isSeeking);
  const pervLocalSeek = usePrevious(seeking);

  const handleToggle = () => {
    setPlaying(!playing);
  };

  const handleOnLoad = () => {
    if (playerRef.current) {
      setLoaded(true);
      setDuration(playerRef.current.duration());
    }
  };

  const handleOnPlay = () => {
    setPlaying(true);
    // renderSeekPos();
  };

  const handleOnEnd = () => {
    setPlaying(false);
    clearRAF();
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      setPlaying(false);
      // renderSeekPos();
    }
  };

  const handleLoopToggle = () => {
    setLoop(!loop);
  };

  const handleMuteToggle = () => {
    setMute(!mute);
  };

  const handleMouseDownSeek = () => {
    setSeeking(true);
  };

  const handleMouseUpSeek = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seek(parseFloat(e.currentTarget.value));
    }
  };

  const handleSeekingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeek(parseFloat(e.currentTarget.value));
  };

  const renderSeekPos = () => {
    const audioSeek = calculateAudioSeek(seek);
    console.log(audioSeek);
    if (audioSeek === 0) {
      setPlaying(!playing);
    }

    if (playing) {
      rafRef.current = raf(renderSeekPos);
    }
  };

  const handleRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rateValue = parseFloat(e.currentTarget.value);
    if (playerRef.current) {
      // @ts-ignore
      playerRef.current.rate(rateValue);
    }
    setRate(rateValue);
  };
  const handleDelay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const delayValue = parseFloat(e.currentTarget.value);
    setDelay(delayValue);
  };

  const clearRAF = () => {
    if (rafRef.current !== null) {
      raf.cancel(rafRef.current);
    }
  };

  const calculateAudioSeek = (propSeek: number) => propSeek - delay;
  const updatePlayerInstaceSeek = () => {
    const audioSeek = calculateAudioSeek(seek);
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.seek(audioSeek);
    }
  };

  useEffect(() => {
    return () => {
      clearRAF();
    };
  }, []);

  useEffect(() => {
    const audioSeek = calculateAudioSeek(propSeek);

    if (
      audioSeek !== seek &&
      playerRef.current &&
      audioSeek <= duration &&
      audioSeek > -1
    ) {
      setSeek(audioSeek);
    } else if (audioSeek > duration) {
      setSeek(duration);
    } else if (audioSeek < 0) {
      setSeek(0);
    }
  }, [propSeek, delay]);

  useEffect(() => {
    const audioSeek = calculateAudioSeek(propSeek);
    if (isPlaying && !playing && audioSeek >= 0 && audioSeek <= duration) {
      setPlaying(true);
    }

    if (!isPlaying && playing) {
      setPlaying(false);
    }

    if (isPlaying && playing) {
      if (audioSeek < 0) {
        setPlaying(false);
      }
    }
  }, [isPlaying, propSeek, delay]);

  useEffect(() => {
    if (prevIsSeeking === true && isSeeking === false) {
      updatePlayerInstaceSeek();
    }
  }, [isSeeking]);

  useEffect(() => {
    if (pervLocalSeek === true && seeking === false) {
      updatePlayerInstaceSeek();
    }
  }, [seeking]);

  return (
    <div className="full-control">
      <ReactHowler
        src={[source]}
        playing={playing}
        onLoad={handleOnLoad}
        onPlay={handleOnPlay}
        onEnd={handleOnEnd}
        loop={loop}
        mute={mute}
        volume={volume}
        ref={playerRef}
        // onSeek={(time) => setSeek(time)}
      />

      <p>
        {loaded ? "Loaded" : "Loading"} {source}
      </p>

      <div className="toggles">
        <label>
          Loop:
          <input type="checkbox" checked={loop} onChange={handleLoopToggle} />
        </label>
        <label>
          Mute:
          <input type="checkbox" checked={mute} onChange={handleMuteToggle} />
        </label>
      </div>

      <p>
        {"Status: "}
        {seek.toFixed(2)}
        {" / "}
        {duration ? duration.toFixed(2) : "NaN"}
      </p>

      <div className="volume">
        <label>
          Volume:
          <span className="slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step=".05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </span>
          {volume.toFixed(2)}
        </label>
      </div>
      <div className="seek">
        <label>
          Seek:
          <span className="slider-container">
            <input
              type="range"
              min="0"
              max={duration ? duration.toFixed(2) : 0}
              step=".01"
              value={seek}
              onChange={handleSeekingChange}
              onMouseDown={handleMouseDownSeek}
              onMouseUp={handleMouseUpSeek}
            />
          </span>
        </label>
      </div>
      <div className="rate">
        <label>
          Rate:
          <span className="slider-container">
            <input
              type="range"
              min="0.1"
              max="3"
              step=".01"
              value={rate}
              onChange={handleRate}
            />
          </span>
          {rate.toFixed(2)}
        </label>
      </div>
      <div className="delay">
        <label>
          Delay:
          <span className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={delay}
              onChange={handleDelay}
              onMouseDown={handleMouseDownSeek}
              onMouseUp={handleMouseUpSeek}
            />
          </span>
          {delay}
        </label>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button onClick={handleToggle}>{playing ? "Pause" : "Play"}</button>
        <button onClick={handleStop}>Stop</button>
      </div>
    </div>
  );
};

export { Player };
