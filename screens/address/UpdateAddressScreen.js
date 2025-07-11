import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import CheckBox from '@react-native-community/checkbox';
import { deleteAddressAction, updateAddressAction } from '../../redux/actions/addressAction';

const UpdateAddressScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute(); // Nhận params từ màn hình trước
    const { user } = useAuth();

    const { address } = route.params || {}; // Truyền { address } từ AddressScreen

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        if (address) {
            setFullName(address.fullName);
            setPhoneNumber(address.phone_number);
            setAddressDetail(address.addressDetail);
            setIsDefault(address.is_default);
        }
    }, [address]);

    const handleUpdate = async () => {
        if (!fullName || !phoneNumber || !addressDetail) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const updatedData = {
            _id: address._id,
            userId: user._id,
            fullName,
            phone_number: phoneNumber,
            addressDetail,
            is_default: isDefault,
        };

        try {
            await dispatch(updateAddressAction(address._id, updatedData));
            Alert.alert('Thành công', 'Cập nhật địa chỉ thành công.');
            navigation.goBack();
        } catch (error) {
            console.error('Lỗi cập nhật địa chỉ:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ.');
        }
    };
    const handleDelete = async () => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa địa chỉ này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dispatch(deleteAddressAction(address._id));
                            Alert.alert('Đã xóa', 'Địa chỉ đã được xóa.');
                            navigation.goBack();
                        } catch (error) {
                            console.error('Lỗi xóa địa chỉ:', error);
                            Alert.alert('Lỗi', 'Không thể xóa địa chỉ.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cập nhật địa chỉ</Text>

            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ tên"
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="Nhập số điện thoại"
            />

            <Text style={styles.label}>Địa chỉ chi tiết</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={addressDetail}
                onChangeText={setAddressDetail}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                multiline
            />


            <View style={styles.checkboxRow}>
                <CheckBox
                    value={isDefault}
                    onValueChange={setIsDefault}
                    tintColors={{ true: '#2ecc71', false: '#aaa' }}
                />
                <Text style={styles.checkboxLabel}>Đặt làm địa chỉ mặc định</Text>
            </View>




            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                    <Text style={styles.buttonTextDelete}>Xóa địa chỉ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Cập nhật</Text>
                </TouchableOpacity>

            </View>

        </ScrollView >
    );
};

export default UpdateAddressScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontWeight: '500',
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 6,
        fontSize: 15,
        backgroundColor: '#fafafa',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    checkboxLabel: {
        fontSize: 14,
        marginLeft: 8,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 24,
    },
    updateButton: {
        backgroundColor: '#3498db',
        flex: 1,
    },
    deleteButton: {
        backgroundColor: '#fff',
        flex: 1,
        borderColor: '#e74c3c',
        borderWidth: 1
    }, buttonTextDelete: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#fff',
        flex: 1,
        borderColor: '#e74c3c',
        borderWidth: 1
    }, buttonTextDelete: {
        color: '#e74c3c',
        fontWeight: 'bold',
    }, checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },

}
);
