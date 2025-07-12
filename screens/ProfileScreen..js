import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext'; // lấy từ context

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        navigation.replace('MainTab', { screen: 'Login' });
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
            <Text style={styles.header}>PROFILE</Text>

            <View style={styles.profileContainer}>
                <Image
                    source={
                        user?.avatar
                            ? { uri: user.avatar }
                            : require('../img/avata.png') // ảnh mặc định
                    }
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Chung</Text>
                <Item title="Xem thông tin" onPress={() => { navigation.navigate('EditUser'); }} />
                <Item title="Chat bot" onPress={() => {navigation.navigate('ChatBot') }} />
                <Item title="Đơn hàng của bạn" onPress={() => { navigation.navigate('orderhistory') }} />
                <Item title="Thông báo" onPress={() => { navigation.navigate('NotificationScreen') }} />
                <Item title="Thông báo đơn hàng" onPress={() => { navigation.navigate('OrderNotificationScreen') }} />
                <Item title="Quản lý địa chỉ" onPress={() => { navigation.navigate('AddressScreen') }} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Bảo mật và Điều khoản</Text>
                <Item title="Điều khoản và điều kiện" onPress={() => { }} />
                <Item title="Chính sách quyền riêng tư" onPress={() => { }} />
            </View>

            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logout}>Đăng xuất</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const Item = ({ title, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 12,
        backgroundColor: '#ccc',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    email: {
        fontSize: 14,
        color: '#888',
    },
    section: {
        marginBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    sectionHeader: {
        color: '#888',
        fontSize: 13,
        marginBottom: 10,
    },
    item: {
        paddingVertical: 12,
    },
    itemText: {
        fontSize: 15,
        color: '#000',
    },
    logout: {
        color: 'red',
        fontSize: 15,
        marginTop: 16,
        textAlign: 'left',
    },
});

export default ProfileScreen;
