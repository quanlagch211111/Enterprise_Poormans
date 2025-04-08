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
  const objectId = localStorage.getItem("objectId");

  const accessToken = localStorage.getItem("accessToken");
  const [users, setUsers] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [documentListCount, setDocumentListCount] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [newStudentData, setNewStudentData] = useState([]);
  const [pendingUserBlogs, setPendingUserBlogs] = useState([]);
  const [newTutorData, setNewTutorData] = useState([]);
  const [meetingLength, setMeetingLenth] = useState("");
  const [meetingLengthTutor, setMeetingLenthTutor] = useState("");
  const [unassignedStudent, setUnassignedStudentData] = useState([]);
  const [unassignedTutor, setUnassignedTutorData] = useState([]);
  const [totalMessagesData, setTotalMessagesData] = useState([]);
  const [notiform, setNotiform] = useState({
    user_id: [],
    from: "",
    message: "",
  });
  const userList = users.map((user) => user._id);
  const studentCount = users.filter((user) => user.role === "Student").length;
  const tutorCount = users.filter((user) => user.role === "Tutor").length;
  const studentPendingBlogs = blogList.filter(
    (blog) => blog.status === "pending" && blog.author_id._id === userId
  ).length;

  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("/meetings", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("ObjectId:", objectId);
        console.log("Meetings:", response.data);

        const meetingLength = response.data.meetings.filter((meeting) =>
          meeting.participant_ids.some((p) => p._id === objectId)
        ).length;
        setMeetingLenth(meetingLength);
        const meetingLengthTutor = response.data.meetings.filter(
          (meeting) => meeting.organizer_id._id === objectId
        ).length;
        setMeetingLenthTutor(meetingLengthTutor);

        console.log("Meeting lenth tutor:", meetingLengthTutor);
        console.log("Meeting lenth:", meetingLength);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

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

        setPendingBlogs(
          response.data.filter((blog) => blog.status === "pending").length
        );
      } catch (error) {
        console.error("Error fetching pending blogs:", error);
      }
    };
    const fetchPendingUserBlogs = async () => {
      try {
        const response = await axios.get("/blogs/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setBlogList(response.data);
        console.log("Blog List:", response.data);
        setPendingUserBlogs(
          response.data.filter(
            (blog) => blog.status === "pending" && blog.author_id._id === userId
          ).length
        );
      } catch (error) {
        console.error("Error fetching pending blogs:", error);
      }
    };

    const fetchDocumentListLength = async () => {
      try {
        const response = await axios.get("/documents/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("Document List:", response.data);
        setDocumentListCount(
          response.data.filter((doc) => doc.owner_id === objectId).length
        );
        console.log("Document List count:", documentListCount);
        // setDocumentList(response.data);
        // console.log("Document List:", response.data);
      } catch (error) {
        console.error("Error fetching pending documents:", error);
      }
    };
    const fetchDocumentList = async () => {
      try {
        const response = await axios.get("/documents/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("Document List:", response.data);
        setDocumentListCount(response.data.length);
        setDocumentList(response.data);
        console.log("Document List:", response.data);
      } catch (error) {
        console.error("Error fetching pending documents:", error);
      }
    };

    if (userId) {
      fetchUserInfo();
      fetchUsersWithRoles();
      fetchPendingBlogs();
      fetchMeetings();
      fetchPendingUserBlogs();
      fetchDocumentList();
      fetchDocumentListLength();
      fetchUnassignedUsers();
      fetchMessages();
    }
  }, [userId, accessToken, navigate]);

  useEffect(() => {
    const calculateLast7DaysData = (users, role) => {
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString().split("T")[0];
      }).reverse();

      return last7Days.map(
        (day) =>
          users.filter(
            (user) =>
              user.role === role &&
              new Date(user.created_at).toISOString().split("T")[0] === day
          ).length
      );
    };

    if (users.length > 0) {
      setNewStudentData(calculateLast7DaysData(users, "Student"));
      setNewTutorData(calculateLast7DaysData(users, "Tutor"));
    }
  }, [users]);

  const fetchUnassignedUsers = async () => {
    try {
      // Fetch all users
      const usersResponse = await axios.get("/users/getuserwithroles", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const allUsers = usersResponse.data;

      // Fetch all assignments
      const assignmentsResponse = await axios.get("/assignments", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const allAssignments = assignmentsResponse.data;

      // Calculate the last 7 days
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      }).reverse();

      // Extract assigned student and tutor IDs
      const assignedStudentIds = allAssignments.flatMap((assignment) =>
        assignment.student_id.map((student) => student._id)
      );
      const assignedTutorIds = allAssignments.map(
        (assignment) => assignment.tutor_id._id
      );

      // Group unassigned users by day
      const unassignedStudentData = last7Days.map((day) => {
        return allUsers.filter(
          (user) =>
            user.role === "Student" &&
            !assignedStudentIds.includes(user._id) &&
            new Date(user.created_at).toISOString().split("T")[0] === day
        ).length;
      });

      const unassignedTutorData = last7Days.map((day) => {
        return allUsers.filter(
          (user) =>
            user.role === "Tutor" &&
            !assignedTutorIds.includes(user._id) &&
            new Date(user.created_at).toISOString().split("T")[0] === day
        ).length;
      });

      // Update state
      setUnassignedStudentData(unassignedStudentData);
      setUnassignedTutorData(unassignedTutorData);
    } catch (error) {
      console.error("Error fetching unassigned users:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      // Fetch messages count for the last 7 days
      const response = await axios.get("/messages/count-last-7-days", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Extract and format the data
      const messagesCount = response.data.data;

      // Ensure all 7 days are included, even if count is 0
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      }).reverse();

      const messagesPerDay = last7Days.map((day) => {
        const dayData = messagesCount.find((item) => item._id === day);
        return dayData ? dayData.count : 0; // Default to 0 if no data for the day
      });

      // Update state
      setTotalMessagesData(messagesPerDay);
    } catch (error) {
      console.error("Error fetching messages count:", error);
    }
  };

  const SendNotification = async () => {
    try {
      console.log("Sending notification with data:", {
        user_ids: userList,
        from: userId,
        message: notiform.message,
      });

      const response = await axios.post(
        "/notifications/multiple",
        {
          user_ids: userList,
          entityType: "Notification",
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

  return (
    <>
      {role === "STUDENT" && (
        <Container fluid>
          <div className="main-content">
            <Col md={9} lg={10} className="p-4 w-100">
              <Row className="mb-4">
                <Col>
                  <h2>Welcome {userInfo.username}!</h2>
                </Col>
              </Row>

              {/* Overview Cards */}
              <Row className="mb-4">
                <Col md={4} sm={6}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{meetingLength}</Card.Title>
                      <Card.Text>Appointment</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} sm={6}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{documentListCount}</Card.Title>
                      <Card.Text>Assignment submited</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} sm={6}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{pendingUserBlogs}</Card.Title>
                      <Card.Text>Blog Waiting for Response</Card.Text>
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
                  <h2>Welcome {userInfo.username} </h2>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>{meetingLengthTutor}</Card.Title>
                      <Card.Text>Appointment</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>{documentListCount}</Card.Title>
                      <Card.Text>Documents submitted</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Card.Title>{pendingUserBlogs}</Card.Title>
                      <Card.Text>Blog awaiting response</Card.Text>
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
                  <h2>Welcome {userInfo.username} !</h2>
                </Col>
              </Row>
              {/* Overview Cards */}
              <Row className="mb-4">
                <Col md={3} sm={6} className="mb-4">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{studentCount}</Card.Title>
                      <Card.Text>Total number of lecturers</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6} className="mb-4">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>{tutorCount}</Card.Title>
                      <Card.Text>Total number of lecturers</Card.Text>
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
                  unassignedStudentData={unassignedStudent}
                  unassignedTutorData={unassignedTutor}
                  totalMessagesData={totalMessagesData}
                />
              </Row>
              {/* Hệ Thống Thông Báo */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Notification System</Card.Title>
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
