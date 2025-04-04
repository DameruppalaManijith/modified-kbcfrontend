import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import Kbcgame from "./kbc.jsx";
import "../styles.css";
export default function Waiting() {
    
    const [selected, changeSelected] = useState(0);
    const [clicked, changeClicked] = useState(0);
    const [userid, setUserid] = useState(null);  // ✅ Start with null, not 0
    const [userinfo, setUserinfo] = useState(null);  // ✅ State variable for userinfo
    const [a, seta] = useState(0);
    const [fffdisplay,changefffdisplay] = useState(true);
    const [instruction,changeinstruction] = useState(true);
    const audiointro = useRef(new Audio("/intro.mp3"));
    // Fetch user count
   
   
    useEffect(() => {
        axios.get("http://localhost:5000/usercount")
            .then(response => {
                console.log("User ID received:", response.data.usercount);
                setUserid(response.data.usercount);  // ✅ Updates state
            })
            .catch(error => console.error("Error fetching user count:", error));
    }, []);
   useEffect(()=>{
    audiointro.current.load();
    audiointro.current.loop = true;
   },[]);
   
    // Fetch user info when `userid` is updated
    useEffect(() => {
        if (!userid) return;  // ✅ Prevents running with null userid
    const interval =setInterval(()=>{
        axios.post("http://localhost:5000/userinfo", { id: userid })
        .then(response => {
            console.log("User info received:", response.data);
            setUserinfo(response.data[0]);
            changeSelected(response.data[0].selected);
            changeClicked(response.data[0].clicked);

        })
        .catch(error => console.error("Error fetching user info:", error));
    },2000);
    return () => clearInterval(interval);  
    }, [userid]);  // ✅ Runs when userid updates
    useEffect(() => {
        const interval = setInterval(()=>{
            axios.get("http://localhost:5000/getstart")
                .then(response=>{
                    axios.get("http://localhost:5000/fetchvalue")
                    .then((response1)=>{
                        if(response1.data[0].value === 1){
                            changefffdisplay(false);
                        }
                    });
                    if(response.data[0].startfff === 1){
                        changefffdisplay(false);

                    }
                    if(response.data[0].startfff === 0){
                        changefffdisplay(true);
                    }
                });
        },2000);
    return () => clearInterval(interval);  
    }, []);
    
    // Determine `a`
    useEffect(() => {
        if (selected === 0 && clicked === 0) {
            seta(0);
        } else if (selected === 1 && clicked === 1) {
            seta(1);
            audiointro.current.play();
            axios.get("http://localhost:5000/cw")
                        .then(()=>{});
        } else if (selected === 0 && clicked === 1) {
            seta(2);
        }
    }, [selected, clicked]);
//new
    function enterFFF(){
        axios.post("http://localhost:5000/enterFFF",{"name":userinfo.name,"email":userinfo.email,"id":userid})
            .then(response =>{
                console.log("HI");
                if (response.status === 200) {
                    console.log("nicebuddy!");
                    window.location.href = "http://localhost:3000/fastestfinger";
                }
            });
    }
    function instructions(){
        changeinstruction((prevValue)=>{return !prevValue});
    }
    useEffect(()=>{
        if(a === 3){
            audiointro.current.pause();
        }
    },[a]);




























//new
    return (
        <div>
            {userinfo ? (
                <>
                    {a === 0 &&
                    <div className="wrwelcome Eliminated">
                     <h2 className="wrheading">Welcome {userinfo.name}!! You are in the waiting room.</h2>
                     {/*new*/}
                     <p style={{fontWeight:"bold"}}>INSTRUCTIONS</p>
                     <ul style={{color:"orange",fontWeight:"bold"}}>
                        <li>You either have to wait until the admin selects you.</li>
                        <li>Or you can play fastest finger first which will also be started by the admin.</li>
                        <li>So once you enter fastest finger first and you won in it.Then there is no need to wait for admin.</li>
                        <li>You will automatically be allowed to play the game once you win in fastest finger first.</li>
                        <li>At a time,only one member can play the game.</li>
                        <li>So if you don't find the fastest finger first button to work,then someone might already be playing.</li>
                        <li>So you have to wait until he finishes.</li>
                        <li>So enter fastest finger first, win, play the game and get some money!!</li>
                     </ul>
                     <button className="hexagon answer-btn" onClick={enterFFF} disabled={!fffdisplay}>Fastest finger first</button>
                    {/*new*/}
                     </div>
                     }
                    {a === 3 && <Kbcgame userdata={userinfo} type="waitingroom" />}
                    {a === 1 && <div class="MainMenu Eliminated">
                        <div className="mainmenuheading">
                        <h1 className="fffwon" style={{fontSize:"1.7rem"}}>CONGRATS YOU GOT SELECTED</h1>
                        <img src="finallogo.jpg" alt=""></img>
                        </div>
                        <div className="mainmenuinstructions">
                        <button className="hexagon answer-btn" style={{margin:"0px"}} onClick={instructions}>Instructions</button>
                        </div>
                        <div className="mainmenuplaygame">
                        <button className="hexagon answer-btn"onClick={()=>{seta(3);}}>PLAY GAME</button>
                        </div>
                        <div className="mainmenugetback">
                        <button className="hexagon answer-btn"onClick={()=>{ axios.post("http://localhost:5000/changeselected",{"id":userid,"type":"waitingroom"})
        .then(response =>{
        // Handle success, maybe redirect to waiting room or display a success message
        if (response.status === 200) {
            console.log("nicebuddy!");
            axios.get("http://localhost:5000/setbackvalue")
           .then(()=>{});
            window.location.href = "http://localhost:3000/userform";
        }});
                            
                        }}>GET BACK</button>
                        </div>
                        <div className="instruction">
                        <ul style={instruction ? {} : {display:"none"}}>
                            <h3 style={{color:"orange",paddingBottom: "4px"}}>INSTRUCTIONS</h3>
                            <li>Each question has four options. Choose wisely—one is gold, three are garbage!</li>
                            <li>Answer correctly, and you move up! Answer wrong, and you might go home with ₹0 (or just deep regret).</li>
                            <li>Once you press "Play Game" directly the game will start. So BE READY!!</li>
                            <li>Lifelines available: 50-50, flip a question(🔄), 2X chance(2X)</li>
                            <li>If you get question with some missing symbols like(?).How it is treated is written beside the question.So no worries!</li>
                            <li>With 2X chance,if you answer the question wrong,you will be given another chance.</li>
                            <li>flip a question and 50-50 are intutive to understand.</li>
                            <li>You can quit anytime and take your winnings (like a safe player 🐔).</li>
                            <li>Or, you can risk it all for the 7 CRORE QUESTION! Be brave, be bold… but don’t blame us if you lose it all!</li>
                        </ul>
                        </div>
                    </div>}
                    {a === 2 && <div>
                     <h2 className="wrheading Eliminated">Welcome {userinfo.name}!! You are in the waiting room.</h2>
                     {/*new*/}
                     <button onClick={enterFFF} style={!fffdisplay ? {display:"none"} : {} }>Fastest finger first</button>
                    {/*new*/}
                     </div>}
                </>
            ) : (
                <h2>Loading...</h2>  // ✅ Handles cases where data is not ready yet
            )}
        </div>
    );
}

