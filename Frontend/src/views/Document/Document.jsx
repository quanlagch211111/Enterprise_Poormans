import {
  MDBBtn,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBFile,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
export const Document = () => {
  const [isAssignment, setAssignment] = useState(false);
  const role = "TEACHER";
  const toggleAssignment = () => {
    setAssignment(!isAssignment);
  };
  return (
    <div className="main-content">
      <div className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">
            {isAssignment ? "Assignments" : "Documents"}
          </h3>
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

        <div className="docs-sidebar d-flex flex-row ">
          <div className="left-side d-flex flex-column gap-2">
            <span className="class-name active">Assignment 1</span>
            <span className="class-name">Assignment 2</span>
          </div>
          {!isAssignment ? (
            <div className="right-side ">
              <div className="document-actions ">
                {role === "ADMIN" && (
                  <>
                    <div className="text-center w-100">
                      <p className="text-center">Student Name && Tutor Name</p>
                    </div>
                  </>
                )}
                {role === "TEACHER" && (
                  <>
                    <div className="d-flex justify-content-end w-100">
                      <MDBBtn>Upload</MDBBtn>
                    </div>
                  </>
                )}
                {role === "STUDENT" && (
                  <>
                    <input
                      type="text"
                      className="search-bar-docs"
                      placeholder="Tìm tài liệu..."
                    />
                    <MDBDropdown group>
                      <MDBDropdownToggle color="info">Action</MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem link>Action</MDBDropdownItem>
                        <MDBDropdownItem link>PDF</MDBDropdownItem>
                        <MDBDropdownItem link>Word</MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </>
                )}
              </div>
              <div className="document-grid">
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="right-side">
              <div className="assignment-grid d-flex align-items-start flex-column mb-3">
                {/* PDF file  */}
                <div className="assignment-container d-flex flex-row align-items-center justify-content-between">
                  <div className=" assignment-card  d-flex flex-row align-items-center gap-2">
                    <i className="fas fa-file-pdf assignment-icon"></i>
                    <div className="assignment-name">Bài tập Toán 10.pdf</div>
                    <div className="assignment-meta d-flex flex-row gap-2">
                      <span className="assignment-size">2.5 MB</span>
                      <span className="assignment-date">12/02/2024</span>
                    </div>
                  </div>
                  <div className="action-assignment">
                    <i class="fa-solid fa-trash assignment-delete"></i>
                  </div>
                </div>
                {/* Word file  */}
                <div className="assignment-container d-flex flex-row align-items-center justify-content-between">
                  <div className=" assignment-card  d-flex flex-row align-items-center gap-2">
                    <i className="fa-solid fa-file-word assignment-icon"></i>
                    <div className="assignment-name">Bài tập Toán 10.pdf</div>
                    <div className="assignment-meta d-flex flex-row gap-2">
                      <span className="assignment-size">2.5 MB</span>
                      <span className="assignment-date">12/02/2024</span>
                    </div>
                  </div>
                  <div className="action-assignment">
                    <i class="fa-solid fa-trash assignment-delete"></i>
                  </div>
                </div>
              </div>
              {role === "STUDENT" && (
                <div className="input-file-container d-flex flex-row gap-2">
                  <div className="input-file">
                    <MDBFile
                      label="Input File Assignment"
                      id="formFileMultiple"
                      multiple
                    />
                  </div>
                  <div className="action-input d-flex align-items-end">
                    <MDBBtn>Upload</MDBBtn>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
