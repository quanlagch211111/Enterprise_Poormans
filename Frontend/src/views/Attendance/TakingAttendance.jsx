import React, { useState, useEffect } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router";

const TakingAttendance = () => {
  const { date } = useParams();

  const [students, setStudents] = useState([
    {
      name: "Nguyễn Văn A",
      date: "2025-04-01",
      address: "123 Lý Thường Kiệt, Hà Nội",
      contact: "0901234567",
      attended: false,
    },
    {
      name: "Trần Thị B",
      date: "2025-04-02",
      address: "45 Nguyễn Huệ, TP.HCM",
      contact: "0912345678",
      attended: false,
    },
    {
      name: "Lê Văn C",
      date: "2025-04-03",
      address: "67 Phan Bội Châu, Đà Nẵng",
      contact: "0987654321",
      attended: false,
    },
    {
      name: "Phạm Thị D",
      date: "2025-04-04",
      address: "89 Trần Hưng Đạo, Cần Thơ",
      contact: "0932123456",
      attended: false,
    },
    {
      name: "Hoàng Văn E",
      date: "2025-04-05",
      address: "22 Nguyễn Trãi, Hải Phòng",
      contact: "0945678901",
      attended: false,
    },
  ]);
  const handleAttendanceChange = (index) => {
    const updated = [...students];
    updated[index].attended = !updated[index].attended;
    setStudents(updated);
  };
  return (
    <Container>
      <MDBTable align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Address</th>
            <th scope="col">Contact</th>
            <th scope="col">Status</th>
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
              <td>{student.date}</td>
              <td>{student.address}</td>
              <td>{student.contact}</td>
              <td>
                <MDBCheckbox
                  name={`attendance-${index}`}
                  checked={student.attended}
                  onChange={() => handleAttendanceChange(index)}
                  label={student.attended ? "Present" : "Absent"}
                />
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      <div className="d-flex justify-content-end">
        <MDBBtn>Save</MDBBtn>
      </div>
    </Container>
  );
};

export default TakingAttendance;
