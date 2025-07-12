import { apiCreateAddress, apiDeleteAddress, apiGetAddressesByUser, apiUpdateAddress, apiUpdateAddressDefault } from '../../api';
import { setAddresses, addAddress, updateAddress, removeAddress } from '../reducers/addressReducer';

export const getAddressByUser = (userId) => async (dispatch) => {
    try {
        const data = await apiGetAddressesByUser(userId);
        dispatch(setAddresses(data));
    } catch (error) {
        console.log('Lỗi lấy địa chỉ:', error.message);
    }
};
export const createAddress = (id, address) => async (dispatch) => {
    try {
        const data = await apiCreateAddress(id, address);
        dispatch(addAddress(data))
    } catch (error) {
        console.log('Lỗi thêm địa chỉ:', error.message);
    }
}

export const updateDefaultAddress = (id, address) => async (dispatch) => {
    try {
        const data = await apiUpdateAddressDefault(id, address);
        dispatch(updateAddress(data))
    } catch (error) {
        console.log('Lỗi cập nhập trạng thái:', error.message);
    }
}

export const updateAddressAction = (id, address) => async (dispatch) => {
    try {
        const data = await apiUpdateAddress(id, address);
        dispatch(updateAddress(data))
    } catch (error) {
        console.log("Lỗi khi cập nhập địa chi", error.message)
    }
}

export const deleteAddressAction = (id) => async (dispatch) => {
    try {
        await apiDeleteAddress(id);
        dispatch(removeAddress(id))
    } catch (error) {
        console.log("Lỗi khi xóa địa chi", error.message)
    }
}