import { createSlice } from '@reduxjs/toolkit';

export const quinielasSlice = createSlice({
    name: 'quinielas',
    initialState: {
        quinielas: null,
        myQuinielas: null,
        winners: null
    },
    reducers: {
        getQuinielas: (state, action) => {
            state.quinielas = action.payload
        },
        getMyQuinielas: (state, action) => {
            state.myQuinielas = action.payload
        },
        getWinners: (state, action) => {
            state.winners = action.payload
        },
        clearMyQuinielas: (state, action) => {
            state.myQuinielas = null
        },

    },
});

export const { getQuinielas, getMyQuinielas, getWinners, clearMyQuinielas } = quinielasSlice.actions;

export const selectQuinielas = (state) => state.quinielas.quinielas;
export const selectMyQuinielas = (state) => state.quinielas.myQuinielas;
export const selectWinners = (state) => state.quinielas.winners;


export default quinielasSlice.reducer;