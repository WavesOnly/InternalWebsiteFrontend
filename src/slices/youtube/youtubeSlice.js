import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../../api/axios';


const initialState = {
    loading: false,
    analytics: {},
    playlists: []
}

export const getPlaylists = createAsyncThunk('youtube/getPlaylists', async () => {
    try {
        const response = await axiosPublic.get('/youtube');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch song history:', error);
        throw error;
    }
});

export const getAnalytics = createAsyncThunk('youtube/getAnalytics', async () => {
    try {
        const response = await axiosPublic.get('/youtube');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch song history:', error);
        throw error;
    }
});


export const youtubeSlice = createSlice({
    name: 'youtube',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
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

            .addCase(getAnalytics.pending, (state) => {
                state.loading = true
            })
            .addCase(getAnalytics.fulfilled, (state, action) => {
                state.analytics = {
                    viewCount: action.payload?.viewCount,
                    subscriberCount: action.payload?.subscriberCount,
                    viewCountPrevious28Days: action.payload?.viewCountPrevious28Days,
                    subscribersCountPrevious28Days: action.payload?.subscribersCountPrevious28Days,
                    estimatedRevenuePrevious28Days: action.payload?.estimatedRevenuePrevious28Days,
                    watchTimePrevious28Days: action.payload?.watchTimePrevious28Days,
                    revenueByMonth: action.payload?.revenueByMonth,
                    topVideos: action.payload?.topVideos,
                    subscribersByDay: [
                        {
                            id: "Subscribers",
                            data: action.payload?.subscribersByDay.map(item => ({
                                x: item.date,
                                y: item.subscribers
                            }))
                        }
                    ]
                }
                state.loading = false
            })
            .addCase(getAnalytics.rejected, (state) => {
                state.loading = false
            })
    }
});


export default youtubeSlice.reducer;
