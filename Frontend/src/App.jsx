import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./views/Dashboard/Dashboard";
import Message from "./views/Message/Message";
import Blog from "./views/Blog/Blog";
import Nav from "./components/Nav";
import Document from "./views/Document/Document";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Dashboard />} exact></Route>
        <Route path="/message" element={<Message />}></Route>
        <Route path="/document" element={<Document />} />
        <Route path="/meeting" element="" />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
