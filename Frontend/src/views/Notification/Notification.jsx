import React, { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";
import axios from "../../services/AxiosCustom";

const NotificationPage = () => {
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
  useEffect(() => {
    if (!socket) return;

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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-2 text-2xl">🔔</span>
            Notifications
          </h2>
          <span className="bg-white text-blue-600 rounded-full px-3 py-1 text-sm font-bold">
            {notifications.length}
          </span>
        </div>

        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((msg) => (
              <div
                key={msg._id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex flex-col sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">
                      {getNotificationIcon(msg.entityType)}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {msg.entityType}
                      </div>
                      <p className="text-gray-700">{msg.message}</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2 sm:mt-0 sm:ml-4">
                  {formatTime(msg.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-5xl mb-4">📭</div>
              <p>No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
