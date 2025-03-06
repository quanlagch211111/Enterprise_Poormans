import React, { useState } from "react";
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

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Logic for handling login
  };

  return (
    
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
    >
      <MDBRow>
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
              <MDBBtn onClick={handleLogin} className="w-100 mb-4">
                Login
              </MDBBtn>
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
