import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../services/AxiosCustom";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";

const TakingAttendance = () => {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const objectId = localStorage.getItem("objectId");
  const { date: meetingId } = useParams(); // Extract meetingId from URL params
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
    fetchUserInMeeting();
  }, [navigate, accessToken]);

  const fetchUserInMeeting = async () => {
    try {
      const response = await axios.get(`/attendances/meeting/${meetingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        console.log("Users fetched successfully:", response.data);
      }
      const updatedStudents = response.data.attendance.map((student) => ({
        id: student.student_id._id, // Add student ID for backend reference
        name: student.student_id.user_id.username,
        email: student.student_id.user_id.email,
        address: student.student_id.user_id.address,
        contact: student.student_id.user_id.phone,
        attended: student.status || "Absent",
      }));
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleTakeAttendance = async () => {
    try {
      const attendanceData = {
        tutor_id: objectId, 
        meeting_id: meetingId,
        students: students.map((student) => ({
          student_id: student.id,
          status: student.attended,
        })),
      };

      const response = await axios.put("/attendances/mark-multiple", attendanceData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        console.log("Attendance marked successfully:", response.data);
        toast.success(response.data.message || "Attendance saved successfully");

      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.success("Failed to save attendance");
    }
  };

  const handleAttendanceChange = (index, value) => {
    const updated = [...students];
    updated[index].attended = value;
    setStudents(updated);
  };

  return (
    <Container>
      <MDBTable align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Contact</th>
            <th scope="col">Attendance</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{student.name}</p>
                  </div>
                </div>
              </td>
              <td>{student.email}</td>
              <td>{student.address}</td>
              <td>{student.contact}</td>
              <td>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`attendance-${index}`}
                      id={`present-${index}`}
                      value="Present"
                      checked={student.attended === "Present"}
                      onChange={() => handleAttendanceChange(index, "Present")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`present-${index}`}
                    >
                      Present
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`attendance-${index}`}
                      id={`absent-${index}`}
                      value="Absent"
                      checked={student.attended === "Absent"}
                      onChange={() => handleAttendanceChange(index, "Absent")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`absent-${index}`}
                    >
                      Absent
                    </label>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      <div className="d-flex justify-content-end mt-3">
        <MDBBtn onClick={handleTakeAttendance}>Save Attendance</MDBBtn>
      </div>
    </Container>
  );
};

export default TakingAttendance;