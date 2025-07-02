// screens/ChatScreen.js

import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import * as ApiService from '../service/ApiService'; // Đảm bảo đường dẫn đúng

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: 'init',
      text: 'Xin chào! Hãy gửi ảnh một loài cây và tôi sẽ giúp bạn nhận diện nó.',
      user: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(1);

  // Hàm thêm tin nhắn vào danh sách và cuộn xuống cuối
  const addMessage = newMessage => {
    setMessages(prevMessages => [newMessage, ...prevMessages]);
    // FlatList đã được set inverted nên không cần cuộn thủ công
  };

  // Xử lý khi chọn ảnh
  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photos'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageAsset = response.assets[0];

        // Reset lại phiên chat
        setAccessToken(null);
        setMessages([]); // Xóa tin nhắn cũ

        setIsLoading(true);
        addMessage({
          id: `user-${Date.now()}`,
          user: 'user',
          image: imageAsset.uri,
        });

        try {
          // Gọi API nhận dạng
          const data = await ApiService.identifyPlant(imageAsset);
          console.log('data screen', data);

          // Lưu lại access token cho các câu hỏi sau
          setAccessToken(data.identificationData.access_token);

          const topSuggestion =
            data.identificationData.result.classification.suggestions[0];
          console.log(
            'classification',
            data.identificationData.result.classification,
          );

          const plantName = topSuggestion.name;
          const probability = Math.round(topSuggestion.probability * 100);

          let botResponse = `Tôi nghĩ đây là cây **${plantName}** với độ chắc chắn là ${probability}%. Bạn muốn hỏi gì thêm về loài cây này không?`;
          if (data.message) {
            // Trường hợp backend trả về message (độ chính xác thấp)
            botResponse = data.message;
          }
          addMessage({id: `bot-${Date.now()}`, text: botResponse, user: 'bot'});
        } catch (error) {
          addMessage({
            id: `bot-${Date.now()}`,
            text: `Lỗi: ${error.message}`,
            user: 'bot',
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // Xử lý khi gửi tin nhắn văn bản
  const handleSendText = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputText,
      user: 'user',
    };
    addMessage(userMessage);
    setInputText('');

    if (!accessToken) {
      addMessage({
        id: `bot-${Date.now()}`,
        text: 'Vui lòng gửi một ảnh để nhận diện cây trước khi đặt câu hỏi nhé.',
        user: 'bot',
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await ApiService.askQuestion(inputText, accessToken);
      console.log('data ask: ', data);
      let botAnswer =
        'Tôi chưa có câu trả lời cho câu hỏi này.';

      // API trả về mảng answers, ta lấy câu trả lời đầu tiên
      const messages = data.messages;

      // Tìm chỉ số (index) của câu hỏi trong mảng
      const questionIndex = messages.findIndex(
        message =>
          message.type === 'question' && message.content.includes(inputText),
      );

      // Nếu tìm thấy câu hỏi và phần tử tiếp theo tồn tại
      if (questionIndex !== -1 && messages[questionIndex + 1]) {
        // Kiểm tra xem phần tử tiếp theo có phải là câu trả lời không
        if (messages[questionIndex + 1].type === 'answer') {
          botAnswer = messages[questionIndex + 1].content;
        }
      }

      if (botAnswer) {
        console.log('Nội dung câu trả lời:', botAnswer);
      }
      addMessage({id: `bot-${Date.now()}`, text: botAnswer, user: 'bot'});
    } catch (error) {
      addMessage({
        id: `bot-${Date.now()}`,
        text: `Lỗi: ${error.message}`,
        user: 'bot',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render mỗi item tin nhắn
  const renderMessage = ({item}) => {
    const isUser = item.user === 'user';
    return (
      <View
        style={[
          styles.messageRow,
          {justifyContent: isUser ? 'flex-end' : 'flex-start'},
        ]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}>
          {item.text && (
            <Text style={styles.messageText}>
              {item.text.replace(/\*\*/g, '')}
            </Text>
          )}
          {item.image && (
            <Image source={{uri: item.image}} style={styles.sentImage} />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust if needed
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messageList}
          inverted // Quan trọng: để chat hiển thị từ dưới lên
        />

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={styles.loadingIndicator}
          />
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
            <Text style={styles.iconText}>📸</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Hỏi về cách chăm sóc,..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleSendText} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  sentImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: 'white',
  },
  iconButton: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#F0F0F0',
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
