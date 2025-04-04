import React,{useState,useEffect,useRef} from "react";
import axios from "axios";
import Kbcgame from "./kbc";
export default function Fastestfinger(){
    const [quesinfo,changequesinfo] = useState({});
    const [starttime,setstarttime] = useState(0);
    const [timetaken,settimetaken] = useState(0);
    const [answeredcorrectly,changeansweredcorrectly] = useState(0);
    const [answered,changeanswered] = useState(0);
    const [fffuserid,changefffuserid] = useState(0);
    const [fffuserinfo,changefffuserinfo] = useState([]);
    const [colourA,changeA] = useState(0);
    const [colourB,changeB] = useState(0);
    const [colourC,changeC] = useState(0);
    const [colourD,changeD] = useState(0);
    const [displayA,changedisA] = useState(false);
    const [displayB,changedisB] = useState(false);
    const [displayC,changedisC] = useState(false);
    const [displayD,changedisD] = useState(false);
    const [previousid,changepreviousid] = useState(0);
    const [shouldPost,setShouldPost] = useState(false);
    const [gamecondition,changegamecondition] = useState(0);
    const [isFetching,setIsFetching] = useState(false);
    const audioRef = useRef(new Audio("/fastestfingerfirst.mp3"));
    const audiointro = useRef(new Audio("/intro.mp3"));
    const audioquestion = useRef(new Audio("/nextquestion.mp3"));
    const audiolock = useRef(new Audio("/lock.mp3"));
    const audiofffintro = useRef(new Audio("/fastestfingerfirstintro.mp3"));
    const [k,changek] = useState(0);
    const [instruction,changeinstruction] = useState(true);
   useEffect(()=>{
        audioRef.current.load();
        audioRef.current.loop = true;
        audiointro.current.load();
        audioquestion.current.load();
        audiofffintro.current.loop = true;
        audiofffintro.current.play();
   },[])
    useEffect(() => {
        axios.get("http://localhost:5000/fffusercount")
            .then(response => {
                console.log("fffuser ID received:", response.data.usercount);
                changefffuserid(response.data.usercount);  // âœ… Updates state
            })
            .catch(error => console.error("Error fetching user count:", error));
    }, []);
    useEffect(() => {
        const interval = setInterval(()=>{
            axios.get("http://localhost:5000/getstart")
                .then(response=>{
                    if(response.data[0].startfff === 1 && response.data[0].questionid !== previousid){
                        
                        changepreviousid(response.data[0].questionid);
                        axios.get("http://localhost:5000/fetchfffquestion")
                        .then(response => {
                            console.log("question is",response.data[0]);
                            changequesinfo(response.data[0]);
                            audioRef.current.play().catch((err) => console.error("Playback error:", err));
                            if(k === 0){
                            audiofffintro.current.pause();
                            changek((prevValue)=>{return prevValue + 1});
                            }
                        })
                        .catch(error => console.error("Error fetching admin info:", error));
                    }
                });
        },2000);
    return () => clearInterval(interval);  
    }, [previousid,k]);
    useEffect(()=>{
        if(gamecondition === 1){
            audioRef.current.pause();
            audiointro.current.loop = true;
            audiointro.current.play();
        }
        if(gamecondition === 3){
            audiointro.current.pause();
        }
    },[gamecondition])
    useEffect(()=>{
        
        const interval = setInterval(()=>{
            if (!isFetching) {
                setIsFetching(true);
            axios.get("http://localhost:5000/getfffplayerinfo")
                .then(response =>{
                   // console.log(response.data[1].time,response.data[1].correctanswers);
                    changefffuserinfo(response.data);
                    console.log(response.data);
                })
                .finally(()=>(setIsFetching(false)));
            }
        },2000);
        return () => clearInterval(interval);
    
    },[colourA,colourB,colourC,colourD,isFetching]);
    
    useEffect(() => {
        console.log("Updated fffuserinfo:", fffuserinfo);
    }, [fffuserinfo]);
    useEffect(() => {
        if (shouldPost) {
          axios.post("http://localhost:5000/inserttimecorrect", {
            "fffid": fffuserid,
            "time": timetaken,
            "answeredcorrectly": answeredcorrectly,
            "answered": answered
          }).then((response) => {
            console.log("Data sent successfully!");
          });
      
          setShouldPost(false); // Reset posting flag
        }
      }, [answered,answeredcorrectly,fffuserid,timetaken,shouldPost]);
    useEffect(()=>{
        if(gamecondition!==0) return;
        const interval = setInterval(()=>{
            axios.get("http://localhost:5000/fetchvalue")
                .then((response1)=>{
                    if(response1.data[0].value === 1){
                        axios.get("http://localhost:5000/fetchwinner")
                            .then((response2)=>{
                                if(response2.data[0].id === fffuserid){
                                    changegamecondition(1);
                                }
                                else{
                                    changegamecondition(2);
                                }
                            }
                        );
                    }
                });


        },2000);
        return ()=>clearInterval(interval);
    },[fffuserid,gamecondition]);
    function checkanswer(nonum){
        // if(event.target.innerText === quesinfo.fanswer){
        //     changegreenmaker(true);
        //     settimetaken((prevvalue)=>{return prevvalue+(performance.now()-starttime)});
        //     changeansweredcorrectly((prevValue)=>{return prevValue+1});
        //     changeanswered((prevValue)=>{return prevValue+1});          
        //     axios.post("http://localhost:5000/inserttimecorrect",{"fffid":fffuserid,"time":timetaken,"answeredcorrectly":answeredcorrectly,"answered":answered})
        //         .then((response)=>{});
        // }
        // else{
        //     changefffredmaker(true);
        //     changeanswered((prevValue)=>{return prevValue+1});
        //     axios.post("http://localhost:5000/inserttimecorrect",{"fffid":fffuserid,"time":timetaken,"answeredcorrectly":answeredcorrectly,"answered":answered})
        //     .then((response)=>{});
        // }
        switch(nonum){
            case 1:
                if(quesinfo.foptionA === quesinfo.fanswer){
                    audioRef.current.pause();audioRef.current.currentTime = 0;
                    audiolock.current.play();
                    changeA(1);
                    changedisA(true);
                    changedisB(true);
                    changedisC(true);
                    changedisD(true);
                    settimetaken((prevvalue)=>{return prevvalue+(performance.now()-starttime)});
                    console.log(timetaken);
                    changeansweredcorrectly((prevValue)=>{return prevValue+1});
                    console.log(answeredcorrectly);
                    changeanswered((prevValue)=>{return prevValue+1});      
                    console.log(answered);    
                    setShouldPost(true);
                }
                else{
                    audioRef.current.pause();audioRef.current.currentTime = 0;
                    audiolock.current.play();
                    changeA(2);
                    changedisA(true);
                    changedisB(true);
                    changedisC(true);
                    changedisD(true);
                    changeanswered((prevValue)=>{return prevValue+1});
                    setShouldPost(true);
                }
                break;
            case 2:
                if(quesinfo.foptionB === quesinfo.fanswer){
                    audioRef.current.pause();audioRef.current.currentTime = 0;
                    audiolock.current.play();
                    changeB(1);
                    changedisA(true);
                    changedisB(true);
                    changedisC(true);
                    changedisD(true);
                    settimetaken((prevvalue)=>{return prevvalue+(performance.now()-starttime)});
                    changeansweredcorrectly((prevValue)=>{return prevValue+1});
                    changeanswered((prevValue)=>{return prevValue+1});          
                    setShouldPost(true);
                }
                else{
                    audioRef.current.pause();audioRef.current.currentTime = 0;
                    audiolock.current.play();
                    changeB(2);
                    changedisA(true);
                    changedisB(true);
                    changedisC(true);
                    changedisD(true);
                    changeanswered((prevValue)=>{return prevValue+1});
                    setShouldPost(true);
                }
                break;
            case 3:
                if(quesinfo.foptionC === quesinfo.fanswer){
                    audioRef.current.pause();audioRef.current.currentTime = 0;
                    audiolock.current.play();
                    changeC(1);
                    changedisA(true);
                    changedisB(true);
                    changedisC(true);
                    changedisD(true);
                    settimetaken((prevvalue)=>{return prevvalue+(performance.now()-starttime)});
            changeansweredcorrectly((prevValue)=>{return prevValue+1});
            changeanswered((prevValue)=>{return prevValue+1});          
            setShouldPost(true);
                }
                else{
                    audioRef.current.pause();audioRef.current.currentTime = 0;
                    audiolock.current.play();
                    changeC(2);
                    changedisA(true);
                    changedisB(true);
                    changedisC(true);
                    changedisD(true);
                    changeanswered((prevValue)=>{return prevValue+1});
                    setShouldPost(true);
                }
                break;
            case 4:
                if(quesinfo.foptionD === quesinfo.fanswer){
                    audioRef.current.pause();audioRef.current.currentTime = 0;
                    audiolock.current.play();
                    changeD(1);
                    changedisA(true);
                    changedisB(true);
                    changedisC(true);
                    changedisD(true);
                    settimetaken((prevvalue)=>{return prevvalue+(performance.now()-starttime)});
            changeansweredcorrectly((prevValue)=>{return prevValue+1});
            changeanswered((prevValue)=>{return prevValue+1});          
            setShouldPost(true);
                }
                else{
                    audioRef.current.pause();audioRef.current.currentTime = 0;
                    audiolock.current.play();
                    changeD(2);
                    changedisA(true);
                    changedisB(true);
                    changedisC(true);
                    changedisD(true);
                    changeanswered((prevValue)=>{return prevValue+1});
                    setShouldPost(true);
                }
                break;
            default:
        }
    }
    



    useEffect(()=>{
        setstarttime(performance.now());
        changeA(0);
        changeB(0);
        changeC(0);
        changeD(0);
        changedisA(0);
        changedisB(0);
        changedisC(0);
        changedisD(0);
    },[quesinfo]);
    function backcolorstyle(i){
       switch(i){
        case 1:
            if(colourA === 1){
                return {backgroundColor:"green"};
            }
            else if(colourA === 2){
                return {backgroundColor:"red"};
            }
            else{
                return {};
            }
        case 2:
            if(colourB === 1){
                return {backgroundColor:"green"};
            }
            else if(colourB === 2){
                return {backgroundColor:"red"};
            }
            else{
                return {};
            }
        case 3:
            if(colourC === 1){
                return {backgroundColor:"green"};
            }
            else if(colourC === 2){
                return {backgroundColor:"red"};
            }
            else{
                return {};
            }
        case 4:
            if(colourD === 1){
                return {backgroundColor:"green"};
            }
            else if(colourD === 2){
                return {backgroundColor:"red"};
            }
            else{
                return {};
            }
        default:
       }
    }

    function instructions(){
        changeinstruction((prevValue)=>{return !prevValue});
    }

    return (
        <div className="FFFmaincontainer">
        {Object.keys(quesinfo).length === 0 &&
                <div className="fffwelcome">
                    <div className="flexinsidefffwelcome">
                    <h1>WELCOME!!! QUESTIONS WILL BE ASKED SOON</h1>
                    <button className="lesswidthfffhexagon" onClick={()=>{axios.post("http://localhost:5000/getbackfromfff",{"id":fffuserid})
                            .then((response)=>{if (response.status === 200) {
                                console.log("nicebuddy!");
                                window.location.href = "http://localhost:3000/userform";
                            }});
                        }}>GET BACK</button>
                    </div>
                </div>
        }
                {Object.keys(quesinfo).length !== 0 && gamecondition === 0 && 
                <div className="fffwelcome" id="playing">
                   
                    <div className="getback">
                    <button className="hexagon generalkbcbutton" onClick={()=>{axios.post("http://localhost:5000/getbackfromfff",{"id":fffuserid})
                            .then((response)=>{if (response.status === 200) {
                                console.log("nicebuddy!");
                                window.location.href = "http://localhost:3000/userform";
                            }});
                            
                        }}>GET BACK2</button>
                    </div>
                    {/* <div className="fffuserinfo">
                    <p>NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CORRECTANSWERS</p>
                        {fffuserinfo.map((fffuser) => (
                        <div key={fffuser.id}>
                            <p>{fffuser.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{fffuser.time}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{fffuser.correctanswers}</p>
                        </div>
                        ))}
                    </div> */}
                    <div className="fffuserinfo">
    <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
        <thead>
            <tr>
                <th style={{ padding: "10px",color:"gold"}}>NAME</th>
                <th style={{ padding: "10px",color:"gold"}}>TIME(in ms)</th>
                <th style={{ padding: "10px",color:"gold"}}>CORRECT ANSWERS</th>
            </tr>
        </thead>
        <tbody>
            {fffuserinfo.map((fffuser) => (
                <tr key={fffuser.id}>
                    <td style={{ padding: "10px" }}>{fffuser.name}</td>
                    <td style={{ padding: "10px" }}>{fffuser.time}</td>
                    <td style={{ padding: "10px" }}>{fffuser.correctanswers}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
                    <div className="gridinsidefffwelcome">
                    <div className="question">
                    
                    <h1 className="widthfffhexagon" >{quesinfo.fquestion}</h1>
                    </div>
                    <div className="option1">
                    <button className="widthfffhexagon generalkbcbutton" onClick={()=>(checkanswer(1))} style={backcolorstyle(1)} disabled={displayA}>{quesinfo.foptionA}</button>
                    </div>
                    <div className="option2">
                    <button className="widthfffhexagon generalkbcbutton" onClick={()=>(checkanswer(2))} style={backcolorstyle(2)} disabled={displayB}>{quesinfo.foptionB}</button>
                    </div>
                    <div className="option1">
                    <button className="widthfffhexagon generalkbcbutton" onClick={()=>(checkanswer(3))} style={backcolorstyle(3)} disabled={displayC}>{quesinfo.foptionC}</button>
                    </div>
                    <div className="option2">
                    <button className="widthfffhexagon generalkbcbutton" onClick={()=>(checkanswer(4))} style={backcolorstyle(4)} disabled={displayD}>{quesinfo.foptionD}</button>
                    </div>
                    </div>
                </div>}
                {Object.keys(quesinfo).length !== 0 && gamecondition === 1 && 
                    <div class="MainMenu Eliminated">
                        <div className="mainmenuheading">
                        <h1 className="fffwon">CONGRATS YOU WON</h1>
                        <img src="finallogo.jpg" alt=""></img>
                        </div>
                        <div className="mainmenuinstructions">
                        <button className="hexagon answer-btn" style={{margin:"0px"}} onClick={instructions}>Instructions</button>
                        </div>
                        <div className="mainmenuplaygame">
                        <button className="hexagon answer-btn"onClick={()=>{changegamecondition(3);}}>PLAY GAME</button>
                        </div>
                        <div className="mainmenugetback">
                        <button className="hexagon answer-btn"onClick={()=>{axios.post("http://localhost:5000/getbackfromfff",{"id":fffuserid})
                            .then((response)=>{if (response.status === 200) {
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
                            <li>Each question has four options. Choose wiselyâ€”one is gold, three are garbage!</li>
                            <li>Answer correctly, and you move up! Answer wrong, and you might go home with â‚¹0 (or just deep regret).</li>
                            <li>Once you press "Play Game" directly the game will start. So BE READY!!</li>
                            <li>Lifelines available: 50-50, flip a question(ðŸ”„), 2X chance(2X)</li>
                            <li>With 2X chance,if you answer the question wrong,you will be given another chance.</li>
                            <li>If you get question with some missing symbols like(?).How it is treated is written beside the question.So no worries!</li>
                            <li>flip a question and 50-50 are intutive to understand.</li>
                            <li>You can quit anytime and take your winnings (like a safe player ðŸ”).</li>
                            <li>Or, you can risk it all for the 7 CRORE QUESTION! Be brave, be boldâ€¦ but donâ€™t blame us if you lose it all!</li>
                        </ul>
                        </div>
                    </div>
}
                {Object.keys(quesinfo).length !== 0 && gamecondition ===2 &&
                    <div className="Eliminated">
                        <h1>SORRY BRO YOU LOST GET BACK </h1>
                        <button onClick={()=>{axios.post("http://localhost:5000/getbackfromfff",{"id":fffuserid})
                            .then((response)=>{if (response.status === 200) {
                                console.log("nicebuddy!");
                                window.location.href = "http://localhost:3000/userform";
                            }});
                            
                        }} className="lesswidthfffhexagon answer-btn">GET BACK</button>
                    </div>
}
                {Object.keys(quesinfo).length !== 0 && gamecondition ===3 &&
                    <Kbcgame type="fff" fffdata={fffuserid} />
}
                
        
                </div>
    );
    

   
}