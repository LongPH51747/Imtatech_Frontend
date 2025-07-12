// components/AddressItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const AddressItem = ({ address, isSelected, onSelect }) => {
    const navigation = useNavigation();
    if (!address) return null;

    return (
        <TouchableOpacity style={styles.container} onPress={() => onSelect(address._id)}>
            <RadioButton
                value={address._id}
                status={isSelected ? 'checked' : 'unchecked'}
                onPress={() => onSelect(address._id)}
                color="#2ecc71"
            />
            <View style={styles.info}>
                <View style={styles.row}>
                    <Text style={styles.name}>{address.fullName}</Text>
                    {address.is_default && (
                        <View style={styles.defaultTag}>
                            <Text style={styles.defaultText}>Mặc định</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.phone}>{address.phone_number}</Text>
                <Text style={styles.detail}>{address.addressDetail}</Text>
            </View>
            <TouchableOpacity onPress={() => { navigation.navigate('UpdateAddress', { address }) }}>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fefefe',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 8,
    },
    defaultTag: {
        backgroundColor: '#fdecea',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 12,
        color: '#e74c3c',
    },
    phone: {
        color: '#555',
        fontSize: 14,
    },
    detail: {
        color: '#333',
        fontSize: 14,
        marginTop: 2,
    },
});

export default AddressItem;
