import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
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


function App() {
  const location = useLocation();
  const hideNavRoutes = ["/meeting", "/login", "/otp-confirm"];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNav && <Sidebar />}
      <div className="right-bar">
        {shouldShowNav && <Header />}
        <Routes>
          <Route path="/" element={<Dashboard />} exact></Route>
          <Route path="/message" element={<Message />}></Route>
          <Route path="/document" element={<Document />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/meeting" element={<MeetingCall />} />
          <Route path="/otp-confirm" element={<OtpConfirm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<Account />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
