import React, { useEffect, useRef, useState } from "react";
import { Badge, Card, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import axios from "../services/AxiosCustom";

export const Header = () => {
  const userId = localStorage.getItem("userId");
  const socket = useSocket(userId);

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/notifications/${userId}`);
        if (response.data && response.data.status === "success") {
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Handle real-time notifications via WebSocket
  // Kiểm tra socket khi mới kết nối
  useEffect(() => {
    if (!socket) {
      console.log("❌ Socket chưa được khởi tạo.");
      return;
    }

    console.log("✅ Socket đã kết nối:", socket);

    socket.on("notification-receive", (message) => {
      console.log("📩 New Notification received:", message);

      setNotifications((prev) => {
        // Check for duplicates based on _id
        const isDuplicate = prev.some((notif) => notif._id === message._id);
        if (!isDuplicate) {
          return [message, ...prev];
        }
        return prev;
      });
    });

    return () => {
      socket.off("notification-receive");
      console.log("🔌 Socket listener removed.");
    };
  }, [socket]);

  // Function to format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Function to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "message":
        return "💬";
      case "like":
        return "❤️";
      case "comment":
        return "📝";
      case "follow":
        return "👤";
      case "mention":
        return "@️";
      default:
        return "🔔";
    }
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
          <i className="fas fa-comment-alt black-color"></i>
        </NavLink>
        <Dropdown onToggle={() => setIsNotificationOpen(!isNotificationOpen)}>
          <Dropdown.Toggle
            as="div"
            className={`d-flex align-items-center pointer notification-icon  ${
              isNotificationOpen && "active"
            }`}
          >
            <i className="fa-solid fa-bell black-color pointer"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Card className="border-0 w-380 noti-container">
              <Card.Header className="purple-bg">
                <h5 className="mb-0 fw-light d-flex justify-content-between">
                  <span className="text-white fw-500">Notifications</span>
                  <Badge className="text-white">{notifications.length}</Badge>
                </h5>
              </Card.Header>
              <Card.Body className="tab-content">
                <ul className="list-unstyled mb-0">
                  {notifications.length > 0 ? (
                    notifications.map((msg) => (
                      <li className="py-2 mb-1 border-bottom" key={msg._id}>
                        <a
                          href="#"
                          className=" d-flex text-color-primary noti-wrap"
                        >
                          <img
                            className="avatar rounded-circle"
                            src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
                            alt=""
                          />
                          <div className="flex-fill ms-2 ta-left">
                            <p className="d-flex justify-content-between mb-0">
                              <div className="d-flex gap-2 align-items-center">
                                <span className="fw-bold">
                                  {msg.entityType}
                                </span>
                                <small>{formatTime(msg.created_at)}</small>
                              </div>
                              <div className="status-noti"></div>
                            </p>
                            <span className="content-noti">{msg.message}</span>
                          </div>
                        </a>
                      </li>
                    ))
                  ) : (
                    <span className="text-center">No notifications</span>
                  )}

                  {/* Bạn có thể thêm các thông báo khác tương tự ở đây */}
                </ul>
              </Card.Body>
              <Card.Footer className="text-center border-top-0">
                <a href="/notification">View all notifications</a>
              </Card.Footer>
            </Card>
          </Dropdown.Menu>
        </Dropdown>
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
