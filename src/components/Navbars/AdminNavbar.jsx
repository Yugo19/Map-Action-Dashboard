import React from "react";
import { Navbar } from "react-bootstrap";
import AdminNavbarLinks from "./AdminNavbarLinks.jsx";

const NavHeader = () => {
  const handleMobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    document.body.addEventListener("click", removeClickListener);
  };

  const removeClickListener = (event) => {
    if (event.target.id === "bodyClick") {
      document.documentElement.classList.toggle("nav-open");
      document.body.removeEventListener("click", removeClickListener);
    }
  };

  return (
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Toggle onClick={handleMobileSidebarToggle} data-testid="navbar-toggle" />
      </Navbar.Header>
      <Navbar.Collapse>
        <AdminNavbarLinks />
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavHeader;
