import React from "react";
class Document extends React.Component {
  render() {
    return (
      <div class="main-content">
        <div class="welcome-section">
          <h1 class="welcome">Tài liệu học tập</h1>
        </div>

        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">Tất cả tài liệu</h3>
            <button class="btn btn-primary">Tải lên</button>
          </div>

          <div class="document-actions">
            <select class="filter-select">
              <option>Tất cả loại</option>
              <option>PDF</option>
              <option>Word</option>
            </select>
            <input
              type="text"
              class="search-bar"
              placeholder="Tìm tài liệu..."
            />
          </div>

          <div class="document-grid">
            <div class="document-card">
              <i class="fas fa-file-pdf document-icon"></i>
              <div class="document-name">Bài tập Toán 10.pdf</div>
              <div class="document-meta">
                <span class="document-size">2.5 MB</span>
                <span class="document-date">12/02/2024</span>
              </div>
              <div class="document-actions">
                <button class="btn-icon">
                  <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon">
                  <i class="fas fa-share"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Document;
