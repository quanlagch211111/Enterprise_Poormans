import React from "react";
import { NavLink } from "react-router-dom";

class Nav extends React.Component {
  render() {
    const role = "ADMIN";
    return (
      <>
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>eTutoring</h2>
          </div>
          <div className="profile d-flex align-items-center flex-column gap-2">
            <div className="profile-image ">
              <img
                src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                alt=""
              />
            </div>
            <div className="profile-name">
              <p>Hieu Dao</p>
            </div>
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
          {role === "ADMIN" && (
            <NavLink to="/assignment" className="nav-item">
              <i className="fas fa-book"></i>
              Assignment
            </NavLink>
          )}
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
      </>
    );
  }
}

export default Nav;
