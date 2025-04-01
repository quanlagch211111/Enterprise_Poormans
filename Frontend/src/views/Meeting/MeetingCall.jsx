import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Col,
  Container,
  Row,
  Offcanvas,
  ListGroup,
  Form,
  Button,
} from "react-bootstrap";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3001"; // Replace with your backend URL

export const MeetingCall = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const [userInfo, setUserInfo] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { userId },
    });

    // Join the meeting room
    const roomId = "meeting-room-id"; // Replace with dynamic room ID
    socketRef.current.emit("join-room", { room_id: roomId, user_id: userId });

    // Handle user joined
    socketRef.current.on("user-joined", ({ user_id }) => {
      setParticipants((prev) => [...prev, user_id]);
    });

    // Handle user left
    socketRef.current.on("user-left", ({ user_id }) => {
      setParticipants((prev) => prev.filter((id) => id !== user_id));
    });

    // Handle incoming messages
    socketRef.current.on("msg-recieve", (data) => {
      setMessages((prev) => [
        ...prev,
        { text: data.message, sender: data.from, time: new Date().toLocaleTimeString() },
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.emit("leave-room", { room_id: roomId, user_id: userId });
      socketRef.current.disconnect();
    };
  }, [accessToken, navigate, userId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const roomId = "meeting-room-id"; // Replace with dynamic room ID
      socketRef.current.emit("send-msg", {
        to: roomId,
        from: userId,
        message,
      });
      setMessages((prev) => [
        ...prev,
        { text: message, sender: "You", time: new Date().toLocaleTimeString() },
      ]);
      setMessage("");
    }
  };

  return (
    <Container
      fluid
      className="bg-dark text-light vh-100 d-flex flex-column p-0"
    >
      <Row className="flex-grow-1 g-0 position-relative">
        {/* Main Video Grid */}
        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 gap-2">
          {participants.map((participant, index) => (
            <div
              key={participant}
              className="video-box bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center rounded-3 overflow-hidden position-relative transition-all"
              style={{
                width: `calc((100% / 4) - 16px)`,
                height: "200px",
                minWidth: "240px",
              }}
            >
              <div className="position-absolute top-0 left-0 p-2">
                <span className="badge bg-dark bg-opacity-75 text-white">
                  {participant === userId ? "You" : `User ${participant}`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <Offcanvas
          show={showParticipants || showChat}
          onHide={() => {
            setShowParticipants(false);
            setShowChat(false);
          }}
          placement="end"
          className="w-25 bg-dark text-light"
          backdropClassName="bg-dark bg-opacity-75"
        >
          <Offcanvas.Header className="border-bottom border-secondary">
            <Offcanvas.Title className="d-flex align-items-center gap-2">
              <i
                className={`fas ${
                  showParticipants ? "fa-users" : "fa-comment"
                }`}
              ></i>
              {showParticipants ? "Participants" : "Chat"}
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="p-0">
            {showParticipants ? (
              <ListGroup variant="flush" className="bg-transparent">
                {participants.map((participant) => (
                  <ListGroup.Item
                    key={participant}
                    className="d-flex align-items-center bg-transparent text-light border-secondary"
                  >
                    <div
                      className={`position-relative ${
                        participant === userId ? "text-primary" : ""
                      }`}
                    >
                      <i className="fas fa-user-circle me-2 fs-4"></i>
                    </div>
                    {participant === userId ? "You" : `User ${participant}`}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="d-flex flex-column h-100">
                <div className="flex-grow-1 overflow-auto p-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-3 d-flex ${
                        msg.sender === "You"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`rounded-3 p-3 ${
                          msg.sender === "You"
                            ? "bg-primary text-white"
                            : "bg-secondary bg-opacity-25"
                        }`}
                        style={{ maxWidth: "75%" }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="fw-bold">{msg.sender}</small>
                          <small className="ms-2 opacity-75">{msg.time}</small>
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top border-secondary p-3">
                  <Form.Group className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type a message"
                      className="bg-dark border-secondary text-light"
                    />
                    <Button
                      variant="primary"
                      onClick={handleSendMessage}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className="fas fa-paper-plane"></i>
                      <span>Send</span>
                    </Button>
                  </Form.Group>
                </div>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </Row>

      {/* Control Bar */}
      <div className="border-top border-secondary bg-dark bg-opacity-75 py-3">
        <div className="d-flex justify-content-between align-items-center px-4">
          <div className="d-flex gap-3">
            <Button
              variant={isMicOn ? "outline-light" : "danger"}
              onClick={() => setIsMicOn(!isMicOn)}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <i
                className={`fas ${
                  isMicOn ? "fa-microphone" : "fa-microphone-slash"
                }`}
              ></i>
              <span>{isMicOn ? "Mute" : "Unmute"}</span>
            </Button>

            <Button
              variant={isCamOn ? "outline-light" : "danger"}
              onClick={() => setIsCamOn(!isCamOn)}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <i
                className={`fas ${isCamOn ? "fa-video" : "fa-video-slash"}`}
              ></i>
              <span>{isCamOn ? "Stop Video" : "Start Video"}</span>
            </Button>
          </div>

          <div className="d-flex gap-3">
            <Button
              variant={showChat ? "primary" : "outline-light"}
              onClick={() => setShowChat(!showChat)}
              className="rounded-pill px-4"
            >
              <i className="fas fa-comment-dots me-2"></i>
              Chat
            </Button>

            <Button
              variant={showParticipants ? "primary" : "outline-light"}
              onClick={() => setShowParticipants(!showParticipants)}
              className="rounded-pill px-4"
            >
              <i className="fas fa-users me-2"></i>
              Participants
            </Button>

            <Button variant="outline-light" className="rounded-pill px-4">
              <i className="fas fa-share-square me-2"></i>
              Share
            </Button>
          </div>

          <Button
            variant="danger"
            onClick={() => console.log("Leave meeting")}
            className="rounded-pill px-4"
          >
            <i className="fas fa-phone-slash me-2"></i>
            Leave
          </Button>
        </div>
      </div>
    </Container>
  );
};