"use client";
import { CSSProperties, useEffect, useState } from "react";

export default function Home() {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (start && !pause) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          let sec = parseInt(prev, 10);
          let min = parseInt(minutes, 10);
          let hr = parseInt(hours, 10);

          if (sec > 0) {
            sec -= 1;
          } else if (min > 0) {
            sec = 59;
            min -= 1;
            setMinutes(min.toString().padStart(2, "0"));
          } else if (hr > 0) {
            sec = 59;
            min = 59;
            hr -= 1;
            setMinutes(min.toString().padStart(2, "0"));
            setHours(hr.toString().padStart(2, "0"));
          } else {
            clearInterval(timer);
            setStart(false);
          }

          return sec.toString().padStart(2, "0");
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [start, pause, hours, minutes, seconds]);

  const transformTime = (value: string, isHours: boolean) => {
    let num = parseInt(value, 10) || 0;
    if (isHours) num = Math.min(num, 24);
    else num = Math.min(num, 59);
    return num.toString().padStart(2, "0");
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-[url('/clocks.jpg')] bg-cover bg-center">
      <div className="sm:w-[500px] h-[500px] border-white/20 border-2 rounded-2xl flex flex-col p-4 justify-center items-center bg-[#ab7b55]/55">
        <h1 className="text-3xl font-bold mb-10">TIMER</h1>
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
          {["hours", "minutes", "seconds"].map((unit) => (
            <div className="flex flex-col" key={unit}>
              <span className="countdown font-mono text-5xl">
                {!start ? (
                  <input
                    className="w-[70px] text-right bg-[#ab7b55]"
                    type="number"
                    max={unit === "hours" ? 24 : 59}
                    min={0}
                    onChange={(e) => {
                      const value = transformTime(
                        e.target.value,
                        unit === "hours"
                      );
                      if (unit === "hours") setHours(value);
                      else if (unit === "minutes") setMinutes(value);
                      else setSeconds(value);
                    }}
                    value={
                      unit === "hours"
                        ? hours
                        : unit === "minutes"
                        ? minutes
                        : seconds
                    }
                  />
                ) : (
                  <span
                    style={
                      {
                        "--value":
                          unit === "hours"
                            ? hours
                            : unit === "minutes"
                            ? minutes
                            : seconds,
                      } as CSSProperties
                    }
                  ></span>
                )}
              </span>
              {unit}
            </div>
          ))}
        </div>
        {!start ? (
          <button
            className="border w-1/2 mt-4 cursor-pointer"
            onClick={() => setStart(true)}
            disabled={hours === "00" && minutes === "00" && seconds === "00"}
          >
            Start
          </button>
        ) : (
          <div className="w-1/2 flex gap-2 mt-4">
            <button className="border w-full cursor-pointer" onClick={() => setPause(!pause)}>
              {pause ? "Continue" : "Pause"}
            </button>
            <button
              className="border w-full cursor-pointer"
              onClick={() => {
                setStart(false);
                setPause(false);
                setHours("00");
                setMinutes("00");
                setSeconds("00");
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
