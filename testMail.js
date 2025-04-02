const axios = require('axios');

const sendNotification = async () => {
  const data = {
    user_id: "67e1adc21040cbd389afc8c7",   // ID người nhận thông báo
    from: "admin",                        // Người gửi thông báo
    message: "📢 Đây là thông báo test!",  // Nội dung thông báo
    entityType: "Message",                // Kiểu thực thể
    entityId: "67e29a2ba80f10bb1178a7a1"  // ID của thực thể
  };

  try {
    const response = await axios.post("http://localhost:3001/api/notifications", data, {
      headers: {
        "Content-Type": "application/json", // Đảm bảo header đúng
      }
    });

    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error.response ? error.response.data : error.message);
  }
};

sendNotification();
