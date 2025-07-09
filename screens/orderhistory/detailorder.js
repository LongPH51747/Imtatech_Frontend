import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DetailOrderScreen = ({ route }) => {
    const { order } = route.params;
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            {/* Header với nút Back */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
            </View>

            {/* Trạng thái đặt hàng */}
            <Text style={styles.successText}>Bạn đã đặt hàng thành công</Text>
            <Text style={styles.dateText}>
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </Text>

            {/* Thông tin khách hàng */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
                <Text>{order.id_address.fullName}</Text>
                <Text>{order.id_address.addressDetail}</Text>
                <Text>{order.id_address.phone_number}</Text>
            </View>

            {/* Danh sách sản phẩm */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
                {order.orderItems.map((item, index) => (
                    <View key={index} style={styles.productItem}>
                        <Image
                            source={{ uri: `http://your-server-url${item.image}` }}
                            style={styles.image}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.productName}>
                                {item.name_product} ({item.size})
                            </Text>
                            <Text>Số lượng: {item.quantity}</Text>
                            <Text>Giá đơn vị: {item.unit_price_item.toLocaleString()}đ</Text>
                            <Text style={styles.totalItem}>
                                Thành tiền: {item.total_price_item.toLocaleString()}đ
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Tổng thanh toán */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                <Text style={styles.totalPrice}>{order.total_amount.toLocaleString()}đ</Text>
            </View>
        </ScrollView>
    );
};

export default DetailOrderScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        color: '#333',
    },

    successText: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 4,
    },
    dateText: {
        color: '#28a745',
        textAlign: 'center',
        marginBottom: 16,
    },
    section: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    productItem: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 4,
    },
    totalItem: {
        fontWeight: '500',
        marginTop: 4,
    },
    totalContainer: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
});
