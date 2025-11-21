import axios from 'axios';

export const query = axios.create({
    baseURL: '/api/v1',
    timeout: 10000,
});

query.interceptors.response.use(
    (response) => response,
    (error) => {
        throw new Error(error || 'An error occurred');
    },
);
