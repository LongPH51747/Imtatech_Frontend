import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAddressByUser, updateDefaultAddress } from '../../redux/actions/addressAction';
import AddressItem from '../../src/components/AddressItem';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddressScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { user } = useAuth();

    const addressList = useSelector((state) => state.address.addresses);
    const [loading, setLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            if (user?._id) {
                await dispatch(getAddressByUser(user._id));
                setLoading(false);
            }
        };
        fetchAddresses();
    }, [user]);

    useEffect(() => {
        const defaultAddr = addressList.find((addr) => addr.is_default);
        setSelectedAddressId(defaultAddr?._id || null);
    }, [addressList]);

    const handleSelectAddress = async (id) => {
        try {
            if (id !== selectedAddressId) {
                await dispatch(updateDefaultAddress(id, address = {
                    userId: user._id,
                    is_default: true,
                }));
                setSelectedAddressId(id);
            }
        } catch (error) {
            console.error('Cập nhật địa chỉ mặc định thất bại:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ mặc định');
        }
    };

    const renderItem = ({ item }) => (
        <AddressItem
            address={item}
            isSelected={selectedAddressId === item._id}
            onSelect={() => {
                handleSelectAddress(item._id)
            }
            }
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Danh sách địa chỉ</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddAddressScreen')}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#3498db" />
                    <Text style={styles.addText}>Thêm địa chỉ</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : addressList.length === 0 ? (
                <Text style={styles.emptyText}>Chưa có địa chỉ nào.</Text>
            ) : (
                <FlatList
                    data={addressList}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

export default AddressScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#3498db',
    },
    emptyText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#aaa',
        fontSize: 16,
        fontStyle: 'italic',
    },
});
