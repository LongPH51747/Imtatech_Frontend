import React from 'react';
import {View, Text, Image, FlatList, StyleSheet} from 'react-native';
import ORDER_GET_API from '../config/api';

const Notification = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Thay bằng API thực tế của bạn
    fetch(`${ORDER_GET_API}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  console.log(`${ORDER_GET_API}`)
  if (!loading && orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>THÔNG BÁO</Text>
        <Text style={styles.noNotification}>
          Hiện chưa có thông báo nào cho bạn
        </Text>
        {/* Thêm bottom navigation nếu cần */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THÔNG BÁO</Text>
      <Text style={styles.date}>Thứ tư, 03/09/2021</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.notificationItem}>
            <Image
              source={{uri: item.orderItems[0].image}}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.success}>Đặt hàng thành công</Text>
              <Text style={styles.productName}>
                {item.orderItems[0].name_product} | {item.orderItems[0].size}
              </Text>
              <Text style={styles.quantity}>
                {item.orderItems.length} sản phẩm
              </Text>
            </View>
          </View>
        )}
      />
      {/* Thêm bottom navigation nếu cần */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 16},
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 16,
  },
  noNotification: {textAlign: 'center', marginTop: 32, color: '#333'},
  date: {marginBottom: 8, color: '#888'},
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 8,
  },
  image: {width: 48, height: 48, borderRadius: 8, marginRight: 12},
  info: {flex: 1},
  success: {color: 'green', fontWeight: 'bold'},
  productName: {color: '#222'},
  quantity: {color: '#888', fontSize: 12},
});

export default Notification;
