import cartReducer from "./reducers/cartReducer";
import { configureStore } from "@reduxjs/toolkit";
import addressReducer from './reducers/addressReducer';
import orderReducer from './reducers/orderReducer';
export const store = configureStore({
    reducer: {
        cart: cartReducer,
        address: addressReducer,
        order: orderReducer
    },
});
