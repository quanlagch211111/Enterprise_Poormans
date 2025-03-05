import {
  MDBBtn,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBDropdownMenu,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
export const Document = () => {
  const [isAssignment, setAssignment] = useState(false);
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
            <span className="class-name active">Front end</span>
            <span className="class-name">Back end</span>
          </div>
          {!isAssignment ? (
            <div className="right-side ">
              <div className="document-actions ">
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
              </div>
              <div className="document-grid">
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                <div className="document-card">
                  <i className="fas fa-file-pdf document-icon"></i>
                  <div className="document-name">Bài tập Toán 10.pdf</div>
                  <div className="document-meta">
                    <span className="document-size">2.5 MB</span>
                    <span className="document-date">12/02/2024</span>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="right-side">Don't have any thing</div>
          )}
        </div>
      </div>
    </div>
  );
};
