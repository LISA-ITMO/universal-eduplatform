import axios from 'axios';
import {QUIZ_TOKEN} from '@utils/common';

const API_BASE_URL = process.env.REACT_APP_API_TESTS_URL;

const getAPIClient = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
});

// getAPIClient.interceptors.request.use((config) => {
//     config.headers.Authorization = `Token ${localStorage.getItem(QUIZ_TOKEN)}`;
//     return config;
// })

//questions[{text, answerVariants['str', 'str..'] rightAnswer
export const API_TESTS = {
    tests: {
        add: async ({authorId, subjectId, themeId, questions, expertId}) => {
            const sendData = {
                "author_id": authorId,
                "subject_id": subjectId,
                "theme_id": themeId,
                "questions": questions,
                "expert_id": expertId,
            };
            const answer = await getAPIClient.post(`/tests/add`, sendData);
            return answer;
        },
        // logout: async () => {
        //     const answer = await getAPIClient.post('/token/logout/');
        //     return answer;
        // },
        // register: async ({email, username, password}) => {
        //     const sendData = {
        //         email,
        //         username,
        //         password,
        //     };
        //     const answer = await axios.post(`${API_BASE_URL}/users/`, sendData);
        //     return answer;
        // },
    },
}