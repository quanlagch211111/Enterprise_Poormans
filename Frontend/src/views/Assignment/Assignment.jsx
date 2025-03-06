import React, { useState } from "react";
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTextArea,
} from "mdb-react-ui-kit";

const Assignment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisibilityId, setVisibilityId] = useState(null);
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      assignmentName: "Math Homework",
      studentName: "John Doe",
      teacherName: "Mr. Smith",
      date: "2025-03-06",
    },
    {
      id: 2,
      assignmentName: "Science Project",
      studentName: "Jane Doe",
      teacherName: "Ms. Johnson",
      date: "2025-03-07",
    },
    {
      id: 3,
      assignmentName: "History Essay",
      studentName: "Alice Brown",
      teacherName: "Mr. Lee",
      date: "2025-03-08",
    },
    {
      id: 4,
      assignmentName: "Geography Presentation",
      studentName: "Bob Smith",
      teacherName: "Ms. Davis",
      date: "2025-03-09",
    },
    {
      id: 5,
      assignmentName: "Chemistry Lab",
      studentName: "Charlie Johnson",
      teacherName: "Mr. Wilson",
      date: "2025-03-10",
    },
    // Add more assignments as needed
  ]);

  const [centredModal, setCentredModal] = useState(false);

  const toggleOpen = () => setCentredModal(!centredModal);
  const toggleVisibility = (id) =>
    setVisibilityId(isVisibilityId === id ? null : id);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddAssignment = () => {
    // Logic to add a new assignment
  };

  const handleEditAssignment = (id) => {
    // Logic to edit an assignment
  };

  const handleDeleteAssignment = (id) => {
    // Logic to delete an assignment
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="main-content">
        <div className="assignment-page">
          <div className="header bg-white p-3 rounded-1 d-flex justify-content-between align-items-center mb-4 gap-2">
            <MDBInput
              label="Search"
              id="searchInput"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
            />
            <MDBBtn onClick={toggleOpen}>Add</MDBBtn>
          </div>
          <div className="body">
            <MDBTable className="rouded-2">
              <MDBTableHead className="table-header rouded-2">
                <tr>
                  <th>Assignment Name</th>
                  <th>Student Name</th>
                  <th>Teacher Name</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table-body bg-white ">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.assignmentName}</td>
                    <td>{assignment.studentName}</td>
                    <td>{assignment.teacherName}</td>
                    <td>{assignment.date}</td>
                    <td>
                      <div className="dropdown-assignment">
                        <div className="container-select d-flex justify-content-end">
                          <div
                            className="dropdown-select  d-flex align-items-center justify-content-center"
                            onClick={() => toggleVisibility(assignment.id)}
                          >
                            <img
                              src={require("../../assets/images/more.png")}
                              alt=""
                            />
                          </div>
                        </div>
                        <ul
                          className={
                            "dropdown-list d-flex gap-2 flex-column " +
                            (isVisibilityId === assignment.id ? "active" : "")
                          }
                        >       
                          <li className="dropdown-item">Delete</li>
                          <li className="dropdown-item">Update</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>
        </div>
      </div>
      {/* modal create  */}

      <MDBModal
        tabIndex="-1"
        open={centredModal}
        onClose={() => setCentredModal(false)}
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create New Assignment</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="d-flex flex-column gap-2">
                <MDBInput label="Title" id="title" type="text"></MDBInput>
                <MDBInput label="Teacher" id="teacher" type="text"></MDBInput>
                <MDBInput label="Student" id="student" type="text"></MDBInput>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn>Create</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default Assignment;
