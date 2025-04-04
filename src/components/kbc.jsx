import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import "../styles.css";
import logo from '../finallogo.jpg';

 export default function Kbcgame(props) {
  const [level, changelevel] = useState(1);
  const [questioninfo, changequestioninfo] = useState({});
  const [playing, changeplaying] = useState(1);
  const scoreboard = [
    1000, 2000, 3000, 5000, 10000, 20000, 40000, 80000, 160000,
    320000, 640000, 1250000, 2500000, 5000000, 7500000, 10000000,
    70000000,
  ];
  const [playerscore, changescore] = useState(0);
  const [todisplayA, changeA] = useState(true);
  const [todisplayB, changeB] = useState(true);
  const [todisplayC, changeC] = useState(true);
  const [todisplayD, changeD] = useState(true);
  const [time, changetime] = useState(60);
  const [buttondisplay, change5050] = useState(false);
  const [selected1, changeselected1] = useState(false);
  const [selected2, changeselected2] = useState(false);
  const [selected3, changeselected3] = useState(false);
  const [selected4, changeselected4] = useState(false);
  const [lock, changelock] = useState(true);
  const [finalanswer, changefinalanswer] = useState(false);
  const [redmaker, changeredmaker] = useState(false);
  const [won, changewon] = useState(false);
  const [flipquestion, changeflipquestion] = useState(false);
  const [quit,changequit] = useState(false);
  const audioquestion = useRef(new Audio("/nextquestion.mp3"));
  const audiolock = useRef(new Audio("/lock.mp3"));
  const audiocorrectanswer = useRef(new Audio("/finalizedcorrectanswer.mp3"));
  const audiowronganswer = useRef(new Audio("/wronganswer.mp3"));
  const audiotimer = useRef(new Audio("/timer.mp3"));
  const audiointro = useRef(new Audio("/intro.mp3"));
  const audioanotherchance = useRef(new Audio("/anotherchance.mp3"));
  const [chance,changechance] = useState(false);
  const [chancedisplay,changechancedisplay] = useState(false);
  // If you want to use the timer, uncomment and adjust logic as needed.
  useEffect(()=>{
    if(redmaker) return;
    const intervalId = setInterval(() => {
      changetime(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [redmaker]);
    useEffect(()=>{
        audioquestion.current.load();
        audiolock.current.load();
        audiocorrectanswer.current.load();
        audiowronganswer.current.load();
        audioanotherchance.current.load();
        audiotimer.current.loop = true;
    },[])
  useEffect(() => {
    axios
      .post("http://localhost:5000/getquestion", { level: level })
      .then((response) => {
        audioquestion.current.play();
        changequestioninfo(response.data);
        changeA(true);
        changeB(true);
        changeC(true);
        changeD(true);
        changeselected1(false);
        changeselected2(false);
        changeselected3(false);
        changeselected4(false);
        changelock(true);
        changefinalanswer(false);
        changeredmaker(false);
      });
  }, [level,flipquestion]);
  useEffect(()=>{
    audiotimer.current.play();
    changetime(60);
  },[level]);
  function buttonclicked(x, event) {
    switch (x) {
      case 1:
        changeselected1(true);
        changeselected2(false);
        changeselected3(false);
        changeselected4(false);
        axios
          .post("http://localhost:5000/setoption", { option: event.target.innerText })
          .then(() => {
            changelock(false);
          });
        break;
      case 2:
        changeselected1(false);
        changeselected2(true);
        changeselected3(false);
        changeselected4(false);
        axios
          .post("http://localhost:5000/setoption", { option: event.target.innerText })
          .then(() => {
            changelock(false);
          });
        break;
      case 3:
        changeselected1(false);
        changeselected2(false);
        changeselected3(true);
        changeselected4(false);
        axios
          .post("http://localhost:5000/setoption", { option: event.target.innerText })
          .then(() => {
            changelock(false);
          });
        break;
      case 4:
        changeselected1(false);
        changeselected2(false);
        changeselected3(false);
        changeselected4(true);
        axios
          .post("http://localhost:5000/setoption", { option: event.target.innerText })
          .then(() => {
            changelock(false);
          });
        break;
      default:
    }
  }
    function backtouserform(){
        if(props.type === "waitingroom"){
            axios.post("http://localhost:5000/changeselected",{"id":props.userdata.id,"type":props.type})
        .then(response =>{
        // Handle success, maybe redirect to waiting room or display a success message
        if (response.status === 200) {
            console.log("nicebuddy!");
            axios.get("http://localhost:5000/setbackvalue")
           .then(()=>{});
            window.location.href = "http://localhost:3000/userform";
        }});
        }
        else if(props.type === "fff"){
            axios.post("http://localhost:5000/changeselected",{"type":props.type,"fffid":props.fffdata})
        .then(response =>{
        // Handle success, maybe redirect to waiting room or display a success message
        if (response.status === 200) {
            console.log("nicebuddy!");
            axios.get("http://localhost:5000/setbackvalue")
           .then(()=>{});
            window.location.href = "http://localhost:3000/userform";
        }});
        }
        
    }

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function lifeline5050() {
    change5050(true);
    const wronganswers = [];
    if (questioninfo.optionA !== questioninfo.answer) {
      wronganswers.push(0);
    }
    if (questioninfo.optionB !== questioninfo.answer) {
      wronganswers.push(1);
    }
    if (questioninfo.optionC !== questioninfo.answer) {
      wronganswers.push(2);
    }
    if (questioninfo.optionD !== questioninfo.answer) {
      wronganswers.push(3);
    }
    const toremove = getRandomElement(wronganswers);
    const x = [];
    for (let i = 0; i < 3; i++) {
      if (wronganswers[i] === toremove) continue;
      x.push(wronganswers[i]);
    }
    for (let j = 0; j < 2; j++) {
      switch (x[j]) {
        case 0:
          changeA(false);
          break;
        case 1:
          changeB(false);
          break;
        case 2:
          changeC(false);
          break;
        case 3:
          changeD(false);
          break;
        default:
      }
    }
  }

  function colourdisplay(y) {
    if (level === y) return { backgroundColor: "yellow" };
    else if (level > y) return { backgroundColor: "green" };
    else return {};
  }

  function lockfunc() {
    audiolock.current.play();
    audiotimer.current.pause();audiotimer.current.currentTime = 0;
    changeredmaker(true);
    axios.get("http://localhost:5000/fetchoption").then((response) => {
      if (response.data[0].value === questioninfo.answer) {
        if(chance === true){changechance(false);}
        setTimeout(() => {
          changefinalanswer(true);
          audiocorrectanswer.current.play();
          changescore(scoreboard[level - 1]);
          setTimeout(() => {
            if (level <= 16) {
              changelevel((prevValue) => prevValue + 1);
            } else {
              changewon(true);
            }
          }, 4400);
        }, 3000);
      } 
      else if(chance === true){
        setTimeout(()=>{
            changeA(true);
            changeB(true);
            changeC(true);
            changeD(true);
            changeselected1(false);
            changeselected2(false);
            changeselected3(false);
            changeselected4(false);
            changelock(true);
            changefinalanswer(false);
            changeredmaker(false);
            changechance(false);
            audiotimer.current.play();
            audioanotherchance.current.play();
        },3000);
        
      }
      else {
        audiotimer.current.pause();
        setTimeout(() => {
          audiowronganswer.current.play();
          changeplaying(0);
        }, 2000);
      }
    });
  }

  function scorefunc() {
    if (level <= 5) {
      return 0;
    } else if (level > 5 && level <= 10) {
      return 10000;
    } else if (level > 10 && level <= 15) {
      return 320000;
    } else {
      return playerscore;
    }
  }

  function coloursetter(c) {
    switch (c) {
      case 1:
        if (selected1 && !redmaker) return { backgroundColor: "yellow" };
        else if (selected1 && redmaker && !finalanswer) return { backgroundColor: "orange" };
        else if (selected1 && redmaker && finalanswer) return { backgroundColor: "green" };
        else return {};
      case 2:
        if (selected2 && !redmaker) return { backgroundColor: "yellow" };
        else if (selected2 && redmaker && !finalanswer) return { backgroundColor: "orange" };
        else if (selected2 && redmaker && finalanswer) return { backgroundColor: "green" };
        else return {};
      case 3:
        if (selected3 && !redmaker) return { backgroundColor: "yellow" };
        else if (selected3 && redmaker && !finalanswer) return { backgroundColor: "orange" };
        else if (selected3 && redmaker && finalanswer) return { backgroundColor: "green" };
        else return {};
      case 4:
        if (selected4 && !redmaker) return { backgroundColor: "yellow" };
        else if (selected4 && redmaker && !finalanswer) return { backgroundColor: "orange" };
        else if (selected4 && redmaker && finalanswer) return { backgroundColor: "green" };
        else return {};
      default:
    }
  }
  function lifelinechance(){
    changechance(true);
    changechancedisplay(true);
  }

  function buttondisabler(y) {
    switch (y) {
      case 1:
        if (selected1 || selected2 || selected3 || selected4) {
          if (!selected1 && redmaker) return true;
          else return false;
        } else return false;
      case 2:
        if (selected1 || selected2 || selected3 || selected4) {
          if (!selected2 && redmaker) return true;
          else return false;
        } else return false;
      case 3:
        if (selected1 || selected2 || selected3 || selected4) {
          if (!selected3 && redmaker) return true;
          else return false;
        } else return false;
      case 4:
        if (selected1 || selected2 || selected3 || selected4) {
          if (!selected4 && redmaker) return true;
          else return false;
        } else return false;
      default:
    }
  }

  function lifelineflip() {
    changeflipquestion(true);
  }
  function quitfunc(){
    changequit(true);
  }
  useEffect(()=>{
    
    if(quit === true){
        audiotimer.current.pause();
        audiowronganswer.current.play();
    }
    else if(won ===true){
        audiotimer.current.pause();
        audiointro.current.play();
    }
  },[quit,won])
  useEffect(()=>{
    if(time === 0){
    audiotimer.current.pause();
    audiowronganswer.current.play();
    }
  },[time])
  function Mainfunc() {
    // If the user is still playing
    if (playing && time > 0 && !won && !quit) {
      return (
        <div className="kbc-container">
          {/* Left Column: Lifelines */}
          <div className="lifeline-section">
            <button
              className="actuallifeline"
              onClick={lifeline5050}
            //   style={buttondisplay ? {display:"none"}:{} }
              disabled={buttondisplay}
            >
              50/50
            </button>
            <button
              className="actuallifeline"
              onClick={lifelineflip}
            //   style={flipquestion ? {display:"none"}:{} }
              disabled={flipquestion}
              style={{fontSize:"2rem"}}
            >
              🔄
            </button>
            <button onClick={lifelinechance} className="actuallifeline" disabled={chancedisplay}>2X</button>
            <button className="lifeline-btn" onClick={quitfunc}>QUIT</button>
            <ul style={{marginTop:"6px"}}>
                <li data-testid="first">P(A ? B) is P(A intersection B)</li>
                <li data-testid ="second">lim (x ? 0) is lim (x tends to 0)</li>
                <li data-testid="third">n?? is (n tends to infinity)</li>
                <li data-testid="fourth">i? is itheta</li>
                <li data-testid="fifth">2?k is 2*pi*k</li>
            </ul>
          </div>
          {/* Center Column: KBC Logo, Timer, Question, Answers */}
          <div className="center-section">
            {/* Placeholder KBC Logo (Triangle) */}
             {/* Timer Display (Oval shape optional in CSS) */}
             <div className="timer">Time:{time}</div>
            <div className="kbc-logo" >
                <img src={logo} alt=""/>
            </div>

           
                
                {/* Question Box */}
                <div className="widthhexagon question-box">
                    <h2 className="question-text">{questioninfo.question}</h2>
                </div>
            

            {/* Answer Buttons (2x2 grid) */}
            <div className="answers-container">
              <button
                className="widthhexagon answer-btn"
                data-testid="answer-button1"
                onClick={(e) => buttonclicked(1, e)}
                style={coloursetter(1)}
                disabled={buttondisabler(1)}
              >
                {todisplayA ? questioninfo.optionA : ""}
              </button>
              <button
                className="widthhexagon answer-btn"
                data-testid="answer-button2"
                onClick={(e) => buttonclicked(2, e)}
                style={coloursetter(2)}
                disabled={buttondisabler(2)}
              >
                {todisplayB ? questioninfo.optionB : ""}
              </button>
              <button
                className="widthhexagon answer-btn"
                data-testid="answer-button3"
                onClick={(e) => buttonclicked(3, e)}
                style={coloursetter(3)}
                disabled={buttondisabler(3)}
              >
                {todisplayC ? questioninfo.optionC : ""}
              </button>
              <button
                className="widthhexagon answer-btn"
                data-testid="answer-button4"
                onClick={(e) => buttonclicked(4, e)}
                style={coloursetter(4)}
                disabled={buttondisabler(4)}
              >
                {todisplayD ? questioninfo.optionD : ""}
              </button>
            </div>

            {/* Lock and Unselect Buttons */}
            <div className="action-buttons">
              <button
                className="lock-btn"
                onClick={lockfunc}
                disabled={lock}
              >
                LOCK
              </button>
              <button
                className="unselect-btn"
                onClick={() => {
                  changeselected1(false);
                  changeselected2(false);
                  changeselected3(false);
                  changeselected4(false);
                }}
              >
                UNSELECT
              </button>
                {/*new*/}
                
                {/*new*/}
            </div>
          </div>

          {/* Right Column: Money Ladder */}
          <div className="money-ladder">
            <div className="card">
              <p className="lessheighthexagon" style={colourdisplay(17)}>
                SATH CRORE
              </p>
              <p className="lessheighthexagon" style={colourdisplay(16)}>
                1 CRORE
              </p>
              <p className="lessheighthexagon checkpoint" style={colourdisplay(15)}>
                *75,00,000*
              </p>
              <p className="lessheighthexagon" style={colourdisplay(14)}>
                50,00,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(13)}>
                25,00,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(12)}>
                12,50,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(11)}>
                6,40,000
              </p>
              <p className="lessheighthexagon checkpoint" style={colourdisplay(10)}>
                *3,20,000*
              </p>
              <p className="lessheighthexagon" style={colourdisplay(9)}>
                1,60,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(8)}>
                80,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(7)}>
                40,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(6)}>
                20,000
              </p>
              <p className="lessheighthexagon checkpoint" style={colourdisplay(5)}>
                *10,000*
              </p>
              <p className="lessheighthexagon" style={colourdisplay(4)}>
                5,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(3)}>
                3,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(2)}>
                2,000
              </p>
              <p className="lessheighthexagon" style={colourdisplay(1)}>
                1,000
              </p>
            </div>
          </div>
        </div>
      );
    }
   
    // If user is eliminated but hasn't won
    else if (!won && !quit) {
      return (
        <div className="Eliminated">
          <h1>ELIMINATED. But your score is {scorefunc()}</h1>
          <button className="restart lesswidthfffhexagon answer-btn" onClick={backtouserform}>RESTART</button>
        </div>
      );
    }
    else if(!won && quit){
      return <div className="Eliminated">
          <h1 data-testid="quit-button">WELL PLAYED.YOUR SCORE IS {playerscore}</h1>
          <button className="restart lesswidthfffhexagon answer-btn" data-testid="restart-button" onClick={backtouserform}> RESTART</button>
      </div>
  }
    // If user wins
    else {
      return (
      <div className="Eliminated">
        <h1>SAAATH COROREEEE!!!!!</h1>;
        <button className="lesswidthfffhexagon answer-btn" onClick={backtouserform}>EXIT</button>
      </div>
      );
    }
  }

  return <Mainfunc />;
}
