import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../services/AxiosCustom";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { format } from 'date-fns'; // Sử dụng date-fns để định dạng ngày tháng

const ViewAttendance = () => {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const { date: meetingId } = useParams(); // Extract meetingId from URL params
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
    fetchStudentAttendance();
  }, [navigate, accessToken]);

  const fetchStudentAttendance = async () => {
    try {
      const response = await axios.get(`/attendances/meeting/${meetingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        console.log("Attendance fetched successfully:", response.data);
        // Filter the attendance to only show the current student
        const studentAttendance = response.data.attendance.filter(
          (attendance) => attendance.student_id.user_id._id === userId
        );
        setAttendance(studentAttendance);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance.");
    }
  };

  return (
    <Container>
      {attendance.length === 0 ? (
        <div className="alert alert-info" role="alert">
          You have no attendance records for this meeting.
        </div>
      ) : (
        <MDBTable align="middle">
          <MDBTableHead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Room</th>
              <th scope="col">Date</th>
              <th scope="col">Attendance</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {attendance.map((entry, index) => (
              <tr key={index}>
                <td>{entry.student_id.user_id.username}</td>
                <td>{entry.meeting_id.room_id}</td>
                <td>{format(new Date(entry.meeting_id.date), 'dd/MM/yyyy')}</td> {/* Định dạng ngày tháng */}
                <td>
                  <span
                    className={`badge ${entry.status === "Present" ? "bg-success" : "bg-danger"}`}
                  >
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      )}
    </Container>
  );
};

export default ViewAttendance;
