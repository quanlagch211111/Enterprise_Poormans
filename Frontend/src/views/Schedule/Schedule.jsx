import {
  Eventcalendar,
  formatDate,
  Popup,
  setOptions,
  Toast,
} from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import axios from "../../services/AxiosCustom";
import { DeleteEvent, NewEvent, UpdateEvent } from "../../components/Modal";
import { color } from "@mui/system";
import { use } from "react";
import { useSocket } from "../../services/Socket";

setOptions({
  theme: "ios",
  themeVariant: "light",
});
export const Schedule = () => {
  const socket = useSocket(); // Ensure socket is initialized correctly
  const navigate = useNavigate(); // Ensure useNavigate is called before usage
  const role = localStorage.getItem("role");
  console.log("Role:", role);
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId").toString();
  const [users, setUsers] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const [modelShowNewEvent, setModelShowNewEvent] = useState(false);
  const [modalDeleteEvent, setModalDeleteEvent] = useState(false);
  const [modalUpdateEvent, setModalUpdateEvent] = useState(false);
  const [isVisibility, setVisibility] = useState(false);
  const students = users.filter((user) => user.role === "Student");
  console.log("users:", users);
  const tutors = users.filter((user) => user.role === "Tutor");
  const [assignments, setAssignments] = useState([]);
  const toggleVisibility = () => setVisibility(!isVisibility);
  const [email, setEmail] = useState();
  const [room, setRoom] = useState();
  // const {username, setUsername} = useState();
  // const {roomId, SetRoomId} = useState();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("/meetings", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("Meetings:", response.data);
        const formattedEvents = response.data.meetings.map((meeting) => ({
          id: meeting._id,
          title: meeting.title || "Event",
          start: new Date(
            `${meeting.date.split("T")[0]}T${meeting.start_time}`
          ),
          end: new Date(`${meeting.date.split("T")[0]}T${meeting.end_time}`),
          note: meeting.note,
          type: meeting.type,
          organizer_id: meeting.organizer_id._id,
          organizer_username: meeting.organizer_id.username,
          participant_ids: meeting.participant_ids.map(
            (participant) => participant._id
          ),
          participant_usernames: meeting.participant_ids.map(
            (participant) => participant.username
          ),
          room_id: meeting.room_id,
          status: meeting.status,
        }));
        console.log("Formatted Events:", formattedEvents);

        const filteredEvents = formattedEvents.filter((event) => {
          if (role === "STAFF") {
            return true;
          } else if (role === "TUTOR") {
            return event.organizer_id === userId;
          } else if (role === "STUDENT") {
            return event.participant_ids.includes(userId);
          }
          return false;
        });
        console.log("Fetched Events:", filteredEvents);

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("/assignments", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
    fetchMeetings();
  }, [accessToken, navigate]);

  const timer = useRef(null);
  const [events, setEvents] = useState([
    {
      id: "",
      room_id: "",
      title: "",
      type: "",
      organizer_id: "",
      participant_ids: [],
      date: "",
      start_time: "",
      end_time: "",
      status: "",
      note: "",
      color: "",
    },
  ]);

  const [argDoubleClick, setArgDoubleClick] = useState(null);
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [tooltipAnchor, setTooltipAnchor] = useState(null);
  const [tooltipColor, setTooltipColor] = useState("4895ef");
  const [detailTooltip, setDetailToolTip] = useState({
    id: "",
    room_id: "",
    title: "",
    type: "",
    organizer_id: "",
    participant_ids: [],
    date: "",
    start: "",
    end: "",
    status: "",
    note: "",
  });

  const myView = useMemo(
    () => ({
      calendar: {
        type: "month",
        labels: true,
        popover: true,
        count: true,
      },
    }),
    []
  );
  const openTooltip = useCallback((args) => {
    const event = args.event;
    if (!event) return;

    setDetailToolTip({
      id: event.id,
      title: event.title,
      date: event.start.toLocaleDateString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      room_id: event.room_id,
      note: event.note,
      type: event.type,
      organizer_id: event.organizer_id,
      organizer_username: event.organizer_username, // Hiển thị username của organizer
      participant_ids: event.participant_ids,
      participant_usernames: event.participant_usernames.join(", "), // Hiển thị username của participants
      start_time: event.start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      end_time: event.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setTooltipAnchor(args.domEvent.target);
    setTooltipOpen(true);
  }, []);

  const [centredModal, setCentredModal] = useState(false);

  const toggleOpen = () => setCentredModal(!centredModal);

  const [isToastOpen, setToastOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [toastText, setToastText] = useState("");
  const [isCreate, setIsCreate] = useState(false);

  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

  const handleEventClick = useCallback(
    (args) => {
      if (args.event) {
        openTooltip(args);
      }
    },
    [openTooltip]
  );
  const handleCellDoubleClick = useCallback((args) => {
    if (role == "STAFF") {
      setArgDoubleClick(args);
      console.log("args", args);
      setModelShowNewEvent(true);
    }
  }, []);

  const handleTooltipClose = useCallback(() => {
    setTooltipOpen(false);
  }, []);

  const renderLabel = useCallback((event) => {
    return (
      <div
        style={{
          background: event.color || "#ccc",
          color: "#fff",
          padding: "2px 5px",
          borderRadius: "3px",
        }}
      >
        {event.title}
      </div>
    );
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    timer.current = setTimeout(() => {
      setTooltipOpen(false);
    }, 200);
  }, []);

  return (
    <div className="main-content" style={{ position: "relative" }}>
      <Eventcalendar
        clickToCreate={false}
        onCellDoubleClick={handleCellDoubleClick}
        dragToCreate={false}
        dragToMove={false}
        dragToResize={false}
        eventDelete={true}
        data={events} // Pass the formatted events here
        showEventTooltip={false}
        view={myView}
        onEventClick={handleEventClick}
        displayTimezone="none"
        renderScheduleEvent={renderLabel}
      />

      {/* Tooltip for event details */}
      <Popup
        anchor={tooltipAnchor}
        contentPadding={false}
        display="anchored"
        isOpen={isTooltipOpen}
        scrollLock={false}
        showOverlay={false}
        touchUi={false}
        width={350}
        onClose={handleTooltipClose}
      >
        <div
          className="mds-tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mds-tooltip-header danger-bg d-flex align-items-center justify-content-between">
            <span>{detailTooltip.title}</span>
            <div className="d-flex justify-content-end">
              <div className="dropdown-custom">
                <div className="container-select d-flex justify-content-end">
                  <div
                    className="dropdown-select d-flex align-items-center justify-content-center"
                    onClick={toggleVisibility}
                  >
                    <i className="fa-solid fa-ellipsis fs-4"></i>
                  </div>
                </div>
                <ul
                  className={
                    "dropdown-list d-flex gap-2 flex-column " +
                    (isVisibility ? "active" : "")
                  }
                >
                  <li
                    className="dropdown-item"
                    onClick={() => {
                      setModalDeleteEvent(true);
                    }}
                  >
                    Delete
                  </li>
                  <li
                    className="dropdown-item"
                    onClick={() => {
                      setModalUpdateEvent(true);
                    }}
                  >
                    Update
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mbsc-padding">
            <div className="mds-tooltip-label mbsc-margin">
              Teacher:{" "}
              <span className="mbsc-light">
                {detailTooltip.organizer_username}
              </span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Students:{" "}
              <span className="mbsc-light">
                {detailTooltip.participant_usernames}
              </span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Date: <span className="mbsc-light">{detailTooltip.date}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Start Time:{" "}
              <span className="mbsc-light">{detailTooltip.start_time}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              End Time:{" "}
              <span className="mbsc-light">{detailTooltip.end_time}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              RoomID:{" "}
              <span className="mbsc-light">{detailTooltip.room_id}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Type: <span className="mbsc-light">{detailTooltip.type}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Note: <span className="mbsc-light">{detailTooltip.note}</span>
            </div>

            <div className="action d-flex justify-content-center">
              <Link to={`/meeting/${detailTooltip.room_id}`}>
                <MDBBtn className="me-1" color="danger">
                  Join Meeting
                </MDBBtn>
              </Link>
            </div>
          </div>
        </div>
      </Popup>

      {/* Modals */}
      <NewEvent
        show={modelShowNewEvent}
        onClose={() => setModelShowNewEvent(false)}
        events={events}
        accessToken={accessToken}
        setEvents={setEvents}
        argDoubleClick={argDoubleClick}
        students={students}
        tutors={tutors}
        assignments={assignments}
      />
      <UpdateEvent
        show={modalUpdateEvent}
        onClose={() => setModalUpdateEvent(false)}
        events={events}
        eventUpdate={detailTooltip}
        accessToken={accessToken}
        setEvents={setEvents}
        students={students}
        tutors={tutors}
        assignments={assignments}
      />
      <DeleteEvent
        show={modalDeleteEvent}
        onClose={() => setModalDeleteEvent(false)}
        events={events}
        setEvents={setEvents}
        id={detailTooltip.id}
      />
      <Toast
        isOpen={isToastOpen}
        message={toastMessage}
        onClose={handleToastClose}
      />
    </div>
  );
};
