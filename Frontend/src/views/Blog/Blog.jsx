import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "../../services/AxiosCustom";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { DetailBlog, NewBlog, EditBlog } from "../../components/Modal"; // Import EditBlog

export const Blog = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [isAllBlogs, setAllBlogs] = useState(false);
  const [isPendingBlogs, setPendingBlogs] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [pendingBlogs, setPendingBlogsData] = useState([]);
  const [newModalBlog, setNewModalBlog] = useState(false);
  const [modalDetailBlog, setModalDetailBlog] = useState(false);
  const [modalEditBlog, setModalEditBlog] = useState(false); // Add state for EditBlog modal
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    fetchBlogs();
    if (role === "STAFF") {
      fetchPendingBlogs();
    }
  }, [accessToken, role]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/blogs", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const publishedBlogs = response.data.filter((blog) => blog.status === "published");
      const myBlogs = response.data.filter((blog) => blog.author_id._id === userId);
      setBlogs(publishedBlogs);
      setMyBlogs(myBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchPendingBlogs = async () => {
    try {
      const response = await axios.get("/blogs", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const pending = response.data.filter((blog) => blog.status === "pending");
      setPendingBlogsData(pending);
    } catch (error) {
      console.error("Error fetching pending blogs:", error);
    }
  };

  // const handleUpdateBlog = (updatedBlog) => {
  //   setMyBlogs((prev) =>
  //     prev.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
  //   );
  // };

  // const handleDeleteBlog = (blogId) => {
  //   setMyBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
  // };

  return (
    <>
      <div className="main-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">
              {isAllBlogs
                ? "All Blogs"
                : isPendingBlogs
                ? "Pending Blogs"
                : "My Blog"}
            </h3>
            <div className="action d-flex">
              {!isAllBlogs && !isPendingBlogs && (
                <button
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => setNewModalBlog(true)}
                >
                  Viết bài mới
                </button>
              )}
              <span
                className={"doc-tabs " + (!isAllBlogs && !isPendingBlogs ? "active" : "")}
                onClick={() => {
                  setAllBlogs(false);
                  setPendingBlogs(false);
                }}
              >
                My Blog
              </span>
              <span
                className={"doc-tabs " + (isAllBlogs ? "active" : "")}
                onClick={() => {
                  setAllBlogs(true);
                  setPendingBlogs(false);
                }}
              >
                All Blogs
              </span>
              {role === "STAFF" && (
                <span
                  className={"doc-tabs " + (isPendingBlogs ? "active" : "")}
                  onClick={() => {
                    setPendingBlogs(true);
                    setAllBlogs(false);
                  }}
                >
                  Pending Blogs
                </span>
              )}
            </div>
          </div>

          <div className="blog-grid">
            {(isAllBlogs
              ? blogs
              : isPendingBlogs
              ? pendingBlogs
              : myBlogs
            ).map((blog) => (
              <article key={blog._id} className="blog-card">
                <div className="blog-image">
                  <img src="https://via.placeholder.com/150" alt="" />
                </div>
                <div className="blog-content">
                  <div className="blog-tags">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="blog-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="blog-title">{blog.title}</h4>
                  <p className="blog-excerpt">{blog.content.substring(0, 100)}...</p>
                  <div className="blog-meta">
                    <span className="blog-author">
                      Author: {blog.author_id?.username || "Unknown"}
                    </span>
                    <span className="blog-date">
                      Date: {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    <span className="blog-status">
                      Status: <strong>{blog.status}</strong>
                    </span>
                  </div>
                  <div className="blog-actions">
                    <MDBBtn
                      color="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedBlog(blog);
                        setModalDetailBlog(true);
                      }}
                    >
                      View Detail
                    </MDBBtn>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <NewBlog
        show={newModalBlog}
        onClose={() => setNewModalBlog(false)}
        accessToken={accessToken}
      />
      <DetailBlog
        show={modalDetailBlog}
        onClose={() => setModalDetailBlog(false)}
        blog={selectedBlog}
        accessToken={accessToken}
        onUpdate={(updatedBlog) => {
          setMyBlogs((prev) =>
            prev.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
          );
        }}
      />
    </>
  );
};