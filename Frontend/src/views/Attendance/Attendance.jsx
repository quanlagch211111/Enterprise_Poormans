import React, { useState, useEffect } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { Card, Col, Row } from "react-bootstrap";

const Attendance = () => {
  // State để lưu trữ danh sách lớp học
  const [classes, setClasses] = useState([]);
  // State để lưu trữ danh sách học sinh của lớp đã chọn
  const [selectedClassStudents, setSelectedClassStudents] = useState([]);
  // State để lưu trữ thông tin của lớp đang được chọn
  const [selectedClass, setSelectedClass] = useState(null);
  // State để kiểm soát hiển thị view (danh sách lớp hoặc danh sách học sinh)
  const [showStudentList, setShowStudentList] = useState(false);

  // Giả lập dữ liệu - trong thực tế bạn sẽ fetch từ API
  useEffect(() => {
    // Mô phỏng việc lấy danh sách lớp
    const fetchClasses = () => {
      const mockClasses = [
        { id: 1, name: "Lớp 7A", totalSessions: 30, students: 28 },
        { id: 2, name: "Lớp 9A", totalSessions: 28, students: 32 },
        { id: 3, name: "Lớp 12A", totalSessions: 32, students: 30 },
        { id: 4, name: "Lớp 12B", totalSessions: 35, students: 25 },
        { id: 5, name: "Lớp 7B", totalSessions: 30, students: 28 },
      ];
      setClasses(mockClasses);
    };

    fetchClasses();
  }, []);

  // Hàm xử lý khi người dùng click vào một lớp
  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setShowStudentList(true);

    const students = [
      {
        name: "Nguyễn Văn A",
        date: "2025-04-01",
        address: "123 Lý Thường Kiệt, Hà Nội",
        contact: "0901234567",
        sessions: 10,
      },
      {
        name: "Trần Thị B",
        date: "2025-04-02",
        address: "45 Nguyễn Huệ, TP.HCM",
        contact: "0912345678",
        sessions: 8,
      },
      {
        name: "Lê Văn C",
        date: "2025-04-03",
        address: "67 Phan Bội Châu, Đà Nẵng",
        contact: "0987654321",
        sessions: 12,
      },
      {
        name: "Phạm Thị D",
        date: "2025-04-04",
        address: "89 Trần Hưng Đạo, Cần Thơ",
        contact: "0932123456",
        sessions: 9,
      },
      {
        name: "Hoàng Văn E",
        date: "2025-04-05",
        address: "22 Nguyễn Trãi, Hải Phòng",
        contact: "0945678901",
        sessions: 11,
      },
    ];
    setSelectedClassStudents(students);
  };

  // Render Grade badge dựa trên cấp lớp
  const renderGradeBadge = (grade) => {
    const gradeClass = {
      "VII A": "bg-orange-500 text-white",
      "IX A": "bg-yellow-500 text-white",
      "XII A": "bg-indigo-600 text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          gradeClass[grade] || "bg-gray-500 text-white"
        }`}
      >
        {grade}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showStudentList ? (
          // Hiển thị danh sách lớp
          <div>
            <Row className="mb-4">
              {classes.map((classItem) => (
                <Col
                  key={classItem.id}
                  md={4}
                  sm={6}
                  xs={12}
                  className="pointer"
                  onClick={() => handleClassClick(classItem)}
                >
                  <Card className="shadow-sm p-3 mb-4 bg-white rounded text-center">
                    <Card.Body>
                      <h5 className="card-title">{classItem.name}</h5>
                      <p className="card-text">
                        👥 Students: <strong>{classItem.students}</strong>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
          </div>
        ) : (
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
                  <td>{student.sessions} / 40</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        )}
      </div>
    </div>
  );
};

export default Attendance;
