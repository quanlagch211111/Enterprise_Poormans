import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdb-react-ui-kit";

const AttendanceDetail = () => {
  const { classId } = useParams(); // Get the classId from the URL
  const navigate = useNavigate();
  const [selectedClassStudents, setSelectedClassStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchClassDetails = () => {
      // Mô phỏng dữ liệu của lớp
      const students = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          date: "2025-04-01",
          address: "123 Lý Thường Kiệt, Hà Nội",
          contact: "0901234567",
          sessions: 10,
        },
        {
          id: 2,
          name: "Trần Thị B",
          date: "2025-04-02",
          address: "45 Nguyễn Huệ, TP.HCM",
          contact: "0912345678",
          sessions: 8,
        },
        {
          id: 3,
          name: "Lê Văn C",
          date: "2025-04-03",
          address: "67 Phan Bội Châu, Đà Nẵng",
          contact: "0987654321",
          sessions: 12,
        },
        {
          id: 4,
          name: "Phạm Thị D",
          date: "2025-04-04",
          address: "89 Trần Hưng Đạo, Cần Thơ",
          contact: "0932123456",
          sessions: 9,
        },
        {
          id: 5,
          name: "Hoàng Văn E",
          date: "2025-04-05",
          address: "22 Nguyễn Trãi, Hải Phòng",
          contact: "0945678901",
          sessions: 11,
        },
      ];
      setSelectedClassStudents(students);

      // Mô phỏng dữ liệu của lớp
      const classDetails = { id: classId, name: `Lớp ${classId}`, totalSessions: 30, students: 28 };
      setSelectedClass(classDetails);
    };

    fetchClassDetails();
  }, [classId]);

  const handleBackClick = () => {
    navigate("/classes");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MDBBtn onClick={handleBackClick}>Back to Classes</MDBBtn>
        <h2 className="mt-4">{selectedClass?.name} - Student List</h2>
        <MDBTable align="middle">
          <MDBTableHead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Date</th>
              <th scope="col">Address</th>
              <th scope="col">Contact</th>
              <th scope="col">Number of sessions</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {selectedClassStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.date}</td>
                <td>{student.address}</td>
                <td>{student.contact}</td>
                <td>{student.sessions} / 40</td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>
    </div>
  );
};

export default AttendanceDetail;
