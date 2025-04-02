import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io("http://localhost:3001", {
      withCredentials: true
    });
    socketInstance.emit("add-user", userId);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useSocket;