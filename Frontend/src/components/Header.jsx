import React from "react";
import { NavLink } from "react-router-dom";
export const Header = () => {
  return (
    <div className="header p-3">
      <div className="header-left"></div>
      <div className="header-right d-flex gap-3 align-items-center justify-content-end">
        <NavLink to="/message">
          <i className="fas fa-comment-alt"></i>
        </NavLink>
        <i className="fas fa-bell"></i>
        <div className="profile">
          <div className="profile-image">
            <img
              src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
