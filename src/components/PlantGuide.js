import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

const PlantGuide = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.pageHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Cẩm nang trồng cây</Text>
      </View>

      <ScrollView
        style={styles.guideContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>🌱 Cách trồng cây cơ bản</Text>
          <Text style={styles.guideText}>
            Hướng dẫn chi tiết về cách chăm sóc và trồng cây từ A-Z. Bao gồm
            việc chọn đất, chọn chậu, và các bước chuẩn bị cần thiết.
          </Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Đọc thêm →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>💧 Tưới nước đúng cách</Text>
          <Text style={styles.guideText}>
            Cách tưới nước hiệu quả cho từng loại cây khác nhau. Học cách nhận
            biết khi nào cây cần nước và tần suất tưới phù hợp.
          </Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Đọc thêm →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>☀️ Ánh sáng và nhiệt độ</Text>
          <Text style={styles.guideText}>
            Tìm hiểu về điều kiện ánh sáng và nhiệt độ phù hợp cho từng loại
            cây. Cách bố trí cây trong nhà để đảm bảo đủ ánh sáng.
          </Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Đọc thêm →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>🐛 Phòng chống sâu bệnh</Text>
          <Text style={styles.guideText}>
            Cách nhận biết và xử lý các loại sâu bệnh phổ biến trên cây. Phương
            pháp phòng ngừa và điều trị hiệu quả.
          </Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Đọc thêm →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>🌿 Chăm sóc cây theo mùa</Text>
          <Text style={styles.guideText}>
            Hướng dẫn chăm sóc cây qua từng mùa trong năm. Điều chỉnh cách chăm
            sóc phù hợp với thời tiết.
          </Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Đọc thêm →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>🍃 Nhân giống và ươm cây</Text>
          <Text style={styles.guideText}>
            Kỹ thuật nhân giống từ hạt, chiết cành và phân chia. Cách ươm cây
            con khỏe mạnh từ những cây mẹ.
          </Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Đọc thêm →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    fontWeight: '300',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  guideContent: {
    flex: 1,
    padding: 20,
  },
  guideCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  guideText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
  },
  readMoreText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PlantGuide;
