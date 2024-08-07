import axios from 'axios';
import { refreshIdToken } from '../slices/user/userSlice';

let store;
// export const baseURL = "https://internalwebsitebackend.onrender.com/"
export const baseURL = "https://internalwebsitebackend.azurewebsites.net/"

export const injectApiStore = realStore => { store = realStore };

export const axiosPublic = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivate = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

axiosPrivate.interceptors.request.use(config => {
    const user = store.getState().user;
    if (user?.idToken) {
        config.headers['Authorization'] = `Bearer ${user.idToken}`;
    }
    if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

axiosPrivate.interceptors.response.use(
    response => response,
    async function (error) {
        const previousRequest = error?.config;
        if (error?.response?.status === 403 && error?.response?.data.message === 'Token expired' && !previousRequest.sent) {
            previousRequest.sent = true;
            await store.dispatch(refreshIdToken());
            const user = store.getState().user;
            previousRequest.headers['Authorization'] = `Bearer ${user.idToken}`;
            return axiosPrivate(previousRequest);
        }
        return Promise.reject(error);
    }
);
