import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        userData: null,
        friendCouponCode: null
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        logout: (state) => {
            state.user = null
            state.userData = null
            state.friendCouponCode = null
        },

        getUserData: (state, action) => {
            state.userData = action.payload
        },
        updatePhoneNumber: (state, action) => {
            state.userData = { ...state.userData, ...action.payload }
        },
        updateFreeQuantity: (state, action) => {
            state.userData = { ...state.userData, ...action.payload }
        },
        setFriendCouponCode: (state, action) => {
            state.friendCouponCode = parseInt(action.payload)
        }
    },
});

export const { login, logout, getUserData, updatePhoneNumber, updateFreeQuantity, setFriendCouponCode } = userSlice.actions;

export const selectUser = (state) => state.user;
export const selectUserPhone = (state) => state.user.user?state.user.userData.phoneNumber:null;


export default userSlice.reducer;