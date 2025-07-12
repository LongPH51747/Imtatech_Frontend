import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { BASE_URL, apiFindOrCreateChat, apiGetMessagesByRoom } from '../api';

const ChatScreen = () => {
  const { user, token } = useAuth();
  const socket = useSocket();

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');

  // Tải room & tin nhắn ban đầu
  useEffect(() => {
    const init = async () => {
      if (!token || !user) return;
      try {
        const ADMIN_ID = '68620b9c3531d339cf6aba50';
        const resRoom = await apiFindOrCreateChat({ adminId: ADMIN_ID }, token);
        const chatRoom = resRoom.data;
        setRoom(chatRoom);

        if (socket) {
          socket.emit('join:chat-room', { chatRoomId: chatRoom._id });
        }

        const resMsgs = await apiGetMessagesByRoom(chatRoom._id, token);
        setMessages(resMsgs.data.messages);
      } catch (err) {
        console.error('Lỗi init:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token, user, socket]);

  // Lắng nghe tin nhắn mới
  useEffect(() => {
    if (!socket || !room) return;
    const handleNewMsg = (data) => {
      const newMsg = data.message;
      if (newMsg.chatRoomId === room._id) {
        setMessages((prev) => [newMsg, ...prev]);
      }
    };
    socket.on('new:message', handleNewMsg);
    return () => socket.off('new:message', handleNewMsg);
  }, [socket, room]);

  // Gửi text
  const handleSend = () => {
    if (!text.trim() || !socket || !room) return;
    socket.emit('send:message', {
      chatRoomId: room._id,
      receiverId: room.admin._id,
      content: text.trim(),
      messageType: 'text',
    });
    setText('');
  };

  // Gửi ảnh
  const handleSendImage = async () => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (result.didCancel) return;

    const file = result.assets[0];
    const formData = new FormData();
    formData.append('image', {
      uri: file.uri,
      name: file.fileName || `photo.jpg`,
      type: file.type,
    });

    const res = await axios.post(`${BASE_URL}/api/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    const imageUrl = res.data.imageUrl;

    // 👇 EMIT ĐÚNG TÊN EVENT
    socket.emit('send:image-message', {
      chatRoomId: room._id,
      receiverId: room.admin._id,
      imageUrl: imageUrl,
    });

  } catch (err) {
    console.error('Lỗi gửi ảnh:', err);
  }
};



  const renderMessageItem = ({ item }) => {
    const isMyMsg = item.sender._id === user._id;
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMsg ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMsg ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {item.messageType === 'image' ? (
            <Image
              source={{ uri: item.mediaUrl }}
              style={{ width: 200, height: 200, borderRadius: 10 }}
            />
          ) : (
            <Text style={isMyMsg ? styles.myMessageText : styles.otherMessageText}>
              {item.content}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
        <TouchableOpacity onPress={handleSendImage}>
          <Ionicons name="image-outline" size={24} color="#007AFF" style={{ marginRight: 10 }} />
        </TouchableOpacity>

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
  messageList: { flex: 1, paddingHorizontal: 10 },
  messageContainer: { marginVertical: 5 },
  myMessageContainer: { alignItems: 'flex-end' },
  otherMessageContainer: { alignItems: 'flex-start' },
  messageBubble: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, maxWidth: '80%' },
  myMessageBubble: { backgroundColor: '#007AFF' },
  otherMessageBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  myMessageText: { color: '#fff' },
  otherMessageText: { color: '#000' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
