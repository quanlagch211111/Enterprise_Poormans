import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Ensure Routes is imported
import { Dashboard } from "./views/Dashboard/Dashboard";
import { Message } from "./views/Message/Message";
import { Blog } from "./views/Blog/Blog";
import { Document } from "./views/Document/Document";
import Assignment from "./views/Assignment/Assignment";
import { Login } from "./views/Login/Login";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Nav";
import { MeetingCall } from "./views/Meeting/MeetingCall";
import { OtpConfirm } from "./views/Confirm/OtpConfirm";
import { Schedule } from "./views/Schedule/Schedule";
import { Profile } from "./views/User/Profile";
import Account from "./views/Account/Account";
import ForgotPassword from "./views/ForgotPassword/ForgotPassword";
import ResetPassword from "./views/ForgotPassword/ResetPassword";
import { SocketProvider } from "./services/Socket";
import NotificationPage from "./views/Notification/Notification";
import { Container } from "react-bootstrap";
import Attendance from "./views/Attendance/Attendance";
import TakingAttendance from "./views/Attendance/TakingAttendance";

function App() {
  const location = useLocation();
  const hideNavRoutes = [
    "/meeting/:room_id", // Routes where navbar should be hidden
    "/login",
    "/otp-confirm",
    "/forgot-password",
    "/reset-password",
  ];

  // Check if the current route is in the list of routes to hide the navbar
  const shouldShowNav = !hideNavRoutes.some((route) =>
    location.pathname.startsWith(route.replace(":room_id", ""))
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="app-container">
        {shouldShowNav && <Sidebar isOpen={isSidebarOpen} />}
        <div className="right-bar">
          {shouldShowNav && <Header />}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/message" element={<Message />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/document" element={<Document />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/meeting/:room_id" element={<MeetingCall />} />
            <Route path="/otp-confirm" element={<OtpConfirm />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<Account />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route
              path="/check-attendance/:date"
              element={<TakingAttendance />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
