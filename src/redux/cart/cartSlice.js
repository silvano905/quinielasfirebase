import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null
    },
    reducers: {
        getCart: (state, action) => {
            state.cart = action.payload
        },
        deleteQuiniela: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload)
        },
        clearCart: (state, action) => {
            state.cart = null
        },

    },
});

export const { getCart, deleteQuiniela, clearCart } = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;


export default cartSlice.reducer;