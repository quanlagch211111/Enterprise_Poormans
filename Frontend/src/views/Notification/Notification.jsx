import React, { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";

const NotificationPage = () => {
  const userId = localStorage.getItem("userId");
  const socket = useSocket(userId);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/notifications/${userId}`);
        const data = await response.json();
        if (data.status === "success") {
          setNotifications(data.data); 
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Handle real-time notifications via WebSocket
  useEffect(() => {
    if (!socket) return;

    socket.on("notification-receive", (message) => {
      console.log("📩 New Notification received:", message);
      setNotifications((prev) => {
        // Kiểm tra trùng lặp (dựa vào `entityId` hoặc `_id`)
        const isDuplicate = prev.some((notif) => notif._id === message._id);
        if (!isDuplicate) {
          return [message, ...prev];
        }
        return prev;
      });
    });

    return () => {
      socket.off("notification-receive");
    };
  }, [socket]);

  return (
    <div>
      <h2>🔔 Notifications</h2>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((msg) => (
            <li key={msg._id}>
              <strong>{msg.entityType}:</strong> {msg.message}
              <br />
              <small>{new Date(msg.created_at).toLocaleString()}</small>
            </li>
          ))
        ) : (
          <p>No notifications yet.</p>
        )}
      </ul>
    </div>
  );
};

export default NotificationPage;
