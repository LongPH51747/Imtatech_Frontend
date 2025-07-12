import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersByUser } from '../../redux/actions/oderAction';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../api';

const tabs = ['Tất cả', 'Chờ xác nhận', 'Đang vận chuyển', 'Đã nhận', 'Đã huỷ'];

const OrderHistoryScreen = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.order.orders);
    const [selectedTab, setSelectedTab] = useState('Tất cả');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await dispatch(getOrdersByUser(user._id));
            } catch (error) {
                console.log('Lỗi lấy đơn hàng:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [dispatch]);

    const filteredOrders = selectedTab === 'Tất cả'
        ? orders
        : orders.filter(order => order.status === selectedTab);

    const renderOrderItem = ({ item }) => {
        const orderItem = item.orderItems?.[0];
        if (!orderItem) return null;

        return (
            <View style={styles.orderContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('DetailOrderScreen', { order: item })}
                >
                    <Text style={styles.date}>
                        {moment(item.createdAt).format('dddd, DD/MM/YYYY')}
                    </Text>
                    <View style={styles.itemRow}>
                        <Image
                            source={{ uri: `${BASE_URL}${orderItem.image}` }}
                            style={styles.image}
                        />
                        <View style={styles.itemDetails}>
                            <Text style={[
                                styles.status,
                                item.status === 'Đã huỷ' ? styles.cancel :
                                    item.status === 'Đang vận chuyển' ? styles.shipping :
                                        item.status === 'Đã nhận' ? styles.received : styles.success
                            ]}>
                                {item.status === 'Đã huỷ' ? 'Đã huỷ đơn hàng' :
                                    item.status === 'Đang vận chuyển' ? 'Đang vận chuyển' :
                                        item.status === 'Đã nhận' ? 'Đã nhận hàng' : 'Chờ xác nhận '}
                            </Text>
                            <Text style={styles.name}>{orderItem.name_product} | {orderItem.size?.trim()}</Text>
                            <Text>{item.orderItems.length} sản phẩm</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
            </View>

            {/* Tabs (nằm dòng dưới) */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabs}
            >
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setSelectedTab(tab)}
                        style={[
                            styles.tabButton,
                            selectedTab === tab && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Order List */}
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={item => item._id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={{ paddingTop: 8 }}
                    ListEmptyComponent={<Text style={styles.empty}>Không có đơn hàng</Text>}
                />
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingTop: 12,
    },

    // Header + Tabs in same ro

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 12,
        marginRight: 10,
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // khoảng cách giữa tiêu đề và tabs
    },

    tabs: {
        flexDirection: 'row',
        marginBottom: 10, // khoảng cách giữa tab và danh sách
    },

    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#eee',
        marginRight: 8,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },

    activeTab: { backgroundColor: '#007AFF' },
    tabText: { color: '#333', fontWeight: '500' },
    activeTabText: { color: '#fff' },

    // Orders
    orderContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 12,
    },
    date: { fontSize: 14, color: '#666', marginBottom: 8 },
    itemRow: { flexDirection: 'row' },
    image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    itemDetails: { flex: 1 },

    name: { fontWeight: 'bold', fontSize: 16 },
    status: { fontWeight: 'bold', marginBottom: 4 },
    success: { color: 'green' },
    cancel: { color: 'red' },
    shipping: { color: '#f0a500' },
    received: { color: '#28a745' },
    empty: { textAlign: 'center', marginTop: 40, color: '#888' },
});

export default OrderHistoryScreen;
