import { MDBBtn } from "mdb-react-ui-kit";
import axios from "../../services/AxiosCustom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Đặt root element cho modal

export const Document = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState({ tutorDocuments: [], studentDocuments: [] }); const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    owner_id: localStorage.getItem("userId"),
    folder_id: "",
    types: "",
    content: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const role = localStorage.getItem("role");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    fetchAssignments();
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

  const fetchFolders = async (assignmentId) => {
    try {
      const response = await axios.post(
        `/submissionFolders/getSubmissionFoldersByAssignment`,
        { assignment_id: assignmentId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setFolders(response.data || []); // Đảm bảo folders luôn là một mảng
    } catch (error) {
      console.error("Error fetching folders:", error);
      setFolders([]); // Đặt folders thành mảng rỗng nếu có lỗi
    }
  };

  const fetchDocuments = async (folderId) => {
    try {
      const response = await axios.get(`/documents/folder/${folderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Lấy danh sách ID của sinh viên từ assignment
      const studentIds = selectedAssignment?.student_id.map((student) => student._id) || [];
      console.log("Student IDs:", studentIds); // Log danh sách ID sinh viên
      const tutorId = selectedAssignment?.tutor_id?._id; // Lấy ID của tutor

      const allDocuments = response.data;

      // Lọc tài liệu của tutor
      const tutorDocuments = allDocuments.filter((doc) => doc.owner_id === tutorId);
      console.log("Tutor Documents:", tutorDocuments); // Log tài liệu của tutor

      // Lọc tài liệu của sinh viên
      const studentDocuments = allDocuments.filter(doc => {
        console.log(`Checking ${doc.owner_id} against`, studentIds);
        return studentIds.some(id => id === doc.owner_id);
      });
      
      console.log("Filtered Student Documents:", studentDocuments);
      console.log("Student Documents:", studentDocuments); // Log tài liệu của sinh viên
      console.log("all", allDocuments) // Log tất cả tài liệu

      // Cập nhật state
      setDocuments({ tutorDocuments, studentDocuments });
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments({ tutorDocuments: [], studentDocuments: [] });
    }
  };

  const handleUnsubmit = async (documentId) => {
    try {
      const response = await axios.delete(`/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        alert("File removed successfully!");
        fetchDocuments(selectedFolder._id); // Refresh danh sách documents
      } else {
        alert("Failed to remove file.");
      }
    } catch (error) {
      console.error("Error removing file:", error);
      alert("An error occurred while removing the file.");
    }
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
        const saveResponse = await axios.post(
          "/documents",
          documentData,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (saveResponse.status === 201) {
          alert("Document uploaded and saved successfully!");
          setIsModalOpen(false);
          setSelectedFile(null);
          setNewDocument({
            owner_id: localStorage.getItem("userId"),
            folder_id: selectedFolder?._id,
            types: "",
            content: "",
          });
        } else {
          alert("Failed to save document.");
        }
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
      alert("An error occurred while uploading the document.");
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

  const renderAssignments = () => (
    <div className="left-side d-flex flex-column gap-2">
      <h3>Assignments</h3>
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <span
            key={assignment._id}
            className={`class-name ${selectedAssignment?._id === assignment._id ? "active" : ""
              }`}
            onClick={() => {
              setSelectedAssignment(assignment);
              setSelectedFolder(null);
              fetchFolders(assignment._id);
            }}
          >
            {assignment.title}
          </span>
        ))
      ) : (
        <span className="text-muted">No assignments available</span>
      )}
    </div>
  );

  const renderDocuments = () => {
    const tutorDocuments = documents?.tutorDocuments || []; // Gán giá trị mặc định là []

    if (tutorDocuments.length === 0) {
      return <p className="text-muted">No documents available</p>;
    }

    return (
      <div className="document-list d-flex flex-wrap gap-3">
        {tutorDocuments.map((doc) => (
          <div key={doc._id} className="document-card p-3 border rounded">
            <div className="d-flex align-items-center gap-2">
              {doc.types.toLowerCase() === "pdf" ? (
                <i className="fas fa-file-pdf text-danger fa-2x"></i>
              ) : doc.types.toLowerCase() === "ppt" || doc.types.toLowerCase() === "pptx" ? (
                <i className="fas fa-file-powerpoint text-warning fa-2x"></i>
              ) : (
                <i className="fas fa-file-alt text-primary fa-2x"></i>
              )}
              <div>
                <h5 className="mb-1">{doc.content}</h5>
                <p className="text-muted">{doc.types.toUpperCase()}</p>
              </div>
            </div>
            <a
              href={doc.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-link mt-2"
            >
              View Document
            </a>
          </div>
        ))}
      </div>
    );
  };

  const renderFolders = () => (
    <div className="right-side">
      <h3>Folders in {selectedAssignment?.title}</h3>
      {Array.isArray(folders) && folders.length > 0 ? (
        <div className="folder-list">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="folder-card d-flex align-items-center justify-content-between p-3 mb-2 border rounded"
              onClick={() => {
                setSelectedFolder(folder);
                fetchDocuments(folder._id); // Gọi hàm fetchDocuments khi chọn folder
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="folder-info">
                <h5 className="mb-1">{folder.title}</h5>
                <p className="text-muted mb-0">
                  {folder.description || "No description available"}
                </p>
              </div>
              <div className="folder-meta text-muted">
                <small>Deadline: {folder.deadline || "No deadline"}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No folders available</p>
      )}
    </div>
  );

  const renderFolderDetails = () => {
    if (!selectedFolder) return null;

    const studentDocuments = documents?.studentDocuments || [];
    const tutorDocuments = documents?.tutorDocuments || [];

    return (
      <div className="folder-details d-flex flex-row gap-4">
        {/* Left side: Tutor Documents */}
        <div className="left-side flex-grow-1">
          <h3>{selectedFolder.title}</h3>
          <p className="text-muted">{selectedFolder.description}</p>
          <div className="document-list d-flex flex-wrap gap-3">
            {tutorDocuments.map((doc) => (
              <div key={doc._id} className="document-card p-3 border rounded">
                <div className="d-flex align-items-center gap-2">
                  {doc.types.toLowerCase() === "pdf" ? (
                    <i className="fas fa-file-pdf text-danger fa-2x"></i>
                  ) : doc.types.toLowerCase() === "ppt" || doc.types.toLowerCase() === "pptx" ? (
                    <i className="fas fa-file-powerpoint text-warning fa-2x"></i>
                  ) : (
                    <i className="fas fa-file-alt text-primary fa-2x"></i>
                  )}
                  <div>
                    <h5 className="mb-1">{doc.content}</h5>
                    <p className="text-muted">{doc.types.toUpperCase()}</p>
                  </div>
                </div>
                <a
                  href={doc.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-link mt-2"
                >
                  View Document
                </a>
              </div>
            ))}
          </div>
          {/* Nút Upload Document */}
          {role !== "STUDENT" && (
            <MDBBtn onClick={() => setIsModalOpen(true)} color="primary" className="mt-3">
              Upload Document
            </MDBBtn>
          )}
        </div>

{role === "STUDENT" ? (
  // Nếu role là "student", hiển thị form cho sinh viên
  <div className="right-side flex-grow-1">
    <h3>Your Work</h3>
    <div className="student-work p-3 border rounded">
      {studentDocuments.length > 0 ? (
        studentDocuments.map((doc) => (
          <div key={doc._id} className="uploaded-file d-flex align-items-center gap-2 mb-2">
            <p className="mb-0">{doc.content}</p>
            <small className="text-muted">{doc.types.toUpperCase()}</small>
            <MDBBtn color="danger" size="sm" onClick={() => handleUnsubmit(doc._id)}>
              Remove
            </MDBBtn>
          </div>
        ))
      ) : (
        <p className="text-muted">Missing</p>
      )}
      <MDBBtn onClick={() => setIsModalOpen(true)} color="primary" className="mt-2">
        + Add or create
      </MDBBtn>
      <p className="text-muted mt-2">Work cannot be turned in after the due date</p>
    </div>
  </div>
) : role === "TUTOR" || role === "STAFF" ? (
  // Nếu role là "tutor" hoặc "staff", hiển thị danh sách Student Submissions
  <div className="right-side flex-grow-1">
    <h3>Student Submissions</h3>
    <div className="student-work p-3 border rounded">
      {studentDocuments.length > 0 ? (
        studentDocuments.map((doc) => (
          <div key={doc._id} className="uploaded-file d-flex align-items-center gap-2 mb-2">
            <p className="mb-0">{doc.content}</p>
            <small className="text-muted">{doc.types.toUpperCase()}</small>
            <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              View
            </a>
          </div>
        ))
      ) : (
        <p className="text-muted">No submissions available</p>
      )}
    </div>
  </div>
) : (
  // Nếu role không phải "student", "tutor" hoặc "staff", hiển thị thông báo
  <p className="text-muted">You do not have permission to view this content.</p>
)}


      </div>
    );
  };
  return (
    <div className="main-content">
      <div className="dashboard-section">
        <div className="docs-sidebar d-flex flex-row">
          {renderAssignments()}
          {selectedAssignment && !selectedFolder && renderFolders()}
          {selectedFolder && renderFolderDetails()}
        </div>
      </div>

      {/* Popup Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Upload Document"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h3 className="text-center mb-4">Upload Document</h3>
        <form onSubmit={handleDocumentUpload} className="d-flex flex-column gap-3">
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
                setNewDocument({ ...newDocument, content: e.target.value })
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
          <div className="d-flex justify-content-end gap-2">
            <MDBBtn color="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </MDBBtn>
            <MDBBtn type="submit" color="primary">
              Upload
            </MDBBtn>
          </div>
        </form>
      </Modal>
    </div>
  );
};