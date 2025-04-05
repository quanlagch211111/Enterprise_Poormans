import { MDBBtn, MDBFile } from "mdb-react-ui-kit";
import axios from "../../services/AxiosCustom";
import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import Modal from "react-modal";
import {
  DeleteAssignment,
  NewAssignment,
  NewFolder,
  UploadAssignment,
} from "../../components/Modal";

Modal.setAppElement("#root"); // Đặt root element cho modal

export const Document = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isAssignment, setIsAssignment] = useState(false);
  const toggleAssignment = () => {
    setIsAssignment(!isAssignment);
  };
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState({
    tutorDocuments: [],
    studentDocuments: [],
  });
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [modalCreateAssignment, setModalCreateAssignment] = useState(false);
  const [modalDeleteAssignment, setModalDeleteAssignment] = useState(false);
  const [modalNewFolder, setModalNewFolder] = useState(false);
  const [documentDeleteId, setDocumentDeleteId] = useState(false);
  const [selectedFolederId, setSelectedFolderId] = useState(false);
  const [documentFilePath, setDocumentFilePath] = useState(false);
  const [selectedAsmId, setSelectedAsmId] = useState(null);
  const [newDocument, setNewDocument] = useState({
    owner_id: localStorage.getItem("userId"),
    folder_id: "",
    types: "",
    content: "",
  });
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
      const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
      const role = localStorage.getItem("role"); // Lấy role từ localStorage
      const response = await axios.get("/assignments", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      let filteredAssignments;

      if (role === "STAFF") {
        // Nếu role là STAFF, hiển thị toàn bộ assignments
        filteredAssignments = response.data;
      } else {
        // Lọc assignment dựa trên tutor_id hoặc student_id
        filteredAssignments = response.data.filter((assignment) => {
          const isTutor = assignment.tutor_id?._id === userId; // Kiểm tra nếu user là tutor
          const isStudent = assignment.student_id.some(
            (student) => student._id === userId // Kiểm tra nếu user là student
          );
          return isTutor || isStudent;
        });
      }

      setAssignments(filteredAssignments); // Cập nhật state với danh sách đã lọc
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
      setFolders(response.data || []);
    } catch (error) {
      console.error("Error fetching folders:", error);
      setFolders([]);
    }
  };
  const fetchUsername = async (ownerId) => {
    try {
      const response = await axios.get(`/users/detailuser/${ownerId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data?.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown User";
    }
  };

  const fetchDocuments = async (folderId) => {
    try {
      const response = await axios.get(`/documents/folder/${folderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const allDocuments = await Promise.all(
        response.data.map(async (doc) => {
          const username = await fetchUsername(doc.owner_id); // Lấy `username` từ `owner_id`
          return { ...doc, username }; // Gắn `username` vào tài liệu
        })
      );

      // Lọc tài liệu của tutor và sinh viên
      const tutorDocuments = allDocuments.filter(
        (doc) => doc.owner_id === selectedAssignment?.tutor_id?._id
      );
      const studentDocuments = allDocuments.filter((doc) =>
        selectedAssignment?.student_id.some(
          (student) => student._id === doc.owner_id
        )
      );

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

  const renderAssignments = () => (
    <>
      <h3>Classes</h3>
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <span
            key={assignment._id}
            className={`class-name ${
              selectedAssignment?._id === assignment._id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedAssignment(assignment);
              setSelectedFolder(null);
              fetchFolders(assignment._id);
              setSelectedAsmId(assignment._id);
            }}
          >
            {assignment.title}
          </span>
        ))
      ) : (
        <span className="text-muted">No assignments available</span>
      )}
    </>
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
              ) : doc.types.toLowerCase() === "ppt" ||
                doc.types.toLowerCase() === "pptx" ? (
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
    <>
      <div className="folder-header d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Folders in {selectedAssignment?.title}</h5>
      </div>
      {role === "STAFF" ||
        (role === "TUTOR" && (
          <div className="d-flex justify-content-end">
            <MDBBtn
              className="mb-3"
              onClick={() => {
                setModalNewFolder(true);
              }}
            >
              New Folder
            </MDBBtn>
          </div>
        ))}

      {Array.isArray(folders) && folders.length > 0 ? (
        <div className="folder-list row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="folder-card col-sm-6 col-md-4"
              onClick={() => {
                setSelectedFolder(folder);
                fetchDocuments(folder._id);
                setSelectedFolderId(folder._id);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5 className="card-title mb-0 text-dark fw-semibold">
                      <i className="fas fa-folder me-2 text-warning"></i>
                      {folder.title}
                    </h5>
                    <span className="badge bg-light text-muted">
                      {/* {folder.documents?.length || 0} files */}
                    </span>
                  </div>
                  <p className="card-text text-muted small mb-2">
                    {folder.description || "No description available"}
                  </p>
                  <div className="folder-meta text-muted small">
                    <i className="fas fa-calendar-alt me-1"></i>
                    Deadline:{" "}
                    {folder.deadline
                      ? new Date(folder.deadline).toLocaleDateString()
                      : "No deadline"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
          <p className="text-muted fs-5">No folders available</p>
        </div>
      )}
    </>
  );

  const renderFolderDetails = () => {
    if (!selectedFolder) return null;

    const studentDocuments = documents?.studentDocuments || [];
    const tutorDocuments = documents?.tutorDocuments || [];

    return (
      <>
        <div className="section-header">
          <h3>{selectedFolder.title}</h3>
          <div className="action d-flex">
            <span
              className={"doc-tabs " + (!isAssignment ? "active" : "")}
              onClick={isAssignment ? toggleAssignment : undefined}
            >
              Documents
            </span>
            <span
              className={"doc-tabs " + (isAssignment ? "active" : "")}
              onClick={!isAssignment ? toggleAssignment : undefined}
            >
              Assignment
            </span>
          </div>
        </div>
        {!isAssignment ? (
          <div className="wrapper">
            <div className="document-grid">
              {tutorDocuments.map((doc) => (
                <div key={doc._id} className="document-card">
                  {doc.types.toLowerCase() === "pdf" ? (
                    <i className="fas fa-file-pdf text-danger document-icon"></i>
                  ) : doc.types.toLowerCase() === "ppt" ||
                    doc.types.toLowerCase() === "pptx" ? (
                    <i className="fas fa-file-powerpoint text-warning document-icon"></i>
                  ) : (
                    <i className="fas fa-file-alt text-primary document-icon"></i>
                  )}
                  <div className="document-name">{doc.content}</div>
                  <div className="document-meta">
                    <p className="text-muted">{doc.types.toUpperCase()}</p>
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

            {/* Nếu là tutor, hiển thị nút upload document */}
            {role === "TUTOR" && (
              <div className="d-flex justify-content-center w-100 mt-3">
                <MDBBtn
                  onClick={() => setModalCreateAssignment(true)} // Mở modal upload document
                  color="primary"
                >
                  Upload Document
                </MDBBtn>
              </div>
            )}
          </div>
        ) : (
          <>
            {role === "STUDENT" ? (
              <>
                <div className="wrapper">
                  {studentDocuments.length > 0 ? (
                    studentDocuments
                      .filter(
                        (doc) => doc.owner_id === localStorage.getItem("userId")
                      ) // Lọc tài liệu của sinh viên đã nộp
                      .map((doc) => (
                        <div
                          key={doc._id}
                          className="assignment-container d-flex flex-row align-items-center justify-content-between"
                        >
                          <div className="assignment-card d-flex flex-row align-items-center gap-2">
                            <i className="fas fa-file-pdf assignment-icon"></i>
                            <div className="assignment-name">{doc.content}</div>
                            <div className="assignment-meta d-flex flex-row gap-2 small">
                              <span className="assignment-size small text-muted">
                                {doc.types.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="action-assignment">
                            <i
                              className="fa-solid fa-trash assignment-delete"
                              onClick={() => {
                                setDocumentDeleteId(doc._id);
                                setDocumentFilePath(doc.file_path);
                                setModalDeleteAssignment(true);
                              }}
                            ></i>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-muted">
                      No assignments have been uploaded yet.
                    </p>
                  )}
                </div>
                <div className="d-flex justify-content-center w-100">
                  <MDBBtn
                    onClick={() => setModalCreateAssignment(true)}
                    color="primary"
                    className="mt-3"
                  >
                    Assignment
                  </MDBBtn>
                </div>
              </>
            ) : role === "TUTOR" || role === "STAFF" ? (
              <>
                <div className="wrapper">
                  {studentDocuments.length > 0 ? (
                    studentDocuments.map((doc) => (
                      <div
                        key={doc._id}
                        className="assignment-container d-flex flex-row align-items-center justify-content-between"
                      >
                        <div className="assignment-card  d-flex flex-row align-items-center gap-2">
                          {doc.types.toLowerCase() === "pdf" ? (
                            <i className="fas fa-file-pdf text-danger"></i>
                          ) : doc.types.toLowerCase() === "ppt" ||
                            doc.types.toLowerCase() === "pptx" ? (
                            <i className="fas fa-file-powerpoint text-warning"></i>
                          ) : (
                            <i className="fas fa-file-alt text-primary"></i>
                          )}
                          <div className="assignment-name ">{doc.content}</div>
                          <div className="assignment-meta d-flex flex-row gap-2">
                            <span className="assignment-size small text-muted">
                              {doc.types.toUpperCase()}
                            </span>
                          </div>
                          <div className="assignment-meta d-flex flex-row gap-2">
                            <span className="assignment-size small text-muted">
                              Submitted by: {doc?.username || "Unknown User"}
                            </span>
                          </div>
                        </div>
                        <div className="action-assignment">
                          <i
                            class="fa-solid fa-cloud-arrow-down assignment-download "
                            href={doc.file_path}
                          ></i>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No submissions available</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted">
                You do not have permission to view this content.
              </p>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div className="main-content">
        <div className="dashboard-section">
          <div className="docs-sidebar d-flex flex-row">
            <div className="left-side d-flex flex-column gap-2">
              {renderAssignments()}
            </div>
            <div className="right-side">
              {selectedAssignment && !selectedFolder && renderFolders()}
              {selectedFolder && renderFolderDetails()}
            </div>
          </div>
        </div>
      </div>
      <UploadAssignment
        fetchAssignments={() => fetchAssignments()}
        fetchFolders={() => fetchFolders(selectedAsmId)}
        fetchDocuments={() => fetchDocuments(selectedFolederId)}
        show={modalCreateAssignment}
        onClose={() => setModalCreateAssignment(false)}
        accessToken={accessToken}
        role={role}
        selectedFolder={selectedFolder}
        newDocument={newDocument}
        setNewDocument={setNewDocument}
      ></UploadAssignment>
      <DeleteAssignment
        show={modalDeleteAssignment}
        onClose={() => setModalDeleteAssignment(false)}
        fetchDocuments={fetchDocuments}
        selectedFolder={selectedFolder}
        documentId={documentDeleteId}
        documentFilePath={documentFilePath}
      ></DeleteAssignment>
      <NewFolder
        fetchFolders={() => fetchFolders(selectedAsmId)}
        show={modalNewFolder}
        onClose={() => setModalNewFolder(false)}
        assignmentId={selectedAssignment?._id}
        accessToken={accessToken}
        folders={folders}
        setFolders={setFolders}
      />
    </>
  );
};
