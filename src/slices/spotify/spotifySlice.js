import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../../api/axios';


const initialState = {
    loading: false,
    songHistory: [],
    playlists: [],
    followers: null,
    playlistFollowers: null,
    followerHistory: [],
    playlistFollowerHistory: [],
    playlistFollowerHistoryId: "",
    playlistManageId: "",
    playlistItems: [],
    alert: null,
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
                state.playlistFollowerHistory = action.payload?.playlistFollowerHistory
                state.playlistFollowerHistory = state.playlistFollowerHistory.map(item => ({
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
