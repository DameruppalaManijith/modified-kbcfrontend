// import { useState } from "react";
// import axios from "axios";
// import "../userformstyle.css"
// export default function UserForm() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//         const response = await axios.post("http://localhost:5000/user", { name: username, email: email });
//         // Handle success, maybe redirect to waiting room or display a success message
//         if (response.status === 200) {
//             console.log("nicebuddy!");
//             window.location.href = "http://localhost:3000/waitingroom";
//         }
//     } catch (error) {
//         console.error("Error submitting form:", error);
//     }
// };
//   return (
//     <div className="container">
//       <h2 className="ufheading">Enter Your Details</h2>
//       <form className="ufform" onSubmit={handleSubmit}>
//         <input type="text" placeholder="Username" name = "name" onChange={(e) => setUsername(e.target.value)} required />
//         <input type="text" placeholder="Email" name = "email" onChange={(e) => setEmail(e.target.value)} required />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }
import React from "react";
import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


export default function UserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
      e.preventDefault();
      
          const response = await axios.post("http://localhost:5000/user", { name: username, email: email });
          // Handle success, maybe redirect to waiting room or display a success message
          if (response.status === 200) {
              console.log("nicebuddy!");
              window.location.href = "http://localhost:3000/waitingroom";
          }
      
  };

  return (
    <div className = 'main-content userform-background Eliminated'>
        <h2>Enter Your Details</h2>
        <br></br>

      
     
        <Form className="alsoaflex" onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text name="name" id="name">What is your full name?</InputGroup.Text>
            <Form.Control
              placeholder="Enter your username"
              aria-label="Username"
              name="name"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text name="email" id="email">What is your email?</InputGroup.Text>
            <Form.Control
              placeholder="Enter your email"
              aria-label="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <button type="submit" className="hexagon answer-btn">Submit</button>
        </Form>

      
    </div>
  );
}