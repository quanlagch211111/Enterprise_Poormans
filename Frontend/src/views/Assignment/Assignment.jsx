import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
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
} from "mdb-react-ui-kit";

const Assignment = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisibilityId, setVisibilityId] = useState(null);
  const [centredModal, setCentredModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [editAssignment, setEditAssignment] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    student_id: [], // Added to fix the issue
    tutor_id: "",
    assigned_by: userId,
  });

  const students = users.filter((user) => user.role === "Student");
  const tutors = users.filter((user) => user.role === "Tutor");

  const openEditModal = (assignment) => {
    setEditAssignment(assignment);
    setEditModal(true);
  };


  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    fetchAssignments();
    fetchUsersWithRoles();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/assignments", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Assignments:", response.data);
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchUsersWithRoles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/getuserwithroles",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setUsers(response.data);
      console.log("Users with roles:", response.data);
    } catch (error) {
      console.error("Error fetching users with roles:", error);
    }
  };

  const handleAddAssignment = async () => {
    try {
      console.log("Data being sent:", newAssignment); // Log data trước khi gửi

      const response = await axios.post(
        "http://localhost:3001/api/assignments",
        newAssignment,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log("Response from server:", response.data); // Log response từ server

      setAssignments([...assignments, response.data.assignment]);
      setCentredModal(false);
      setNewAssignment({
        title: "",
        student_id: [], // Reset student_ids
        tutor_id: "",
        assigned_by: userId,
      });
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };


  const handleEditAssignment = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/assignments/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setAssignments(
        assignments.map((assignment) =>
          assignment._id === id ? response.data.assignment : assignment
        )
      );
    } catch (error) {
      console.error("Error editing assignment:", error);
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const toggleOpen = () => setCentredModal(!centredModal);
  const toggleVisibility = (id) =>
    setVisibilityId(isVisibilityId === id ? null : id);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <tr key={assignment._id}>
                    <td>{assignment.title}</td>
                    {/* Map over the student_id array to display all student names */}
                    <td>
                      {assignment.student_id
                        .map((student) => student.username) // Extract each student's username
                        .join(", ")} {/* Join the names with a comma */}
                    </td>
                    <td>{assignment.tutor_id.username}</td>
                    <td>
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="dropdown-assignment">
                        <div className="container-select d-flex justify-content-end">
                          <div
                            className="dropdown-select  d-flex align-items-center justify-content-center"
                            onClick={() => toggleVisibility(assignment._id)}
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
                            (isVisibilityId === assignment._id ? "active" : "")
                          }
                        >
                          <li
                            className="dropdown-item"
                            onClick={() => handleDeleteAssignment(assignment._id)}
                          >
                            Delete
                          </li>
                          <li
                            className="dropdown-item"
                            onClick={() => openEditModal(assignment)}
                          >
                            Update
                          </li>

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
                <MDBInput
                  label="Title"
                  id="title"
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                />

                {/* Student Select */}
                <label>Select Students</label>
                <select
                  multiple
                  className="form-select"
                  value={newAssignment.student_id}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      student_id: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                >
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.username}
                    </option>
                  ))}
                </select>

                {/* Tutor Select */}
                <label>Select Tutor</label>
                <select
                  className="form-select"
                  value={newAssignment.tutor_id || ""}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      tutor_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select a tutor</option>
                  {tutors.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.username}
                    </option>
                  ))}
                </select>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleAddAssignment}>Create</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal tabIndex="-1" open={editModal} onClose={() => setEditModal(false)}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update Assignment</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setEditModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="d-flex flex-column gap-2">
                <MDBInput
                  label="Title"
                  id="editTitle"
                  type="text"
                  value={editAssignment?.title || ""}
                  onChange={(e) =>
                    setEditAssignment({ ...editAssignment, title: e.target.value })
                  }
                />

                {/* Student Select */}
                <label>Select Students</label>
                <select
                  multiple
                  className="form-select"
                  value={editAssignment?.student_id.map((s) => s._id) || []}
                  onChange={(e) =>
                    setEditAssignment({
                      ...editAssignment,
                      student_id: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                >
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.username}
                    </option>
                  ))}
                </select>

                {/* Tutor Select */}
                <label>Select Tutor</label>
                <select
                  className="form-select"
                  value={editAssignment?.tutor_id?._id || ""}
                  onChange={(e) =>
                    setEditAssignment({
                      ...editAssignment,
                      tutor_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select a tutor</option>
                  {tutors.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.username}
                    </option>
                  ))}
                </select>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setEditModal(false)}>
                Close
              </MDBBtn>
              <MDBBtn onClick={() => handleEditAssignment(editAssignment._id, editAssignment)}>
                Update
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

    </>
  );
};

export default Assignment;