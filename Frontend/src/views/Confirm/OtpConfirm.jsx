import React, { useState, useEffect } from "react";
import axios from "../../services/AxiosCustom";
import { useNavigate } from "react-router-dom";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

export const OtpConfirm = () => {
  const navigate = useNavigate(); // Ensure navigate is defined at the top level
  const [otp, setOTP] = useState("");
  const emailtoverify = localStorage.getItem("emailtoverify");

  useEffect(() => {
    if (!emailtoverify) {
      navigate("/login"); // Redirect to login if email is not found
    }
  }, [navigate, emailtoverify]); // Add emailtoverify as a dependency

  const handleVerify = async () => {
    try {
      const response = await axios.post("users/verify-otp", {
        emailtoverify,
        otp,
      });
      console.log(response);
      if (response.status === 200) {
        localStorage.removeItem("emailtoverify");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="d-flex justify-content-center">
        <Col xl={6}>
          <Card className="p-5">
            <h3 className="etutoring fw-bold text-center">Etutoring</h3>
            <h4 className="verify-email text-center">Verify your email</h4>
            <span className="d-flex text-muted justify-content-center">
              We've sent a verification code to
            </span>
            <span className="d-flex text-muted fw-bold justify-content-center mb-3">
              {emailtoverify || "example@gmail.com"}
            </span>
            <MDBInput
              label="OTP"
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
            />
            <MDBBtn onClick={handleVerify} className="mt-3">
              Verify Email
            </MDBBtn>
            <div className="d-flex justify-content-center mt-3 gap-2 align-items-center">
              <span className="text-muted">Didn't receive the code?</span>
              <span
                className="resend-code text-uppercase small"
                style={{ cursor: "pointer", color: "blue" }}
              >
                Resend Code
              </span>
            </div>
            <div className="d-flex justify-content-center">
              <Button
                variant="link"
                className="text-decoration-underline mt-2 back-btn"
                onClick={() => navigate("/login")}
              >
                Back to login
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};