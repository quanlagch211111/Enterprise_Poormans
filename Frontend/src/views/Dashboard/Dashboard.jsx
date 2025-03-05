import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
export const Dashboard = () => {
  var navigate = useNavigate();
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
          <Link to="/schedule" className="view-all">
            Xem tất cả →
          </Link>
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
    </div>
  );
};
