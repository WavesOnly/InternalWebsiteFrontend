import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user/userSlice';
import spotifyReducer from '../slices/spotify/spotifySlice';
import youtubeReducer from '../slices/youtube/youtubeSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        spotify: spotifyReducer,
        youtube: youtubeReducer
    }
})

export default store;