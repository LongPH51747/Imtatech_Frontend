// CheckoutScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getAddressByUser } from '../../redux/actions/addressAction';
import { createOrder } from '../../redux/actions/oderAction';
import { removeAllItems } from '../../redux/actions/cartAction'; // hoặc đường dẫn đúng với project bạn

const CheckoutScreen = () => {
    const { user } = useAuth();
    const cartItems = useSelector((state) => state.cart.cart);
    const addressList = useSelector((state) => state.address.addresses);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [defaultAddress, setDefaultAddress] = useState(null);

    const SHIPPING_FEE = 20000;

    useEffect(() => {
        if (user?._id) {
            dispatch(getAddressByUser(user._id));
        }
    }, [user]);

    useEffect(() => {
        const defaultAddr = addressList.find((addr) => addr.is_default);
        setDefaultAddress(defaultAddr || null);
    }, [addressList]);

    const selectedItems = cartItems.filter((item) => item.status);
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + SHIPPING_FEE;

    const handleSubmit = async () => {
        if (!defaultAddress) {
            Alert.alert('Lỗi', 'Vui lòng thêm địa chỉ giao hàng trước khi thanh toán.');
            return;
        }

        if (selectedItems.length === 0) {
            Alert.alert('Lỗi', 'Không có sản phẩm nào được chọn.');
            return;
        }

        try {
            const orderItems = selectedItems.map((item) => ({
                id_product: item.id_product || item._id,
                quantity: item.quantity,
            }));

            const orderData = {
                orderItems,
                id_cart: selectedItems[0].id_cart || selectedItems[0].cart || '',
                id_address: defaultAddress._id,
                userId: user._id,
            };

            await dispatch(createOrder(orderData));
            await dispatch(removeAllItems(selectedItems, user._id));

            Alert.alert('Thành công', 'Đơn hàng của bạn đã được đặt!');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            Alert.alert('Lỗi', 'Đặt hàng thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            {defaultAddress ? (
                <View style={styles.box}>
                    <Text style={styles.label}>{defaultAddress.fullName}</Text>
                    <Text style={styles.subText}>{user.email}</Text>
                    <Text style={styles.subText}>{defaultAddress.addressDetail}</Text>
                    <Text style={styles.subText}>{defaultAddress.phone_number}</Text>
                </View>
            ) : (
                <Text style={styles.errorText}>
                    Chưa có địa chỉ. Vui lòng cập nhật.
                </Text>
            )}

            <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
            {selectedItems.map((item) => (
                <View key={item._id} style={styles.itemBox}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.subText}>
                        Số lượng: {item.quantity} | Đơn giá: {item.price.toLocaleString('vi-VN')}đ
                    </Text>
                    <Text style={styles.subText}>
                        Thành tiền: {(item.quantity * item.price).toLocaleString('vi-VN')}đ
                    </Text>
                </View>
            ))}

            <View style={styles.totalBox}>
                <Text>Tạm tính: {subtotal.toLocaleString('vi-VN')}đ</Text>
                <Text>Phí vận chuyển: {SHIPPING_FEE.toLocaleString('vi-VN')}đ</Text>
                <Text style={styles.total}>Tổng cộng: {total.toLocaleString('vi-VN')}đ</Text>
            </View>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: defaultAddress ? '#2ecc71' : '#ccc' }]}
                disabled={!defaultAddress}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Đặt hàng</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    box: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        backgroundColor: '#f8f8f8',
    },
    label: {
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 14,
        color: '#555',
    },
    errorText: {
        color: 'red',
        fontStyle: 'italic',
    },
    itemBox: {
        marginBottom: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 6,
        backgroundColor: '#fafafa',
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    totalBox: {
        marginTop: 16,
        borderTopWidth: 1,
        borderColor: '#eee',
        paddingTop: 10,
    },
    total: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 4,
        color: '#27ae60',
    },
    button: {
        marginTop: 24,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
