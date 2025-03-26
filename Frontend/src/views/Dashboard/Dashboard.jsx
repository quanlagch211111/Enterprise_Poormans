import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  ListGroup,
  Badge,
  Form,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RoleContext } from "../../services/RoleContext";
import axios from "../../services/AxiosCustom";
const localizer = momentLocalizer(moment);

export const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [userLists, setUserLists] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`/users/detailuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          setUserInfo(response.data.data); // Set userInfo after fetching
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        navigate("/login"); // Redirect to login on error
      }
    };

    // const fetchUserLists = async () => {
    //   try {
    //     const response = await axios.get("/users/getallusers", {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     });

    //     if (response.status === 200) {
    //       // Assuming the API returns an array of users with `isVerify` field
    //       const usersWithStatus = response.data.map((user) => ({
    //         id: user.id,
    //         username: user.username,
    //         email: user.email,
    //         isVerify: user.isVerify, // Extract the `isVerify` field
    //       }));

    //       console.log("Users with status:", usersWithStatus);
    //       setUserLists(usersWithStatus); // Save the processed data to state
    //     }
    //   } catch (error) {
    //     console.error("Error fetching users:", error);
    //   }
    // };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId, accessToken, navigate]);

  // Show a loading spinner or message until userInfo is fetched
  if (!userInfo) {
    return (
      <div className="loading-container">
        <p>Loading user information...</p>
      </div>
    );
  }

  const studentData = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      status: "active",
      lastInteraction: "2 ngày trước",
    },
    {
      id: 2,
      name: "Trần Thị B",
      status: "inactive",
      lastInteraction: "10 ngày trước",
    },
  ];
  const blogData = [
    {
      id: 1,
      name: "tại sao anh pakistan lại gọi cho ny bằng số điện thoại",
      status: "active",
      lastInteraction: "2 ngày trước",
    },
    {
      id: 2,
      name: "tại sao anh pakistan lại gọi cho ny bằng số điện thoại",
      status: "inactive",
      lastInteraction: "10 ngày trước",
    },
  ];

  const appointmentData = [
    { title: "Meeting với SV A", start: new Date(), end: new Date() },
  ];

  const interactionData = [
    { name: "Cuộc hẹn", value: 12 },
    { name: "Tài liệu", value: 8 },
  ];

  // STUDENT
  // Dummy data
  const dashboardData = {
    advisor: "TS. Trần Văn B",
    meetings: {
      completed: 4,
      upcoming: 2,
    },
    documents: {
      submitted: 5,
      pending: 1,
    },
    lastInteraction: "3 ngày trước",
    messages: [
      {
        id: 1,
        sender: "GVHD",
        content: "Đã nhận báo cáo tuần 3",
        date: "2024-03-10",
      },
      {
        id: 2,
        sender: "Hệ thống",
        content: "Nhắc nhở họp định kỳ",
        date: "2024-03-12",
      },
    ],
    appointments: [
      {
        title: "Họp định kỳ",
        start: new Date(2024, 2, 15, 14),
        end: new Date(2024, 2, 15, 15),
      },
      {
        title: "Phản biện đề cương",
        start: new Date(2024, 2, 20, 9),
        end: new Date(2024, 2, 20, 10),
      },
    ],
    interactionStats: [
      { name: "Tháng 1", meetings: 2, documents: 3 },
      { name: "Tháng 2", meetings: 4, documents: 5 },
      { name: "Tháng 3", meetings: 1, documents: 2 },
    ],
    documentList: [
      { name: "Báo cáo tuần 1", status: "Đã phê duyệt", date: "2024-02-01" },
      {
        name: "Đề cương nghiên cứu",
        status: "Chờ phản hồi",
        date: "2024-03-10",
      },
    ],
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      {role === "TEACHER" && (
        <div className="main-content">
          <Container fluid>
            <Col md={9} lg={10} className="p-4 w-100">
              <Row className="mb-4">
                <Col>
                  <h2>Chào mừng {userInfo.username}!</h2>
                  <p className="text-muted">Có 3 thông báo mới</p>
                </Col>
              </Row>

              {/* Overview Cards */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>12</Card.Title>
                      <Card.Text>Sinh viên</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>5</Card.Title>
                      <Card.Text>Cuộc hẹn</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>3</Card.Title>
                      <Card.Text>Tài liệu đã gửi</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>3</Card.Title>
                      <Card.Text>Blog Chờ Phản Hồi</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Charts Section */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>Tần suất tương tác</Card.Title>
                      <BarChart
                        width={500}
                        height={300}
                        data={interactionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>Phân loại tương tác</Card.Title>
                      <PieChart width={500} height={300}>
                        <Pie
                          data={interactionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {interactionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Students List */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Danh sách sinh viên</Card.Title>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Tên</th>
                            <th>Trạng thái</th>
                            <th>Lần tương tác cuối</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentData.map((student) => (
                            <tr
                              key={student.id}
                              className={
                                student.status === "inactive"
                                  ? "table-warning"
                                  : ""
                              }
                            >
                              <td>{student.name}</td>
                              <td>{student.status}</td>
                              <td>{student.lastInteraction}</td>
                              <td>
                                <Button variant="outline-primary" size="sm">
                                  Chi tiết
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
                {/* blog management */}
                <Col md={6}>
                  <Card>
                    <Col>
                      <Card className="h-100">
                        <Card.Body>
                          <Card.Title>Quản lý blog</Card.Title>
                          <Table striped hover>
                            <thead>
                              <tr>
                                <th>Tên Blog</th>
                                <th>Trạng thái</th>
                                <th>Ngày nộp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dashboardData.documentList.map((doc, index) => (
                                <tr key={index}>
                                  <td>{doc.name}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        doc.status === "Đã phê duyệt"
                                          ? "bg-success"
                                          : "bg-warning"
                                      }`}
                                    >
                                      {doc.status}
                                    </span>
                                  </td>
                                  <td>{doc.date}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Card>
                </Col>
              </Row>

              {/* Calendar Section */}
              <Card>
                <Card.Body>
                  <Card.Title>Lịch hẹn</Card.Title>
                  <Calendar
                    localizer={localizer}
                    events={appointmentData}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Container>
        </div>
      )}
      {role === "STUDENT" && (
        <div className="main-content">
          <Container fluid>
            <Col md={9} lg={10} className="p-4 w-100">
              {/* Phần tổng quan */}
              <Row className="mb-4">
                <Col>
                  <h2>Chào mừng {userInfo.username} </h2>
                  <p className="text-muted">
                    Giảng viên hướng dẫn: {dashboardData.advisor}
                  </p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>
                        {dashboardData.meetings.completed}
                      </Card.Title>
                      <Card.Text>Cuộc họp đã hoàn thành</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>{dashboardData.meetings.upcoming}</Card.Title>
                      <Card.Text>Cuộc họp sắp tới</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>
                        {dashboardData.documents.submitted}
                      </Card.Title>
                      <Card.Text>Tài liệu đã nộp</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>{dashboardData.documents.pending}</Card.Title>
                      <Card.Text>Blog chờ phản hồi</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Biểu đồ và thống kê */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>Thống kê tương tác</Card.Title>
                      <BarChart
                        width={500}
                        height={300}
                        data={dashboardData.interactionStats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="meetings"
                          fill="#8884d8"
                          name="Số cuộc họp"
                        />
                        <Bar
                          dataKey="documents"
                          fill="#82ca9d"
                          name="Tài liệu"
                        />
                      </BarChart>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>Lần tương tác gần nhất</Card.Title>
                      <p className="h4">{dashboardData.lastInteraction}</p>
                      <Card.Title className="mt-4">Tin nhắn mới</Card.Title>
                      <div className="message-list">
                        {dashboardData.messages.map((message) => (
                          <div
                            key={message.id}
                            className="message-item mb-2 p-2 border rounded"
                          >
                            <div className="d-flex justify-content-between">
                              <strong>{message.sender}</strong>
                              <small>{message.date}</small>
                            </div>
                            <div>{message.content}</div>
                          </div>
                        ))}
                      </div>
                      <Button variant="primary" className="mt-3">
                        Gửi tin nhắn mới
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/*  tài liệu */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>Quản lý blog</Card.Title>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Tên Blog</th>
                            <th>Trạng thái</th>
                            <th>Ngày nộp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.documentList.map((doc, index) => (
                            <tr key={index}>
                              <td>{doc.name}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    doc.status === "Đã phê duyệt"
                                      ? "bg-success"
                                      : "bg-warning"
                                  }`}
                                >
                                  {doc.status}
                                </span>
                              </td>
                              <td>{doc.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Lịch và ghi chú */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>Lịch hẹn</Card.Title>
                      <Calendar
                        localizer={localizer}
                        events={dashboardData.appointments}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 400 }}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Container>
        </div>
      )}
      {role === "STAFF" && (
        <div className="main-content">
          <Container fluid>
            <Col md={9} lg={10} className="p-4 w-100">
              <Row className="mb-4">
                <Col>
                  <h2>Chào mừng {userInfo.username} !</h2>
                  <p className="text-muted">Có 3 thông báo mới</p>
                </Col>
              </Row>

              {/* Overview Cards */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>120</Card.Title>
                      <Card.Text>Tổng số sinh viên</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>30</Card.Title>
                      <Card.Text>Tổng số giảng viên</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>15</Card.Title>
                      <Card.Text>New Blog</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>5</Card.Title>
                      <Card.Text>Hoạt động gần đây</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Quản Lý Tài Khoản */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Quản Lý Tài Khoản</Card.Title>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Tên</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentData.map((student) => (
                            <tr key={student.id}>
                              <td>{student.name}</td>
                              <td>Sinh viên</td>
                              <td>
                                <Badge
                                  bg={
                                    student.status === "active"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {student.status}
                                </Badge>
                              </td>
                              <td>
                                <Button variant="outline-primary" size="sm">
                                  Chi tiết
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              {/* Quản Lý blog */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Quản Lý Blog</Card.Title>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Ngày</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogData.map((blog) => (
                            <tr key={blog.id}>
                              <td>{blog.name}</td>
                              <td>10/2/2024</td>
                              <td>
                                <Badge
                                  bg={
                                    blog.status === "active"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {blog.status}
                                </Badge>
                              </td>
                              <td>
                                <Button variant="outline-primary" size="sm">
                                  Chi tiết
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Phân Bổ Người Hướng Dẫn */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Phân Bổ Người Hướng Dẫn</Card.Title>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Chọn giảng viên</Form.Label>
                          <Form.Select>
                            <option>Giảng viên 1</option>
                            <option>Giảng viên 2</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Chọn sinh viên</Form.Label>
                          <Form.Select multiple>
                            <option>Sinh viên 1</option>
                            <option>Sinh viên 2</option>
                          </Form.Select>
                        </Form.Group>
                        <Button variant="primary">Phân bổ</Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Báo Cáo & Thống Kê */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Báo Cáo & Thống Kê</Card.Title>
                      <BarChart
                        width={500}
                        height={300}
                        data={interactionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Quản Lý Tương Tác và Nội Dung */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Quản Lý Tương Tác và Nội Dung</Card.Title>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Người gửi</th>
                            <th>Nội dung</th>
                            <th>Ngày</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentData.map((student) => (
                            <tr key={student.id}>
                              <td>{student.name}</td>
                              <td>Tin nhắn mẫu</td>
                              <td>{student.lastInteraction}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Hệ Thống Thông Báo */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Hệ Thống Thông Báo</Card.Title>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Tiêu đề thông báo</Form.Label>
                          <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Nội dung thông báo</Form.Label>
                          <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <Button variant="primary">Gửi thông báo</Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Container>
        </div>
      )}
    </>
  );
};
