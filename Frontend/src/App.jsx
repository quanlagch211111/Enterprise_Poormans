import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./views/Dashboard/Dashboard";
import { Message } from "./views/Message/Message";
import { Blog } from "./views/Blog/Blog";
import { Document } from "./views/Document/Document";
import Calender from "./views/Calender/Calender";
import Assignment from "./views/Assignment/Assignment";
import { Login } from "./views/Login/Login";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Nav";
import { OtpConfirm } from "./views/Confirm/OtpConfirm";
import MeetingForm from "./views/Meetin/Meeting";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="right-bar">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} exact></Route>
          <Route path="/message" element={<Message />}></Route>
          <Route path="/document" element={<Document />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/schedule" element={<Calender />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp-confirm" element={<OtpConfirm />} />
          <Route path="/meeting" element={<MeetingForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
