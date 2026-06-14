import { gql } from "@apollo/client";

// Auth mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        username
        email
        role
        firstName
        lastName
        middleName
        phone
        lastLogin
      }
      requires2FA
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        username
        email
        role
        firstName
        lastName
        middleName
        phone
        lastLogin
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken)
  }
`;

// Subjects mutations
export const CREATE_SUBJECT_MUTATION = gql`
  mutation CreateSubject($nameSubject: String!, $expertId: Int) {
    createSubject(nameSubject: $nameSubject, expertId: $expertId) {
      id
      nameSubject
      expertId
    }
  }
`;

export const CREATE_THEME_MUTATION = gql`
  mutation CreateTheme($nameTheme: String!, $subjectId: Int!) {
    createTheme(nameTheme: $nameTheme, subjectId: $subjectId) {
      id
      nameTheme
      subjectId
    }
  }
`;

export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse(
    $nameCourse: String!
    $subjectId: Int!
    $expertId: Int
    $description: String
  ) {
    createCourse(
      nameCourse: $nameCourse
      subjectId: $subjectId
      expertId: $expertId
      description: $description
    ) {
      id
      nameCourse
      subjectId
    }
  }
`;

export const ADD_SUBJECT_MATERIAL_MUTATION = gql`
  mutation AddSubjectMaterial($subjectId: Int!, $url: String!, $title: String) {
    addSubjectMaterial(subjectId: $subjectId, url: $url, title: $title) {
      id
      subjectId
      title
      url
    }
  }
`;

export const DELETE_SUBJECT_MATERIAL_MUTATION = gql`
  mutation DeleteSubjectMaterial($id: Int!) {
    deleteSubjectMaterial(id: $id)
  }
`;

export const DELETE_SUBJECT_MUTATION = gql`
  mutation DeleteSubject($id: Int!) {
    deleteSubject(id: $id)
  }
`;

export const DELETE_THEME_MUTATION = gql`
  mutation DeleteTheme($id: Int!) {
    deleteTheme(id: $id)
  }
`;

export const DELETE_TEST_MUTATION = gql`
  mutation DeleteTest($id: Int!) {
    deleteTest(id: $id)
  }
`;

// Tests mutations
export const CREATE_TEST_MUTATION = gql`
  mutation CreateTest(
    $subjectId: Int!
    $themeId: Int!
    $maxPoints: Float!
    $name: String
    $expertId: Int
  ) {
    createTest(
      subjectId: $subjectId
      themeId: $themeId
      maxPoints: $maxPoints
      name: $name
      expertId: $expertId
    ) {
      id
      name
      subjectId
      themeId
      maxPoints
    }
  }
`;

export const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestion(
    $testId: Int!
    $questionText: String!
    $additionInfo: String!
    $questionPoints: Float!
  ) {
    createQuestion(
      testId: $testId
      questionText: $questionText
      additionInfo: $additionInfo
      questionPoints: $questionPoints
    ) {
      id
      questionText
      questionPoints
    }
  }
`;

export const CREATE_ANSWER_MUTATION = gql`
  mutation CreateAnswer(
    $questionId: Int!
    $answerText: String!
    $isCorrect: Boolean!
  ) {
    createAnswer(
      questionId: $questionId
      answerText: $answerText
      isCorrect: $isCorrect
    ) {
      id
      answerText
      isCorrect
    }
  }
`;

export const SUBMIT_TEST_RESULT_MUTATION = gql`
  mutation SubmitTestResult(
    $testId: Int!
    $subject: String!
    $theme: String!
    $solutions: [SolutionInput!]!
  ) {
    submitTestResult(
      testId: $testId
      subject: $subject
      theme: $theme
      solutions: $solutions
    ) {
      id
      testId
      subject
      theme
      pointsUser
      score
      passingDate
      solutions {
        id
        questionId
        userAnswer
        userAnswers
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      role
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

// AI Assistant mutations (admin)
export const AUTHORIZE_AI_ASSISTANT_MUTATION = gql`
  mutation AuthorizeAiAssistant {
    authorizeAiAssistant
  }
`;

export const DEAUTHORIZE_AI_ASSISTANT_MUTATION = gql`
  mutation DeauthorizeAiAssistant {
    deauthorizeAiAssistant
  }
`;

export const AI_RUN_TEST_MUTATION = gql`
  mutation AiRunTest($testId: Int!) {
    aiRunTest(testId: $testId)
  }
`;

export const AI_CREATE_TEST_MUTATION = gql`
  mutation AiCreateTest(
    $subjectId: Int!
    $themeId: Int!
    $questionsCount: Int
  ) {
    aiCreateTest(
      subjectId: $subjectId
      themeId: $themeId
      questionsCount: $questionsCount
    )
  }
`;
