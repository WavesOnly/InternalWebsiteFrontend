import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate, axiosPublic } from '../../api/axios';


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



export const getPlaylists = createAsyncThunk('spotify/getPlaylists', async () => {
    try {
        const response = await axiosPrivate.get('/spotify/playlists');
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const getAnalytics = createAsyncThunk('spotify/getAnalytics', async () => {
    try {
        const response = await axiosPrivate.get('/spotify/analytics');
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const getPlaylistFollowerHistory = createAsyncThunk('spotify/getPlaylistFollowerHistory', async ({ playlistId }) => {
    try {
        const response = await axiosPrivate.get(`/spotify/playlists/history/${playlistId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});


export const addSong = createAsyncThunk('spotify/addSong', async (newSong, { rejectWithValue }) => {
    try {
        const songData = { ...newSong };
        songData.promotion = songData.type === "Promotion";
        delete songData.type;
        const response = await axiosPrivate.post('/spotify/add-song', songData);
        return response.data;
    }
    catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: error.message });
    }
});


export const getPlaylistItems = createAsyncThunk('spotify/getPlaylistItems', async ({ playlistId }) => {
    try {
        const response = await axiosPrivate.get(`spotify/playlist/items/${playlistId}`);
        return response.data
    } catch (error) {
        throw error;
    }
});

export const updatePlaylistItems = createAsyncThunk('spotify/updatePlaylistItems', async ({ playlistId, songIds }) => {
    try {
        const response = await axiosPrivate.put(`spotify/playlist/items/${playlistId}`, { playlistId, songIds });
        return response.data
    } catch (error) {
        throw error;
    }
})

export const deletePlaylistItems = createAsyncThunk('spotify/deletePlaylistItems', async ({ playlistId, songIds }) => {
    try {
        console.log(songIds)
        const response = await axiosPrivate.delete(`spotify/playlist/${playlistId}/songs?ids=${songIds.join(",")}`);
        return response.data
    } catch (error) {
        throw error;
    }
})

export const getSongHistory = createAsyncThunk('spotify/getSongHistory', async () => {
    try {
        const response = await axiosPrivate.get('/spotify/curation/history');
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const triggerMonetizationPipeline = createAsyncThunk('spotify/triggerMonetizationPipeline', async (newMonetization) => {
    try {
        const response = await axiosPrivate.post('/spotify/monetization-pipeline', newMonetization)
        return response.data
    } catch (error) {
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
            .addCase(addSong.pending, (state) => {
                state.loading = true
            })
            .addCase(addSong.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(addSong.rejected, (state) => {
                state.loading = false
            })
            .addCase(getSongHistory.pending, (state) => {
                state.loading = true
            })
            .addCase(getSongHistory.fulfilled, (state, action) => {
                state.songHistory = action.payload?.songHistory
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
                state.playlistItems = action.payload?.playlistItems
                state.loading = false
            })
            .addCase(getPlaylistItems.rejected, (state) => {
                state.loading = false
            })

            .addCase(getAnalytics.pending, (state) => {
                state.loading = true
            })
            .addCase(getAnalytics.fulfilled, (state, action) => {
                state.loading = false
                state.analytics = {
                    accountFollowers: action.payload?.accountFollowers,
                    playlistFollowers: action.payload?.playlistFollowers,
                    accountFollowersPrevious28Days: action.payload?.accountFollowersPrevious28Days,
                    playlistFollowersPrevious28Days: action.payload?.playlistFollowersPrevious28Days
                }
            })
            .addCase(getAnalytics.rejected, (state) => {
                state.loading = false
            })

            .addCase(updatePlaylistItems.pending, (state) => {
                state.loading = true
            })
            .addCase(updatePlaylistItems.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(updatePlaylistItems.rejected, (state) => {
                state.loading = false
            })

            .addCase(deletePlaylistItems.pending, (state) => {
                state.loading = true
            })
            .addCase(deletePlaylistItems.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(deletePlaylistItems.rejected, (state) => {
                state.loading = false
            })
            .addCase(triggerMonetizationPipeline.pending, (state) => {
                state.loading = true
            })
            .addCase(triggerMonetizationPipeline.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(triggerMonetizationPipeline.rejected, (state) => {
                state.loading = false
            })
    }
});

export const { setPlaylistFollowerHistoryId, setPlaylistManageId, setPlaylistItems } = spotifySlice.actions;

export default spotifySlice.reducer;
