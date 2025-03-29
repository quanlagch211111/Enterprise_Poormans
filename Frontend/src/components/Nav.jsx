import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RoleContext } from "../services/RoleContext";
import axios from "../services/AxiosCustom";
import { ConfirmLogout } from "./Modal";

export const Sidebar = () => {
  const role = localStorage.getItem("role");
  const [showModalLogout, setShowModalLogout] = useState(false);
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>eTutoring</h2>
        </div>
        <NavLink to="/" end className="nav-item">
          <i className="fas fa-home"></i>
          Dashboard
        </NavLink>
        <NavLink to="/document" className="nav-item">
          <i className="fas fa-file-alt"></i>
          Assignment
        </NavLink>
        <NavLink to="/assignment" className="nav-item">
          <i className="fas fa-book"></i>
          Class
        </NavLink>
        <NavLink to="/schedule" className="nav-item">
          <i className="fas fa-video"></i>
          Schedule
        </NavLink>
        <NavLink to="/blog" className="nav-item">
          <i className="fas fa-blog"></i>
          Blog
        </NavLink>
        <a
          href="#"
          className="nav-item logout"
          onClick={() => setShowModalLogout(true)}
        >
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </div>
      <ConfirmLogout
        show={showModalLogout}
        onClose={() => setShowModalLogout(false)}
      ></ConfirmLogout>
    </>
  );
};
