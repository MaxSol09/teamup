const BASE_URL = 'http://localhost:4529'

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${BASE_URL}/vk/login`,
        REGISTER: `${BASE_URL}/vk/register`,
        GET_ME: `${BASE_URL}/me`,
        COMPLETE: `${BASE_URL}/complete-registration`,
        UPDATE_PROFILE: `${BASE_URL}/profile`
    },
    USER: {
        UPDATE_PROFILE: `${BASE_URL}/users/profile`
    },
    AD: {
        CREATE: `${BASE_URL}/create/ad`,
        GET_ALL: `${BASE_URL}/ads`,
        GET_MY: `${BASE_URL}/ads/my`
    },
    POSTS: {
        GET_ALL: `${BASE_URL}/ads`
    },
    PROJECT: {
        CREATE: `${BASE_URL}/create/project`,
        GET_ALL: `${BASE_URL}/projects`,
        GET_MY: `${BASE_URL}/projects/my`
    },
    COMMUNITY: {
        CREATE: `${BASE_URL}/create/community`,
        GET_ALL: `${BASE_URL}/communities`,
        GET_MY: `${BASE_URL}/communities/my`
    },
    EVENT: {
        CREATE: `${BASE_URL}/events`,
        GET_ALL: `${BASE_URL}/events`,
        GET_MY: `${BASE_URL}/events/my`,
        JOIN: (id: string) => `${BASE_URL}/events/${id}/join`,
        LEAVE: (id: string) => `${BASE_URL}/events/${id}/leave`,
        UPDATE: (id: string) => `${BASE_URL}/events/${id}`,
        DELETE: (id: string) => `${BASE_URL}/events/${id}`,
        GET_PARTICIPANTS: (id: string) => `${BASE_URL}/events/${id}/participants`
    }    
};
