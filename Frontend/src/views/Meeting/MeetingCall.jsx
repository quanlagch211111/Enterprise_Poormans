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
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [myStream, setMyStream] = useState(null);
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
  const [roomFull, setRoomFull] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const myVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const peerInstance = useRef(null);
  const peersRef = useRef({});
  const socketRef = useRef();
  const screenTrackRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const MAX_PARTICIPANTS = 10;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
          ],
          iceTransportPolicy: 'all',
          iceCandidatePoolSize: 9,
        },
        debug: 0,
    });


        peerInstance.current.on('open', (id) => {
          setConnectionStatus('connected');
          socketRef.current.emit('join-room', roomId, id);
        });

        peerInstance.current.on('call', (call) => {
          call.answer(stream);
          
          call.on('stream', (remoteStream) => {
            setRemoteStreams(prev => {
              if (!prev.some(s => s.id === call.peer)) {
                return [...prev, { id: call.peer, stream: remoteStream }];
              }
              return prev;
            });
          });
          
          call.on('close', () => {
            setRemoteStreams(prev => prev.filter(s => s.id !== call.peer));
          });
          
          peersRef.current[call.peer] = call;
        });

        peerInstance.current.on('disconnected', () => {
          setConnectionStatus('disconnected');
          setTimeout(() => {
            if (peerInstance.current && peerInstance.current.disconnected) {
              peerInstance.current.reconnect();
            }
          }, 2000);
        });

        peerInstance.current.on('error', (err) => {
          console.error('PeerJS error:', err);
          setConnectionStatus('error');
        });

        socketRef.current.on('user-connected', (userId) => {
          if (Object.keys(peersRef.current).length >= MAX_PARTICIPANTS) {
            setRoomFull(true);
            return;
          }
          
          if (!peersRef.current[userId]) {
            const call = peerInstance.current.call(userId, stream);
            
            call.on('stream', (remoteStream) => {
              setRemoteStreams(prev => {
                if (!prev.some(s => s.id === userId)) {
                  return [...prev, { id: userId, stream: remoteStream }];
                }
                return prev;
              });
            });
            
            call.on('close', () => {
              setRemoteStreams(prev => prev.filter(s => s.id !== userId));
              delete peersRef.current[userId];
            });
            
            peersRef.current[userId] = call;
          }
        });

        socketRef.current.on('user-disconnected', (userId) => {
          if (peersRef.current[userId]) {
            peersRef.current[userId].close();
          }
          setRemoteStreams(prev => prev.filter(s => s.id !== userId));
          delete peersRef.current[userId];
          setRoomFull(false);
        });

        socketRef.current.on('room-full', () => {
          setRoomFull(true);
        });

        const handleNewMessage = (message) => {
          const formattedMessage = {
            text: message.text,
            sender: message.sender === peerInstance.current?.id ? "You" : `Participant ${remoteStreams.findIndex(s => s.id === message.sender) + 1}`,
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
            sender: msg.sender === peerInstance.current?.id ? "You" : `Participant ${remoteStreams.findIndex(s => s.id === msg.sender) + 1}`,
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        });
      })
      .catch(err => {
        console.error("Failed to get media devices", err);
      });

    return () => {
      if (isRecording) {
        stopScreenRecording();
      }
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      Object.values(peersRef.current).forEach(call => call.close());
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const toggleScreenSharing = async () => {
    if (!myStream || !peerInstance.current) return;

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
        });
        
        const screenVideoTrack = screenStream.getVideoTracks()[0];
        const screenAudioTrack = screenStream.getAudioTracks()[0];
        
        Object.values(peersRef.current).forEach(call => {
          const pc = call.peerConnection;
          
          const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (videoSender) videoSender.replaceTrack(screenVideoTrack);
          
          if (screenAudioTrack) {
            const audioSender = pc.getSenders().find(s => s.track?.kind === 'audio');
            if (audioSender) audioSender.replaceTrack(screenAudioTrack);
          }
        });

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = new MediaStream([
            screenVideoTrack,
            screenAudioTrack || myStream.getAudioTracks()[0]
          ]);
        }

        screenTrackRef.current = {
          video: screenVideoTrack,
          audio: screenAudioTrack
        };

        screenVideoTrack.onended = stopScreenSharing;
        if (screenAudioTrack) screenAudioTrack.onended = stopScreenSharing;
        
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

    screenTrackRef.current.video.stop();
    if (screenTrackRef.current.audio) screenTrackRef.current.audio.stop();
    
    Object.values(peersRef.current).forEach(call => {
      const pc = call.peerConnection;
      
      const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (videoSender && myStream.getVideoTracks()[0]) {
        videoSender.replaceTrack(myStream.getVideoTracks()[0]);
      }
      
      const audioSender = pc.getSenders().find(s => s.track?.kind === 'audio');
      if (audioSender && myStream.getAudioTracks()[0]) {
        audioSender.replaceTrack(myStream.getAudioTracks()[0]);
      }
    });

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = myStream;
    }

    screenTrackRef.current = null;
    setIsScreenSharing(false);
  };

  const startScreenRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true
      });
  
      if (!screenStream) {
        console.error("No screen stream available for recording");
        return;
      }
  
      recordedChunksRef.current = [];
  
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000,
      };
  
      mediaRecorderRef.current = new MediaRecorder(screenStream, options);
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
  
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `screen-recording-${new Date().toISOString()}.webm`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      };
  
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
      stopScreenRecording();
    } else {
      startScreenRecording();
    }
  };

  const leaveMeeting = () => {
    if (isRecording) {
      stopScreenRecording();
    }
    navigate('/');
  };

  const users = [
    { id: 'me', name: 'You', isMe: true, isSpeaking: isMicOn },
    ...remoteStreams.map((remote, index) => ({ 
      id: remote.id, 
      name: `Participant ${index + 1}`, 
      isMe: false, 
      isSpeaking: true 
    }))
  ];

  const visibleUsers = users.slice(0, 4);
  const extraUsersCount = users.length > 4 ? users.length - 4 : 0;

  return (
    <Container fluid className="bg-dark text-light vh-100 d-flex flex-column p-0">
      {isRecording && (
        <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-3">
          <div className="d-flex align-items-center bg-danger bg-opacity-75 rounded-pill px-3 py-1">
            <div className="pulsating-recording-indicator me-2"></div>
            <span className="me-2">REC</span>
            <span>{formatTime(recordingTime)}</span>
          </div>
        </div>
      )}

      {connectionStatus !== 'connected' && (
        <div className="position-absolute top-0 start-0 m-2">
          <span className={`badge ${
            connectionStatus === 'connected' ? 'bg-success' : 
            connectionStatus === 'connecting' ? 'bg-warning' : 'bg-danger'
          }`}>
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
      )}

      {roomFull && (
        <div className="position-absolute top-0 start-50 translate-middle-x mt-5 z-3">
          <div className="alert alert-warning">
            Room is full. Maximum participants reached.
          </div>
        </div>
      )}

      <Row className="flex-grow-1 g-0 position-relative">
        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 gap-2">
          {visibleUsers.map((user) => (
            <div
              key={user.id}
              className="video-box bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center rounded-3 overflow-hidden position-relative"
              style={{
                width: `calc((100% / ${Math.min(Math.max(users.length, 2), 4}) - 16px)`,
                height: "200px",
                minWidth: "200px",
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
                  ref={el => remoteVideoRefs.current[user.id] = el}
                  autoPlay
                  className="h-100 w-100 object-fit-cover"
                  onCanPlay={() => {
                    if (remoteVideoRefs.current[user.id]) {
                      remoteVideoRefs.current[user.id].srcObject = 
                        remoteStreams.find(s => s.id === user.id)?.stream || null;
                    }
                  }}
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
