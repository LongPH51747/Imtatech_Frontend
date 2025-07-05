import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    addresses: [],
};

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
    },
});

export const { setAddresses } = addressSlice.actions;

export default addressSlice.reducer;
