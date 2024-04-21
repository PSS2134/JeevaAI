import React, { useEffect, useState, useRef } from "react";
import "./AudioCard.css";
import { FaPlayCircle } from "react-icons/fa";
import { FaCirclePause } from "react-icons/fa6";
import { AiFillSound } from "react-icons/ai";
import { IoVolumeMute } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
const AudioCard = ({ doc, pat, age, date, id }) => {
  const [isplaying, setisplaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({});
  const [isMute, setIsMute] = useState(false);
  const [volumeProgress, setVolumeProgress] = useState(100);
  const [min, setMin] = useState("00");
  const [sec, setSec] = useState("00");
  const audioElem = useRef();

  useEffect(() => {
    if (isplaying) {
      audioElem.current.play();
    } else {
      audioElem.current.pause();
    }
    if (isMute) {
      audioElem.current.volume = 0;
      setVolumeProgress(0);
    } else {
      audioElem.current.volume = 1;
      setVolumeProgress(100);
    }
  }, [isplaying, isMute]);

  const onPlaying = () => {
    // console.log(audioElem.current);
    const duration = audioElem.current.duration;

    const ct = audioElem.current.currentTime;
    // console.log(ct,duration);
    let minutes = Math.floor(ct / 60);
    let extraSeconds = ct % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
    setMin(String(minutes).slice(0, 2));
    setSec(String(extraSeconds).slice(0, 2));
    if (
      audioElem.current.duration == Infinity ||
      isNaN(audioElem.current.duration)
    ) {
      setCurrentSong({ progress: "99" });
      return;
    }

    setCurrentSong({ progress: (ct / duration) * 100, length: duration });
  };

  const clickRef = useRef();
  const volref = useRef();
  const PlayPause = () => {
    setisplaying(!isplaying);
  };
  const toggleMute = () => {
    setIsMute(!isMute);
  };

  const checkWidth = (e) => {
    let width = clickRef.current.clientWidth;
    const offset = e.nativeEvent.offsetX;

    const divprogress = (offset / width) * 100;
    if (
      audioElem.current.duration == Infinity ||
      isNaN(audioElem.current.duration)
    ) {
      return;
    }
    audioElem.current.currentTime =
      (divprogress / 100) * audioElem.current.duration;
  };
  const checkVolumeWidth = (e) => {
    let width = volref.current.clientWidth;
    const offset = e.nativeEvent.offsetX;

    const divprogress = (offset / width) * 100;
    console.log(divprogress);
    audioElem.current.volume = divprogress / 100;
    if (volumeProgress == 0) {
      setIsMute(true);
    }
    setVolumeProgress(divprogress);
  };

  return (
    <div>
      <div className="audiocard" style={{ position: "relative" }}>
        <div className="audiocard-flexbox">
          <div className="audiocard-left">
            <p className="audiocard-content">Doctor's Name : {doc}</p>
            <p className="audiocard-content">Patient's Name : {pat}</p>
          </div>
          <div className="audiocard-right">
            <p className="audiocard-content">Age : {age}</p>
            <p className="audiocard-content">
              Date : {String(date).slice(0, 10)}{" "}
            </p>
          </div>
        </div>

        <audio
          src={`http://localhost:5000/tracks/details/${id}`}
          ref={audioElem}
          onTimeUpdate={onPlaying}
        />
        <div className="audio-player-box">
          <div className="audio-player-progress-bar-box">
            <div
              className="audio-player-progress-bar"
              onClick={checkWidth}
              ref={clickRef}
            >
              <div
                className="audio-player-progress-fill"
                style={{ width: `${currentSong.progress + "%"}` }}
              ></div>
            </div>
          </div>

          <div className="controls">
            <p className="audio-current-time">
              {min}:{sec}
            </p>
            {isplaying ? (
              <FaCirclePause
                className="ctrl-icons playpause"
                onClick={PlayPause}
              />
            ) : (
              <FaPlayCircle
                className="ctrl-icons playpause"
                onClick={PlayPause}
              />
            )}
            <div className="audio-player-volume-box">
              <div>
                {isMute ? (
                  <IoVolumeMute
                    className="ctrl-icons"
                    style={{ margin: "4vh 2vh" }}
                    onClick={toggleMute}
                  />
                ) : (
                  <AiFillSound
                    className="ctrl-icons"
                    style={{ margin: "4vh 2vh" }}
                    onClick={toggleMute}
                  />
                )}
              </div>

              <div
                className="audio-player-volume-bar"
                onClick={checkVolumeWidth}
                ref={volref}
              >
                <div
                  className="audio-player-volume-fill"
                  style={{ width: `${volumeProgress + "%"}` }}
                ></div>
              </div>
            </div>
            <div
              className="download-icon"
              style={{
                margin: "4vh 8vh",
                float: "right",
                position: "absolute",
                right: "1vh",
              }}
            >
              <a
                href={`http://localhost:5000/tracks/details/${id}`}
                download="filename.mp3"
              >
                <MdOutlineFileDownload className="ctrl-icons" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCard;
