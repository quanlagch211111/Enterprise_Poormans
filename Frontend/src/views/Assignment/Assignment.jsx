import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "../../services/AxiosCustom";
import {
  MDBBtn,
  MDBInput,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import {
  ConfirmDeleteAsm,
  EditAssignment,
  NewAssignment,
} from "../../components/Modal";

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
  const [showModalNewAsm, setShowModalNewAsm] = useState(false);
  const [showModalDeleteAsm, setShowModalDeleteAsm] = useState(false);
  const [showModalEditAsm, setShowModalEditAsm] = useState(false);
  const [idAsmDelete, setIdAsmDelete] = useState("");
  const [idAsmEdit, setIdAsmEdit] = useState("");

  const students = users.filter((user) => user.role === "Student");
  const tutors = users.filter((user) => user.role === "Tutor");
  const role = localStorage.getItem("role");

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
      const response = await axios.get("/assignments", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchUsersWithRoles = async () => {
    try {
      const response = await axios.get("/users/getuserwithroles", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users with roles:", error);
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
            {role === "STAFF" && (
              <MDBBtn onClick={() => setShowModalNewAsm(true)}>Add</MDBBtn>
            )}
          </div>
          <div className="body">
            <MDBTable className="rouded-2">
              <MDBTableHead className="table-header rouded-2">
                <tr>
                  <th>Class Name</th>
                  <th>Student Name</th>
                  <th>Teacher Name</th>
                  <th>Date</th>
                  {role !== "STUDENT" && <th>Action</th>}
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table-body bg-white ">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>{assignment.title}</td>
                    {/* Map over the student_id array to display all student names */}
                    <td>
                      {assignment.student_id
                        .map((student) => student.user_id.username) // Extract each student's username
                        .join(", ")}{" "}
                      {/* Join the names with a comma */}
                    </td>
                    <td>{assignment.tutor_id.user_id.username}</td>
                    <td>
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </td>
                    {role !== "STUDENT" && (
                      <td>
                        <div className="dropdown-assignment mb-9 d-flex justify-content-end align-items-center">
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
                              (isVisibilityId === assignment._id
                                ? "active"
                                : "")
                            }
                          >
                            <li
                              className="dropdown-item"
                              onClick={() => {
                                setIdAsmDelete(assignment._id);
                                setShowModalDeleteAsm(true);
                              }}
                            >
                              Delete
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={() => {
                                setEditAssignment(assignment);
                                setIdAsmEdit(assignment.id);
                                setShowModalEditAsm(true);
                              }}
                            >
                              Update
                            </li>
                          </ul>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>
        </div>
      </div>
      {/* modal create  */}
      <NewAssignment
        show={showModalNewAsm}
        setAssignments={setAssignments}
        assignments={assignments}
        userId={userId}
        accessToken={accessToken}
        students={students} // Truyền danh sách students
        tutors={tutors} // Truyền danh sách tutors
        onClose={() => setShowModalNewAsm(false)}
      ></NewAssignment>
      <ConfirmDeleteAsm
        show={showModalDeleteAsm}
        setAssignments={setAssignments}
        assignments={assignments}
        id={idAsmDelete}
        accessToken={accessToken}
        onClose={() => setShowModalDeleteAsm(false)}
      ></ConfirmDeleteAsm>
      <EditAssignment
        show={showModalEditAsm}
        setAssignments={setAssignments}
        assignments={assignments}
        editAssignment={editAssignment}
        students={students} // Truyền danh sách students
        tutors={tutors}
        setEditAssignment={setEditAssignment}
        accessToken={accessToken}
        onClose={() => setShowModalEditAsm(false)}
      ></EditAssignment>
    </>
  );
};

export default Assignment;
