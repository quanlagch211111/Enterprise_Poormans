import React, { useState } from "react";
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
export const Blog = () => {
  const [scrollableModal, setScrollableModal] = useState(false);
  const [centredModal, setCentredModal] = useState(false);
  const [isVisibility, setVisibility] = useState(false);
  const [isAllBlogs, setAllBlogs] = useState(false);

  const toggleAllBlogs = () => setAllBlogs(!isAllBlogs);
  const toggleVisibility = () => setVisibility(!isVisibility);
  const toggleOpen = () => setCentredModal(!centredModal);
  return (
    <>
      <div className="main-content">
        <div className="welcome-section">
          <h1 className="welcome">Blog học tập</h1>
        </div>
        <div className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">
              {isAllBlogs ? "All Blogs" : "My Blog"}
            </h3>

            <div className="action d-flex">
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
          <div className="action mb-3 d-flex justify-content-end">
            {!isAllBlogs && (
              <button
                className="btn btn-primary"
                onClick={() => setScrollableModal(!scrollableModal)}
              >
                Viết bài mới
              </button>
            )}
          </div>

          <div className="blog-grid">
            <article className="blog-card" onClick={toggleOpen}>
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
            <article className="blog-card" onClick={toggleOpen}>
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
            <article className="blog-card" onClick={toggleOpen}>
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
      <MDBModal
        tabIndex="-1"
        open={centredModal}
        onClose={() => setCentredModal(false)}
      >
        <MDBModalDialog centered size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                {" "}
                Phương pháp giải phương trình lượng giác
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="mb-2 d-flex justify-content-end">
                {/* <MDBDropdown dropleft group>
                  <MDBDropdownToggle>
                    <i className="fas fa-bars"></i>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem link>Edit</MDBDropdownItem>
                    <MDBDropdownItem link>Update</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown> */}
                <div className="dropdown ">
                  <div className="container-select d-flex justify-content-end">
                    <div
                      className="dropdown-select  d-flex align-items-center justify-content-center"
                      onClick={toggleVisibility}
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
                      (isVisibility ? "active" : "")
                    }
                  >
                    <li className="dropdown-item">Delete</li>
                    <li className="dropdown-item">Update</li>
                  </ul>
                </div>
              </div>
              <div className="blog-grid">
                <article className="blog-card" onClick={toggleOpen}>
                  <div className="blog-image"></div>
                  <div className="blog-content">
                    <div className="blog-tags">
                      <span className="blog-tag">Toán học</span>
                      <span className="blog-tag">Lớp 10</span>
                    </div>
                    {/* <h4 className="blog-title">
              </h4> */}
                    <p className="blog-excerpt">
                      Khám phá các kỹ thuật giải nhanh phương trình lượng giác
                      cơ bản Khám phá các kỹ thuật giải nhanh phương trình lượng
                      giác cơ bản Khám phá các kỹ thuật giải nhanh phương trình
                      lượng giác cơ bản Khám phá các kỹ thuật giải nhanh phương
                      trình lượng giác cơ bản Khám phá các kỹ thuật giải nhanh
                      phương trình lượng giác cơ bản Khám phá các kỹ thuật giải
                      nhanh phương trình lượng giác cơ bản Khám phá các kỹ thuật
                      giải nhanh phương trình lượng giác cơ bản Khám phá các kỹ
                      thuật giải nhanh phương trình lượng giác cơ bản Khám phá
                      các kỹ thuật giải nhanh phương trình lượng giác cơ bản
                      Khám phá các kỹ thuật giải nhanh phương trình lượng giác
                      cơ bản Khám phá các kỹ thuật giải nhanh phương trình lượng
                      giác cơ bản Khám phá các kỹ thuật giải nhanh phương trình
                      lượng giác cơ bản Khám phá các kỹ thuật giải nhanh phương
                      trình lượng giác cơ bản Khám phá các kỹ thuật giải nhanh
                      phương trình lượng giác cơ bản Khám phá các kỹ thuật giải
                      nhanh phương trình lượng giác cơ bản Khám phá các kỹ thuật
                      giải nhanh phương trình lượng giác cơ bản
                    </p>
                    <div className="blog-meta">
                      <span className="blog-author">Nguyễn Văn C</span>
                      <span className="blog-date">2 ngày trước</span>
                    </div>
                  </div>
                </article>
              </div>
            </MDBModalBody>
            <MDBModalFooter></MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      {/* Create new blog */}
      <MDBModal
        open={scrollableModal}
        onClose={() => setScrollableModal(false)}
        tabIndex="-1"
      >
        <MDBModalDialog scrollable size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>New Blog</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setScrollableModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                className="mb-3"
                label="Title"
                id="typeText"
                type="text"
              />
              <MDBTextArea
                label="Description"
                id="textAreaExample"
                rows="{4}"
              />
            </MDBModalBody>
            <MDBModalFooter>
              <button
                className="btn btn-danger"
                onClick={() => setScrollableModal(!setScrollableModal)}
              >
                Close
              </button>
              <button className="btn btn-primary">Save changes</button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
