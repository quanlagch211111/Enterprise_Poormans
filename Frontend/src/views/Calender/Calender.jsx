import {
  Button,
  Eventcalendar,
  formatDate,
  Popup,
  setOptions,
  Toast /* localeImport */,
} from "@mobiscroll/react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import * as React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

setOptions({
  theme: "ios",
  themeVariant: "light",
});
const Calendar = () => {
  const timer = useRef(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    {
      id: uuidv4(),
      start: "2025-03-03",
      end: "2025-03-09",
      title: "Short trip!",
    },
    {
      id: uuidv4(),
      start: "2025-03-04",
      end: "2025-03-10",
      title: "Birthday",
    },
    {
      id: uuidv4(),
      start: "2025-03-05",
      end: "2025-03-20",
      title: "X-mas",
    },
  ]);

  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [meetingTime, setMeetingTime] = useState("");
  const [title, setTitle] = useState("");
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [tooltipAnchor, setTooltipAnchor] = useState(null);
  const [tooltipColor, setTooltipColor] = useState("4895ef");

  const myView = useMemo(
    () => ({ calendar: { labels: true, count: true } }),
    []
  );
  const openTooltip = useCallback((args) => {
    const event = args.event;
    const time =
      formatDate("hh:mm A", new Date(event.start)) +
      " - " +
      formatDate("hh:mm A", new Date(event.end));

    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    // setAppointment(event);
    setTitle(event.title);
    setMeetingTime(time);
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

  const createEvent = () => {
    if (!title || !startAt || !endAt) {
      setToastText("Vui lòng điền đầy đủ thông tin!");
      setToastOpen(true);
      return;
    }

    const event = {
      id: uuidv4(),
      title: title,
      start: dayjs(startAt).toDate(),
      end: dayjs(endAt).toDate(),
      color: "#ccc", // Mặc định màu
    };

    setEvents([...events, event]);
    setToastText("Đã thêm sự kiện: " + title);
    setToastOpen(true);
    setTitle("");
    setStartAt(null);
    setEndAt(null);
    toggleOpen();
  };

  const deleteEvent = useCallback(
    (args) => {
      const eventToDelete = args.event;
      const updatedEvents = events.filter(
        (event) => event.id !== eventToDelete.id
      );
      setEvents(updatedEvents);
      setToastText("Đã xóa sự kiện: " + eventToDelete.title);
      setToastOpen(true);
    },
    [events]
  );

  const handleEventClick = useCallback(
    (args) => {
      openTooltip(args);
    },
    [openTooltip]
  );

  const handleCellDoubleClick = useCallback((args) => {
    setStartAt(dayjs(args.date));
    setEndAt(dayjs(args.date));
    setIsCreate(true);
    toggleOpen();
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
        onEventDeleted={deleteEvent}
        displayTimezone="none"
      />

      {/* Toast */}
      <Toast
        message={toastText}
        isOpen={isToastOpen}
        onClose={handleToastClose}
      />

      {/* Modal */}
      <MDBModal
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
      </MDBModal>

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
          <div className="mds-tooltip-header text-center danger-bg">
            <span>{title}</span>
          </div>
          <div className="mbsc-padding">
            <div className="mds-tooltip-label mbsc-margin">
              Teacher: <span className="mbsc-light">Dao Van Hieu</span>
            </div>
            <div className="mds-tooltip-label mbsc-margin">
              Time: <span className="mbsc-light">{meetingTime}</span>
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
      <Toast
        isOpen={isToastOpen}
        message={toastMessage}
        onClose={handleToastClose}
      />
    </div>
  );
};

export default Calendar;
