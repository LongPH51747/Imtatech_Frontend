import React, { useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import CheckoutFooter from '../components/CheckOutFooter';

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            name: 'Spider Plant',
            description: 'Ưa bóng',
            price: 250000,
            quantity: 2,
            image:
                'https://i.pinimg.com/736x/08/48/ab/0848ab3102de7aaccf67cdf3b0f25495.jpg',
            checked: true,
        },
        {
            id: '3',
            name: 'Peace Lily',
            description: 'Lọc không khí',
            price: 320000,
            quantity: 1,
            image:
                'https://i.pinimg.com/736x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            checked: false,
        },
        {
            id: '4',
            name: 'Peace Lily',
            description: 'Lọc không khí',
            price: 320000,
            quantity: 1,
            image:
                'https://i.pinimg.com/736x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            checked: false,
        },
        {
            id: '5',
            name: 'Peace Lily',
            description: 'Lọc không khí',
            price: 320000,
            quantity: 1,
            image:
                'https://i.pinimg.com/736x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            checked: false,
        },
        {
            id: '6',
            name: 'Peace Lily',
            description: 'Lọc không khí',
            price: 320000,
            quantity: 1,
            image:
                'https://i.pinimg.com/736x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            checked: false,
        },
        {
            id: '7',
            name: 'Peace Lily',
            description: 'Lọc không khí',
            price: 320000,
            quantity: 1,
            image:
                'https://i.pinimg.com/736x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            checked: false,
        },
        {
            id: '8',
            name: 'Peace Lily',
            description: 'Lọc không khí',
            price: 320000,
            quantity: 1,
            image:
                'https://i.pinimg.com/736x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            checked: false,
        },
        {
            id: '9',
            name: 'Peace Lily',
            description: 'Lọc không khí',
            price: 320000,
            quantity: 1,
            image:
                'https://i.pinimg.com/736x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            checked: false,
        },
        {
            id: '10',
            name: 'Peace Lily',
            description: 'Lọc không khí',
            price: 320000,
            quantity: 1,
            image:
                'https://i.pinimg.com/736x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            checked: false,
        },
    ]);

    // 👉 Hàm xử lý số lượng, xoá, chọn
    const handleIncrease = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecrease = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const handleDelete = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleToggleCheck = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    // 👉 Gắn thêm callback vào mỗi item
    const renderItem = ({ item }) => {
        const itemWithHandlers = {
            ...item,
            onIncrease: () => handleIncrease(item.id),
            onDecrease: () => handleDecrease(item.id),
            onDelete: () => handleDelete(item.id),
            onToggleCheck: () => handleToggleCheck(item.id),
        };
        return <CartItem item={itemWithHandlers} />;
    };

    // 👉 Tính tổng tiền các sản phẩm được chọn
    const total = cartItems
        .filter(item => item.checked)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Giỏ hàng"
                onBackPress={() => { }}
                onDeletePress={() => { }}
            />
            <View style={{ flex: 1 }}>
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                />
                <CheckoutFooter
                    total={total}
                    onCheckout={() => {
                        console.log('Thanh toán', total);
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
