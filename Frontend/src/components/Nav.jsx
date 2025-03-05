import React from "react";
import { NavLink } from "react-router-dom";
class Nav extends React.Component {
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>eTutoring</h2>
        </div>
        <NavLink to="/" end href="#" className="nav-item">
          <i className="fas fa-home"></i>
          Dashboard
        </NavLink>
        <NavLink to="/message" className="nav-item">
          <i className="fas fa-comment-alt"></i>
          Messages
        </NavLink>
        <NavLink to="/document" className="nav-item">
          <i className="fas fa-file-alt"></i>
          Documents
        </NavLink>
        <NavLink to="/schedule" className="nav-item">
          <i className="fas fa-video"></i>
          Schedule
        </NavLink>
        <NavLink to="/blog" className="nav-item">
          <i className="fas fa-blog"></i>
          Blog
        </NavLink>
        <a href="#" className="nav-item logout">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </div>
    );
  }
}
export default Nav;
