import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_TESTS_URL;

const getAPIClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

export const API_TESTS = {
  tests: {
    add: async ({ authorId, subjectId, themeId, questions, expertId }) => {
      console.log(authorId, subjectId, themeId, questions);
      const max_points = questions.reduce(
        (sum, current) => sum + current.question_points,
        0
      );
      const sendData = {
        author_id: authorId,
        subject_id: Number(subjectId),
        theme_id: Number(themeId),
        questions: questions,
        max_points: max_points,
      };

      const answer = await getAPIClient.post(`/tests/add`, sendData);
      return answer;
    },
    list: async ({ subjectId, themeId }) => {
      const answer = await getAPIClient.get(
        `/tests/list/${subjectId}/${themeId}`
      );
      return answer;
    },
    get: async ({ id }) => {
      const answer = await getAPIClient.get(`/tests/${id}`);
      return answer;
    },
    getAnswers: async ({ id }) => {
      const answer = await getAPIClient.get(
        `/tests/get-all-correct-answers/${id}`
      );
      return answer;
    },
    getQuestionAnswer: async ({ id }) => {
      const answer = await getAPIClient.get(
        `/tests/get-correct-answer-by-question-id/${id}`
      );
      return answer;
    },
  },
  results: {
    grade: async ({ userId, testId, results, points, subject, theme }) => {
      const sendData = {
        id_user: userId,
        id_test: Number(testId),
        solutions: results,
        points_user: points,
        subject: subject,
        theme: theme,
        // "idStudent": userId,
        // "idTest": Number(testId),
        // "solutions": results,
      };
      const answer = await getAPIClient.post(`/results/add`, sendData);
      return answer;
    },
    get: async ({ id }) => {
      const answer = await getAPIClient.get(`/results/getByResultId/${id}`);
      return answer;
    },

    getAllResults: async ({ id }) => {
      const answer = await getAPIClient.get(
        `/results/full/getByStudentId/${id}`
      );
      return answer;
    },
    getAnalyticityCourse: async ({ student_id, subject_id }) => {
      const answer = await getAPIClient.get(
        `/analytics/analiticity/course/${student_id}/${subject_id}`
      );
      return answer;
    },
    getLeadershipCourse: async ({ student_id, subject_id }) => {
      const answer = await getAPIClient.get(
        `/analytics/leadership/course/${student_id}/${subject_id}`
      );
      return answer;
    },
  },
};
