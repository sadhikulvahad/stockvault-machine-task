

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
    AUTH: {
        SIGNUP: `${API_BASE_URL}/auth/signup`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        LOGOUT: `/auth/logout`,
        REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    },
    POST: {
        CREATE_POST: `/posts/`,
        GET_POSTS: `/posts/`,
        UPDATE_POST: `/posts/`,
        DELETE_POST: `/posts/`,
        UPDATE_POSITION: `/posts/update-position`,
    },
    PROFILE: {
        GET_PROFILE: `/profile/`,
        RESET_PASSWORD: `/profile/reset-password`,
    }
}