import { createSlice } from '@reduxjs/toolkit';

export const priceSlice = createSlice({
    name: 'price',
    initialState: {
        price: null
    },
    reducers: {
        getPrice: (state, action) => {
            state.price = action.payload
        },
        setPrice: (state, action) => {
            state.price = action.payload
        }

    },
});

export const { setPrice, getPrice } = priceSlice.actions;

export const selectPrice = (state) => state.price.price;


export default priceSlice.reducer;