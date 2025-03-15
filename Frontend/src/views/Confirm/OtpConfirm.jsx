import { Input } from "@mobiscroll/react";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

export const OtpConfirm = () => {
  return (
    <Container>
      <Row className="d-flex justify-content-center">
        <Col xl={6}>
          <Card className="p-5">
            <h3 className="etutoring fw-bold text-center">Eturtoring</h3>
            <h4 className="verify-email text-center"> Verify your email</h4>
            <span className="d-flex text-muted justify-content-center ">
              We're sent a verification code to
            </span>
            <span className="d-flex text-muted fw-bold justify-content-center mb-3">
              example@gmail.com
            </span>
            <MDBInput></MDBInput>
            <MDBBtn className="mt-3">Verify Email</MDBBtn>
            <div className="d-flex justify-content-center mt-3 gap-2 align-items-center">
              <span className="text-muted">Didn't receive the code?</span>
              <span className="resend-code  text-uppercase small ">Resend Code</span>
            </div>
            <div className="d-flex justify-content-center">
              <Button
                variant="link"
                className="text-decoration-underline mt-2 back-btn"
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
