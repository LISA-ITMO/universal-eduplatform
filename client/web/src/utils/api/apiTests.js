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
                "max_points": 0
            };
            
            const answer = await getAPIClient.post(`/tests/add`, sendData);
            return answer;
        },
        list: async ({ subjectId, themeId, }) => {
            // const sendData = {
            //     "subject_id": Number(subjectId),
            //     "theme_id": Number(themeId),
            // };
            // const answer = await getAPIClient.get(`/tests/list?subject_id=${subjectId}&theme_id=${themeId}`);
            const answer = await getAPIClient.get(`/tests/list/${subjectId}/${themeId}`);
            return answer;
        },
        get: async ({id}) => {
            const answer = await getAPIClient.get(`/tests/${id}`);
            return answer;
        },
        getAnswers: async ({id}) => {
            const answer = await getAPIClient.get(`/tests/get-all-correct-answers/${id}`);
            return answer;
        },
        getQuestionAnswer: async ({id}) => {
            
            const answer = await getAPIClient.get(`/tests/get-correct-answer-by-question-id/${id}`);
            return answer;
        }
    },
    results: {
        grade: async ({userId, testId, results, points}) => {
            
            const sendData = {
                "id_user": userId,
                "id_test": Number(testId),
                "solutions": results,
                "points_user": points
                // "idStudent": userId,
                // "idTest": Number(testId),
                // "solutions": results,
            };
            const answer = await getAPIClient.post(`/results/add`, sendData);
            return answer;
        },
        get: async ({id}) => {
            const answer = await getAPIClient.get(`/results/getByResultId/${id}`);
            return answer;
        },

        getAllResults: async ({id}) => {
            const answer = await getAPIClient.get(`/results/full/getByStudentId/${id}`);
            return answer;
    },
}
}