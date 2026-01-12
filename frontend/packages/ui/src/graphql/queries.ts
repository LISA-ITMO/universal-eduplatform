import { gql } from '@apollo/client';

// Auth queries
export const ME_QUERY = gql`
  query Me {
    me {
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
`;

// Subjects queries
export const SUBJECTS_QUERY = gql`
  query Subjects {
    subjects {
      id
      nameSubject
      expertId
      expert {
        id
        username
        firstName
        lastName
      }
      subjectMaterials {
        id
        title
        url
      }
      themes {
        id
        nameTheme
      }
      courses {
        id
        nameCourse
      }
    }
  }
`;

export const USERS_PAGED_QUERY = gql`
  query UsersPage($skip: Int, $take: Int, $search: String, $orderByField: String, $orderByDirection: String) {
    usersPage(skip: $skip, take: $take, search: $search, orderByField: $orderByField, orderByDirection: $orderByDirection) {
      items {
        id
        username
        email
        firstName
        lastName
        middleName
        phone
        role
        lastLogin
      }
      totalCount
    }
  }
`;

export const SUBJECT_QUERY = gql`
  query Subject($id: Int!) {
    subject(id: $id) {
      id
      nameSubject
      themes {
        id
        nameTheme
      }
    }
  }
`;

export const THEMES_BY_SUBJECT_QUERY = gql`
  query ThemesBySubject($subjectId: Int!) {
    themesBySubject(subjectId: $subjectId) {
      id
      nameTheme
      subjectId
    }
  }
`;

export const ANALYTICS_BY_THEME_QUERY = gql`
  query AnalyticsByTheme($subjectId: Int!, $themeId: Int!) {
    analyticsByTheme(subjectId: $subjectId, themeId: $themeId) {
      studentId
      username
      firstName
      lastName
      analyticityTheme
      leadershipTheme
    }
  }
`;

export const COURSES_BY_SUBJECT_QUERY = gql`
  query CoursesBySubject($subjectId: Int!) {
    coursesBySubject(subjectId: $subjectId) {
      id
      nameCourse
      subjectId
      expertId
      description
    }
  }
`;

// Tests queries
export const TEST_QUERY = gql`
  query Test($id: Int!) {
    test(id: $id) {
      id
      authorId
      subjectId
      themeId
      timesSolved
      maxPoints
      questions {
        id
        questionText
        additionInfo
        questionPoints
        answers {
          id
          answerText
          isCorrect
        }
      }
    }
  }
`;

export const TESTS_BY_AUTHOR_QUERY = gql`
  query TestsByAuthor($authorId: Int!) {
    testsByAuthor(authorId: $authorId) {
      id
      subjectId
      themeId
      timesSolved
      maxPoints
    }
  }
`;

export const TESTS_LIST_QUERY = gql`
  query TestsList($subjectId: Int!, $themeId: Int!) {
    testsBySubjectAndTheme(subjectId: $subjectId, themeId: $themeId) {
      id
      authorId
      subjectId
      themeId
      timesSolved
      maxPoints
    }
  }
`;

export const MY_RESULTS_QUERY = gql`
  query MyResults {
    myResults {
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

// Analytics queries
export const MY_ANALYTICS_QUERY = gql`
  query MyAnalytics {
    myAnalytics {
      id
      studentId
      analyticity
      leadership
    }
  }
`;

export const ANALYTICS_BY_TEST_QUERY = gql`
  query AnalyticsByTest($testId: Int!) {
    analyticsByTest(testId: $testId) {
      id
      studentId
      testId
      analyticityTest
    }
  }
`;

export const USERS_QUERY = gql`
  query Users($skip: Int, $take: Int) {
    users(skip: $skip, take: $take) {
      id
      username
      email
      firstName
      lastName
      middleName
      phone
      role
      lastLogin
    }
  }
`;

