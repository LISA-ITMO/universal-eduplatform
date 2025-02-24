import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_SUBJECTS_URL;

const getAPIClient = axios.create({
    baseURL: `${API_BASE_URL}`,
});

export const API_SUBJECTS = {
    subjects: {
        add: async ({subject}) => {
            const data = {
                'name_subject': subject
            }
            const answer = await getAPIClient.post('/subjects/add/', data);
            return answer;
        },
        get: async ({id}) => {
            const answer = await getAPIClient.get(`/subjects/get/${id}/`);
            return answer;
        },
        list: async () => {
            const answer = await getAPIClient.get('/subjects/list/');
            return answer;
        },
        delete: async ({id}) => {
            const answer = await getAPIClient.delete(`/subjects/delete/${id}/`);
            return answer;
        },
    },
    themes: {
        add: async ({subjectId, theme}) => {
            
            const data = {
                'id_subject': Number(subjectId),
                'name_theme': theme
            }
            
            
            const answer = await getAPIClient.post('/themes/add/', data);
            return answer;
        },
       

        get: async ({id}) => {
            const answer = await getAPIClient.get(`/themes/get/${id}/`);
            return answer;
        },
        getBySubjectId: async ({id}) => {
            const answer = await getAPIClient.get(`/themes/getBySubjectId/${id}/`);
            return answer;
        },
        list: async () => {
            const answer = await getAPIClient.get('/themes/list/');
            return answer;
        },
        delete: async ({id}) => {
            const answer = await getAPIClient.delete(`/themes/delete/${id}/`);
            return answer;
        },
    }
}