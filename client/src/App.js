import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./navbar";
import Upload from "./pages/Upload";
import Stock from "./pages/Stock";
import Home from "./pages/home";
import Curmodel from "./pages/Curmodel";
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";
import "./styles.css";
// import Main from "./pages/Main";
import Footer from "./layouts/Footer";
import Detail from "./pages/detail";
import MasterModel from "./pages/mastermodel";
import Login from "./pages/Login";
import { key, YES } from "./constant";
import Register from "./pages/Register";
import MasterMachine from "./pages/mastermachine";



const SecuredRoute = ( children ) => {
  if (isLoggedIn()) {
    return children;
  }
  return <Login />;
};

const SecuredAdminRoute = ( children ) => {
  console.log(localStorage.getItem(key.USER_LV));
  //console.log(window.location.pathname)

  if (isLoggedIn()) {
    if (localStorage.getItem(key.USER_LV) === "ADMIN") {
      return children;
    }else if (localStorage.getItem(key.USER_LV) === "STAFF"){
      return <Login />;
    }
  }else{
    
    return <Login />;
  }

  return <Navigate to="/Home" />;
};

const SecuredStaffRoute = ( children ) => {
  if (isLoggedIn()) {
    if(localStorage.getItem(key.USER_LV) === "ADMIN" || localStorage.getItem(key.USER_LV) === "STAFF"){
      return children;
    }

  }else{
    return <Login />;
  }
  return <Navigate to="/Home" />;
};

const isLoggedIn = () => {
  return localStorage.getItem(key.LOGIN_PASSED) === YES;
};

function App() {
  const redirectToCheckMatSize = () => {
    return <Navigate to="/Home" />;
  };

  return (
    <div>
      {<Header />}
      {<Sidebar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Home />} />
        <Route path="/Upload" element={SecuredStaffRoute(<Upload />)} />
        <Route path="/Curmodel" element={<Curmodel />} />
        <Route path="/Stock" element={SecuredStaffRoute(<Stock />)} />
        <Route path="/Detail" element={<Detail />} />

     
          <Route path="/MasterMachine" element={SecuredAdminRoute(<MasterMachine />)} />
          <Route path="/MasterModel" element={SecuredAdminRoute(<MasterModel />)} />


        {/* <Route path="/"  element={<Detail />} /> */}
      </Routes>

      {<Footer />}
    </div>
  );
}

export default App;
