import axios from 'axios';
import {QUIZ_TOKEN, QUIZ_TOKEN_REFRESH} from '@utils/common';
import Cookies from "universal-cookie";

export const cookies = new Cookies();

const API_BASE_URL = process.env.REACT_APP_API_USER_URL;

const getAPIClient = axios.create({
    baseURL: `${API_BASE_URL}/users`,
});

getAPIClient.interceptors.request.use(
    (config) => {
      const token = cookies.get('access_token'); // Assuming you store the token in localStorage
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const API_USER = {
    login: async ({username, password}) => {
      try{
        const sendData = {
            "username": username,
            "password": password,
        };
        const answer = await axios.post(`${API_BASE_URL}/users/signin/`, sendData, { withCredentials: true });
        console.log(answer.data);
        return answer;}
      catch (error) {
        console.log(error);
      }
    },

    logout: async () => {
      const sendData = {
        "refresh": cookies.get('refresh_token'),
    };
        const answer = await getAPIClient.post('/logout/', sendData, { withCredentials: true });
        return answer;
    },
    register: async ({email, username, password, role='student'}) => {
        const sendData = {
            email,
            username,
            password,
            role
        };
        const answer = await axios.post(`${API_BASE_URL}/users/signup/`, sendData, { withCredentials: true });
        return answer;
    },
}