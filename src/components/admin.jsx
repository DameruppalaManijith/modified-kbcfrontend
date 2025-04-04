import React, { useState, useEffect,useRef} from "react";
import axios from "axios";
import "../styles.css"
export default function Admin() {
    const [users, setUsers] = useState([]); 
    //new
    const [fffusers,setfffUsers] = useState([]);
    const [fffqans,setqans] = useState([]); 
    const [numofquepopped,changenumofquepopped] = useState(0);
    const [pop1,changepop1] = useState(true);
    const [pop2,changepop2] = useState(true);
    const [pop3,changepop3] = useState(true);
    const [pop4,changepop4] = useState(true);
    const [pop5,changepop5] = useState(true);
    const [pop6,changepop6] = useState(true);
    const [pop7,changepop7] = useState(true);
    const [pop8,changepop8] = useState(true);
    const [pop9,changepop9] = useState(true);
    const [pop10,changepop10] = useState(true);
     const [nextpop,changenextpop] = useState(true);
    const [displayquestions,changedisplayquestions] = useState(true);
    const buttonRefs = useRef([]);
     const [fetchedanswered,changefetchedanswered] = useState([]);
    const [isFetching,setIsFetching] = useState(false);
    const [starter,changestarter] = useState(true);
 

    //new
    useEffect(() => {
        const interval = setInterval(()=>{axios.get("http://localhost:5000/admininfo")
            .then(response => setUsers(response.data))
            .catch(error => console.error("Error fetching admin info:", error));
        },2000);
    return () => clearInterval(interval);  
    }, []);

     function selectUser(id,index) {
        console.log("HI");
        axios.post("http://localhost:5000/updateinfo", { id })
            .then((response)=>{
                if (buttonRefs.current[index]) {   
                    buttonRefs.current[index].disabled = true; // Disable the clicked button
                    buttonRefs.current[index].innerText = "Selected";
                }
            });
        
       
    }
//new
    useEffect(() => {
        axios.get("http://localhost:5000/setbackvalue")
        .then(()=>{});
        axios.get("http://localhost:5000/setstartandquestionid")
            .then((response)=>{
                const interval = setInterval(()=>{axios.get("http://localhost:5000/fffusers")
                    .then(response => setfffUsers(response.data))
                    .catch(error => console.error("Error fetching admin info:", error));
                },2000);
                return () => clearInterval(interval);  
            });
    }, []);
    useEffect(()=>{
        if(starter===true){
            axios.get("http://localhost:5000/setstartandquestionid")
            .then(()=>{});
        }
    },[starter])
    useEffect(() => {
        const interval = setInterval(()=>{axios.get("http://localhost:5000/fetchvalue")
            .then((response1)=>{
                if(response1.data[0].value === 0){
                    changestarter(true);
                    changedisplayquestions(true);
                }
                if(response1.data[0].value === 1){
                    changedisplayquestions(false);
                    changestarter(false);
                }
        },2000);
    return () => clearInterval(interval);  
    })
}, []);
    useEffect(() => {
        const interval = setInterval(()=>{
            if (!isFetching) {
                setIsFetching(true);
            axios.get("http://localhost:5000/fetchanswered")
            .then(response => {
                changefetchedanswered(response.data);
                let m=0;
                response.data.map((obj,index)=>{
                    if(obj.answered !== numofquepopped){
                        m=1;
                }
                    return 1;
                });
                if(m===0){
                    changenextpop(true);
                    if(numofquepopped === 3  && response.data[0].answered === 3){
                        axios.get("http://localhost:5000/cw")
                        .then(()=>{});
                    setqans([]);
                        // axios.get("http://localhost:5000/setbackstart")
                        //     .then(()=>{});
                        changenumofquepopped(0);
                    }
                }
                else{
                    changenextpop(false);
                }

            })
            .catch(error => console.error("Error fetching admin info:", error))
            .finally(()=>(setIsFetching(false)));
        }
        },2000);
    return () => clearInterval(interval);  
    }, [fetchedanswered,numofquepopped,isFetching]);
    function getquestions(){
        changepop1(true);
        changepop2(true);
        changepop3(true);
        changepop4(true);
        changepop5(true);
        changepop6(true);
        changepop7(true);
        changepop8(true);
        changepop9(true);
        changepop10(true);
        axios.get("http://localhost:5000/getfffquestions")
            .then(response =>{
                setqans(response.data);
            });
    }
    function questionselected(g,id){
       switch (g){
            case 1:
                changepop1(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 2:
                changepop2(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 3:
                changepop3(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 4:
                changepop4(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 5:
                changepop5(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 6:
                changepop6(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 7:
                changepop7(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 8:
                changepop8(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 9:
                changepop9(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            case 10:
                changepop10(false);
                changenumofquepopped((prevValue)=>{return prevValue + 1});
                break;
            default:
       }
       axios.post("http://localhost:5000/sendid",{"id":id})
        .then(response=>{});

    }
    function popfunc(h){
        switch (h){
            case 1:
                return (pop1 && nextpop);
            case 2:
                return (pop2 && nextpop);
            case 3:
                return (pop3 && nextpop);
            case 4:
                return (pop4 && nextpop);
            case 5:
                return (pop5 && nextpop);
            case 6:
                return (pop6 && nextpop);
            case 7:
                return (pop7 && nextpop);
            case 8:
                return (pop8 && nextpop);
            case 9:
                return (pop9 && nextpop);
            case 10:
                return (pop10 && nextpop);
            default:
       }
    }
    
    // useEffect(()=>{
    //     if(struggled === 3){
    //         axios.get("http://localhost:5000/cw")
    //         .then(()=>{});
    //     setqans([]);
    //         // axios.get("http://localhost:5000/setbackstart")
    //         //     .then(()=>{});
    //         changenumofquepopped(0);
    //     }
    // },[struggled])




//new
    return (
        //new
        <div className="admincontainer">
            <h1>Admin Panel</h1>
            <h2>Users in Waiting List</h2>
            {users.length > 0 ? (
                users.map((user,index) => (
                    <div key={user.id}>
                        <p style={{ display: "inline" }}>{user.name}         {user.email}</p>
                        {/*new*/}
                        <button onClick={() => selectUser(user.id,index)} ref= {(el)=>{buttonRefs.current[index] = el;}} style={{ display: "inline" }} >SELECT</button>
                         {/*new*/}
                    </div>
                ))
            ) : (
                <p>Loading users...</p>  
            )}
            <hr />
            <h2>Users in FastestFingerFirst</h2>
            {fffusers.length > 0 ? (
                fffusers.map((fffuser) => (
                    <div key={fffuser.id}>
                        <p>{fffuser.name}       {fffuser.email}     {fffuser.time}     {fffuser.correctanswers}     {fffuser.answered}  </p>
                    </div>
                ))
                
            ) : (
                <div>
                    <p>No fff players registered yet.....</p>
                    

                </div>
            )}
            {(fffqans.length > 0 && fffusers.length > 0)? (
                fffqans.map((fffquestion,index) => (
                    <div key={fffquestion.number}>
                        <p style={{ display: "inline" }} > {index+1}.{fffquestion.fquestion}</p>
                        <button onClick={()=>{questionselected(index+1,fffquestion.number)}} disabled={!popfunc(index+1)}>pop me</button>
                    </div>
                ))
            ) : null
            }
            <h1 style={displayquestions ? {display:"none"}: {}}>Winner Choosed</h1>
            <button onClick={getquestions} style={fffusers.length===0 ? {display:"none"} : {}} disabled = {(!fffqans.length !== 0 && !starter)||(fffqans.length !== 0 && starter)}>Start</button>
            {/*
            <button onClick={choosewinner} disabled={!(numofquepopped >=1 && nextpop === true)|| (touched)}>{touched ? choosed :choosewinnerstring}</button>
            */ }
            </div>

    );
    //new
}