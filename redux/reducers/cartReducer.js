import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        getcart: (state, action) => {
            // Giữ lại trạng thái `status` nếu đã có trong cart trước đó
            const updatedCart = action.payload.map(newItem => {
                const oldItem = state.cart.find(i => i._id === newItem._id);
                return {
                    ...newItem,
                    status: oldItem?.status ?? false,
                };
            });
            state.cart = updatedCart;
        },

        increaseQuantity: (state, action) => {
            const item = state.cart.find(i => i._id === action.payload);
            if (item) item.quantity += 1;
        },
        decreaseQuantity: (state, action) => {
            const item = state.cart.find(i => i._id === action.payload);
            if (item && item.quantity > 1) item.quantity -= 1;
        },
        setCartTrue: (state, action) => {
            const item = state.cart.find(i => i._id === action.payload);
            if (item) {
                item.status = !item.status;
            }
        },
        deleteItem: (state, action) => {
            state.cart = state.cart.filter(i => i._id !== action.payload);
            console.log(state.cart);
        },
        deleteAllItems: (state) => {
            state.cart = [];
        },
        deleteAllItemCheckOut: (state) => {
            state.cart = state.cart.filter(item => !item.status);
        }
    }
});

export const {
    getcart,
    increaseQuantity,
    decreaseQuantity,
    setCartTrue,
    deleteItem,
    deleteAllItems,
    deleteAllItemCheckOut
} = cartSlice.actions;

export default cartSlice.reducer;
