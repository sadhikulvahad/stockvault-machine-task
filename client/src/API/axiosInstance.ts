import axios from "axios";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Autherization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

let isRefreshing = false;
let failedQueue: Array<(token: string | null) => void> = [];

axiosInstance.interceptors.response.use(
    (response) => {
        const fresh = response.headers['x-access-token'];
        if (fresh) {
            localStorage.setItem("accessToken", fresh);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config

        // 403 Blocked account
        if (
            error.response?.status === 403 &&
            (error.response.data?.message === 'Account is blocked' || error.response.data?.error === 'Account is blocked')
        ) {
            localStorage.removeItem("accessToken");
            window.location.href = '/register';
            return Promise.reject(error);
        }

        // 401 Refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    failedQueue.push((newaccessToken: string | null) => {
                        originalRequest.headers = {
                            ...originalRequest.headers,
                            Authorization: `Bearer ${newaccessToken}`
                        };
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data, headers } = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh-token`, null, {
                    withCredentials: true
                });
                const newAccessToken = headers['x-access-token'] || data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                failedQueue.forEach(callback => callback(newAccessToken));
                failedQueue = [];
                return axiosInstance(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                document.cookie = 'refreshToken=; Max-Age=0; path=/';
                window.location.href = '/register';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        // ❌ Ensure you reject all other errors
        return Promise.reject(error);
    }
);


export default axiosInstance;