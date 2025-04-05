import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import axios from "../../services/AxiosCustom";
import { io } from "socket.io-client";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import Picker from "emoji-picker-react";

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
      const response = await axios.get(`/users/getuserforchat/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
      } else {
        console.error("Failed to add message:", response.data.msg);
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
      socket.current.on("msg-recieve", (data) => {
        console.log("Message received via socket:", data);
        // console.log("Selected user:", data.data.from);

        // Chỉ thêm tin nhắn nếu thuộc về cuộc trò chuyện hiện tại
        if (data.from === selectedUser?._id || data.to === selectedUser?._id) {
          setIncoming({ fromSelf: false, message: data.message, from: data.from });
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

  return (
    <Container>
      <div className="sidebar">
        <h3>Contacts</h3>
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact._id}
              onClick={() => setSelectedUser(contact)}
              className={selectedUser?._id === contact._id ? "active" : ""}
            >
              {contact.username || contact.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-container">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h3>{selectedUser.username || selectedUser.name}</h3>
            </div>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={uuidv4()}
                  className={`message ${message.fromSelf ? "sended" : "received"}`}
                  ref={scrollRef}
                >
                  <p>{message.message}</p>
                </div>
              ))}
            </div>
            {showPicker && (
              <EmojiContainer>
                <Picker
                  onEmojiClick={(emojiObject) =>
                    setMsg((prevMsg) => prevMsg + emojiObject.emoji)
                  }
                />
              </EmojiContainer>
            )}
            <div className="input-container">
              <div className="emoji">
                <MdOutlineEmojiEmotions
                  onClick={() => setShowPicker(!showPicker)}
                />
              </div>
              <form onSubmit={handleSend}>
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Type a message"
                />
                <button type="submit">
                  <IoMdSend />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="no-chat">
            <h3>Select a user to start chatting</h3>
          </div>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;

  .sidebar {
    width: 25%;
    background-color: #f0f0f0;
    padding: 1rem;
    overflow-y: auto;

    h3 {
      margin-bottom: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 0.5rem;
        cursor: pointer;
        border-radius: 0.5rem;

        &:hover,
        &.active {
          background-color: #d1d1d1;
        }
      }
    }
  }

  .chat-container {
    width: 75%;
    display: flex;
    flex-direction: column;

    .chat-header {
      padding: 1rem;
      background-color: #075e54;
      color: white;
    }

    .chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      background-color: #ece5dd;

      .message {
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        max-width: 60%;
        word-wrap: break-word;

        &.sended {
          background-color: #dcf8c6;
          align-self: flex-end;
          text-align: right;
          margin-left: auto;
        }

        &.received {
          background-color: white;
          align-self: flex-start;
          text-align: left;
          margin-right: auto;
        }
      }
    }

    .input-container {
      display: flex;
      align-items: center;
      padding: 1rem;
      background-color: #f0f0f0;

      .emoji {
        margin-right: 1rem;
        cursor: pointer;

        svg {
          font-size: 1.5rem;
          color: #888;
        }
      }

      form {
        display: flex;
        flex: 1;

        input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          margin-right: 1rem;
        }

        button {
          background-color: #075e54;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;

          svg {
            font-size: 1.2rem;
          }
        }
      }
    }

    .no-chat {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #888;
    }
  }
`;

const EmojiContainer = styled.div`
  position: absolute;
  bottom: 100px;
  left: 20px;
  z-index: 1000;
`;