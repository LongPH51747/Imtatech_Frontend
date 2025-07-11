
import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: []
    },
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        addOrder: (state, action) => {
            state.orders.unshift(action.payload); // thêm đơn mới vào đầu danh sách
        }
    }
});

export const { setOrders, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
