import React, { Component } from "react";
import { Nav, NavDropdown, MenuItem } from "react-bootstrap";

class AdminNavbarLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  logOut = () => {
    sessionStorage.clear();
    window.location.pathname = "/";
  };

  profile = () => {
    if (sessionStorage.getItem("user_type") == "admin") {
      window.location.pathname = "/admin/profile";
    } else {
      window.location.pathname = "/elu/profile-elu";
    }
  };

  render() {
    return (
      <div data-testid="admin-navbar-links">
        <Nav pullRight>
          <NavDropdown
            title={sessionStorage.first_name}
            eventKey={2}
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1} onClick={this.profile} data-testid="profile-menu-item">
              Profil
            </MenuItem>
            <MenuItem eventKey={2.2} onClick={this.logOut} data-testid="logout-menu-item">
              Log Out
            </MenuItem>
          </NavDropdown>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
