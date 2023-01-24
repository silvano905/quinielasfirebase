import { createSlice } from '@reduxjs/toolkit';

export const jornadasSlice = createSlice({
    name: 'jornadas',
    initialState: {
        jornada: null,
        nextJornada: null
    },
    reducers: {
        getJornada: (state, action) => {
            state.jornada = action.payload
        },
        getNextJornada: (state, action) => {
            state.nextJornada = action.payload
        },

    },
});

export const { getJornada, getNextJornada } = jornadasSlice.actions;

export const selectJornada = (state) => state.jornadas.jornada?state.jornadas.jornada.data:null;
export const selectNextJornada = (state) => state.jornadas.nextJornada?state.jornadas.nextJornada.data:null;
export const selectJornadaId = (state) => state.jornadas.jornada.id;
// export const selectNextJornadaId = (state) => state.jornadas.nextJornada.id;
export const selectNextJornadaId = (state) => state.jornadas.nextJornada?state.jornadas.nextJornada.id:null;


export default jornadasSlice.reducer;