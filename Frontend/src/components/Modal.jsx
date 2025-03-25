import { faIR } from "@mui/x-date-pickers/locales";
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
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { useNavigate } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export const ConfirmLogout = (props) => {
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        navigate("/login");
      } else {
        console.error("Failed to log out:", response.data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      <MDBModal open={props.show} onClose={handleClose} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Are you sure to logout?</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleLogout}>Yes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

// Assignment
export const NewAssignment = (props) => {
  const { setAssignments, assignments, userId, accessToken, students, tutors } =
    props;
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    student_id: [], // Added to fix the issue
    tutor_id: "",
    assigned_by: userId,
  });
  const [isLoading, setLoading] = useState(false);
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleAddAssignment = async () => {
    try {
      setLoading(true);
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
      toast.success("Assignment has been created successfully");
      setLoading(false);
      handleClose();
      setNewAssignment({
        title: "",
        student_id: [], // Reset student_ids
        tutor_id: "",
        assigned_by: userId,
      });
    } catch (error) {
      toast.error("Error adding assignment:", error);
    }
  };
  return (
    <>
      <MDBModal tabIndex="-1" open={props.show} onClose={handleClose}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create New Assignment</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
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
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleAddAssignment} disabled={isLoading}>
                {isLoading ? (
                  <ClipLoader color="#ffffff" size={15} />
                ) : (
                  "Create"
                )}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
export const EditAssignment = (props) => {
  const {
    setAssignments,
    assignments,
    editAssignment,
    setEditAssignment,
    accessToken,
    students,
    tutors,
  } = props;
  const [isLoading, setLoading] = useState(false);
  if (!editAssignment || !Array.isArray(editAssignment.student_id)) return null;
  console.log("Edit asm: ", editAssignment.student_id);
  console.log("student: ", students);
  console.log("tutors: ", tutors);
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleEditAssignment = async (id, updatedData) => {
    try {
      setLoading(true);
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
      setLoading(false);
      toast.success("Assignment has been updated successfully.");
      handleClose();
    } catch (error) {
      toast.error("Error editing assignment:", error);
    }
  };
  return (
    <>
      <MDBModal tabIndex="-1" open={props.show} onClose={handleClose}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update Assignment</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="d-flex flex-column gap-2">
                <MDBInput
                  label="Title"
                  id="editTitle"
                  type="text"
                  value={editAssignment?.title || ""}
                  onChange={(e) =>
                    setEditAssignment({
                      ...editAssignment,
                      title: e.target.value,
                    })
                  }
                />

                {/* Student Select */}
                <label>Select Students</label>
                <select
                  multiple
                  className="form-select"
                  value={
                    Array.isArray(editAssignment?.student_id)
                      ? editAssignment.student_id.map((s) => s._id)
                      : []
                  }
                  onChange={(e) =>
                    setEditAssignment({
                      ...editAssignment,
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
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn
                onClick={() =>
                  handleEditAssignment(editAssignment._id, editAssignment)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <ClipLoader color="#ffffff" size={15} />
                ) : (
                  "Update"
                )}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
export const ConfirmDeleteAsm = (props) => {
  const { setAssignments, assignments, accessToken, id } = props;
  const [isLoading, setLoading] = useState(false);
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleDeleteAssignment = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
      handleClose();
      setLoading(false);
      toast.success("Assignment has been deleted successfully.");
    } catch (error) {
      toast.error("Error deleting assignment:", error);
    }
  };
  return (
    <>
      <MDBModal open={props.show} onClose={handleClose} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Are you sure to delete this assignment
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleDeleteAssignment} disabled={isLoading}>
                {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Yes"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

// Blog
export const NewBlog = (props) => {
  const { accessToken } = props;
  const [isVisibility, setVisibility] = useState(false);
  const toggleVisibility = () => setVisibility(!isVisibility);
  const [newBlog, setNewBog] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setLoading] = useState(false);
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleAddBlog = async () => {
    try {
      // before call api
      setLoading(true);
      // ...
      // after call api
      setLoading(false);
      toast.success("Blog has been created successfully.");
      handleClose();
    } catch (error) {
      toast.error("Blog has been created failed.");
    }
  };
  return (
    <>
      <MDBModal tabIndex="-1" open={props.show} onClose={handleClose}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create New Blog</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                className="mb-3"
                label="Title"
                id="typeText"
                type="text"
                value={newBlog.title}
                onChange={(e) =>
                  setNewBog({ ...newBlog, title: e.target.value })
                }
              />
              <MDBTextArea
                label="Description"
                id="textAreaExample"
                rows="{4}"
                value={newBlog.description}
                onChange={(e) =>
                  setNewBog({ ...newBlog, description: e.target.value })
                }
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleAddBlog} disabled={isLoading}>
                {isLoading ? (
                  <ClipLoader color="#ffffff" size={15} />
                ) : (
                  "Create"
                )}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
export const DeleteBlog = (props) => {
  const [isLoading, setLoading] = useState(false);
  const { accessToken } = props;
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleDeleteBlog = async () => {
    try {
      // before call api
      setLoading(true);
      // ...
      // after call api
      setLoading(false);
      toast.success("Blog has been deleted successfully.");
      handleClose();
    } catch (error) {
      toast.error("Blog has been deleted failed.");
    }
  };
  return (
    <>
      <MDBModal tabIndex="-1" open={props.show} onClose={handleClose}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Are you sure to delete this blog?</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleDeleteBlog} disabled={isLoading}>
                {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Yes"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
export const DetailBlog = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [isVisibility, setVisibility] = useState(false);
  const toggleVisibility = () => setVisibility(!isVisibility);
  const [modalDeleteBlog, setModalDeleteBlog] = useState(false);
  const [modalUpdateBlog, setModalUpdateBlog] = useState(false);
  const { accessToken } = props;
  const [data, setData] = useState({
    title: "Thằng Quân Nguuuuu",
    description: "Cực Ngu REAL.",
    createdAt: "25/03/2025",
    createdBy: "Tao Là Đức",
  });
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleDeleteBlog = async () => {
    try {
      // before call api
      setLoading(true);
      // ...
      // after call api
      setLoading(false);
      toast.success("Blog has been deleted successfully.");
      handleClose();
    } catch (error) {
      toast.error("Blog has been deleted failed.");
    }
  };
  return (
    <>
      <MDBModal size="lg" tabIndex="-1" open={props.show} onClose={handleClose}>
        <MDBModalDialog centered size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{data.title}</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="mb-2 d-flex justify-content-end">
                <div className="dropdown ">
                  <div className="container-select d-flex justify-content-end">
                    <div
                      className="dropdown-select  d-flex align-items-center justify-content-center"
                      onClick={toggleVisibility}
                    >
                      <img src={require("../assets/images/more.png")} alt="" />
                    </div>
                  </div>
                  <ul
                    className={
                      "dropdown-list d-flex gap-2 flex-column " +
                      (isVisibility ? "active" : "")
                    }
                  >
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        handleClose();
                        setModalDeleteBlog(true);
                      }}
                    >
                      Delete
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        handleClose();
                        setModalUpdateBlog(true);
                      }}
                    >
                      Update
                    </li>
                  </ul>
                </div>
              </div>
              <div className="blog-grid">
                <article className="blog-card" onClick={handleClose}>
                  <div className="blog-image"></div>
                  <div className="blog-content">
                    <div className="blog-tags">
                      <span className="blog-tag">{data.createdAt}</span>
                      <span className="blog-tag">{data.createdBy}</span>
                    </div>
                    {/* <h4 className="blog-title">
                          </h4> */}
                    <p className="blog-excerpt">{data.description}</p>
                  </div>
                </article>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <EditBlog
        show={modalUpdateBlog}
        onClose={setModalUpdateBlog}
        blog={data}
        accessToken={accessToken}
      ></EditBlog>
      <DeleteBlog
        show={modalDeleteBlog}
        onClose={setModalDeleteBlog}
        blog={data}
        setBlog={setData}
        accessToken={accessToken}
      ></DeleteBlog>
    </>
  );
};
export const EditBlog = (props) => {
  const { accessToken, blog: editBlog, setBlog: setEditBlog } = props;
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleEditBlog = async () => {
    try {
      // before call api
      setLoading(true);
      // ...
      // after call api
      setLoading(false);
      toast.success("Blog has been created successfully.");
      handleClose();
    } catch (error) {
      toast.error("Blog has been created failed.");
    }
  };
  return (
    <>
      <MDBModal tabIndex="-1" open={props.show} onClose={handleClose}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Blog</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                className="mb-3"
                label="Title"
                id="typeText"
                type="text"
                value={editBlog.title}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, title: e.target.value })
                }
              />
              <MDBTextArea
                label="Description"
                id="textAreaExample"
                rows="{4}"
                value={editBlog.description}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, description: e.target.value })
                }
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleEditBlog} disabled={isLoading}>
                {isLoading ? (
                  <ClipLoader color="#ffffff" size={15} />
                ) : (
                  "Create"
                )}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
