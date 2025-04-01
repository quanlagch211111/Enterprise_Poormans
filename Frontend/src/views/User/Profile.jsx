import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Badge,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaCog,
  FaHistory,
} from "react-icons/fa";
import { EditPassword, EditUser } from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import axios from "../../services/AxiosCustom";

export const Profile = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId")
  const role = localStorage.getItem("role")
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalEditUser, setModalEditUser] = useState(false);
  const [modalEditPass, setModalEditPass] = useState(false);
     
  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }
    const fetchCurrentUser = async () => {
      try {
        // Mô phỏng API call
        setLoading(true);
        const response = await axios.get(`users/detailuser/${userId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTimeout(() => {
          setUser(response.data.data);
          console.log(response)
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải thông tin người dùng...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Đã xảy ra lỗi!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Profile</h2>

      <Row>
        {/* Phần thông tin cá nhân */}
        <Col lg={4} md={5} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <img
                src={user.avatar}
                alt="Avatar"
                className="rounded-circle img-thumbnail mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <h4>{user.username}</h4>
              <Badge
                bg={user.isVerified === true ? "success" : "secondary"}
                className="mb-3"
              >
                {user.isVerified === true
                  ? "Verified"
                  : "Not Verified"}
              </Badge>
              <div className="d-grid gap-2 mt-3">
                <Button
                  variant="primary"
                  onClick={() => setModalEditUser(true)}
                >
                  <FaCog className="me-2" /> Change Profile
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setModalEditPass(true)}
                >
                  Change Password
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Phần thông tin chi tiết */}
        <Col lg={8} md={7}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Chi tiết tài khoản</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">
                  ID User:
                </Col>
                <Col sm={8}>{user._id}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">
                  Full Name:
                </Col>
                <Col sm={8}>{user.username}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">
                  Email:
                </Col>
                <Col sm={8}>{user.email}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">
                  Role:
                </Col>
                <Col sm={8}>
                  <Badge bg="primary">{role}</Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">
                  Status:
                </Col>
                <Col sm={8}>
                  <Badge
                    bg={user.isVerified === true ? "success" : "secondary"}
                  >
                    {user.isVerified === true
                      ? "Verified"
                      : "Not Verified"}
                    
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <EditUser
        show={modalEditUser}
        onClose={() => setModalEditUser(false)}
        userData={user}
      ></EditUser>
      <EditPassword
        show={modalEditPass}
        onClose={() => setModalEditPass(false)}
      ></EditPassword>
    </Container>
  );
};
