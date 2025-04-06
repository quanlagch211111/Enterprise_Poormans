import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ConfirmLogout } from "./Modal";

export const Sidebar = () => {
  const role = localStorage.getItem("role");
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State mở/đóng sidebar

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(true)}>
        <i className="fas fa-bars"></i>
      </button>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>eTutoring</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>

        <NavLink
          to="/"
          end
          className="nav-item"
          onClick={() => setIsOpen(false)}
        >
          <i className="fas fa-home"></i>
          Dashboard
        </NavLink>
        <NavLink
          to="/document"
          className="nav-item"
          onClick={() => setIsOpen(false)}
        >
          <i className="fas fa-file-alt"></i>
          Assignment
        </NavLink>
        {role === "STAFF" && (
          <NavLink
            to="/assignment"
            className="nav-item"
            onClick={() => setIsOpen(false)}
          >
            <i className="fas fa-book"></i>
            Class
          </NavLink>
        )}
        <NavLink
          to="/schedule"
          className="nav-item"
          onClick={() => setIsOpen(false)}
        >
          <i className="fas fa-video"></i>
          Schedule
        </NavLink>
        <NavLink
          to="/blog"
          className="nav-item"
          onClick={() => setIsOpen(false)}
        >
          <i className="fas fa-blog"></i>
          Blog
        </NavLink>
        {role === "STAFF" && (
          <NavLink
            to="/account"
            className="nav-item"
            onClick={() => setIsOpen(false)}
          >
            <i className="fas fa-user"></i>
            Account
          </NavLink>
        )}
        {/* {role === "STAFF" && (
          <NavLink to="/classes" className="nav-item">
            <i class="fa-solid fa-clipboard-user"></i>
            Attendance
          </NavLink>
        )} */}

        <a
          href="#"
          className="nav-item logout"
          onClick={() => {
            setShowModalLogout(true);
            setIsOpen(false);
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </div>

      <ConfirmLogout
        show={showModalLogout}
        onClose={() => setShowModalLogout(false)}
      />
    </>
  );
};
