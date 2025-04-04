import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Admin from "./components/admin.jsx";
import Waiting from "./components/main.jsx";
import UserForm from "./components/userform.jsx";
import Fastestfinger from "./components/FFF.jsx";
function App() {
  
    return (
      
      
      <BrowserRouter>
          <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/waitingroom" element={<Waiting />} />
              <Route path="/userform" element={<UserForm />}/>
              <Route path="fastestfinger" element={<Fastestfinger />}/>
          </Routes>
      </BrowserRouter>
      
  );
  
}

export default App;
