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
import React, { useState } from "react";
export const Message = () => {
  const [centredModal, setCentredModal] = useState(false);

  const toggleOpen = () => setCentredModal(!centredModal);
  return (
    <>
      <div className="main-content">
        <div className="chat-container">
          <div className="sidebar-chart">
            <div className="search-bar d-flex gap-2">
              <input type="text" placeholder="Search here..." />
              <MDBBtn onClick={toggleOpen}>+</MDBBtn>
            </div>
            <div className="contacts">
              <h3>Contacts</h3>
              <ul>
                <li>
                  <img
                    src="https://gamek.mediacdn.vn/133514250583805952/2024/4/8/visual-avata-1712548856362-1712548857464569977792.jpg"
                    alt="Contact 1"
                  />{" "}
                  Contact 1
                </li>
                <li>
                  <img
                    src="https://gamek.mediacdn.vn/133514250583805952/2024/4/8/visual-avata-1712548856362-1712548857464569977792.jpg"
                    alt="Contact 2"
                  />{" "}
                  Contact 2
                </li>
                <li>
                  <img
                    src="https://gamek.mediacdn.vn/133514250583805952/2024/4/8/visual-avata-1712548856362-1712548857464569977792.jpg"
                    alt="Contact 3"
                  />{" "}
                  Contact 3
                </li>
              </ul>
            </div>
            <div className="chats">
              <h3>Chats</h3>
              <ul>
                <li>
                  <img src="chat1.jpg" alt="Design Team" /> Design Team (32)
                </li>
                <li>
                  <img src="chat1.jpg" alt="Design Team" /> Design Team (32)
                </li>
                <li>
                  <img src="chat1.jpg" alt="Design Team" /> Design Team (32)
                </li>
                <li>
                  <img src="chat1.jpg" alt="Design Team" /> Design Team (32)
                </li>
                <li>
                  <img src="chat1.jpg" alt="Design Team" /> Design Team (32)
                </li>
                <li>
                  <img src="chat1.jpg" alt="Design Team" /> Design Team (32)
                </li>
              </ul>
            </div>
          </div>
          <div className="chat-window">
            <div className="chat-header">
              <img
                src="https://gamek.mediacdn.vn/133514250583805952/2024/4/8/visual-avata-1712548856362-1712548857464569977792.jpg"
                alt="Jordan"
              />
              <div className="header-info">
                <h2>Jordan</h2>
                <p>Online</p>
              </div>
            </div>
            <div className="chat-messages">
              <div className="message received">
                <p>Hello Nella!</p>
              </div>
              <div className="message sent">
                <p>Can you arrange schedule for next meeting?</p>
              </div>
              <div className="message sent">
                <p>Can you arrange schedule for next meeting?</p>
              </div>
              <div className="message sent">
                <p>Can you arrange schedule for next meeting?</p>
              </div>
              <div className="message received">
                <p>Hello Nella!</p>
              </div>
              <div className="message sent">
                <p>Can you arrange schedule for next meeting?</p>
              </div>
              <div className="message received">
                <p>Hello Nella!</p>
              </div>
              <div className="message sent">
                <p>Can you arrange schedule for next meeting?</p>
              </div>
              <div className="message received">
                <p>Hello Nella!</p>
              </div>
              <div className="message sent">
                <p>Can you arrange schedule for next meeting?</p>
              </div>
              <div className="message received">
                <p>Hello Nella!</p>
              </div>
              <div className="message sent">
                <p>Can you arrange schedule for next meeting?</p>
              </div>
              <div className="message received">
                <p>Hello Nella!</p>
              </div>
            </div>

            <div className="chat-input">
              <input type="text" placeholder="message..." />
              <button className="send-btn">Send</button>
            </div>
          </div>
        </div>
      </div>

      {/* modal create */}
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
