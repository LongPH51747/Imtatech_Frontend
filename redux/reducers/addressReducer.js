import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    addresses: [],
};

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        // Gán toàn bộ danh sách
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },

        // Thêm địa chỉ mới
        addAddress: (state, action) => {
            if (newAddress.is_default) {
                state.addresses = state.addresses.map(addr => ({
                    ...addr,
                    is_default: false,
                }));
            }
            state.addresses.push(action.payload);
        },

        // Cập nhật địa chỉ
        updateAddress: (state, action) => {
            const updated = action.payload;

            state.addresses = state.addresses.map((addr) => {
                if (updated.is_default) {
                    // Nếu address mới là mặc định, set các address khác thành false
                    if (addr._id !== updated._id) {
                        return { ...addr, is_default: false };
                    }
                }

                // Cập nhật address đúng ID
                return addr._id === updated._id ? updated : addr;
            });
        },


        // Xoá địa chỉ
        removeAddress: (state, action) => {
            const id = action.payload;
            state.addresses = state.addresses.filter((addr) => addr._id !== id);
        },

        // Đặt lại địa chỉ mặc định
        setDefaultAddress: (state, action) => {
            const id = action.payload;
            state.addresses = state.addresses.map((addr) => ({
                ...addr,
                is_default: addr._id === id,
            }));
        },
    },
});

export const {
    setAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
