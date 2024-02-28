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
                "subject_id": Number(subjectId),
                "theme_id": Number(themeId),
                "questions": questions,
            };
            const answer = await getAPIClient.post(`/tests/add`, sendData);
            return answer;
        },
        list: async ({ subjectId, themeId, }) => {
            // const sendData = {
            //     "subject_id": Number(subjectId),
            //     "theme_id": Number(themeId),
            // };
            const answer = await getAPIClient.get(`/tests/list?subject_id=${subjectId}&theme_id=${themeId}`);
            return answer;
        },
        get: async ({id}) => {
            const answer = await getAPIClient.get(`/tests/${id}`);
            return answer;
        },
        getAnswers: async ({id}) => {
            const answer = await getAPIClient.get(`/tests/get-all-correct-answers/${id}`);
            return answer;
        }
    },
    results: {
        grade: async ({userId, testId, results}) => {
            const sendData = {
                "idStudent": userId,
                "idTest": Number(testId),
                "solutions": results,
            };
            const answer = await getAPIClient.post(`/results/add`, sendData);
            return answer;
        },
        get: async ({id}) => {
            const answer = await getAPIClient.get(`/results/getByResultId/${id}`);
            return answer;
        },
    },
}