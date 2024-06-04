import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
import Root from './Routes';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import Login from './components/login';

const App = () => {
  return (
    <div style={{ backgroundColor: "#f4f7f7" }}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/'];

  return (
    <>
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
      <Root />
    </>
  );
};

export default App;
