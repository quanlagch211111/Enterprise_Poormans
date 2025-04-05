import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "../../services/AxiosCustom";
import { io } from "socket.io-client";
import { MdOutlineEmojiEmotions, MdMenu, MdClose } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import Picker from "emoji-picker-react";
import { SearchComponant } from "../../components/SearchComponent";

export const Message = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const accessToken = localStorage.getItem("accessToken");
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [incoming, setIncoming] = useState(null);
  const [msg, setMsg] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [searchText, setSerchText] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const scrollRef = useRef();

  const APP_HOST = process.env.REACT_APP_SOCKET_PORT;

  // Lấy thông tin người dùng hiện tại
  const getUser = async () => {
    const user = JSON.parse(localStorage.getItem("userlogged"));
    setCurrentUser(user);
  };

  // Lấy danh sách liên hệ
  const getContacts = async () => {
    try {
      const response = await axios.get(
        `/users/getuserforchat/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setContacts(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Lấy tất cả tin nhắn
  const getAllMessages = async () => {
    if (!selectedUser || !currentUser) return;

    try {
      const response = await axios.post(
        "/messages/getmessage",
        {
          from: currentUser._id,
          to: selectedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("API response:", response.data);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();

    if (msg.trim().length === 0 || !selectedUser) {
      console.error("Message is empty or no user selected.");
      return;
    }

    try {
      // Gửi tin nhắn đến backend
      const response = await axios.post(
        "/messages/addmessage",
        {
          to: selectedUser._id,
          message: msg,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.msg === "Message added successfully.") {
        // Phát sự kiện qua socket
        socket.current.emit("send-msg", {
          to: selectedUser._id,
          from: currentUser._id,
          message: msg,
        });

        // Cập nhật danh sách tin nhắn
        const updatedMessages = [...messages];
        updatedMessages.push({ fromSelf: true, message: msg });
        setMessages(updatedMessages);

        // Xóa nội dung tin nhắn sau khi gửi
        setMsg("");
        setShowPicker(false);
      } else {
        console.error("Failed to add message:", response.data.msg);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Toggle sidebar khi ở chế độ mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Chọn người dùng và đóng sidebar trên mobile
  const handleSelectUser = (contact) => {
    setSelectedUser(contact);

    // Nếu đang ở chế độ mobile, đóng sidebar sau khi chọn người dùng
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    getUser();
  }, []);

  useEffect(() => {
    if (currentUser && !socket.current) {
      socket.current = io(APP_HOST, { withCredentials: true });

      socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current.id);
      });

      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socket.current.emit("add-user", currentUser._id);
      getContacts();

      // Lắng nghe sự kiện msg-recieve
      socket.current.on("msg-receive", (data) => {
        console.log("Message received via socket:", data);

        // Chỉ thêm tin nhắn nếu thuộc về cuộc trò chuyện hiện tại
        if (data.from === selectedUser?._id || data.to === selectedUser?._id) {
          setIncoming({
            fromSelf: false,
            message: data.message,
            from: data.from,
          });
        } else {
          console.log("Message does not belong to the current chat.");
        }
      });
    }
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      getAllMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (incoming) {
      setMessages((prev) => [...prev, incoming]);
    }
  }, [incoming]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Lấy thời gian hiện tại
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={`message-container ${showSidebar ? "sidebar-active" : ""}`}>
      <div className="menu-button">
        {showSidebar ? (
          <MdClose onClick={toggleSidebar} />
        ) : (
          <MdMenu onClick={toggleSidebar} />
        )}
      </div>

      <div className={`conversation-list ${showSidebar ? "active" : ""}`}>
        <div className="conversation-header">
          <h2>Conversation</h2>
        </div>
        <div className="search-container">
          <SearchComponant
            onSearch={setSerchText}
            placeholder="Tìm kiếm người dùng..."
          />
        </div>
        <div className="user-list">
          {contacts
            .filter(
              (contact) =>
                contact.username
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                contact.name?.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((contact) => (
              <div
                key={contact._id}
                onClick={() => handleSelectUser(contact)}
                className={`user-item ${
                  selectedUser?._id === contact._id ? "active" : ""
                }`}
              >
                <div className="avatar">
                  <BsPersonCircle />
                </div>
                <div className="user-info">
                  <h4>{contact.username || contact.name}</h4>
                  <p className="last-message">Click to start chatting</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="chat-container">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="user-profile">
                <div className="avatar">
                  <BsPersonCircle />
                </div>
                <div className="user-info">
                  <h3>{selectedUser.username || selectedUser.name}</h3>
                  <span className="status">Online</span>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={uuidv4()}
                    className={`message-wrapper ${
                      message.fromSelf ? "sended" : "received"
                    }`}
                    ref={scrollRef}
                  >
                    <div className="message-content">
                      <p>{message.message}</p>
                      <span className="message-time">{getCurrentTime()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">
                  <p>
                    Let's start the conversation with{" "}
                    {selectedUser.username || selectedUser.name}
                  </p>
                </div>
              )}
            </div>

            {showPicker && (
              <div className="emoji-container">
                <Picker
                  onEmojiClick={(emojiObject) =>
                    setMsg((prevMsg) => prevMsg + emojiObject.emoji)
                  }
                />
              </div>
            )}

            <div className="input-container">
              <div className="emoji-button">
                <MdOutlineEmojiEmotions
                  onClick={() => setShowPicker(!showPicker)}
                />
              </div>
              <form onSubmit={handleSend}>
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                />
                <button type="submit">
                  <IoMdSend />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <BsPersonCircle />
            </div>
            <h2>Welcome to the messaging app</h2>
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
