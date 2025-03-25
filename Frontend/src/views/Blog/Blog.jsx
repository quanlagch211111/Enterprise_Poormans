import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea,
  MDBInput,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBIcon,
} from "mdb-react-ui-kit";
import { DetailBlog, NewBlog } from "../../components/Modal";
export const Blog = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no accessToken
      return;
    }
  }, []);
  const [scrollableModal, setScrollableModal] = useState(false);
  const [newModalBlog, setNewModalBlog] = useState(false);
  const [modalDetailBlog, setModalDetailBlog] = useState(false);
  const [centredModal, setCentredModal] = useState(false);
  const [isAllBlogs, setAllBlogs] = useState(false);
  const toggleAllBlogs = () => setAllBlogs(!isAllBlogs);
  const toggleOpen = () => setCentredModal(!centredModal);
  return (
    <>
      <div className="main-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">
              {isAllBlogs ? "All Blogs" : "My Blog"}
            </h3>

            <div className="action d-flex">
              {!isAllBlogs && (
                <button
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => setNewModalBlog(true)}
                >
                  Viết bài mới
                </button>
              )}
              <span
                className={"doc-tabs " + (!isAllBlogs ? "active" : "")}
                onClick={isAllBlogs ? toggleAllBlogs : undefined}
              >
                My Blog
              </span>
              <span
                className={"doc-tabs " + (isAllBlogs ? "active" : "")}
                onClick={!isAllBlogs ? toggleAllBlogs : undefined}
              >
                All Blogs
              </span>
            </div>
            {/* <button
              className="btn btn-primary"
              onClick={() => setScrollableModal(!scrollableModal)}
            >
              Viết bài mới
            </button> */}
          </div>

          <div className="blog-grid">
            <article
              className="blog-card pointer"
              onClick={() => setModalDetailBlog(true)}
            >
              <div className="blog-image">
                <img
                  src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/bb/a3/97/predator-ride-in-the.jpg?w=900&h=500&s=1"
                  alt=""
                />
              </div>
              <div className="blog-content">
                <div className="blog-tags">
                  <span className="blog-tag">Toán học</span>
                  <span className="blog-tag">Lớp 10</span>
                </div>
                <h4 className="blog-title">
                  Phương pháp giải phương trình lượng giác
                </h4>
                <p className="blog-excerpt">
                  Khám phá các kỹ thuật giải nhanh phương trình lượng giác cơ
                  bản...
                </p>
                <div className="blog-meta">
                  <span className="blog-author">Nguyễn Văn C</span>
                  <span className="blog-date">2 ngày trước</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* Modal detail */}
      <NewBlog
        show={newModalBlog}
        onClose={() => setNewModalBlog(false)}
        accessToken={accessToken}
      ></NewBlog>
      {/* Create new blog */}
      <DetailBlog
        show={modalDetailBlog}
        onClose={() => setModalDetailBlog(false)}
      ></DetailBlog>
    </>
  );
};
