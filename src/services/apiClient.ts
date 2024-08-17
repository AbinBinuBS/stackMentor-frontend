import axios from 'axios';
import { store } from '../redux/store';
import { mentorLogin, mentorLogout } from '../redux/mentorSlice';

const apiClient = axios.create({
    baseURL: 'http://localhost:5173', 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    config => {
        const state = store.getState();
        const accessToken = state.mentor.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const state = store.getState();
            const refreshToken = state.mentor.refreshToken;

            if (refreshToken) {
                try {
                    console.log("reacher here")
                    const { data } = await apiClient.post('/auth/refresh-token', { refreshToken });
                    console.log(data)
                    store.dispatch(mentorLogin({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    store.dispatch(mentorLogout());
                }
            } else {
                console.error('No refresh token available');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
