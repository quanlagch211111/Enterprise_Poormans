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
import Chart from "react-apexcharts";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RoleContext } from "../../services/RoleContext";
import axios from "../../services/AxiosCustom";
import { MDBInput, MDBModalBody, MDBBtn } from "mdb-react-ui-kit";
import DashboardCharts from "../../components/DashboardChart";
const localizer = momentLocalizer(moment);

export const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  // const role = "STUDENT";
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const [users, setUsers] = useState([]);
  const [studentCount, setStudentCount] = useState();
  const [tutorCount, setTutorCount] = useState();
  const [blogList, setBlogList] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [documentListCount, setDocumentList] = useState([]);
  const [notiform, setNotiform] = useState({
    user_id: [],
    from: "",
    message: "",
  });
  const userList = users.map((user) => user._id);

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

    const fetchUsersWithRoles = async () => {
      try {
        const response = await axios.get("/users/getuserwithroles", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsers(response.data);
        console.log("Users with roles:", response.data);
        const studentCount = users.filter(
          (user) => user.role === "Student"
        ).length;
        setStudentCount(studentCount);
        console.log("Student Count:", studentCount);
        const tutorCount = users.filter((user) => user.role === "Tutor").length;
        setTutorCount(tutorCount);
        console.log("Tutor Count:", tutorCount);
      } catch (error) {
        console.error("Error fetching users with roles:", error);
      }
    };

    const fetchPendingBlogs = async () => {
      try {
        const response = await axios.get("/blogs/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setBlogList(response.data);
        console.log("Blogs:", response.data);
        const pendingBlogs = response.data.filter(
          (blog) => blog.status === "pending"
        ).length;
        setPendingBlogs(pendingBlogs);
        console.log("Pending Blogs:", pendingBlogs);
      } catch (error) {
        console.error("Error fetching pending blogs:", error);
      }
    };

    const fetchDocumentList = async () => {
      try {
        const response = await axios.get("/documents/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const documentListCount = response.data.length;
        setDocumentList(documentListCount);
      } catch (error) {
        console.error("Error fetching pending documents:", error);
      }
    };

    if (userId) {
      fetchUserInfo();
      fetchUsersWithRoles();
      fetchPendingBlogs();
      fetchDocumentList();
    }
  }, [userId, accessToken, navigate]);

  const SendNotification = async () => {
    try {
      console.log("Sending notification with data:", {
        user_id: userList,
        from: userId,
        message: notiform.message,
      });

      const response = await axios.post(
        "/notifications",
        {
          user_id: userList,
          from: userId,
          message: notiform.message,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log("Notification sent:", response.data);

      setNotiform({
        user_id: [],
        from: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Error sending notification:",
        error.response ? error.response.data : error.message
      );
    }
  };
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

  // chart of staff?
  const newStudentData = [5, 3, 8, 2, 4, 6, 7]; // New students per day for the last 7 days
  const newTutorData = [2, 4, 3, 5, 2, 3, 4]; // New tutors per day for the last 7 days
  const unassignedStudentData = [1, 2, 1, 3, 2, 1, 4]; // Unassigned students per day
  const unassignedTutorData = [0, 1, 0, 2, 1, 1, 0]; // Unassigned tutors per day
  const totalMessagesData = [10, 20, 15, 30, 40, 50, 60]; // Total messages per day for the last 7 days

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      {role === "STUDENT" && (
        <Container fluid>
          <div className="main-content">
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
            </Col>
          </div>
        </Container>
      )}
      {role === "TUTOR" && (
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
        <Container fluid>
          <div className="main-content">
            <Col md={9} lg={10} className="p-4 w-100">
              <Row className="mb-4">
                <Col>
                  <h2>Chào mừng {userInfo.username} !</h2>
                  <p className="text-muted">Có 3 thông báo mới</p>
                </Col>
              </Row>
              {/* Overview Cards */}
              <Row className="mb-4">
                <Col md={3} sm={6} className="mb-4">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{studentCount}</Card.Title>
                      <Card.Text>Tổng số sinh viên</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6} className="mb-4">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{tutorCount}</Card.Title>
                      <Card.Text>Tổng số giảng viên</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6} className="mb-4">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{pendingBlogs}</Card.Title>
                      <Card.Text>All Pending Blogs</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6} className="mb-4">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{documentListCount}</Card.Title>
                      <Card.Text>Documents Submission</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              {/* Chart? */}
              <Row className="mb-4">
                <DashboardCharts
                  newStudentData={newStudentData}
                  newTutorData={newTutorData}
                  unassignedStudentData={unassignedStudentData}
                  unassignedTutorData={unassignedTutorData}
                  totalMessagesData={totalMessagesData}
                />
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
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td>{user.username}</td>
                              <td>Sinh viên</td>
                              <td>
                                <Badge
                                  bg={
                                    user.status === true ? "success" : "warning"
                                  }
                                >
                                  {user.status ? "verified" : "not verified"}
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
                      <Table responsive="sm" striped hover>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Ngày</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogList.map((blog) => (
                            <tr key={blog.id}>
                              <td>{blog.title}</td>
                              <td>10/2/2024</td>
                              <td>
                                <Badge
                                  bg={
                                    blog.status === "published"
                                      ? "success"
                                      : blog.status === "pending"
                                      ? "warning"
                                      : "danger"
                                  }
                                >
                                  {blog.status === "published"
                                    ? "Published"
                                    : blog.status === "pending"
                                    ? "Pending"
                                    : "Canceled"}
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

              {/* Hệ Thống Thông Báo */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Hệ Thống Thông Báo</Card.Title>
                      <MDBModalBody>
                        <MDBInput
                          label="Message"
                          id="typeText"
                          type="text"
                          value={notiform.message}
                          onChange={(e) =>
                            setNotiform({
                              ...notiform,
                              message: e.target.value,
                            })
                          }
                        />
                        <MDBBtn className="mt-3" onClick={SendNotification}>
                          Send
                        </MDBBtn>
                      </MDBModalBody>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </div>
        </Container>
      )}
    </>
  );
};
