import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic, axiosPrivate } from '../../api/axios';

const initialState = {
    status: 'idle',
    idToken: "",
    user: {},
    alert: null,
    persistLogin: (JSON.parse(localStorage.getItem('persistLogin'))),
    displayMode: (localStorage.getItem('displayMode') || "dark"),
    collapsed: localStorage.getItem('collapsed') === 'true',
}

export const loginUser = createAsyncThunk('user/login', async ({ code }, { rejectWithValue }) => {
    try {
        const response = await axiosPublic.post('/auth/login', { code });
        return response.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return rejectWithValue(err.response.data)
    }
})

export const refreshIdToken = createAsyncThunk('user/refreshIdToken', async () => {
    const response = await axiosPrivate.get('/auth/refresh-token');
    return response.data
})

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
    const response = await axiosPrivate.get('/auth/logout');
    return response.data
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setPersistLogin: (state, action) => {
            state.persistLogin = action.payload;
            localStorage.setItem('persistLogin', action.payload);
        },
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
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload?.user
                state.idToken = action.payload?.idToken
                state.alert = {
                    "alert": "Logged in",
                    "severity": "success"
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log(action)
                state.loading = false
                state.alert = {
                    "alert": action.payload?.detail,
                    "severity": "error"
                }
            })

            .addCase(logoutUser.pending, (state) => {
                state.loading = true
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.idToken = "";
                localStorage.removeItem('persistLogin');
                state.user = {}
                state.loading = false
                state.alert = {
                    "alert": "Logged out",
                    "severity": "success"
                }
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false
                state.alert = {
                    "alert": "Logout failed, try again",
                    "severity": "error"
                }
            })

            .addCase(refreshIdToken.pending, (state) => {
                state.loading = true
            })
            .addCase(refreshIdToken.fulfilled, (state, action) => {
                state.idToken = action.payload?.idToken
                state.loading = false
            })
            .addCase(refreshIdToken.rejected, (state) => {
                console.log("Rejected")
                state.loading = false
            })
    }
})

export const {
    setPersistLogin,
    setDisplayMode,
    setCollapsed,
    setAlert
} = userSlice.actions;

export default userSlice.reducer;
