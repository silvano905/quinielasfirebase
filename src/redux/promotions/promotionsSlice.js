import { createSlice } from '@reduxjs/toolkit';

export const promotionsSlice = createSlice({
    name: 'promotions',
    initialState: {
        promotion: null
    },
    reducers: {
        getPromotions: (state, action) => {
            state.promotion = action.payload
        },
        setPromotions: (state, action) => {
            state.promotion = action.payload
        }

    },
});

export const { setPromotions, getPromotions } = promotionsSlice.actions;

export const selectPromotions = (state) => state.promotions.promotion;


export default promotionsSlice.reducer;