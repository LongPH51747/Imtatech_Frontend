// screens/AddAddressScreen.js
import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { createAddress, getAddressByUser } from '../../redux/actions/addressAction'; // Bạn cần có action này
import CheckBox from '@react-native-community/checkbox';

const AddAddressScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { user } = useAuth();

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const handleSave = async () => {
        if (!fullName || !phoneNumber || !addressDetail) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const addressData = {
            fullName,
            phone_number: phoneNumber,
            addressDetail,
            is_default: isDefault,
        };

        try {
            await dispatch(createAddress(id = user._id, addressData));
            await dispatch(getAddressByUser(user._id));
            Alert.alert('Thành công', 'Địa chỉ đã được thêm.');
            navigation.goBack();
        } catch (error) {
            console.error('Lỗi thêm địa chỉ:', error);
            Alert.alert('Lỗi', 'Không thể thêm địa chỉ.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Thêm địa chỉ mới</Text>

            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập họ tên"
                value={fullName}
                onChangeText={setFullName}
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />

            <Text style={styles.label}>Địa chỉ chi tiết</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                value={addressDetail}
                onChangeText={setAddressDetail}
                multiline
            />

            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={isDefault}
                    onValueChange={setIsDefault}
                    tintColors={{ true: '#2ecc71', false: '#aaa' }}
                />
                <Text style={styles.checkboxLabel}>Đặt làm địa chỉ mặc định</Text>
            </View>


            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Lưu địa chỉ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddAddressScreen;

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
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: 'transparent',
    },
    checked: {
        backgroundColor: '#2ecc71',
    },
    checkboxLabel: {
        fontSize: 14,
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
