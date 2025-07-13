import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView, // Import để tránh bàn phím che ô nhập liệu
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  apiFindOrCreateChat, 
  apiGetMessagesByRoom, 
} from '../api';

const ChatScreen = () => {
  const { user, token } = useAuth();
  const socket = useSocket();

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [text, setText] = useState('');

  // Tải dữ liệu ban đầu và tham gia phòng chat
  useEffect(() => {
    const initializeChat = async () => {
      if (!token || !user) return;
      try {
        const ADMIN_ID = '68620b9c3531d339cf6aba50';
        const roomResponse = await apiFindOrCreateChat({ adminId: ADMIN_ID }, token);
        const chatRoom = roomResponse.data;
        setRoom(chatRoom);

        // --- THAY ĐỔI 1: SAU KHI CÓ PHÒNG, THAM GIA VÀO ROOM ---
        if (socket) {
          console.log(`Đang yêu cầu tham gia phòng: ${chatRoom._id}`);
          socket.emit('join:chat-room', { chatRoomId: chatRoom._id });
        }
        // ------------------------------------------------------

        const messagesResponse = await apiGetMessagesByRoom(chatRoom._id, token);
        setMessages(messagesResponse.data.messages);
      } catch (err) {
        setError('Không thể tải dữ liệu cuộc trò chuyện.');
        console.error('Lỗi khi khởi tạo chat:', err);
      } finally {
        setLoading(false);
      }
    };
    // --- THAY ĐỔI 2: CHẠY LẠI KHI SOCKET THAY ĐỔI ---
    // Để đảm bảo việc join room diễn ra sau khi socket đã kết nối
    initializeChat();
  }, [token, user, socket]); 

  // Lắng nghe tin nhắn mới từ socket
  useEffect(() => {
    if (!socket || !room) return;

    const handleNewMessage = (data) => {
      const newMessage = data.message;
      if (newMessage.chatRoomId === room._id) {
        setMessages(prevMessages => [newMessage, ...prevMessages]);
      }
    };

    socket.on('new:message', handleNewMessage);

    return () => {
      socket.off('new:message', handleNewMessage);
    };
  }, [socket, room]);

  // Hàm gửi tin nhắn qua Socket
  const handleSend = async () => {
    if (text.trim() === '' || !room || !socket) return;

    const messageData = {
      chatRoomId: room._id,
      receiverId: room.admin._id,
      content: text.trim(),
      messageType: 'text',
    };

    socket.emit('send:message', messageData);
    setText('');
  };

  const renderMessageItem = ({ item }) => {
    const isMyMessage = item.sender._id === user._id;
    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
        <View style={[styles.messageBubble, isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble]}>
          <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item._id}
        style={styles.messageList}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
  messageList: { flex: 1, paddingHorizontal: 10 },
  messageContainer: { marginVertical: 5 },
  myMessageContainer: { alignItems: 'flex-end' },
  otherMessageContainer: { alignItems: 'flex-start' },
  messageBubble: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, maxWidth: '80%' },
  myMessageBubble: { backgroundColor: '#007AFF' },
  otherMessageBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  myMessageText: { color: '#fff' },
  otherMessageText: { color: '#000' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#e0e0e0', backgroundColor: '#fff' },
  textInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, backgroundColor: '#f0f0f0' },
  sendButton: { marginLeft: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
});
