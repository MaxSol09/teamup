const BASE_URL = 'http://localhost:4529'

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${BASE_URL}/vk/login`,
        REGISTER: `${BASE_URL}/vk/register`,
        GET_ME: `${BASE_URL}/me`
    },
    USER: {
        UPDATE_PROFILE: `${BASE_URL}/users/profile`
    }
};
