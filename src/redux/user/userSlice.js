import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        userData: null
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        logout: (state) => {
            state.user = null
            state.userData = null
        },

        getUserData: (state, action) => {
            state.userData = action.payload
        }
    },
});

export const { login, logout, getUserData } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectUserPhone = (state) => state.user.user?state.user.userData.phone:null;


export default userSlice.reducer;