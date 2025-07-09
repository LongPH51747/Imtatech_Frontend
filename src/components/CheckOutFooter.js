import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CheckoutFooter = ({ total = 0, onCheckout }) => {
    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <Text style={styles.label}>Tạm tính</Text>
                <Text style={styles.total}>{total.toLocaleString()}đ</Text>
            </View>

            {/* Nút thanh toán */}
            <TouchableOpacity style={styles.button} onPress={onCheckout}>
                <Text style={styles.buttonText}>Tiến hành thanh toán</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

export default CheckoutFooter;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        color: '#888',
        fontSize: 14,
    },
    total: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007A3E', // Màu xanh đậm
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        paddingVertical: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        marginRight: 6,
    },
});
