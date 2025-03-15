import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaCommentAlt,
  FaUsers,
  FaCopy,
  FaUserPlus,
} from "react-icons/fa";

const MeetingPage = () => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const roomId = "meeting-room-xyz-123";

  // Mock participants data
  const participants = [
    {
      id: 1,
      name: "You",
      initials: "YU",
      micOn: true,
      cameraOn: true,
      isMainUser: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      initials: "JS",
      micOn: true,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 3,
      name: "Robert Johnson",
      initials: "RJ",
      micOn: false,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 4,
      name: "Alice Brown",
      initials: "AB",
      micOn: true,
      cameraOn: false,
      isMainUser: false,
    },
    {
      id: 5,
      name: "David Wilson",
      initials: "DW",
      micOn: true,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 6,
      name: "Emily Davis",
      initials: "ED",
      micOn: false,
      cameraOn: false,
      isMainUser: false,
    },
    {
      id: 7,
      name: "Michael Lee",
      initials: "ML",
      micOn: true,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 8,
      name: "Sarah Clark",
      initials: "SC",
      micOn: true,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 9,
      name: "James Wright",
      initials: "JW",
      micOn: false,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 10,
      name: "Linda Evans",
      initials: "LE",
      micOn: true,
      cameraOn: false,
      isMainUser: false,
    },
    {
      id: 11,
      name: "Kevin Moore",
      initials: "KM",
      micOn: true,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 12,
      name: "Patricia Taylor",
      initials: "PT",
      micOn: false,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 13,
      name: "Thomas White",
      initials: "TW",
      micOn: true,
      cameraOn: false,
      isMainUser: false,
    },
    {
      id: 14,
      name: "Nancy Green",
      initials: "NG",
      micOn: true,
      cameraOn: true,
      isMainUser: false,
    },
    {
      id: 15,
      name: "George Brown",
      initials: "GB",
      micOn: false,
      cameraOn: false,
      isMainUser: false,
    },
  ];

  // Maximum number of participants to show in the grid
  const maxVisibleParticipants = 11;
  const visibleParticipants = participants.slice(0, maxVisibleParticipants);
  const remainingCount = participants.length - maxVisibleParticipants;

  const toggleMic = () => setMicOn(!micOn);
  const toggleCamera = () => setCameraOn(!cameraOn);
  const toggleComments = () => {
    setShowComments(!showComments);
    if (showParticipants) setShowParticipants(false);
  };
  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
    if (showComments) setShowComments(false);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => alert("Room ID copied!"));
  };

  return (
    <div className="video-call-container vh-100 d-flex flex-column bg-dark text-light">
      {/* Main video area */}
      <div className="flex-grow-1 position-relative p-3">
        <div className="video-grid">
          {visibleParticipants.map((participant) => (
            <div
              key={participant.id}
              className="participant-tile position-relative bg-secondary rounded overflow-hidden shadow-sm"
            >
              {participant.cameraOn ? (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark">
                  <span className="text-light opacity-75">
                    {participant.name}'s video
                  </span>
                </div>
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark">
                  <div className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center">
                    <span className="fs-2 fw-bold">{participant.initials}</span>
                  </div>
                </div>
              )}

              {/* Participant name and controls */}
              <div className="participant-info position-absolute bottom-0 start-0 end-0 mx-2 mb-2 px-2 py-1 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 rounded">
                <span className="fs-6">
                  {participant.name} {participant.isMainUser && "(You)"}
                </span>
                <div className="d-flex align-items-center">
                  {!participant.micOn && (
                    <FaMicrophoneSlash className="text-danger mx-1" />
                  )}
                  {!participant.cameraOn && (
                    <FaVideoSlash className="text-danger mx-1" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* "More participants" tile */}
          {remainingCount > 0 && (
            <div className="participant-tile position-relative bg-secondary rounded overflow-hidden d-flex align-items-center justify-content-center shadow-sm">
              <div className="text-center">
                <div className="more-icon bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                  <FaUserPlus className="fs-3 text-white" />
                </div>
                <p className="fs-5 fw-medium text-light">
                  +{remainingCount} more
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Room ID - bottom left */}
        <div className="room-id position-absolute bottom-0 start-0 ms-4 mb-4 px-3 py-2 bg-dark bg-opacity-75 rounded d-flex align-items-center shadow">
          <span className="me-2 fs-6">ID: {roomId}</span>
          <button
            onClick={copyRoomId}
            className="btn btn-sm btn-outline-light p-1"
          >
            <FaCopy size={14} />
          </button>
        </div>
      </div>

      {/* Controls bar */}
      <div className="controls-bar p-4 bg-dark shadow-lg">
        <div className="row align-items-center">
          <div className="col-4"></div>

          {/* Center controls */}
          <div className="col-4 d-flex justify-content-center">
            <div className="d-flex gap-3">
              <button
                onClick={toggleMic}
                className={`btn btn-lg rounded-circle shadow-sm ${
                  micOn ? "btn-secondary" : "btn-danger"
                }`}
              >
                {micOn ? (
                  <FaMicrophone size={24} />
                ) : (
                  <FaMicrophoneSlash size={24} />
                )}
              </button>

              <button
                onClick={toggleCamera}
                className={`btn btn-lg rounded-circle shadow-sm ${
                  cameraOn ? "btn-secondary" : "btn-danger"
                }`}
              >
                {cameraOn ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
              </button>

              <button className="btn btn-lg btn-danger rounded-circle shadow-sm">
                <FaPhoneSlash size={24} />
              </button>
            </div>
          </div>

          {/* Right controls */}
          <div className="col-4 d-flex justify-content-end">
            <div className="d-flex gap-2">
              <button
                onClick={toggleComments}
                className={`btn btn-lg shadow-sm ${
                  showComments ? "btn-primary" : "btn-secondary"
                }`}
              >
                <FaCommentAlt size={20} />
              </button>

              <button
                onClick={toggleParticipants}
                className={`btn btn-lg shadow-sm ${
                  showParticipants ? "btn-primary" : "btn-secondary"
                }`}
              >
                <FaUsers size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showComments && (
        <div
          className="comments-panel position-absolute end-0 top-0 bottom-0 mb-5 bg-dark shadow-lg animate__animated animate__fadeInRight"
          style={{ width: "300px", zIndex: 1030 }}
        >
          <div className="p-4 h-100 d-flex flex-column">
            <h5 className="mb-4 text-light">Comments</h5>
            <div className="comments-list flex-grow-1 overflow-auto">
              <div className="comment mb-3 p-3 bg-secondary rounded">
                <p className="fw-bold mb-1 text-light">John Doe</p>
                <p className="mb-1 text-light">Hello everyone!</p>
                <p className="text-muted small mb-0">10:15 AM</p>
              </div>
              <div className="comment mb-3 p-3 bg-secondary rounded">
                <p className="fw-bold mb-1 text-light">Jane Smith</p>
                <p className="mb-1 text-light">Can everyone hear me?</p>
                <p className="text-muted small mb-0">10:16 AM</p>
              </div>
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="form-control bg-secondary text-light border-0"
              />
            </div>
          </div>
        </div>
      )}

      {showParticipants && (
        <div
          className="participants-panel position-absolute end-0 top-0 bottom-0 mb-5 bg-dark shadow-lg animate__animated animate__fadeInRight"
          style={{ width: "300px", zIndex: 1030 }}
        >
          <div className="p-4 h-100 d-flex flex-column">
            <h5 className="mb-4 text-light">
              Participants ({participants.length})
            </h5>
            <div className="participants-list flex-grow-1 overflow-auto">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="participant d-flex justify-content-between align-items-center mb-3 p-2 rounded hover-bg-secondary"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="participant-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span className="fs-6">{participant.initials}</span>
                    </div>
                    <span className="fs-6">
                      {participant.name} {participant.isMainUser && "(You)"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    {!participant.micOn && (
                      <FaMicrophoneSlash className="text-danger mx-1" />
                    )}
                    {!participant.cameraOn && (
                      <FaVideoSlash className="text-danger mx-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS for the video grid and animations */}
      <style jsx>{`
        .video-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 12px;
          height: 100%;
        }

        .participant-tile {
          aspect-ratio: 16/9;
          min-height: 120px;
          transition: transform 0.2s ease;
        }

        .participant-tile:hover {
          transform: scale(1.02);
        }

        .avatar {
          width: 90px;
          height: 90px;
        }

        .more-icon {
          width: 90px;
          height: 90px;
        }

        .hover-bg-secondary:hover {
          background-color: #6c757d;
        }

        .btn:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }

        .bg-opacity-75 {
          opacity: 0.75;
        }

        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2) !important;
        }

        .shadow-lg {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3) !important;
        }

        /* Animation for modals */
        .animate__animated {
          --animate-duration: 0.3s;
        }

        .animate__fadeInRight {
          animation-name: fadeInRight;
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MeetingPage;
