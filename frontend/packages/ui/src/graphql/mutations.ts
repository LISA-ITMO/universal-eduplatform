import { gql } from '@apollo/client';

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
  mutation CreateSubject($nameSubject: String!) {
    createSubject(nameSubject: $nameSubject) {
      id
      nameSubject
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

// Tests mutations
export const CREATE_TEST_MUTATION = gql`
  mutation CreateTest(
    $subjectId: Int!
    $themeId: Int!
    $maxPoints: Float!
    $expertId: Int
  ) {
    createTest(
      subjectId: $subjectId
      themeId: $themeId
      maxPoints: $maxPoints
      expertId: $expertId
    ) {
      id
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
      pointsUser
      score
      passingDate
    }
  }
`;




