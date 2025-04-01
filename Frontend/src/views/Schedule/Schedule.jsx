import {
  Eventcalendar,
  formatDate,
  Popup,
  setOptions,
  Toast,
} from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import * as React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import axios from "../../services/AxiosCustom";
import { DeleteEvent, NewEvent, UpdateEvent } from "../../components/Modal";
import { color } from "@mui/system";

setOptions({
  theme: "ios",
  themeVariant: "light",
});
export const Schedule = () => {
  const navigate = useNavigate(); // Ensure useNavigate is called before usage
  const role = localStorage.getItem("role");
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const [users, setUsers] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const [modelShowNewEvent, setModelShowNewEvent] = useState(false);
  const [modalDeleteEvent, setModalDeleteEvent] = useState(false);
  const [modalUpdateEvent, setModalUpdateEvent] = useState(false);
  const [isVisibility, setVisibility] = useState(false);
  const students = users.filter((user) => user.role === "Student");
  const tutors = users.filter((user) => user.role === "Tutor");
  const toggleVisibility = () => setVisibility(!isVisibility);

  
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
          start: new Date(`${meeting.date.split("T")[0]}T${meeting.start_time}`), // Kết hợp date và start_time
          end: new Date(`${meeting.date.split("T")[0]}T${meeting.end_time}`), // Kết hợp date và end_time
          note: meeting.note,
          type: meeting.type,
          organizer_id: meeting.organizer_id,
          participant_ids: meeting.participant_ids,
          room_id: meeting.room_id,
          status: meeting.status,
        }));
        setEvents(formattedEvents);
        console.log("Formatted Events:", formattedEvents);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    const fetchUsersWithRoles = async () => {
      try {
        const response = await axios.get("/users/getuserwithroles", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsers(response.data);
        console.log("Users with roles:", response.data);
      } catch (error) {
        console.error("Error fetching users with roles:", error);
      }
    };

    fetchUsersWithRoles();
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
  console.log("Events:", events);

  const [argDoubleClick, setArgDoubleClick] = useState(null);
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  console.log("Tooltip open state:", isTooltipOpen);
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
        type: 'month',
        labels: true,
        popover: false,
        count: true
      }
    }),
    []
  );
  const openTooltip = useCallback((args) => {
    const event = args.event;
    if (!event) return; // Thêm kiểm tra này
    
    console.log("Event data for tooltip:", event);
    
    setDetailToolTip({
      id: event.id,
      title: event.title,
      start: formatDate(event.start, "HH:mm"),
      end: formatDate(event.end, "HH:mm"),
      date: formatDate(event.start, "YYYY-MM-DD"),
      note: event.note,
      type: event.type,
      organizer_id: event.organizer_id,
      participant_ids: event.participant_ids,
      // Thêm các trường teacher và student nếu cần
      teacher: "Teacher Name", // Thay bằng dữ liệu thực tế
      student: "Student Name", // Thay bằng dữ liệu thực tế
      time: `${formatDate(event.start, "HH:mm")} - ${formatDate(event.end, "HH:mm")}`
    });
    
    setTooltipAnchor(args.domEvent.target);
    setTooltipOpen(true);
  }, []);
  const [centredModal, setCentredModal] = useState(false);

  const toggleOpen = () => setCentredModal(!centredModal);

  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [isCreate, setIsCreate] = useState(false);

  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

  const handleEventClick = useCallback((args) => {
    console.log("Event clicked:", args.event); // Kiểm tra xem event có được nhận không
    if (args.event) {
      openTooltip(args);
    }
  }, [openTooltip]);
  const handleCellDoubleClick = useCallback((args) => {
    setArgDoubleClick(args);
    setModelShowNewEvent(true);
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
              Teacher: <span className="mbsc-light">{detailTooltip.teacher}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Student: <span className="mbsc-light">{detailTooltip.student}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Date: <span className="mbsc-light">{detailTooltip.date}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Time: <span className="mbsc-light">{detailTooltip.time}</span>
            </div>
            <div className="action d-flex justify-content-center">
              <MDBBtn
                className="me-1"
                color="danger"
                onClick={() => navigate("/meeting")}
              >
                Join Meeting
              </MDBBtn>
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
