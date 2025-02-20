import React from "react";
class Dashboard extends React.Component {
  render() {
    return (
      <div class="main-content">
        <div class="welcome-section">
          <h1 class="welcome">Chào mừng, Dao Van Hieu!</h1>
          <p class="welcome-sub">Đây là bản tóm tắt hoạt động của bạn</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Buổi học sắp tới</div>
            <div class="stat-value">3</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Tin nhắn chưa đọc</div>
            <div class="stat-value">5</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Tài liệu đã tải lên</div>
            <div class="stat-value">12</div>
          </div>
        </div>

        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">Buổi học sắp tới</h3>
            <a href="#" class="view-all">
              Xem tất cả →
            </a>
          </div>
          <div class="meeting-item">
            <span class="meeting-subject">Toán cao cấp</span>
            <div>
              <span class="meeting-time">10/02/2025 - 10:00 AM</span>
            </div>
          </div>
          <div class="meeting-item">
            <span class="meeting-subject">Lập trình Java</span>
            <div>
              <span class="meeting-time">12/02/2025 - 2:00 PM</span>
            </div>
          </div>
          <div class="meeting-item">
            <span class="meeting-subject">Hệ quản trị CSDL</span>
            <div>
              <span class="meeting-time">14/02/2025 - 9:00 AM</span>
            </div>
          </div>
        </div>
        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">Tin nhắn gần đây</h3>
            <a href="#" class="view-all">
              Xem tất cả →
            </a>
          </div>
          <div class="message-item unread">
            <div class="message-icon">
              <i class="fas fa-comment"></i>
            </div>
            <div class="message-content">
              <div class="message-sender">Gia sư A</div>
              <div class="message-text">Hãy nhớ làm bài tập nhé!</div>
            </div>
            <div class="message-time">2 giờ trước</div>
          </div>
          <div class="message-item">
            <div class="message-icon">
              <i class="fas fa-file-upload"></i>
            </div>
            <div class="message-content">
              <div class="message-sender">Gia sư B</div>
              <div class="message-text">Cập nhật tài liệu mới rồi nhé!</div>
            </div>
            <div class="message-time">1 ngày trước</div>
          </div>
          <div class="message-item">
            <div class="message-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="message-content">
              <div class="message-sender">Gia sư C</div>
              <div class="message-text">Hẹn gặp vào thứ 6!</div>
            </div>
            <div class="message-time">3 ngày trước</div>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
