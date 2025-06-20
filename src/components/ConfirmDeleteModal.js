import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel, title, message }) => {
    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title || 'Xác nhận xoá?'}</Text>
                    <Text style={styles.message}>{message || 'Thao tác này sẽ không thể khôi phục.'}</Text>

                    <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                        <Text style={styles.confirmText}>Đồng ý</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onCancel}>
                        <Text style={styles.cancelText}>Huỷ bỏ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    message: {
        color: 'gray',
        marginBottom: 16,
    },
    confirmBtn: {
        backgroundColor: '#007A3E',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 6,
        marginBottom: 12,
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelText: {
        textAlign: 'center',
        color: '#000',
        textDecorationLine: 'underline',
    },
});

export default ConfirmDeleteModal;
