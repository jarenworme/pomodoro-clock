import { useState, useEffect } from "react";
import './App.css';


function App() {
  // states to keep track of elements
  const [time, setTime] = useState(1500);
  const [sessionInit, setSessionInit] = useState(25);
  const [breakInit, setBreakInit] = useState(5);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [breakRunning, setBreakRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  // temporary/transition elements that don't need state
  var beep = document.getElementById("beep") as HTMLAudioElement;
  const minutes = Math.floor(time/60).toString().padStart(2, "0");
  const seconds = Math.floor(time%60).toString().padStart(2, "0");
  const title = isSession ? "Session" : "Break";

  // useEffect hook keeps track of variables indepently. Needed to auto update times in setInterval function
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sessionRunning){
        interval = setInterval(() => {
            setTime((prev) => prev - 1);
            if(time<=0){
              setSessionRunning(false);
              setTime(breakInit*60);
              setBreakRunning(true);
              beep.play();
              setIsSession(false);
            }
        }, 1000);
    } else if (breakRunning){
      interval = setInterval(() => {
          setTime((prev) => prev - 1);
          if(time<=0){
            setBreakRunning(false);
            setTime(sessionInit*60);
            setSessionRunning(true);
            setIsSession(true);
          }
      }, 1000);
  }
    return () => clearInterval(interval);
  }, [sessionRunning, breakRunning, sessionInit, time, isSession, breakInit, beep]);

  // handles every increment and decrement time button to set up initial conditions
  // cannot change these without pressing the reset button after a session has started
  const handleInit = (type: string) => {
    if(!hasStarted){
      if(breakInit<1){
        setBreakInit(1)
      }
      if(sessionInit<1){
        setSessionInit(1)
      }
      if(type === "bi"){
        if(breakInit < 60){
          setBreakInit(prev => prev + 1);
        }
      } else if(type === "si"){
        if(sessionInit < 60){
          setSessionInit(prev => prev + 1);
          setTime(prev => prev + 60);
        }
      } else if(type === "bd"){
        if(breakInit > 1){
          setBreakInit(prev => prev - 1);
        }
      } else {
        if(sessionInit > 1){
          setSessionInit(prev => prev - 1);
          setTime(prev => prev - 60);
        }
      }
    }
  }

  // handles functionality of the start / stop button
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

  // resets the clock to its intial state
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


  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>
      <h2 id="timer-label">{title}</h2>
      <h4 id="time-left">{ minutes }:{ seconds }</h4>
      <div className="control-buttons">
        <button id="start_stop" onClick={handleStartStop}>{(breakRunning || sessionRunning) ? "Stop" : "Start"}</button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
      <div className="setup-ctr">
        <div className="session">
          <h3 id="session-label">Session Length</h3>
          <hr></hr>
          <div className="btn-wrapper">
            <button id="session-increment" onClick={() => handleInit("si")}>+</button>
            <p id="session-length">{ sessionInit }</p>      
            <button id="session-decrement" onClick={() => handleInit("sd")}>-</button> 
          </div>
        </div>
        <div className="break">
          <h3 id="break-label">Break Length</h3>
          <hr></hr>
          <div className="btn-wrapper">
            <button id="break-increment" onClick={() => handleInit("bi")}>+</button>
            <p id="break-length">{ breakInit }</p>
            <button id="break-decrement" onClick={() => handleInit("bd")}>-</button>
          </div>
        </div>
      </div>   
      <div className="more-info">
        <a id="website-link" href="https://www.jarenworme.com/">
          <p>&copy;Jaren Worme 2024</p>
        </a>
        <a id="linkedin-link" href="https://www.linkedin.com/in/jarenworme/" target="_blank">
          <i className="fab fa-linkedin"></i>
        </a>
        <a id="profile-link" href="https://github.com/jarenworme" target="_blank">
          <i className="fab fa-github"></i>
        </a>
      </div>  
    </div>
  );
}

export default App;
