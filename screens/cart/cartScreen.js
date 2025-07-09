import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    SafeAreaView,
    Text,
    Image,
} from 'react-native';
import Header from '../../src/components/Header';
import CartItem from '../../src/components/CartItem';
import CheckoutFooter from '../../src/components/CheckOutFooter';
import ConfirmDeleteModal from '../../src/components/ConfirmDeleteModal';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from "../../context/AuthContext";
import { getCartByUser, remove, removeAllItems, updateQuantity } from '../../redux/actions/cartAction';
import {
    increaseQuantity,
    decreaseQuantity,
    setCartTrue,
} from '../../redux/reducers/cartReducer';

const CartScreen = () => {
    const navigation = useNavigation();
    const cartItems = useSelector(state => state.cart.cart);
    const dispatch = useDispatch();
    const { user } = useAuth();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteAll, setDeleteAll] = useState(false);

    useEffect(() => {
        if (user?._id) {
            dispatch(getCartByUser(user._id));
        }
    }, [user]);

    const handleIncrease = (item) => {
        const newQuantity = item.quantity + 1;

        dispatch(updateQuantity(item._id, {
            newQuantity: newQuantity,
            userId: user._id
        }, user._id));
    };

    const handleDecrease = (item) => {
        const newQuantity = item.quantity - 1;
        if (newQuantity < 1) return; // Không cho nhỏ hơn 1

        dispatch(updateQuantity(item._id, {
            newQuantity: newQuantity,
            userId: user._id
        }, user._id));
    };

    const handleToggleCheck = (id) => dispatch(setCartTrue(id));

    const hasCheckedItem = cartItems.some(item => item.status === true);
    const total = cartItems.reduce((sum, item) =>
        item.status ? sum + item.price * item.quantity : sum
        , 0);

    const handleDelete = (id) => {
        setDeleteItemId(id);
        setDeleteAll(false);
        setDeleteModalVisible(true);
    };

    const handleDeleteAll = () => {
        if (cartItems.length === 0) return;
        setDeleteAll(true);
        setDeleteModalVisible(true);
    };

    const confirmDelete = (id) => {
        if (deleteAll) {
            dispatch(removeAllItems(cartItems, user._id));
        } else {
            dispatch(remove(id, user._id));
        }
        setDeleteModalVisible(false);
        setDeleteItemId(null);
        setDeleteAll(false);
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setDeleteItemId(null);
        setDeleteAll(false);
    };

    const renderItem = ({ item }) => {
        const itemWithHandlers = {
            ...item,
            onIncrease: () => handleIncrease(item),
            onDecrease: () => handleDecrease(item),
            onDelete: () => handleDelete(item._id),
            onToggleCheck: () => handleToggleCheck(item._id),
        };
        return <CartItem item={itemWithHandlers} />;
    };


    const EmptyCartView = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Ouch! Trống rồi</Text>
            <Text style={styles.emptySubtitle}>
                Có vẻ bạn chưa chọn bất kỳ loại cây nào cho tổ ấm của mình.
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Giỏ hàng"
                onBackPress={() => navigation.goBack()}
                onDeletePress={handleDeleteAll}
            />
            <View style={{ flex: 1 }}>
                {cartItems.length === 0 ? (
                    <EmptyCartView />
                ) : (
                    <>
                        <FlatList
                            data={cartItems}
                            keyExtractor={(item) => item._id}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: hasCheckedItem ? 16 : 0 }}
                            showsVerticalScrollIndicator={false}
                        />
                        {hasCheckedItem && (
                            <CheckoutFooter
                                total={total}
                                onCheckout={() => {
                                    navigation.navigate('Checkout');
                                }}
                            />
                        )}
                    </>
                )}
            </View>
            <ConfirmDeleteModal
                visible={deleteModalVisible}
                onConfirm={() => confirmDelete(deleteItemId)}
                onCancel={cancelDelete}
                title={deleteAll ? "Xác nhận xoá tất cả?" : "Xác nhận xoá sản phẩm?"}
                message={deleteAll ? "Bạn có chắc chắn muốn xoá tất cả sản phẩm khỏi giỏ hàng?" : "Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?"}
            />
        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#e9f8ec',
    },
    emptyImage: {
        width: 150,
        height: 150,
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#27ae60',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 20,
    },
});
