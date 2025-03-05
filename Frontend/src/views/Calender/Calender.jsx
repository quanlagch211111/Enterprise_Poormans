import { Eventcalendar, getJson, setOptions, Toast } from "@mobiscroll/react";
import { useCallback, useEffect, useMemo, useState } from "react";
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

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

setOptions({
  theme: "ios",
  themeVariant: "light",
});

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: uuidv4,
      start: "2025-03-03",
      end: "2025-03-09",
      title: "Short trip!",
    },
    { id: uuidv4, start: "2025-03-04", end: "2025-03-10", title: "Birthday" },
    { id: uuidv4, start: "2025-03-05", end: "2025-03-20", title: "X-mas" },
  ]);
  const [modalEvents, setModalEvents] = useState([null]);
  const [centredModal, setCentredModal] = useState(false);
  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [title, setTitle] = useState("");

  const toggleOpen = () => setCentredModal(!centredModal);

  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCreate, setIsCreate] = useState(false);

  // State cho form thêm/sửa sự kiện
  const [newEvent, setNewEvent] = useState({
    id: "",
    title: "",
    start: "",
    end: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Cấu hình view cho lịch
  const myView = useMemo(
    () => ({ calendar: { labels: true, count: true } }),
    []
  );

  // Đóng Toast
  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

  // Tạo sự kiện mới
  const createEvent = () => {
    console.log(">>> Check: ", title + startAt + endAt);
    if (!title || !startAt || !endAt) {
      setToastText("Vui lòng điền đầy đủ thông tin!");
      setToastOpen(true);
      return;
    }

    const event = {
      id: uuidv4(), // Gọi hàm uuidv4() để tạo id
      title: title,
      start: dayjs(startAt).toDate(), // Bạn có thể format theo định dạng mong muốn
      end: dayjs(endAt).toDate(),
    };
    console.log(">>> Types: ", {
      title: typeof title,
      startAt: typeof startAt,
      endAt: typeof endAt,
    });
    console.log(">>> Event wwith id", event);

    setEvents([...events, event]);
    setToastText("Đã thêm sự kiện: " + newEvent.title);
    setToastOpen(true);
  };

  // Cập nhật sự kiện
  const updateEvent = () => {
    if (!newEvent.id) return;

    const updatedEvents = events.map((event) =>
      event.id === newEvent.id ? { ...newEvent } : event
    );
    setEvents(updatedEvents);
    setToastText("Đã cập nhật sự kiện: " + newEvent.title);
    setToastOpen(true);
    setIsEditing(false);
  };

  // Xóa sự kiện
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

  // Chọn sự kiện để chỉnh sửa
  const handleEventClick = useCallback((args) => {
    const event = args.event;
    if (event) {
      setModalEvents({
        id: event.id,
        title: event.title,
        start: event.start.split("T")[0],
        end: event.end.split("T")[0],
      });
      setIsCreate(!isCreate);
      toggleOpen();
    }
  }, []);

  const handleCellDoubleClick = useCallback(
    (args) => {
      console.log(">>> ARGS: ", args.date);
      setStartAt(dayjs(args.date));
      setEndAt(dayjs(args.date));
      setIsCreate(!isCreate);
      toggleOpen();
    },
    [toggleOpen]
  );

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="main-content">
      <Eventcalendar
        clickToCreate={false}
        onCellDoubleClick={handleCellDoubleClick}
        dragToCreate={false}
        dragToMove={false}
        dragToResize={false}
        eventDelete={true}
        data={events}
        view={myView}
        eventPopover={false}
        onEventClick={handleEventClick}
        onEventDeleted={deleteEvent} // Xóa khi kéo thả (nếu có)
        displayTimezone="none"
      />

      {/* Thông báo Toast */}
      <Toast
        message={toastText}
        isOpen={isToastOpen}
        onClose={handleToastClose}
      />

      <MDBModal
        tabIndex="-1"
        open={centredModal}
        onClose={() => setCentredModal(false)}
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create New Event</MDBModalTitle>
              {isCreate ? (
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() => {
                    toggleOpen();
                    setIsCreate(!isCreate);
                  }}
                ></MDBBtn>
              ) : (
                <div className="dropdown ">
                  <div className="container-select d-flex justify-content-end">
                    <div className="dropdown-select  d-flex align-items-center justify-content-center">
                      <img
                        src={require("../../assets/images/more.png")}
                        alt=""
                      />
                    </div>
                  </div>
                  <ul className="dropdown-list d-flex gap-2 flex-column">
                    <li className="dropdown-item">Delete</li>
                    <li className="dropdown-item">Update</li>
                  </ul>
                </div>
              )}
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Example label"
                id="form1"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="start-end-date d-flex gap-3 mt-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start"
                    value={startAt}
                    onChange={(newValue) => setStartAt(newValue)}
                  />
                  <DateTimePicker
                    label="End"
                    value={endAt}
                    onChange={(newValue) => setEndAt(newValue)}
                  />
                </LocalizationProvider>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => {
                  toggleOpen();
                  if (isCreate) {
                    setIsCreate(!isCreate);
                  }
                }}
              >
                Close
              </MDBBtn>
              {isCreate ? (
                <MDBBtn onClick={createEvent}>Save changes</MDBBtn>
              ) : (
                <div className="null"></div>
              )}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default Calendar;
