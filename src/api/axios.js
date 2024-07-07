import axios from 'axios';

// import { refreshIdToken } from '../slices/user/userSlice';

const baseURL = 'http://localhost:3000'

let store

export const injectApiStore = realStore => { store = realStore }

export const axiosPublic = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true
})

// export const axiosPrivate = axios.create({
//     baseURL: baseURL,
//     withCredentials: true
// })

// axiosPrivate.interceptors.request.use(config => {
//     const user = store.getState().user
//     if (!config.headers['Authorization']) {
//         config.headers['Authorization'] = user?.user?.idToken;
//     }
//     if (!config.headers['Content-Type']) {
//         config.headers['Content-Type'] = 'application/json'
//     }
//     return config;
// })

// axiosPrivate.interceptors.response.use(
//     response => response,
//     async function (error) {
//         const previousRequest = error?.config;
//         if (error?.response?.status === 403 && error?.response?.data === { 'message': 'Token expired' } && !previousRequest.sent) {
//             previousRequest.sent = true;
//             store.dispatch(refreshIdToken())
//             const user = store.getState().user;
//             previousRequest.headers['Authorization'] = user?.user?.idToken;
//             return previousRequest;
//         }
//         return Promise.reject(error);
//     }
// )