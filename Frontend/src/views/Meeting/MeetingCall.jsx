import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../../services/Socket";
import peer from "../../services/peer";
import {
  Col,
  Container,
  Row,
  Offcanvas,
  ListGroup,
  Form,
  Button,
} from "react-bootstrap";
import { use } from "react";
import { stringify } from "uuid";

export const MeetingCall = () => {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();


  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }
  }, []);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const users = [];

  const visibleUsers = users.slice(0, 12);
  const extraUsersCount = users.length > 12 ? users.length - 12 : 0;

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { text: message, sender: "You", time: new Date().toLocaleTimeString() },
      ]);
      setMessage("");
    }
  };

  //#region Socket Events
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  //#endregion
  return (
    <Container
      fluid
      className="bg-dark text-light vh-100 d-flex flex-column p-0"
    >
      <Row className="flex-grow-1 g-0 position-relative">
        {/* Main Video Grid */}
        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 gap-2">
          {visibleUsers.map((user, index) => (
            <div
              key={user.id}
              className="video-box bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center rounded-3 overflow-hidden position-relative transition-all"
              style={{
                width: `calc((100% / 4) - 16px)`,
                height: "200px",
                minWidth: "240px",
              }}
            >
              <div className="position-absolute top-0 left-0 p-2">
                <span className="badge bg-dark bg-opacity-75 text-white">
                  <i className="fas fa-microphone-slash me-1"></i>
                  {user.name}
                </span>
              </div>

              {user.isMe && (
                <div className="position-absolute bottom-0 start-0 m-2">
                  <span className="badge bg-primary">
                    <i className="fas fa-user me-1"></i>You
                  </span>
                </div>
              )}

              {index === 11 && extraUsersCount > 0 && (
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-90 d-flex flex-column justify-content-center align-items-center">
                  <div className="display-4">+{extraUsersCount}</div>
                  <div className="text-muted">More participants</div>
                </div>
              )}
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
                className={`fas ${showParticipants ? "fa-users" : "fa-comment"
                  }`}
              ></i>
              {showParticipants ? "Participants" : "Chat"}
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="p-0">
            {showParticipants ? (
              <ListGroup variant="flush" className="bg-transparent">
                {users.map((user) => (
                  <ListGroup.Item
                    key={user.id}
                    className="d-flex align-items-center bg-transparent text-light border-secondary"
                  >
                    <div
                      className={`position-relative ${user.isMe ? "text-primary" : ""
                        }`}
                    >
                      <i className="fas fa-user-circle me-2 fs-4"></i>
                      {user.isMe && (
                        <div className="position-absolute top-0 start-0 translate-middle badge bg-primary rounded-circle p-1"></div>
                      )}
                    </div>
                    {user.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="d-flex flex-column h-100">
                <div className="flex-grow-1 overflow-auto p-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-3 d-flex ${msg.sender === "You"
                        ? "justify-content-end"
                        : "justify-content-start"
                        }`}
                    >
                      <div
                        className={`rounded-3 p-3 ${msg.sender === "You"
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
                className={`fas ${isMicOn ? "fa-microphone" : "fa-microphone-slash"
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
