import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RoleContext } from "../services/RoleContext";
import axios from "axios";

export const Sidebar = () => {
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return; 
  
    try {
      const response = await axios.post('http://localhost:3001/api/users/logout', {}, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        navigate("/login");
      } else {
        console.error('Failed to log out:', response.data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

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
        <a href="#" className="nav-item logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </div>
    </>
  );
};
