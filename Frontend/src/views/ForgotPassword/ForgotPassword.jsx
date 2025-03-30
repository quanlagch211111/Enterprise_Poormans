import React, { useState } from "react";
import axios from "../../services/AxiosCustom";
import { useNavigate, Link } from "react-router-dom";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardFooter,
} from "mdb-react-ui-kit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleEmailChange = (e) =>{
    setEmail(e.target.value);
    setEmailError(false); // Reset error state on input change
  }
  const handleForgotPassword = async () => {
    if (email === "") {
      toast.error("Please enter your email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      // Giả lập API call
      setTimeout(() => {
        setIsEmailSent(true);
        setLoading(false);
        toast.success(
          "Password reset instructions have been sent to your email"
        );
      }, 1500);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
    >
      <ToastContainer />
      <MDBRow className="w-100 d-flex justify-content-center">
        <MDBCol md="6">
          <MDBCard>
            <MDBCardHeader className="text-center">
              <h3>Forgot Password</h3>
            </MDBCardHeader>
            <MDBCardBody>
              {!isEmailSent ? (
                <>
                  <p className="text-center mb-4">
                    Enter your email address and we'll send you instructions to
                    reset your password.
                  </p>
                  <MDBInput
                    label="Email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={emailError ? "is-invalid mb-1" : "mb-1"}
                    required
                  />
                  {emailError && (
                    <div className="text-danger small mt-1">{emailError}</div>
                  )}
                  <MDBBtn
                    onClick={handleForgotPassword}
                    className="w-100 mb-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ClipLoader color="#ffffff" size={15} />
                    ) : (
                      "Reset Password"
                    )}
                  </MDBBtn>
                </>
              ) : (
                <div className="text-center">
                  <MDBIcon
                    fas
                    icon="check-circle"
                    size="3x"
                    className="text-success mb-3"
                  />
                  <h4 className="mb-3">Email Sent</h4>
                  <p>
                    We've sent password reset instructions to your email. Please
                    check your inbox.
                  </p>
                  <p className="mt-4">
                    Didn't receive the email? Check your spam folder or{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEmailSent(false);
                      }}
                    >
                      try again
                    </a>
                  </p>
                </div>
              )}
            </MDBCardBody>
            <MDBCardFooter className="text-center">
              <p>
                Remember your password? <Link to="/login">Back to login</Link>
              </p>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ForgotPassword;