import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    user: {},
    alert: null,
    displayMode: (localStorage.getItem('displayMode') || "dark"),
    collapsed: localStorage.getItem('collapsed') === 'true',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setDisplayMode: (state, action) => {
            state.displayMode = action.payload;
            localStorage.setItem('displayMode', action.payload);
        },
        setCollapsed: (state, action) => {
            state.collapsed = action.payload;
            localStorage.setItem('collapsed', action.payload ? "true" : "false");
        },
        setAlert: (state, action) => {
            state.alert = action.payload;
        }
    }
});

export const {
    setDisplayMode,
    setCollapsed,
    setAlert
} = userSlice.actions;

export default userSlice.reducer;
