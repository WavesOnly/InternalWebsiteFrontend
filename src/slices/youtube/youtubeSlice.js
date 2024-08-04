import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate } from '../../api/axios';


const initialState = {
    loading: false,
    analytics: {},
    playlists: []
}

export const getAnalytics = createAsyncThunk('youtube/getAnalytics', async () => {
    try {
        const response = await axiosPrivate.get('/youtube/analytics');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        throw error;
    }
});

export const getSubscribersByDay = createAsyncThunk('youtube/getSubscribersByDay', async () => {
    try {
        const response = await axiosPrivate.get('/youtube/subscribers-by-day');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        throw error;
    }
});


export const getPlaylists = createAsyncThunk('youtube/getPlaylists', async () => {
    try {
        const response = await axiosPrivate.get('/youtube/playlists');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch playlists:', error);
        throw error;
    }
});

export const uploadVideo = createAsyncThunk('youtube/uploadVideo', async (newUpload, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('file', newUpload.file);
        formData.append('throwbackThursday', newUpload.throwbackThursday);
        formData.append('playlists', newUpload.playlists);
        formData.append('comment', newUpload.comment);
        const response = await axiosPrivate.post('/youtube/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    } catch (err) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


export const youtubeSlice = createSlice({
    name: 'youtube',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(uploadVideo.pending, (state) => {
                state.loading = true
            })
            .addCase(uploadVideo.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(uploadVideo.rejected, (state) => {
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

            .addCase(getSubscribersByDay.pending, (state) => {
                state.loading = true
            })
            .addCase(getSubscribersByDay.fulfilled, (state, action) => {
                state.loading = false
                state.analytics = {
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
            })
            .addCase(getSubscribersByDay.rejected, (state) => {
                state.loading = false
                state.analytics = {
                    subscribersByDay: [
                        {
                            id: "Subscribers",
                            data: []
                        }
                    ]
                }
            })
    }
});


export default youtubeSlice.reducer;
