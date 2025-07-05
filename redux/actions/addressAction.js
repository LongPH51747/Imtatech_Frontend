import { apiGetAddressesByUser } from '../../api';
import { setAddresses } from '../reducers/addressReducer';

export const getAddressByUser = (userId) => async (dispatch) => {
    try {
        const data = await apiGetAddressesByUser(userId);
        dispatch(setAddresses(data));
    } catch (error) {
        console.log('Lỗi lấy địa chỉ:', error.message);
    }
};
