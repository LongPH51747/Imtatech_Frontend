// src/redux/actions/order.actions.js
import {
    apiCreateOder,
    apiGetOrdersByUser
} from '../../api';
import {
    setOrders,
    addOrder
} from '../reducers/orderReducer';

export const createOrder = (data) => async (dispatch) => {
    try {
        const res = await apiCreateOder(data); // API POST tạo đơn
        dispatch(addOrder(res.order));
        return res.order;
    } catch (error) {
        console.error('Tạo đơn hàng thất bại:', error.message);
        throw error;
    }
};

export const getOrdersByUser = (userId) => async (dispatch) => {
    try {
        const res = await apiGetOrdersByUser(userId);
        console.log("đây là test trong action", res)
        dispatch(setOrders(res));
    } catch (error) {
        console.error('Lấy danh sách đơn hàng thất bại:', error.message);
    }
};
