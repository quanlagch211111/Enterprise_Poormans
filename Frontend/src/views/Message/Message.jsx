import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBTextArea,
} from "mdb-react-ui-kit";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import styled from "styled-components";
import axios from "axios";

export const Message = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [msg, setMsg] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to track the selected user

  const getContacts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users/getuserforchat', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setContacts(response.data.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }
  }, []);
  useEffect(() => {
    if (userId) {
      getContacts();
    }
  }, []);

  const [centredModal, setCentredModal] = useState(false);

  const toggleOpen = () => setCentredModal(!centredModal);

  const sendChat = (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      console.log(`Message sent to ${selectedUser?.username || "unknown"}:`, msg); // Replace with actual send logic
      setMsg("");
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="chat-container">
          <div className="sidebar-chart">
            <div className="search-bar d-flex gap-2">
              <input type="text" placeholder="Search here..." />
              <MDBBtn onClick={toggleOpen}>+</MDBBtn>
            </div>
            <div className="chats">
              <h3>Chats</h3>
              <ul>
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <li
                      key={contact._id}
                      className="d-flex align-items-center gap-2"
                      onClick={() => setSelectedUser(contact)} // Set the selected user on click
                      style={{
                        cursor: "pointer",
                        backgroundColor: selectedUser?._id === contact._id ? "#f0f0f0" : "transparent",
                      }}
                    >
                      <img
                        src={contact.avatar || "https://via.placeholder.com/40"}
                        alt={contact.username}
                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                      />
                      {contact.username || contact.name}
                    </li>
                  ))
                ) : (
                  <li>No contacts found</li>
                )}
              </ul>
            </div>
          </div>
          <div className="chat-window">
            <div className="chat-header">
              {selectedUser ? (
                <>
                  <img
                    src={selectedUser.avatar || "https://via.placeholder.com/40"}
                    alt={selectedUser.username}
                  />
                  <div className="header-info">
                    <h2>{selectedUser.username || selectedUser.name}</h2>
                    <p>Online</p>
                  </div>
                </>
              ) : (
                <p>Select a user to start chatting</p>
              )}
            </div>
            <div className="chat-messages">
              <div className="message received">
                <p>Hello Nella!</p>
              </div>
              <div className="message sent">
                <p>Can you arrange schedule for next meeting?</p>
              </div>
            </div>

            {/* Updated Chat Input Section */}
            {showPicker && (
              <EmojiContainer>
                <Picker
                  onEmojiClick={(emojiObject) =>
                    setMsg((prevMsg) => prevMsg + emojiObject.emoji)
                  }
                />
              </EmojiContainer>
            )}
            <Container>
              <form onSubmit={(e) => sendChat(e)} className="input-container">
                <div className="emoji">
                  <MdOutlineEmojiEmotions
                    onClick={() => {
                      setShowPicker(!showPicker);
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder={`Message ${selectedUser?.username || "..."}`}
                  disabled={!selectedUser} // Disable input if no user is selected
                />
                <button type="submit" disabled={!selectedUser}>
                  <IoMdSend />
                </button>
              </form>
            </Container>
          </div>
        </div>
      </div>

      {/* Modal for creating a new message */}
      <MDBModal
        tabIndex="-1"
        open={centredModal}
        onClose={() => setCentredModal(false)}
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create New Message</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="d-flex flex-column gap-2">
                <MDBInput label="Username" id="typeText" type="text"></MDBInput>
                <MDBTextArea
                  label="Message"
                  id="textAreaExample"
                  rows="{4}"
                ></MDBTextArea>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn>Send</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

const EmojiContainer = styled.div`
  position: absolute;
  margin-top: 7.1rem;
  margin-left: 30px;
  z-index: 1;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ededea;
  padding: 0 2rem;

  .input-container {
    width: 100%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: white;

    .emoji {
      position: relative;
      margin-top: 0.4rem;
      margin-left: 1rem;
      svg {
        color: #a8a8a8;
        font-size: 1.5rem;
        cursor: pointer;
      }
    }

    input {
      width: 100%;
      height: 60%;
      background-color: white;
      color: grey;
      border: none;
      border-radius: 0.2rem;
      font-size: 1.2rem;
      &::placeholder {
        font-size: 1rem;
      }
      &:focus {
        outline: none;
      }
    }

    button {
      border-radius: 0.5rem;
      width: 4rem;
      height: 2.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #128c7e;
      border: none;
      svg {
        font-size: 1.5rem;
        color: white;
      }
    }
  }
`;