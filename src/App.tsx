import React, { useState, useEffect } from "react";
import './App.css';
// import { ChakraProvider, Container } from '@chakra-ui/react';


function App() {
  const [time, setTime] = useState(1500);
  const [sessionInit, setSessionInit] = useState(25);
  const [breakInit, setBreakInit] = useState(5);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [breakRunning, setBreakRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  var beep = document.getElementById("beep") as HTMLAudioElement;

  const minutes = Math.floor(time/60).toString().padStart(2, "0");
  const seconds = Math.floor(time%60).toString().padStart(2, "0");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sessionRunning){
        interval = setInterval(() => {
            setTime((prev) => prev - 1);
            if(time<=0){
              setIsSession(false);
              setSessionRunning(false);
              setTime(breakInit*60);
              setBreakRunning(true);
              beep.play();
            }
        }, 1000);
    } else if (breakRunning){
      interval = setInterval(() => {
          setTime((prev) => prev - 1);
          if(time<=0){
            setIsSession(true);
            setBreakRunning(false);
            setTime(sessionInit*60);
            setSessionRunning(true);
          }
      }, 1000);
  }
    return () => clearInterval(interval);
  }, [sessionRunning, breakRunning, sessionInit, time, isSession, breakInit, beep]);


  const handleInit = (type: string) => {
    if(!hasStarted){
      if(type === "bi"){
        if(breakInit > 1 && breakInit < 60){
          setBreakInit(prev => prev + 1);
        }
      } else if(type === "si"){
        if(sessionInit > 1 && sessionInit < 60){
          setSessionInit(prev => prev + 1);
          setTime(prev => prev + 60);
        }
      } else if(type === "bd"){
        if(breakInit > 1 && breakInit < 60){
          setBreakInit(prev => prev - 1);
        }
      } else {
        if(sessionInit > 1 && sessionInit < 60){
          setSessionInit(prev => prev - 1);
          setTime(prev => prev - 60);
        }
      }
    }
  }

  const handleStartStop = () => {
    if(isSession){
      setSessionRunning(!sessionRunning);
      setBreakRunning(false);
    }
    if(!isSession){
      setSessionRunning(false);
      setBreakRunning(!breakRunning);
    }
    
    if(!hasStarted){setHasStarted(true)}
  }

  const handleReset = () => {
    setTime(1500);
    setBreakInit(5);
    setSessionInit(25);
    setSessionRunning(false);
    setBreakRunning(false);
    setHasStarted(false);
    setIsSession(true);
    beep.pause();
    beep.currentTime = 0;
  };

  const title = isSession ? "Session" : "Break";

  return (
    <div className="App">
      
      <h1 id="break-label">Break Length</h1>
      <p id="break-length">{ breakInit }</p>
      <h1 id="session-label">Session Length</h1>
      <p id="session-length">{ sessionInit }</p>
      <button id="break-increment" onClick={() => handleInit("bi")}>Break +</button>
      <button id="break-decrement" onClick={() => handleInit("bd")}>Break -</button>
      <button id="session-increment" onClick={() => handleInit("si")}>Session +</button>
      <button id="session-decrement" onClick={() => handleInit("sd")}>Session -</button>
      <h1 id="timer-label">{title}</h1>
      <h2 id="time-left">{ minutes }:{ seconds }</h2>
      <button id="start_stop" onClick={handleStartStop}>{(breakRunning || sessionRunning) ? "Stop" : "Start"}</button>
      <button id="reset" onClick={handleReset}>Reset</button>
      
    </div>
  );
}

export default App;
