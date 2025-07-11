import { apiAddCart, apiEditStatus, apiGetCartByUser, apiEditStatusTrue, apiRemoveCart, apiUpdateQuantity } from "../../api";
import {
    getcart, increaseQuantity,
    decreaseQuantity,
    setCartTrue,
    deleteItem,
    deleteAllItems
} from "../reducers/cartReducer";

export const getCartByUser = (id) => async (dispatch) => {
    try {
        const response = await apiGetCartByUser(id);
        dispatch(getcart(response.cartItem));
    } catch (error) {
        console.log(error);
    }
};

export const setCartStatusTrue = (itemId) => async (dispatch, getState) => {
    try {
        const item = getState().cart.cart.find(i => i._id === itemId);
        if (item) {
            await apiEditStatus(itemId);
            dispatch(setCartTrue(itemId));
        }
    } catch (error) {
        console.error(error);
    }
};

export const addToCart = (id, data) => async (dispatch) => {
    try {
        const response = await apiAddCart(id, data);
        dispatch(getcart(response.cartItem));
    } catch (error) {
        console.log(error);
    }
}

export const remove = (id, userId) => async (dispatch) => {
    try {
        const response = await apiRemoveCart(id, userId);
        dispatch(deleteItem(id));
    } catch (error) {
        console.log(error);
    }
}
export const removeAllItems = (cartItems, userId) => async (dispatch) => {
    try {
        for (const item of cartItems) {
            await dispatch(remove(item._id, userId));
        }
    } catch (error) {
        console.error('Xoá tất cả thất bại:', error);
    }
};

export const updateQuantity = (cartItemId, data, userId) => async (dispatch) => {
    try {
        console.log(data)
        const res = await apiUpdateQuantity(cartItemId, data);
        dispatch(getCartByUser(data.userId));
    } catch (error) {
        console.error('Cập nhật số lượng thất bại:', error.message);
    }
};