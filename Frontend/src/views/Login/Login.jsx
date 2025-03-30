import React, { useState, useEffect } from "react";
import axios from "../../services/AxiosCustom";
import { jwtDecode } from "jwt-decode";
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
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    if (email === "" && password === "") {
      toast.error("Please fill in all fields");
      return false;
    } else if (email === "") {
      toast.error("Please fill in email field");
      return false;
    } else if (password === "") {
      toast.error("Please fill in password field");
      return false;
    }
  
    try {
      setLoading(true);
      const response = await axios.post(
        "users/signin",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        const { accesstoken, refreshToken, isVerifiedToken,user, ...userData } = response.data;
  
        // Kiểm tra trạng thái trả về từ backend
        if (response.data.status === "NEED_VERIFICATION") {
          toast.warning("Your account is not verified. Redirecting to OTP confirmation...");
          localStorage.setItem("isVerifiedToken", isVerifiedToken); 
          const isverifyDecoded = jwtDecode(isVerifiedToken);
          localStorage.setItem("emailtoverify", isverifyDecoded.payload.email);
          setLoading(false);
          try {
            const response = await axios.post("otp/resend-email-otp", {
              email: isverifyDecoded.payload.email,
            });
            if (response.status === 200) {
              console.log(response.data);
            }
          } catch (error) {
            
          }
          navigate("/otp-confirm"); // Chuyển hướng đến trang OTP
          return;
        }
  
        const decoded = jwtDecode(accesstoken);
        console.log("Decoded JWT:", decoded);
        console.log("refreshToken:", refreshToken);
        localStorage.setItem("accessToken", accesstoken);
        localStorage.setItem('userlogged',JSON.stringify(user));
        localStorage.setItem("userId", decoded.payload.id);
        localStorage.setItem("role", decoded.payload.role);
        toast.success("Login successful!");
        setLoading(false);
        navigate("/");
      }
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
      <MDBRow className="w-100 d-flex justify-content-center">
        <MDBCol md="6">
          <MDBCard>
            <MDBCardHeader className="text-center">
              <h3>Login</h3>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBInput
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <MDBInput
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4"
              />
              <MDBBtn
                onClick={handleLogin}
                className="w-100 mb-4"
                disable={isLoading}
              >
                {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Login"}
              </MDBBtn>
              <div>
                <p className="mb-0 text-end text-decoration-underline text-muted">
                  <Link to="/forgot-password">Forgot Password</Link>
                </p>
              </div>
              <div className="text-center">
                <p>or login with:</p>
                <MDBBtn floating color="primary" className="mx-1">
                  <MDBIcon fab icon="facebook-f" />
                </MDBBtn>
                <MDBBtn floating color="danger" className="mx-1">
                  <MDBIcon fab icon="google" />
                </MDBBtn>
                <MDBBtn floating color="info" className="mx-1">
                  <MDBIcon fab icon="twitter" />
                </MDBBtn>
              </div>
            </MDBCardBody>
            <MDBCardFooter className="text-center">
              <p>
                Don't have an account? <a href="/register">Register</a>
              </p>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
