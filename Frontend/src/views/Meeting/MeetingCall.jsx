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
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const peersRef = useRef({});
  const socketRef = useRef();
  const screenTrackRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Format time for recording display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize meeting
  useEffect(() => {
    const path = window.location.pathname.split('/');
    const id = path[path.length - 1];
    if (!id) {
      navigate('/');
      return;
    }
    setRoomId(id);

    socketRef.current = io(process.env.REACT_APP_SOCKET_PORT, {
      withCredentials: true
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        peerInstance.current = new Peer(undefined, {
          path: "/peerjs",
          host: "/",
          port: window.location.protocol === "https:" ? 443 : 80, 
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
          const remoteMediaStream = new MediaStream();

          call.on('stream', () => {
            // Handle stream if needed
          });

          call.peerConnection.ontrack = (event) => {
            remoteMediaStream.addTrack(event.track);
            setRemoteStream(remoteMediaStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteMediaStream;
            }
          };
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

        const handleNewMessage = (message) => {
          const formattedMessage = {
            text: message.text,
            sender: message.sender === peerInstance.current?.id ? "You" : "Participant",
            time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setMessages(prev => {
            const messageExists = prev.some(
              msg => msg.text === formattedMessage.text &&
                msg.sender === formattedMessage.sender &&
                msg.time === formattedMessage.time
            );
            return messageExists ? prev : [...prev, formattedMessage];
          });
        };

        socketRef.current.on('new-message', handleNewMessage);

        socketRef.current.on('message-history', (history) => {
          setMessages(history.map(msg => ({
            text: msg.text,
            sender: msg.sender === peerInstance.current?.id ? "You" : "Participant",
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        });
      })
      .catch(err => {
        console.error("Failed to get media devices", err);
      });

    return () => {
      if (isRecording) {
        // stopRecording();
        stopScreenRecording();
      }
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [roomId, navigate]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat functions
  const handleSendMessage = () => {
    if (message.trim() && socketRef.current && peerInstance.current?.id) {
      socketRef.current.emit('send-message', {
        roomId,
        userId: peerInstance.current.id,
        text: message
      });
      setMessage("");
    }
  };

  // Media control functions
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

  // Screen sharing functions
  const toggleScreenSharing = async () => {
    if (!myStream || !peerInstance.current) return;

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        for (let peerId in peersRef.current) {
          const sender = peersRef.current[peerId].peerConnection
            .getSenders()
            .find(s => s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        }

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = new MediaStream([
            screenTrack,
            ...myStream.getAudioTracks(),
          ]);
        }

        screenTrack.onended = () => {
          stopScreenSharing();
        };

        screenTrackRef.current = screenTrack;
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Screen sharing failed", err);
      }
    } else {
      stopScreenSharing();
    }
  };

  const stopScreenSharing = () => {
    if (!screenTrackRef.current) return;

    for (let peerId in peersRef.current) {
      const sender = peersRef.current[peerId].peerConnection
        .getSenders()
        .find(s => s.track.kind === 'video');
      if (sender) {
        const videoTrack = myStream.getVideoTracks()[0];
        sender.replaceTrack(videoTrack);
      }
    }

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = myStream;
    }

    screenTrackRef.current.stop();
    screenTrackRef.current = null;
    setIsScreenSharing(false);
  };


  const startScreenRecording = async () => {
    try {
      // Yêu cầu quyền truy cập vào màn hình (desktop hoặc cửa sổ ứng dụng)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true // Có thể ghi lại cả âm thanh từ hệ thống nếu cần
      });
  
      if (!screenStream) {
        console.error("No screen stream available for recording");
        return;
      }
  
      recordedChunksRef.current = [];
  
      // Tạo MediaRecorder để ghi lại video từ màn hình
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000, // Cài đặt băng thông video
      };
  
      mediaRecorderRef.current = new MediaRecorder(screenStream, options);
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
  
      mediaRecorderRef.current.onstop = () => {
        // Khi ghi xong, tạo URL và tải video xuống
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `screen-recording-${new Date().toISOString()}.webm`;
        document.body.appendChild(a);
        a.click();
        
        // Dọn dẹp sau khi tải xong
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      };
  
      // Bắt đầu ghi
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
  
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting screen recording:", err);
    }
  };
  
  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };
  

  const toggleRecording = () => {
    if (isRecording) {
      // stopRecording();
      stopScreenRecording();
    } else {
      // startRecording();
      startScreenRecording();
    }
  };

  // Meeting control
  const leaveMeeting = () => {
    if (isRecording) {
      // stopRecording();
      stopScreenRecording();
    }
    navigate('/');
  };

  // Participants data
  const users = [
    { id: 'me', name: 'You', isMe: true, isSpeaking: isMicOn },
    ...(remoteStream ? [{ id: 'remote', name: 'Participant', isMe: false, isSpeaking: true }] : [])
  ];

  const visibleUsers = users.slice(0, 4);
  const extraUsersCount = users.length > 4 ? users.length - 4 : 0;

  return (
    <Container fluid className="bg-dark text-light vh-100 d-flex flex-column p-0">
      {/* Simple Recording Indicator */}
      {isRecording && (
        <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-3">
          <div className="d-flex align-items-center bg-danger bg-opacity-75 rounded-pill px-3 py-1">
            <div className="pulsating-recording-indicator me-2"></div>
            <span className="me-2">REC</span>
            <span>{formatTime(recordingTime)}</span>
          </div>
        </div>
      )}

      {/* Main Meeting Area */}
      <Row className="flex-grow-1 g-0 position-relative">
        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 gap-2">
          {visibleUsers.map((user) => (
            <div
              key={user.id}
              className="video-box bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center rounded-3 overflow-hidden position-relative"
              style={{
                width: `calc((100% / ${Math.min(users.length, 2)}) - 16px)`,
                height: "100",
                minWidth: "100",
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

        {/* Sidebar for Participants/Chat */}
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
                  <div ref={messagesEndRef} />
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

            <Button
              variant={isScreenSharing ? "warning" : "outline-light"}
              onClick={toggleScreenSharing}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <i className="fas fa-desktop"></i>
              <span>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</span>
            </Button>

            <Button
              variant={isRecording ? "danger" : "outline-light"}
              onClick={toggleRecording}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <i className={`fas ${isRecording ? "fa-stop" : "fa-circle"}`}></i>
              <span>{isRecording ? `Stop (${formatTime(recordingTime)})` : "Record"}</span>
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

      {/* CSS for recording indicator */}
      <style>
        {`
          .pulsating-recording-indicator {
            width: 12px;
            height: 12px;
            background-color: #ff0000;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
            }
          }
        `}
      </style>
    </Container>
  );
};
