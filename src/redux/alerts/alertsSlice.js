import { createSlice } from '@reduxjs/toolkit';
export const alertsSlice = createSlice({
    name: 'alerts',
    initialState: {
        alerts: null
    },
    reducers: {
        setAlert: (state, action) => {
            state.alerts = action.payload
        },
        removeAlert: (state, action) => {
            state.alerts = null
        }
    },
});

export const { setAlert, removeAlert } = alertsSlice.actions;

export const selectAlerts = (state) => state.alerts.alerts;


export default alertsSlice.reducer;