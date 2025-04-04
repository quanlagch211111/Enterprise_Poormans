import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';
import FirebaseSignaling from "../../services/firebaseSignaling";
import PeerService from "../../services/peer";
import {
  Container, Row, Offcanvas,
  ListGroup, Form, Button
} from "react-bootstrap";

export const MeetingCall = () => {
  const navigate = useNavigate();
  const videoGridRef = useRef(null);
  const myVideoRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const [stream, setStream] = useState(null);
  const peers = useRef({});
  const location = useLocation();
  const roomId = location.pathname.split('/').pop();
  
  // Khởi tạo services
  const signaling = useRef(null);
  const peerService = useRef(null);

  // UI states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // Thêm video stream vào grid
  const addVideoStream = useCallback((videoElement, stream) => {
    if (videoElement && videoGridRef.current) {
      videoElement.srcObject = stream;
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
      });
      videoGridRef.current.append(videoElement);
    }
  }, []);

  // Kết nối với peer mới
  const connectToNewUser = useCallback((peerId, localStream) => {
    if (!localStream || peers.current[peerId]) return;
  
    if (!peerService.current || !peerService.current.peer) {
      console.error("PeerJS instance is not initialized.");
      return;
    }
  
    const call = peerService.current.peer.call(peerId, localStream);
    if (!call) {
      console.error(`Failed to create a call with peerId: ${peerId}`);
      return;
    }
    else {
      console.log(`Calling peerId: ${peerId}`);
    }
  
    const video = document.createElement("video");
  
    call.on("stream", (userVideoStream) => {
      console.log(`Received stream from peerId: ${peerId}`);
      addVideoStream(video, userVideoStream);
    });
  
    call.on("close", () => {
      console.log(`Call closed with peerId: ${peerId}`);
      video.remove();
      delete peers.current[peerId];
    });
  
    call.on("error", (error) => {
      console.error(`Error in call with peerId: ${peerId}`, error);
    });
  
    peers.current[peerId] = call;
  }, [addVideoStream]);

  // Xử lý khi nhận call
  const setupCallAnswer = useCallback((localStream) => {
    if (!peerService.current || !peerService.current.peer) {
      console.error("PeerJS instance is not initialized.");
      return;
    }
  
    peerService.current.on("call", (call) => {
      if (!call) {
        console.error("Received an invalid call object.");
        return;
      }
  
      call.answer(localStream);
      console.log(`Answering call from peerId: ${call.peer}`);
      const video = document.createElement("video");
  
      call.on("stream", (userVideoStream) => {
        console.log(`Received stream from peerId: ${call.peer}`);
        addVideoStream(video, userVideoStream);
      });
  
      call.on("close", () => {
        console.log(`Call closed with peerId: ${call.peer}`);
        video.remove();
      });
  
      call.on("error", (error) => {
        console.error(`Error in call with peerId: ${call.peer}`, error);
      });
    });
  }, [addVideoStream]);

  // Khởi tạo stream video/audio
  const initStream = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isCamOn,
        audio: isMicOn
      });
      setStream(mediaStream);
      addVideoStream(myVideoRef.current, mediaStream);
      return mediaStream;
    } catch (err) {
      console.error('Failed to get media stream', err);
      return null;
    }
  }, [isCamOn, isMicOn, addVideoStream]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { text: message, sender: "You", time: new Date().toLocaleTimeString() },
      ]);
      setMessage("");
    }
  };

  // Thiết lập signaling và WebRTC
  useEffect(() => {
    console.log("Initializing PeerJS and Firebase Signaling...");
    console.log("User ID:", userId);
    console.log("Room ID:", roomId);
  
    const initialize = async () => {
      try {
        signaling.current = new FirebaseSignaling(roomId, userId);
        await signaling.current.initialize();
        console.log("Firebase signaling initialized.");
  
        peerService.current = new PeerService(userId);
        console.log("PeerJS instance created.", peerService.current);
  
        const localStream = await initStream();
        if (!localStream) {
          console.error("Failed to initialize local stream.");
          return;
        }
  
        await signaling.current.joinRoom();
        console.log("Joined room:", roomId);
  
        setupCallAnswer(localStream);
  
        signaling.current.onPeerJoined((peerId) => {
          console.log("New peer joined:", peerId);
          connectToNewUser(peerId, localStream);
        });
  
        signaling.current.onSignalReceived((signal) => {
          console.log("Signal received:", signal);
          peerService.current.peer.signal(signal);
        });
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
  
    initialize();
  
    return () => {
      console.log("Cleaning up resources...");
      if (signaling.current) {
        signaling.current.cleanup();
        signaling.current.leaveRoom();
      }
  
      if (peerService.current) {
        peerService.current.destroy();
      }
  
      Object.values(peers.current).forEach((call) => call.close());
  
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [accessToken, navigate, roomId, userId, initStream, setupCallAnswer, connectToNewUser]);

  // Xử lý tắt/bật mic và camera
  useEffect(() => {
    if (!stream) return;

    stream.getAudioTracks().forEach(track => {
      track.enabled = isMicOn;
    });
  }, [isMicOn, stream]);

  useEffect(() => {
    if (!stream) return;

    stream.getVideoTracks().forEach(track => {
      track.enabled = isCamOn;
    });
  }, [isCamOn, stream]);

  return (
    <Container fluid className="bg-dark text-light vh-100 d-flex flex-column p-0">
      <Row className="flex-grow-1 g-0 position-relative">
        {/* Video Grid */}
        <div
          ref={videoGridRef}
          className="d-flex flex-wrap justify-content-center align-items-center p-2 gap-2"
          id="video-grid"
        >
          <video 
            ref={myVideoRef} 
            className="bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center rounded-3 overflow-hidden position-relative transition-all"
            style={{
              width: `calc((100% / 4) - 16px)`,
              height: "200px",
              minWidth: "240px",
            }}
          />
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
              <i className={`fas ${showParticipants ? "fa-users" : "fa-comment"}`} />
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
                    <div className={`position-relative ${user.isMe ? "text-primary" : ""}`}>
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
                      className={`mb-3 d-flex ${msg.sender === "You" ? "justify-content-end" : "justify-content-start"}`}
                    >
                      <div
                        className={`rounded-3 p-3 ${msg.sender === "You" ? "bg-primary text-white" : "bg-secondary bg-opacity-25"}`}
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
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
              <i className={`fas ${isMicOn ? "fa-microphone" : "fa-microphone-slash"}`} />
              <span>{isMicOn ? "Mute" : "Unmute"}</span>
            </Button>

            <Button
              variant={isCamOn ? "outline-light" : "danger"}
              onClick={() => setIsCamOn(!isCamOn)}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <i className={`fas ${isCamOn ? "fa-video" : "fa-video-slash"}`} />
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
          </div>

          <Button
            variant="danger"
            onClick={() => navigate("/")}
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