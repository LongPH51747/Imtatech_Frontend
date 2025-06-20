import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartItem = ({ item }) => {
    const {
        image,
        name,
        description,
        price,
        quantity,
        checked,
        onIncrease,
        onDecrease,
        onDelete,
        onToggleCheck,
    } = item;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onToggleCheck}>
                <Ionicons
                    name={checked ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="black"
                />
            </TouchableOpacity>

            <Image source={{ uri: image }} style={styles.image} />

            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.desc}>{description}</Text>
                <Text style={styles.price}>{price.toLocaleString()}đ</Text>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={onDecrease} style={styles.btn}>
                        <Ionicons name="remove" size={16} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.qty}>{quantity}</Text>

                    <TouchableOpacity onPress={onIncrease} style={styles.btn}>
                        <Ionicons name="add" size={16} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onDelete}>
                        <Text style={styles.delete}>Xoá</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CartItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'flex-start',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginHorizontal: 10,
    },
    info: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    desc: {
        color: 'gray',
        fontSize: 12,
    },
    price: {
        color: 'green',
        marginVertical: 4,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    btn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 2,
    },
    qty: {
        marginHorizontal: 8,
        fontSize: 14,
    },
    delete: {
        marginLeft: 12,
        color: 'black',
        textDecorationLine: 'underline',
    },
});
