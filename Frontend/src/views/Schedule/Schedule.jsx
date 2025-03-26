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
import { DeleteEvent, NewEvent, UpdateEvent } from "../../components/Modal";

setOptions({
  theme: "ios",
  themeVariant: "light",
});
export const Schedule = () => {
  const role = localStorage.getItem("role");
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const [modelShowNewEvent, setModelShowNewEvent] = useState(false);
  const [modalDeleteEvent, setModalDeleteEvent] = useState(false);
  const [modalUpdateEvent, setModalUpdateEvent] = useState(false);
  const [isVisibility, setVisibility] = useState(false);
  const toggleVisibility = () => setVisibility(!isVisibility);
  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }
  }, []);
  const timer = useRef(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    {
      id: uuidv4(),
      start: "2025-03-03",
      end: "2025-03-04",
      title: "Short trip!",
      teacher: "Thầy Hiếu",
      student: "Trò Quân, Đức, Kiên",
    },
  ]);

  const [argDoubleClick, setArgDoubleClick] = useState(null);
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [tooltipAnchor, setTooltipAnchor] = useState(null);
  const [tooltipColor, setTooltipColor] = useState("4895ef");
  const [detailTooltip, setDetailToolTip] = useState({
    id: "",
    title: "",
    time: "",
    date: "",
    teacher: "",
    student: "",
  });

  const myView = useMemo(
    () => ({ calendar: { labels: true, count: true } }),
    []
  );
  const openTooltip = useCallback((args) => {
    const event = args.event;
    console.log("Event: ", args.event);
    const time =
      formatDate("hh:mm A", new Date(event.start)) +
      " - " +
      formatDate("hh:mm A", new Date(event.end));

    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const date =
      dayjs(event.start).format("DD/MM/YYYY") +
      " - " +
      dayjs(event.end).format("DD/MM/YYYY");
    // setAppointment(event);
    setDetailToolTip({
      id: event.id,
      title: event.title,
      time: time,
      date: date,
      teacher: event.teacher,
      student: event.student,
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

  const handleEventClick = useCallback(
    (args) => {
      openTooltip(args);
    },
    [openTooltip]
  );

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
        data={events}
        showEventTooltip={false}
        view={myView}
        // renderLabel={renderLabel}
        onEventClick={handleEventClick}
        displayTimezone="none"
      />

      {/* Toast */}
      <Toast
        message={toastText}
        isOpen={isToastOpen}
        onClose={handleToastClose}
      />

      {/* Modal */}
      {/* <MDBModal
        tabIndex="-1"
        open={centredModal}
        onClose={() => setCentredModal(false)}
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                {isCreate ? "Tạo sự kiện mới" : "Tham gia cuộc họp"}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  toggleOpen();
                  setIsCreate(false);
                }}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {isCreate ? (
                <>
                  <MDBInput
                    label="Tiêu đề sự kiện"
                    id="form1"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="start-end-date d-flex gap-3 mt-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Bắt đầu"
                        value={startAt}
                        onChange={(newValue) => setStartAt(newValue)}
                      />
                      <DateTimePicker
                        label="Kết thúc"
                        value={endAt}
                        onChange={(newValue) => setEndAt(newValue)}
                      />
                    </LocalizationProvider>
                  </div>
                </>
              ) : (
                <p>Bạn có muốn tham gia cuộc họp không?</p>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => {
                  toggleOpen();
                  setIsCreate(false);
                }}
              >
                Đóng
              </MDBBtn>
              {isCreate ? (
                <MDBBtn onClick={createEvent}>Lưu</MDBBtn>
              ) : (
                <MDBBtn onClick={() => navigate("/meeting")}>Có</MDBBtn>
              )}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal> */}

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
          <div className="mds-tooltip-header  danger-bg d-flex align-items-center justify-content-between">
            <span>{detailTooltip.title}</span>
            <div className="d-flex justify-content-end">
              <div className="dropdown-custom">
                <div className="container-select d-flex justify-content-end">
                  <div
                    className="dropdown-select  d-flex align-items-center justify-content-center"
                    onClick={toggleVisibility}
                  >
                    <i class="fa-solid fa-ellipsis fs-4"></i>
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
              <span className="mbsc-light">{detailTooltip.teacher}</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Student:{" "}
              <span className="mbsc-light">{detailTooltip.student}</span>
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
      <NewEvent
        show={modelShowNewEvent}
        onClose={() => setModelShowNewEvent(false)}
        events={events}
        accessToken={accessToken}
        setEvents={setEvents}
        argDoubleClick={argDoubleClick}
      />
      <UpdateEvent
        show={modalUpdateEvent}
        onClose={() => setModalUpdateEvent(false)}
        events={events}
        eventUpdate={detailTooltip}
        accessToken={accessToken}
        setEvents={setEvents}
        argDoubleClick={argDoubleClick}
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
