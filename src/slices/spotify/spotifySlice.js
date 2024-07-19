import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../../api/axios';


const initialState = {
    loading: false,
    songHistory: [],
    playlists: [],
    followerHistory: [],
    playlistFollowerHistory: [],
    playlistFollowerHistoryId: "",
    playlistManageId: "",
    playlistItems: [],
    analytics: {},
}

export const getSongHistory = createAsyncThunk('spotify/getSongHistory', async () => {
    try {
        const response = await axiosPublic.get('/songHistory');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch song history:', error);
        throw error;
    }
});

export const getPlaylists = createAsyncThunk('spotify/getPlaylists', async () => {
    try {
        const response = await axiosPublic.get('/user');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch playlists:', error);
        throw error;
    }
});

export const getAnalytics = createAsyncThunk('spotify/getAnalytics', async () => {
    try {
        const response = await axiosPublic.get('/user');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch playlists:', error);
        throw error;
    }
});

export const getPlaylistFollowerHistory = createAsyncThunk('spotify/getPlaylistFollowerHistory', async ({ playlistId }) => {
    try {
        let response = await axiosPublic.get('/user');
        if (playlistId) {
            response = { data: response.data.playlists.filter((playlist) => playlist?.id == playlistId)[0] }
        }
        return response.data;
    } catch (error) {
        console.error('Failed to fetch playlists:', error);
        throw error;
    }
});

export const getPlaylistItems = createAsyncThunk('spotify/getPlaylistItems', async ({ playlistId }) => {
    try {
        let response = await axiosPublic.get(`/playlistItems`);
        if (playlistId) {
            response = { data: response.data.filter((item) => item?.id === playlistId)[0].items }
            return response.data
        }
    } catch (error) {
        console.error('Failed to fetch playlists:', error);
        throw error;
    }
});

export const updatePlaylistItems = createAsyncThunk('spotify/updatePlaylistItems', async ({ playlistId, playlistItemIds }) => {
    try {
        // let response = await axiosPublic.put(``);
    } catch (error) {
        console.error('Failed to fetch playlists:', error);
        throw error;
    }
})

export const deletePlaylistItems = createAsyncThunk('spotify/deletePlaylistItems', async ({ playlistId, playlistItemIds }) => {
    try {
        // let response = await axiosPublic.delete(`/playlistItems/delete/${playlistId}/${playlistItemIds}`);

    } catch (error) {
        console.error('Failed to fetch playlists:', error);
        throw error;
    }
})

export const spotifySlice = createSlice({
    name: 'spotify',
    initialState,
    reducers: {
        setPlaylistFollowerHistoryId: (state, action) => {
            state.playlistFollowerHistoryId = action.payload
        },
        setPlaylistManageId: (state, action) => {
            state.playlistManageId = action.payload
        },
        setPlaylistItems: (state, action) => {
            state.playlistItems = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getSongHistory.pending, (state) => {
                state.loading = true
            })
            .addCase(getSongHistory.fulfilled, (state, action) => {
                state.songHistory = action.payload
                state.loading = false
            })
            .addCase(getSongHistory.rejected, (state) => {
                state.loading = false
            })

            .addCase(getPlaylists.pending, (state) => {
                state.loading = true
            })
            .addCase(getPlaylists.fulfilled, (state, action) => {
                state.playlists = action.payload?.playlists
                state.loading = false
            })
            .addCase(getPlaylists.rejected, (state) => {
                state.loading = false
            })

            .addCase(getPlaylistFollowerHistory.pending, (state) => {
                state.loading = true
            })
            .addCase(getPlaylistFollowerHistory.fulfilled, (state, action) => {
                state.playlistFollowerHistory = action.payload?.playlistFollowerHistory.map(item => ({
                    x: item.date,
                    y: item.followers
                }));
                state.playlistFollowerHistory = [
                    {
                        id: "Followers",
                        data: state.playlistFollowerHistory
                    }
                ]
                state.loading = false
            })
            .addCase(getPlaylistFollowerHistory.rejected, (state) => {
                state.loading = false
            })

            .addCase(getPlaylistItems.pending, (state) => {
                state.loading = true
            })
            .addCase(getPlaylistItems.fulfilled, (state, action) => {
                state.playlistItems = action.payload
                state.loading = false
            })
            .addCase(getPlaylistItems.rejected, (state) => {
                state.loading = false
            })

            .addCase(getAnalytics.pending, (state) => {
                state.loading = true
            })
            .addCase(getAnalytics.fulfilled, (state, action) => {
                console.log(action.payload)
                state.loading = false
                state.analytics = {
                    accountFollowers: action.payload?.accountFollowers,
                    playlistFollowers: action.payload?.playlistFollowers,
                    accountFollowersPrevious28Days: ((action.payload?.accountFollowerHistory[0]?.followers) - (action.payload?.accountFollowerHistory[27]?.followers)),
                    playlistFollowersPrevious28Days: ((action.payload?.playlistFollowerHistory[0]?.followers) - (action.payload?.playlistFollowerHistory[27]?.followers)),
                }
            })
            .addCase(getAnalytics.rejected, (state) => {
                state.loading = false
            })

            .addCase(updatePlaylistItems.pending, (state) => {
                state.loading = true
            })
            .addCase(updatePlaylistItems.fulfilled, (state) => {
                console.log("Updated")
                state.loading = false
            })
            .addCase(updatePlaylistItems.rejected, (state) => {
                state.loading = false
            })

            .addCase(deletePlaylistItems.pending, (state) => {
                state.loading = true
            })
            .addCase(deletePlaylistItems.fulfilled, (state) => {
                console.log("Deleted")
                state.loading = false
            })
            .addCase(deletePlaylistItems.rejected, (state) => {
                state.loading = false
            })
    }
});

export const { setPlaylistFollowerHistoryId, setPlaylistManageId, setPlaylistItems } = spotifySlice.actions;

export default spotifySlice.reducer;
