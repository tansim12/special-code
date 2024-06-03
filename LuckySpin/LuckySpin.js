import React, { useRef, useEffect, useState } from "react";
import { Fireworks } from "@fireworks-js/react";
import SpinWheel from "./SpinWheel";
import fireWorksSound from "../../../Assets/Audio/firework-show-short-64657.mp3";

import ReactPlayer from "react-player";
const LuckySpin = () => {
  const [loading, setLoading] = useState(true)
  const [showFireWorks, setFireWorks] = useState(true);
  const [fireWorksAudio, setFireWorksAudio] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    // Ensure that the fireworks start when the component mounts
    if (ref.current && !ref.current.isRunning) {
      ref.current.start();
    }

    const stopFireworks = setTimeout(() => {
      setFireWorks(false);
      setFireWorksAudio(false);
      setLoading(false)
    }, 10000); // 10 seconds in milliseconds

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(stopFireworks);
  }, []);

  return (
    <>
      <div>
        {/* <audio src={fireWorksSound} autoPlay loop /> */}
        {fireWorksAudio && (
          <div style={{ visibility: "hidden", position: "absolute" }}>
            <ReactPlayer
              url={fireWorksSound}
              playing={true}
              muted={false}
              controls={true}
              volume={0.2}
              width="100%"
              height="25vh"
            />
          </div>
        )}
      </div>
      <div className="position-relative">
        <div>
          {showFireWorks && (
            <div className="d-flex justify-content-center " style={{width:"100%"}}>
              <Fireworks
              ref={ref}
              options={{
                opacity: 0.2,
                intensity: 38,
                explosion: 10,
                brightness: {
                  min: 70,
                  max: 100,
                },
              }}
              style={{
                // top: 0,
                left: 0,
                width: "50%",
                
                marginLeft:"25%",
               
                position: "fixed",
                background: "transparent",
                marginTop: 20,
                
              }}
              
            />
            </div>
          )}
        </div>
        <div className="mt-5 position-absolute">
          {/* Main spin design */}
          <SpinWheel loading={loading} setLoading={setLoading}  />
        </div>
      </div>
    </>
  );
};

export default LuckySpin;
