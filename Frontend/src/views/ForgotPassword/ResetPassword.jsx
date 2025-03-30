import React, { useState, useEffect } from "react";
import axios from "../../services/AxiosCustom";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  MDBProgress,
  MDBProgressBar,
} from "mdb-react-ui-kit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  // Lấy token từ query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Invalid or missing reset token");
      // Sau 3 giây, chuyển hướng về trang forgot password
      setTimeout(() => {
        navigate("/forgot-password");
      }, 3000);
    }
  }, [location, navigate]);

  // Kiểm tra độ mạnh của mật khẩu
  const checkPasswordStrength = (password) => {
    let strength = 0;

    // Độ dài ít nhất 8 ký tự
    if (password.length >= 8) strength += 25;

    // Có ít nhất một ký tự hoa
    if (/[A-Z]/.test(password)) strength += 25;

    // Có ít nhất một ký tự số
    if (/[0-9]/.test(password)) strength += 25;

    // Có ít nhất một ký tự đặc biệt
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "danger";
    if (passwordStrength <= 50) return "warning";
    if (passwordStrength <= 75) return "info";
    return "success";
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const handleResetPassword = async () => {
    // Validate password
    if (password === "") {
      toast.error("Please enter your new password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (passwordStrength < 50) {
      toast.error("Please use a stronger password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Giả lập API call
      setTimeout(() => {
        setIsReset(true);
        setLoading(false);
        toast.success("Your password has been reset successfully!");

        // Sau 3 giây, chuyển hướng đến trang đăng nhập
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
              <h3>Reset Password</h3>
            </MDBCardHeader>
            <MDBCardBody>
              {!isReset ? (
                <>
                  <p className="text-center mb-4">
                    Enter your new password below.
                  </p>

                  <div className="mb-4">
                    <MDBInput
                      label="New Password"
                      id="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="mb-2"
                    />
                    {password && (
                      <>
                        <MDBProgress height="10">
                          <MDBProgressBar
                            striped
                            animated
                            width={passwordStrength}
                            bgColor={getPasswordStrengthColor()}
                          />
                        </MDBProgress>
                        <div className="d-flex justify-content-end mt-1">
                          <small
                            className={`text-${getPasswordStrengthColor()}`}
                          >
                            {getPasswordStrengthLabel()}
                          </small>
                        </div>
                      </>
                    )}
                    <div className="mt-1">
                      <small className="text-muted">
                        Password must be at least 8 characters and include
                        uppercase letters, numbers, and special characters.
                      </small>
                    </div>
                  </div>

                  <MDBInput
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mb-4"
                  />

                  {password &&
                    confirmPassword &&
                    password !== confirmPassword && (
                      <div className="text-danger mb-4">
                        Passwords do not match
                      </div>
                    )}

                  <MDBBtn
                    onClick={handleResetPassword}
                    className="w-100 mb-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ClipLoader color="#ffffff" size={15} />
                    ) : (
                      "Set New Password"
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
                  <h4 className="mb-3">Password Reset Successful</h4>
                  <p>
                    Your password has been reset successfully. You will be
                    redirected to the login page shortly.
                  </p>
                </div>
              )}
            </MDBCardBody>
            <MDBCardFooter className="text-center">
              <p>
                <Link to="/login">Back to login</Link>
              </p>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ResetPassword;