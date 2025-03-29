import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <div className="header p-3 d-flex justify-content-between">
      <div className="header-left"></div>
      <div className="header-right d-flex gap-3 align-items-center">
        <NavLink to="/message">
          <i className="fas fa-comment-alt"></i>
        </NavLink>
        <i className="fas fa-bell"></i>
        <div className="profile position-relative" ref={profileRef}>
          <div
            className="profile-image rounded-circle overflow-hidden cursor-pointer"
            style={{ width: "40px", height: "40px" }}
            onClick={toggleDropdown}
          >
            <img
              src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
              alt="profile"
              className="w-100 h-100 object-fit-cover"
            />
          </div>

          {/* Dropdown */}
          <div
            className={`dropdown-menu shadow-sm ${
              isDropdownOpen ? "show" : ""
            }`}
            style={{
              right: 0,
              left: "auto",
              minWidth: "200px",
              transition: "all 0.3s",
              display: isDropdownOpen ? "block" : "none",
            }}
          >
            <NavLink
              to="/profile"
              className="dropdown-item py-2 px-3"
              activeClassName="active"
            >
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
