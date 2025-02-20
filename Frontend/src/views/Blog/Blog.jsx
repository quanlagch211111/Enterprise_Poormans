import React from "react";
class Blog extends React.Component {
  render() {
    return (
      <div class="main-content">
        <div class="welcome-section">
          <h1 class="welcome">Blog học tập</h1>
        </div>
        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">Bài viết mới nhất</h3>
            <button class="btn btn-primary">Viết bài mới</button>
          </div>

          <div class="blog-grid">
            <article class="blog-card">
              <div class="blog-image"></div>
              <div class="blog-content">
                <div class="blog-tags">
                  <span class="blog-tag">Toán học</span>
                  <span class="blog-tag">Lớp 10</span>
                </div>
                <h4 class="blog-title">
                  Phương pháp giải phương trình lượng giác
                </h4>
                <p class="blog-excerpt">
                  Khám phá các kỹ thuật giải nhanh phương trình lượng giác cơ
                  bản...
                </p>
                <div class="blog-meta">
                  <span class="blog-author">Nguyễn Văn C</span>
                  <span class="blog-date">2 ngày trước</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }
}
export default Blog;
