import React, { Component } from 'react';
import Sidebar from './components/sidebar/sidebar';
import Root from './Routes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css"
const App = () => {
  return (
    <div style={{backgroundColor:"#f4f7f7"}}>
      <BrowserRouter>
        <Sidebar /> 
        <Root /> 
      </BrowserRouter>
    </div>
    
 
  );
};
export default App;