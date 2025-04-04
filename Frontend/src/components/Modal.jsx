import { Toast } from "@mobiscroll/react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { faIR } from "@mui/x-date-pickers/locales";
import axios from "../services/AxiosCustom";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
export const ConfirmLogout = (props) => {
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.clear();
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
//#region Assignment
export const NewAssignment = (props) => {
  const { setAssignments, assignments, userId, accessToken, students, tutors } =
    props;

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    student_id: [],
    tutor_id: "",
    assigned_by: userId,
  });

  const [isLoading, setLoading] = useState(false);

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  const handleCheckboxChange = (studentId) => {
    setNewAssignment((prev) => ({
      ...prev,
      student_id: prev.student_id.includes(studentId)
        ? prev.student_id.filter((id) => id !== studentId) // Bỏ chọn
        : [...prev.student_id, studentId], // Thêm vào danh sách đã chọn
    }));
  };

  const handleTutorSelect = (tutorId) => {
    setNewAssignment((prev) => ({
      ...prev,
      tutor_id: tutorId,
    }));
  };

  const handleAddAssignment = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/assignments", newAssignment, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAssignments([...assignments, response.data.assignment]);
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error adding assignment:", error);
      setLoading(false);
    }
  };

  return (
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
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, title: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Students</label>
              {students.map((student) => (
                <div key={student._id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`student-${student._id}`}
                    checked={newAssignment.student_id.includes(student._id)}
                    onChange={() => handleCheckboxChange(student._id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`student-${student._id}`}
                  >
                    {student.username}
                  </label>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="tutor">Tutor</label>
              {tutors.map((tutor) => (
                <div key={tutor._id} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`tutor-${tutor._id}`}
                    name="tutor"
                    checked={newAssignment.tutor_id === tutor._id}
                    onChange={() => handleTutorSelect(tutor._id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`tutor-${tutor._id}`}
                  >
                    {tutor.username}
                  </label>
                </div>
              ))}
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={handleClose}>
              Close
            </MDBBtn>
            <MDBBtn onClick={handleAddAssignment} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
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
  const [formState, setFormState] = useState({
    title: "",
    student_id: [],
    tutor_id: "",
  });

  // Đồng bộ dữ liệu từ editAssignment vào formState khi editAssignment thay đổi
  useEffect(() => {
    if (editAssignment) {
      setFormState({
        title: editAssignment.title || "",
        student_id:
          editAssignment.student_id.map((student) => student._id) || [],
        tutor_id: editAssignment.tutor_id?._id || "",
      });
    }
  }, [editAssignment]);

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (studentId) => {
    setFormState((prev) => ({
      ...prev,
      student_id: prev.student_id.includes(studentId)
        ? prev.student_id.filter((id) => id !== studentId) // Bỏ chọn
        : [...prev.student_id, studentId], // Thêm vào danh sách đã chọn
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/assignments/${editAssignment._id}`,
        formState,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        setAssignments((prev) =>
          prev.map((assignment) =>
            assignment._id === editAssignment._id
              ? response.data.assignment
              : assignment
          )
        );
        toast.success("Assignment updated successfully!");
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to update assignment.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formState.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Students</label>
              {students.map((student) => (
                <div key={student._id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`student-${student._id}`}
                    checked={formState.student_id.includes(student._id)}
                    onChange={() => handleCheckboxChange(student._id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`student-${student._id}`}
                  >
                    {student.username}
                  </label>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="tutor">Tutor</label>
              <select
                id="tutor"
                name="tutor_id"
                className="form-control"
                value={formState.tutor_id}
                onChange={handleInputChange}
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
            <MDBBtn color="primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
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
      await axios.delete(`/assignments/${id}`, {
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
              <MDBBtn
                onClick={handleDeleteAssignment}
                color="danger"
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Yes"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
//#endregion

// Blog
//#region Blog
export const NewBlog = (props) => {
  const { accessToken, fetchBlog, fetchPendingBlogs } = props;
  const [newBlog, setNewBlog] = useState({
    title: "",
    author_id: localStorage.getItem("userId"),
    status: "pending",
    tags: [],
    content: "",
  });
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  const handleAddBlog = async () => {
    try {
      setLoading(true);

      // API call to create a new blog
      const response = await axios.post("/blogs", newBlog, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 201) {
        fetchBlog();
        fetchPendingBlogs();
        toast.success("Blog has been created successfully.");
        handleClose();
        setNewBlog({ title: "", tags: [], content: "" });
      } else {
        toast.error("Failed to create blog.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Blog creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = e.target.value.trim();

      if (newTag && !newBlog.tags.includes(newTag)) {
        setNewBlog((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }

      e.target.value = ""; // Clear input after adding a tag
    }
  };

  const removeTag = (index) => {
    setNewBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  return (
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
                setNewBlog({ ...newBlog, title: e.target.value })
              }
            />

            <div>
              <MDBInput
                className="mb-3"
                label="Tags"
                id="tagInput"
                type="text"
                onKeyDown={handleKeyDown}
              />
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {newBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => removeTag(index)}
                  >
                    {tag} ✖
                  </span>
                ))}
              </div>
            </div>
            <MDBTextArea
              label="Description"
              id="textAreaExample"
              rows="4"
              value={newBlog.content}
              onChange={(e) =>
                setNewBlog({ ...newBlog, content: e.target.value })
              }
            />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={handleClose}>
              Close
            </MDBBtn>
            <MDBBtn onClick={handleAddBlog} disabled={isLoading}>
              {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Create"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export const DeleteBlog = (props) => {
  const [isLoading, setLoading] = useState(false);
  const { accessToken, blog, fetchBlogs } = props;
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleDeleteBlog = async () => {
    try {
      setLoading(true);
      await axios.delete(`/blogs/${blog._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchBlogs();
      toast.success("Blog deleted successfully.");
      handleClose();
    } catch (error) {
      toast.error("Failed to delete blog.");
    } finally {
      setLoading(false);
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
              <MDBBtn
                onClick={handleDeleteBlog}
                color="danger"
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Yes"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
// export const DetailBlog = (props) => {
//   const [isLoading, setLoading] = useState(false);
//   const [isVisibility, setVisibility] = useState(false);
//   const toggleVisibility = () => setVisibility(!isVisibility);
//   const [modalDeleteBlog, setModalDeleteBlog] = useState(false);
//   const [modalUpdateBlog, setModalUpdateBlog] = useState(false);
//   const { accessToken } = props;
//   const [data, setData] = useState({
//     title: "Thằng Quân Nguuuuu",
//     description: "Cực Ngu REAL.",
//     createdAt: "25/03/2025",
//     createdBy: "Tao Là Đức",
//   });
//   const handleClose = () => {
//     if (props.onClose) props.onClose();
//   };
//   return (
//     <>
//       <MDBModal size="lg" tabIndex="-1" open={props.show} onClose={handleClose}>
//         <MDBModalDialog centered size="lg">
//           <MDBModalContent>
//             <MDBModalHeader>
//               <MDBModalTitle>{data.title}</MDBModalTitle>
//               <MDBBtn
//                 className="btn-close"
//                 color="none"
//                 onClick={handleClose}
//               ></MDBBtn>
//             </MDBModalHeader>
//             <MDBModalBody>
//               <div className="mb-2 d-flex justify-content-end">
//                 <div className="dropdown ">
//                   <div className="container-select d-flex justify-content-end">
//                     <div
//                       className="dropdown-select  d-flex align-items-center justify-content-center"
//                       onClick={toggleVisibility}
//                     >
//                       <img src={require("../assets/images/more.png")} alt="" />
//                     </div>
//                   </div>
//                   <ul
//                     className={
//                       "dropdown-list d-flex gap-2 flex-column " +
//                       (isVisibility ? "active" : "")
//                     }
//                   >
//                     <li
//                       className="dropdown-item"
//                       onClick={() => {
//                         handleClose();
//                         setModalDeleteBlog(true);
//                       }}
//                     >
//                       Delete
//                     </li>
//                     <li
//                       className="dropdown-item"
//                       onClick={() => {
//                         handleClose();
//                         setModalUpdateBlog(true);
//                       }}
//                     >
//                       Update
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <div className="blog-grid">
//                 <article className="blog-card" onClick={handleClose}>
//                   <div className="blog-image"></div>
//                   <div className="blog-content">
//                     <div className="blog-tags">
//                       <span className="blog-tag">{data.createdAt}</span>
//                       <span className="blog-tag">{data.createdBy}</span>
//                     </div>
//                     {/* <h4 className="blog-title">
//                           </h4> */}
//                     <p className="blog-excerpt">{data.description}</p>
//                   </div>
//                 </article>
//               </div>
//             </MDBModalBody>
//             <MDBModalFooter>
//               <MDBBtn color="secondary" onClick={handleClose}>
//                 Close
//               </MDBBtn>
//             </MDBModalFooter>
//           </MDBModalContent>
//         </MDBModalDialog>
//       </MDBModal>
//       <EditBlog
//         show={modalUpdateBlog}
//         onClose={setModalUpdateBlog}
//         blog={data}
//         accessToken={accessToken}
//       ></EditBlog>
//       <DeleteBlog
//         show={modalDeleteBlog}
//         onClose={setModalDeleteBlog}
//         blog={data}
//         setBlog={setData}
//         accessToken={accessToken}
//       ></DeleteBlog>
//     </>
//   );
// };

export const DetailBlog = (props) => {
  const { blog, accessToken, onClose, onUpdate, fetchBlogs } = props;
  const [modalDeleteBlog, setModalDeleteBlog] = useState(false);
  const role = localStorage.getItem("role"); // Get the user's role
  const userId = localStorage.getItem("userId"); // Get the logged-in user's ID
  const [isEditing, setIsEditing] = useState(false);
  const [editBlog, setEditBlog] = useState({
    title: blog?.title || "",
    tags: blog?.tags || [],
    content: blog?.content || "",
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setEditBlog({
      title: blog?.title || "",
      tags: blog?.tags || [],
      content: blog?.content || "",
    });
  }, [blog]);

  const handleEditBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/blogs/${blog._id}`, editBlog, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        fetchBlogs(); // Fetch updated blogs
        toast.success("Blog updated successfully.");
        onUpdate(response.data); // Notify parent component
        setIsEditing(false);
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !editBlog.tags.includes(newTag)) {
        setEditBlog((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      e.target.value = ""; // Clear input after adding a tag
    }
  };

  const removeTag = (index) => {
    setEditBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      await axios.put(
        `/blogs/${blog._id}`,
        {
          status: "published",
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.success("Blog approved successfully.");
      onClose();
    } catch (error) {
      toast.error("Failed to approve blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await axios.put(
        `/blogs/${blog._id}/`,
        {
          status: "rejected",
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchBlogs();
      toast.success("Blog rejected successfully.");
      onClose();
    } catch (error) {
      toast.error("Failed to reject blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MDBModal tabIndex="-1" open={props.show} onClose={onClose}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Blog Details</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={onClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {isEditing ? (
                <>
                  <MDBInput
                    className="mb-3"
                    label="Title"
                    name="title"
                    value={editBlog.title}
                    onChange={handleInputChange}
                  />
                  <div>
                    <MDBInput
                      className="mb-3"
                      label="Tags"
                      id="tagInput"
                      type="text"
                      onKeyDown={handleTagKeyDown}
                    />
                    <div
                      style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
                    >
                      {editBlog.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            background: "#007bff",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => removeTag(index)}
                        >
                          {tag} ✖
                        </span>
                      ))}
                    </div>
                  </div>
                  <MDBTextArea
                    label="Content"
                    rows="4"
                    name="content"
                    value={editBlog.content}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <h5>{blog?.title}</h5>
                  <p>{blog?.content}</p>
                  <div>
                    <strong>Tags:</strong>{" "}
                    {blog?.tags.map((tag, index) => (
                      <span key={index} className="badge bg-primary mx-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p>
                    <strong>Status:</strong> {blog?.status}
                  </p>
                </>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              {isEditing ? (
                <>
                  <MDBBtn color="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </MDBBtn>
                  <MDBBtn
                    color="primary"
                    onClick={handleEditBlog}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </MDBBtn>
                </>
              ) : (
                <>
                  {/* Approve and Reject buttons for STAFF */}
                  {role === "STAFF" && blog?.status === "pending" && (
                    <>
                      <MDBBtn
                        color="success"
                        onClick={handleApprove}
                        disabled={isLoading}
                      >
                        Approve
                      </MDBBtn>
                      <MDBBtn
                        color="warning"
                        onClick={handleReject}
                        disabled={isLoading}
                      >
                        Reject
                      </MDBBtn>
                    </>
                  )}

                  {/* Edit and Delete buttons for blog owner */}
                  {blog?.author_id._id === userId && (
                    <>
                      <MDBBtn color="info" onClick={() => setIsEditing(true)}>
                        Edit
                      </MDBBtn>
                      <MDBBtn
                        color="danger"
                        onClick={() => setModalDeleteBlog(true)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Deleting..." : "Delete"}
                      </MDBBtn>
                    </>
                  )}

                  <MDBBtn color="secondary" onClick={onClose}>
                    Close
                  </MDBBtn>
                </>
              )}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <DeleteBlog
        accessToken={accessToken}
        blog={blog}
        show={modalDeleteBlog}
        onClose={() => setModalDeleteBlog(false)}
        fetchBlogs={fetchBlogs}
      />
    </>
  );
};
export const EditBlog = (props) => {
  const { accessToken, blog: editBlog, onClose, onUpdate } = props;
  const [updatedBlog, setUpdatedBlog] = useState({
    title: editBlog?.title || "",
    tags: editBlog?.tags || [],
    content: editBlog?.content || "",
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setUpdatedBlog({
      title: editBlog?.title || "",
      tags: editBlog?.tags || [],
      content: editBlog?.content || "",
    });
  }, [editBlog]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleUpdateBlog = async () => {
    try {
      setLoading(true);

      // API call to update the blog
      const response = await axios.put(`/blogs/${editBlog._id}`, updatedBlog, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        toast.success("Blog has been updated successfully.");
        onUpdate(response.data); // Notify parent component
        handleClose();
      } else {
        toast.error("Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Blog update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = e.target.value.trim();

      if (newTag && !updatedBlog.tags.includes(newTag)) {
        setUpdatedBlog((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }

      e.target.value = ""; // Clear input after adding a tag
    }
  };

  const removeTag = (index) => {
    setUpdatedBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  return (
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
              value={updatedBlog.title}
              onChange={(e) =>
                setUpdatedBlog({ ...updatedBlog, title: e.target.value })
              }
            />

            <div>
              <MDBInput
                className="mb-3"
                label="Tags"
                id="tagInput"
                type="text"
                onKeyDown={handleKeyDown}
              />
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {updatedBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => removeTag(index)}
                  >
                    {tag} ✖
                  </span>
                ))}
              </div>
            </div>
            <MDBTextArea
              label="Content"
              id="textAreaExample"
              rows="4"
              value={updatedBlog.content}
              onChange={(e) =>
                setUpdatedBlog({ ...updatedBlog, content: e.target.value })
              }
            />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={handleClose}>
              Close
            </MDBBtn>
            <MDBBtn onClick={handleUpdateBlog} disabled={isLoading}>
              {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Update"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
//#endregion

// Event meeting
//#region meeting
export const NewEvent = (props) => {
  const { accessToken, events, setEvents, students, tutors, onClose } = props;

  const [newMeeting, setNewMeeting] = useState({
    organizer_id: "", // Chọn tutor (radio button)
    participant_ids: [], // Chọn students (checkbox)
    date: "",
    start_time: "",
    end_time: "",
    type: "",
    note: "",
  });

  const handleStudentSelection = (studentId) => {
    setNewMeeting((prev) => ({
      ...prev,
      participant_ids: prev.participant_ids.includes(studentId)
        ? prev.participant_ids.filter((id) => id !== studentId) // Bỏ chọn
        : [...prev.participant_ids, studentId], // Thêm vào danh sách đã chọn
    }));
  };

  const handleTutorSelection = (tutorId) => {
    setNewMeeting((prev) => ({
      ...prev,
      organizer_id: tutorId, // Chỉ chọn 1 tutor
    }));
  };

  const handleCreateMeeting = async () => {
    if (
      !newMeeting.organizer_id ||
      newMeeting.participant_ids.length === 0 ||
      !newMeeting.date ||
      !newMeeting.start_time ||
      !newMeeting.end_time ||
      !newMeeting.type
    ) {
      toast.error("Please fill in all the required fields!");
      return;
    }
    try {
      const response = await axios.post("/meetings/create", newMeeting, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEvents([...events, response.data.meeting]);
      onClose();
    } catch (error) {
      toast.error("Error creating meeting:", error);
    }
  };

  return (
    <MDBModal tabIndex="-1" open={props.show} onClose={onClose}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Create New Meeting</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={onClose}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              label="Date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={newMeeting.date}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, date: e.target.value })
              }
            />
            <MDBInput
              label="Start Time"
              className="my-3"
              type="time"
              value={newMeeting.start_time}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, start_time: e.target.value })
              }
            />
            <MDBInput
              label="End Time"
              className="my-3"
              type="time"
              value={newMeeting.end_time}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, end_time: e.target.value })
              }
            />
            <MDBInput
              label="Type"
              className="my-3"
              type="text"
              value={newMeeting.type}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, type: e.target.value })
              }
            />
            <MDBInput
              label="Note"
              className="my-3"
              type="text"
              value={newMeeting.note}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, note: e.target.value })
              }
            />

            {/* Chọn Tutor (Organize) */}
            <div className="form-group">
              <label>
                <strong>Select Organizer (Tutor)</strong>
              </label>
              {tutors.map((tutor) => (
                <div key={tutor._id} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`tutor-${tutor._id}`}
                    name="organizer"
                    checked={newMeeting.organizer_id === tutor._id}
                    onChange={() => handleTutorSelection(tutor._id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`tutor-${tutor._id}`}
                  >
                    {tutor.username}
                  </label>
                </div>
              ))}
            </div>

            {/* Chọn Students (Participants) */}
            <div className="form-group mt-3">
              <label>
                <strong>Select Participants (Students)</strong>
              </label>
              {students.map((student) => (
                <div key={student._id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`student-${student._id}`}
                    checked={newMeeting.participant_ids.includes(student._id)}
                    onChange={() => handleStudentSelection(student._id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`student-${student._id}`}
                  >
                    {student.username}
                  </label>
                </div>
              ))}
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onClose}>
              Close
            </MDBBtn>
            <MDBBtn onClick={handleCreateMeeting}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
export const DeleteEvent = (props) => {
  const { accessToken, events, setEvents, id, onClose } = props;

  const handleDeleteMeeting = async () => {
    try {
      await axios.delete(`/meetings/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEvents(events.filter((event) => event.id !== id));
      onClose();
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  return (
    <MDBModal tabIndex="-1" open={props.show} onClose={onClose}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Delete Meeting</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={onClose}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onClose}>
              Close
            </MDBBtn>
            <MDBBtn color="danger" onClick={handleDeleteMeeting}>
              Delete
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export const UpdateEvent = (props) => {
  const {
    accessToken,
    events,
    setEvents,
    eventUpdate,
    students,
    tutors,
    onClose,
  } = props;

  const [updatedMeeting, setUpdatedMeeting] = useState({
    ...eventUpdate, // Dữ liệu mặc định từ event cần update
    participant_ids: eventUpdate.participant_ids || [],
    organizer_id: eventUpdate.organizer_id || "",
  });

  const handleStudentSelection = (studentId) => {
    setUpdatedMeeting((prev) => ({
      ...prev,
      participant_ids: prev.participant_ids.includes(studentId)
        ? prev.participant_ids.filter((id) => id !== studentId) // Bỏ chọn
        : [...prev.participant_ids, studentId], // Thêm vào danh sách đã chọn
    }));
  };

  const handleTutorSelection = (tutorId) => {
    setUpdatedMeeting((prev) => ({
      ...prev,
      organizer_id: tutorId, // Chỉ chọn 1 tutor
    }));
  };

  const handleUpdateMeeting = async () => {
    try {
      const response = await axios.put(
        `/meetings/${updatedMeeting._id}`,
        updatedMeeting,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setEvents(
        events.map((event) =>
          event._id === updatedMeeting._id ? response.data.meeting : event
        )
      );

      onClose();
    } catch (error) {
      console.error("Error updating meeting:", error);
    }
  };

  return (
    <MDBModal tabIndex="-1" open={props.show} onClose={onClose}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Update Meeting</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={onClose}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              label="Date"
              type="date"
              value={updatedMeeting.date}
              onChange={(e) =>
                setUpdatedMeeting({ ...updatedMeeting, date: e.target.value })
              }
            />
            <MDBInput
              label="Start Time"
              className="my-3"
              type="time"
              value={updatedMeeting.start_time}
              onChange={(e) =>
                setUpdatedMeeting({
                  ...updatedMeeting,
                  start_time: e.target.value,
                })
              }
            />
            <MDBInput
              label="End Time"
              className="my-3"
              type="time"
              value={updatedMeeting.end_time}
              onChange={(e) =>
                setUpdatedMeeting({
                  ...updatedMeeting,
                  end_time: e.target.value,
                })
              }
            />
            <MDBInput
              label="Type"
              className="my-3"
              type="text"
              value={updatedMeeting.type}
              onChange={(e) =>
                setUpdatedMeeting({ ...updatedMeeting, type: e.target.value })
              }
            />
            <MDBInput
              label="Note"
              className="my-3"
              type="text"
              value={updatedMeeting.note}
              onChange={(e) =>
                setUpdatedMeeting({ ...updatedMeeting, note: e.target.value })
              }
            />

            {/* Chọn Tutor (Organizer) */}
            <div className="form-group">
              <label>
                <strong>Select Organizer (Tutor)</strong>
              </label>
              {tutors.map((tutor) => (
                <div key={tutor._id} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`tutor-${tutor._id}`}
                    name="organizer"
                    checked={updatedMeeting.organizer_id === tutor._id}
                    onChange={() => handleTutorSelection(tutor._id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`tutor-${tutor._id}`}
                  >
                    {tutor.username}
                  </label>
                </div>
              ))}
            </div>

            {/* Chọn Students (Participants) */}
            <div className="form-group mt-3">
              <label>
                <strong>Select Participants (Students)</strong>
              </label>
              {students.map((student) => (
                <div key={student._id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`student-${student._id}`}
                    checked={updatedMeeting.participant_ids.includes(
                      student._id
                    )}
                    onChange={() => handleStudentSelection(student._id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`student-${student._id}`}
                  >
                    {student.username}
                  </label>
                </div>
              ))}
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onClose}>
              Close
            </MDBBtn>
            <MDBBtn onClick={handleUpdateMeeting}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
//#endregion
// Assignment

//#region document
export const UploadAssignment = (props) => {
  const { accessToken, selectedFolder, newDocument, setNewDocument, role } =
    props;
  const [selectedFile, setSelectedFile] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      // Upload file to Google Drive
      const uploadResponse = await axios.post(
        "/google-drive/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (uploadResponse.status === 200) {
        const fileUrl = uploadResponse.data.fileUrl;

        // Prepare document data
        const documentData = {
          ...newDocument,
          folder_id: selectedFolder._id,
          file_path: fileUrl,
          content: role === "STUDENT" ? "submit" : newDocument.content, // Nếu là STUDENT, content mặc định là "submit"
        };

        // Log the body of the POST request
        console.log("Document Data to be sent:", documentData);

        // Save document to database
        const saveResponse = await axios.post("/documents", documentData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (saveResponse.status === 201) {
          alert("Document uploaded and saved successfully!");
          handleClose();
          setSelectedFile(null);
          setNewDocument({
            owner_id: localStorage.getItem("userId"),
            folder_id: selectedFolder?._id,
            types: "",
            content: "",
          });
          toast.success("Assignment has been uploaded successfully.");
        } else {
          toast.error("Failed to save document.");
        }
      } else {
        toast.error("Failed to upload file.");
      }
    } catch (error) {
      if (error.response) {
        toast.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        toast.error("No response received from server:", error.request);
      } else {
        toast.error("Error setting up the request:", error.message);
      }
      toast.error("An error occurred while uploading the document.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[1]; // Lấy phần mở rộng của file (e.g., pdf, docx)
      setSelectedFile(file);
      setNewDocument((prev) => ({
        ...prev,
        types: fileType, // Cập nhật type vào state
      }));
    }
  };
  return (
    <>
      <MDBModal tabIndex="-1" open={props.show} onClose={handleClose}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Upload Assignment</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  handleClose();
                }}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <>
                <div className="form-group">
                  <label htmlFor="document-type" className="form-label">
                    Document Type
                  </label>
                  <input
                    type="text"
                    id="document-type"
                    className="form-control"
                    value={newDocument.types} // Hiển thị type tự động lấy từ file
                    readOnly // Không cho phép chỉnh sửa
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="document-content" className="form-label">
                    Content
                  </label>
                  <textarea
                    id="document-content"
                    className="form-control"
                    placeholder="Enter document content"
                    value={newDocument.content}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        content: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="document-file" className="form-label">
                    File
                  </label>
                  <input
                    type="file"
                    id="document-file"
                    className="form-control"
                    onChange={handleFileChange} // Gọi hàm xử lý khi chọn file
                    required
                  />
                </div>
              </>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => {
                  handleClose();
                }}
              >
                Close
              </MDBBtn>
              <MDBBtn onClick={handleDocumentUpload} disabled={isLoading}>
                {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Lưu"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
export const DeleteAssignment = (props) => {
  const [isLoading, setLoading] = useState(false);
  const {
    accessToken,
    documentId,
    fetchDocuments,
    selectedFolder,
    documentFilePath,
  } = props;
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleDeleteAssignment = async () => {
    try {
      setLoading(true);

      const response = await axios.delete(`/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const removeFileResponse = await axios.delete("/google-drive/delete", {
        data: { fileUrl: documentFilePath },
      });

      if (response.status === 200 && removeFileResponse.status === 200) {
        toast.success("Assignment has been deleted successfully.");
        fetchDocuments(selectedFolder._id); // Refresh danh sách documents
        setLoading(false);
        handleClose();
      } else {
        alert("Failed to remove file.");
      }
    } catch (error) {
      toast.error("Error removing file:", error);
      toast.error("An error occurred while removing the file.");
    }
  };
  return (
    <>
      <MDBModal tabIndex="-1" open={props.show} onClose={handleClose}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Are you sure to delete this assignment?
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
              <MDBBtn
                onClick={handleDeleteAssignment}
                color="danger"
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Yes"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
//#endregion

// User

//#region user
export const EditUser = (props) => {
  const { accessToken, userData } = props;
  const [isLoading, setLoading] = useState(false);
  const [userEdit, setUserEdit] = useState({
    id: "",
    fullName: "",
    email: "",
    address: "",
    role: "",
    status: "",
    avatar: "",
  });
  useEffect(() => {
    setUserEdit({
      id: userData.id,
      fullName: userData.fullName,
      email: userData.email,
      address: userData.address,
      role: userData.role,
      status: userData.status,
      avatar: userData.avatar,
    });
  }, [userData]);

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleEditUser = async () => {
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
              <MDBModalTitle>Edit User</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                className="mb-3"
                label="Full Name"
                id="typeText"
                type="text"
                value={userEdit.fullName}
                onChange={(e) =>
                  setUserEdit({ ...userEdit, fullName: e.target.value })
                }
              />
              <MDBInput
                className="mb-3"
                label="Email"
                id="typeText"
                type="text"
                value={userEdit.email}
                onChange={(e) =>
                  setUserEdit({ ...userEdit, email: e.target.value })
                }
              />
              <MDBInput
                className="mb-3"
                label="Address"
                id="typeText"
                type="text"
                value={userEdit.address}
                onChange={(e) =>
                  setUserEdit({ ...userEdit, address: e.target.value })
                }
              />
              <MDBInput
                className="mb-3"
                label="role"
                id="typeText"
                type="text"
                value={userEdit.role}
                disabled={true}
                onChange={(e) =>
                  setUserEdit({ ...userEdit, role: e.target.value })
                }
              />
              <MDBInput
                className="mb-3"
                label="Title"
                id="typeText"
                type="file"
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleEditUser} disabled={isLoading}>
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
export const EditPassword = (props) => {
  const { accessToken } = props;
  const [isLoading, setLoading] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState({
    oldPass: "",
    newPass: "",
  });

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleEditPass = async () => {
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
              <MDBModalTitle>Change Password</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                className="mb-3"
                label="Old Password"
                id="typeText"
                type="text"
                value={passwordEdit.oldPass}
                onChange={(e) =>
                  setPasswordEdit({ ...passwordEdit, oldPass: e.target.value })
                }
              />
              <MDBInput
                className="mb-3"
                label="New Password"
                id="typeText"
                type="text"
                value={passwordEdit.newPass}
                onChange={(e) =>
                  setPasswordEdit({ ...passwordEdit, newPass: e.target.value })
                }
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn
                onClick={handleEditPass}
                disabled={isLoading}
                color="info"
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
//#endregion

// folder
//#region folder
export const NewFolder = (props) => {
  const { folders, accessToken, assignmentId } = props;
  const [newFolder, setNewFolder] = useState({
    assignment_id: assignmentId,
    title: "",
    description: "",
    deadline: "",
  });

  const [isLoading, setLoading] = useState(false);

  // Update newFolder.assignment_id when assignmentId changes
  useEffect(() => {
    setNewFolder((prev) => ({
      ...prev,
      assignment_id: assignmentId,
    }));
  }, [assignmentId]);

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  const handleAddNewFolder = async () => {
    try {
      console.log("Form Data:", newFolder); // Debug log
      setLoading(true);
      const response = await axios.post("/submissionFolders", newFolder, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("API Response:", response);
      setLoading(false);
      if (response.status === 201 || response.status === 200) {
        toast.success("Folder created successfully.");
        // setNewFolder([...folders, response.data.folder]);
        handleClose();
      }
    } catch (error) {
      toast.error("Folder creation failed.");
    }
  };

  return (
    <MDBModal tabIndex="-1" open={props.show} onClose={handleClose}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Create New Folder</MDBModalTitle>
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
              value={newFolder.title}
              onChange={(e) =>
                setNewFolder({ ...newFolder, title: e.target.value })
              }
            />
            <MDBTextArea
              label="Description"
              id="textAreaExample"
              rows="4"
              value={newFolder.description}
              onChange={(e) =>
                setNewFolder({ ...newFolder, description: e.target.value })
              }
            />
            <MDBInput
              className="my-3"
              label="Deadline"
              id="typeText"
              type="date"
              value={newFolder.deadline}
              onChange={(e) =>
                setNewFolder({ ...newFolder, deadline: e.target.value })
              }
            />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={handleClose}>
              Close
            </MDBBtn>
            <MDBBtn onClick={handleAddNewFolder} disabled={isLoading}>
              {isLoading ? <ClipLoader color="#ffffff" size={15} /> : "Create"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
//#endregion
