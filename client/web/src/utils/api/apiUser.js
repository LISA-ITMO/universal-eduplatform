import axios from 'axios';
import {QUIZ_TOKEN} from '@utils/common';

const API_BASE_URL = process.env.REACT_APP_API_USER_URL;

const getAPIClient = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
});

getAPIClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Token ${localStorage.getItem(QUIZ_TOKEN)}`;
    return config;
})

export const API_USER = {
    login: async ({username, password}) => {
        const sendData = {
            "username": username,
            "password": password,
        };
        const answer = await axios.post(`${API_BASE_URL}/api/v1/token/login/`, sendData);
        return answer;
    },
    logout: async () => {
        const answer = await getAPIClient.post('/token/logout/');
        return answer;
    },
    register: async ({email, username, password}) => {
        const sendData = {
            email,
            username,
            password,
        };
        const answer = await axios.post(`${API_BASE_URL}/users/`, sendData);
        return answer;
    },
}