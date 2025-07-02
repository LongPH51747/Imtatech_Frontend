import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

// Import hook useAuth để lấy token và BASE_URL từ file api
import { useAuth } from './AuthContext';
import { BASE_URL } from '../api';

// 1. Tạo Socket Context
const SocketContext = createContext();

// Custom hook để dễ dàng sử dụng socket ở các component khác
export const useSocket = () => {
  return useContext(SocketContext);
};

// 2. Tạo Provider để bọc ứng dụng
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useAuth(); // Lấy token từ AuthContext

  useEffect(() => {
    // --- DEBUG: In ra token mỗi khi nó thay đổi ---
    console.log('[SocketContext] Token state changed:', token);

    // Chỉ tạo kết nối socket KHI người dùng đã đăng nhập (có token)
    if (token) {
      console.log('[SocketContext] Có token, đang thử kết nối đến:', BASE_URL);
      
      const newSocket = io(BASE_URL, {
        query: { token },
        transports: ['websocket'] // Thêm dòng này để kết nối ổn định hơn, tránh các lỗi fallback
      });

      // --- DEBUG: In ra đối tượng socket vừa được tạo ---
      console.log('[SocketContext] Đối tượng socket đã được tạo.');
      setSocket(newSocket);

      // Lắng nghe các sự kiện kết nối để gỡ lỗi
      newSocket.on('connect', () => {
        console.log('[SocketContext] ==> KẾT NỐI SOCKET THÀNH CÔNG! ID:', newSocket.id);
      });

      newSocket.on('connect_error', (err) => {
        // --- DEBUG: Lắng nghe và in ra lỗi kết nối cụ thể ---
        console.error('[SocketContext] ==> LỖI KẾT NỐI:', err.message);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('[SocketContext] Socket đã bị ngắt kết nối. Lý do:', reason);
      });

      // Dọn dẹp: Ngắt kết nối socket khi component bị unmount hoặc khi token thay đổi (logout)
      return () => {
        console.log('[SocketContext] Dọn dẹp và ngắt kết nối socket.');
        newSocket.disconnect();
      };
    } else {
      // --- DEBUG: Xử lý trường hợp không có token ---
      console.log('[SocketContext] Không tìm thấy token, bỏ qua việc kết nối socket.');
      // Nếu có socket cũ đang kết nối thì ngắt nó đi
      if(socket) {
          socket.disconnect();
          setSocket(null);
      }
    }
  }, [token]); // useEffect này sẽ chạy lại mỗi khi token thay đổi

  // Cung cấp đối tượng socket cho toàn bộ app
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
