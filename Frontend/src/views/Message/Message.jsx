import React from "react";
class Message extends React.Component {
  render() {
    return (
      <div class="main-content">
        <div class="welcome-section">
          <h1 class="welcome">Tin nhắn</h1>
        </div>

        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">Hộp thư đến</h3>
            <button type="button" class="btn btn-primary">
              Viết tin mới
            </button>
          </div>

          <div class="message-actions">
            <input
              type="text"
              class="search-bar"
              placeholder="Tìm kiếm tin nhắn..."
            />
            <div class="message-tabs">
              <div class="tab-item active">Tất cả (15)</div>
              <div class="tab-item">Chưa đọc (5)</div>
              <div class="tab-item">Đã ghim (3)</div>
            </div>
          </div>

          <div class="message-item unread">
            <div class="message-icon">
              <i class="fas fa-user-graduate"></i>
            </div>
            <div class="message-details">
              <div class="message-sender">Nguyễn Thị B</div>
              <div class="message-text">
                [Toán 10] Thắc mắc bài tập chương 2...
              </div>
              <div class="message-time">10 phút trước</div>
            </div>
            <div class="message-attachment">
              <i class="fas fa-paperclip"></i>
              <span>Bài tập.pdf</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Message;
