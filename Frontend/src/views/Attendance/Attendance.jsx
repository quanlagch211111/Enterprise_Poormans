import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "../../services/AxiosCustom";

const Attendance = () => {
  const navigate = useNavigate();  
  const accessToken = localStorage.getItem("accessToken");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Asynchronous function to fetch the classes
    const fetchClasses = async () => {
      try {
        // Replace with actual API call
        const response = await axios.get("assignments/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,  // Ensure `accessToken` is available in your scope
          },
        });

        if (response.status === 200) {
          setClasses(response.data); // Assuming `response.data` contains the class data
          console.log("Classes fetched successfully:", response.data);
        } else {
          toast.error("Failed to fetch classes.");
        }
      } catch (error) {
        toast.error("Error fetching classes: " + error.message);
      }
    };

    fetchClasses();
  }, []); // Empty dependency array to run this effect only once after the component mounts

  // Hàm xử lý khi người dùng click vào một lớp
  const handleClassClick = (classId) => {
    navigate(`/classes/${classId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row className="mb-4">
          {classes.map((classItem) => (
            <Col
              key={classItem._id}
              md={4}
              sm={6}
              xs={12}
              className="pointer"
              onClick={() => handleClassClick(classItem._id)}
            >
              <Card className="shadow-sm p-3 mb-4 bg-white rounded text-center">
                <Card.Body>
                  <h5 className="card-title">{classItem.title}</h5>
                  <p className="card-text">
                    👥 Students: <strong>{classItem.student_id.length}</strong>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Attendance;
