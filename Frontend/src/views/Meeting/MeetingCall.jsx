import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Peer from "peerjs";
import io from 'socket.io-client';
import {
  Offcanvas,
  ListGroup,
  Form,
  Button,
  Container,
  Row,
} from "react-bootstrap";

export const MeetingCall = () => {
  const navigate = useNavigate();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [roomId, setRoomId] = useState("");

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const peersRef = useRef({});
  const socketRef = useRef();

  // Initialize meeting
  useEffect(() => {
    // Get room ID from URL
    const path = window.location.pathname.split('/');
    const id = path[path.length - 1];
    if (!id) {
      navigate('/'); // Redirect if no room ID
      return;
    }
    setRoomId(id);

    // Initialize socket connection
    socketRef.current = io("http://localhost:3001", {
      withCredentials: true
    });

    // Initialize media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        // Initialize PeerJS
        peerInstance.current = new Peer(undefined, {
          host: process.env.REACT_APP_PEER_HOST || 'localhost',
          port: process.env.REACT_APP_PEER_PORT || 3030,
          path: '/peerjs',
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        peerInstance.current.on('open', (id) => {
          socketRef.current.emit('join-room', roomId, id);
        });

        peerInstance.current.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });

        socketRef.current.on('user-connected', (userId) => {
          const call = peerInstance.current.call(userId, stream);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
          call.on('close', () => {
            setRemoteStream(null);
          });
          peersRef.current[userId] = call;
        });

        socketRef.current.on('user-disconnected', (userId) => {
          if (peersRef.current[userId]) {
            peersRef.current[userId].close();
          }
          setRemoteStream(null);
        });

        // Handle messages
        socketRef.current.on('createMessage', (message) => {
          setMessages(prev => [...prev, message]);
        });

      })
      .catch(err => {
        console.error("Failed to get media devices", err);
      });

    return () => {
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, navigate]);

  const handleSendMessage = () => {
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('message', {
        text: message,
        sender: "You",
        time: new Date().toLocaleTimeString()
      });
      setMessages(prev => [...prev, {
        text: message,
        sender: "You",
        time: new Date().toLocaleTimeString()
      }]);
      setMessage("");
    }
  };

  const toggleMic = () => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    }
  };

  const leaveMeeting = () => {
    navigate('/');
  };

  // Generate participant data for UI
  const users = [
    { id: 'me', name: 'You', isMe: true, isSpeaking: isMicOn },
    ...(remoteStream ? [{ id: 'remote', name: 'Participant', isMe: false, isSpeaking: true }] : [])
  ];

  const visibleUsers = users.slice(0, 4); // Show max 4 videos
  const extraUsersCount = users.length > 4 ? users.length - 4 : 0;

  return (
    <Container fluid className="bg-dark text-light vh-100 d-flex flex-column p-0">
      <Row className="flex-grow-1 g-0 position-relative">
        {/* Main Video Grid */}
        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 gap-2">
          {visibleUsers.map((user) => (
            <div
              key={user.id}
              className="video-box bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center rounded-3 overflow-hidden position-relative"
              style={{
                width: `calc((100% / ${Math.min(users.length, 2)}) - 16px)`,
                height: "200px",
                minWidth: "240px",
              }}
            >
              {user.id === 'me' ? (
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted
                  className="h-100 w-100 object-fit-cover"
                />
              ) : (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  className="h-100 w-100 object-fit-cover"
                />
              )}

              <div className="position-absolute top-0 left-0 p-2">
                <span className={`badge ${user.isSpeaking ? 'bg-success' : 'bg-dark'} bg-opacity-75 text-white`}>
                  <i className={`fas fa-microphone${user.isSpeaking ? '' : '-slash'} me-1`}></i>
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
            </div>
          ))}

          {extraUsersCount > 0 && (
            <div className="video-box bg-secondary bg-opacity-10 d-flex flex-column justify-content-center align-items-center rounded-3 overflow-hidden"
              style={{ width: "240px", height: "200px" }}>
              <div className="display-4">+{extraUsersCount}</div>
              <div className="text-muted">More participants</div>
            </div>
          )}
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
              <i className={`fas ${showParticipants ? "fa-users" : "fa-comment"}`}></i>
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
              onClick={toggleMic}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <i className={`fas ${isMicOn ? "fa-microphone" : "fa-microphone-slash"}`}></i>
              <span>{isMicOn ? "Mute" : "Unmute"}</span>
            </Button>

            <Button
              variant={isCamOn ? "outline-light" : "danger"}
              onClick={toggleCam}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <i className={`fas ${isCamOn ? "fa-video" : "fa-video-slash"}`}></i>
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
            onClick={leaveMeeting}
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