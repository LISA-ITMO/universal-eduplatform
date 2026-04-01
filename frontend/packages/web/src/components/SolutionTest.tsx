import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Card,
  CardContent,
  Tooltip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// react-hook-form not needed here
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { MY_RESULTS_QUERY } from "@quiz-platform/ui";
import { toast } from "react-toastify";
import { useAuth } from "@quiz-platform/ui";
import { TEST_QUERY, SUBMIT_TEST_RESULT_MUTATION } from "@quiz-platform/ui";

type TestComponentProps = {
  subjectName: string;
  themeName: string;
  testName: string;
  testId: number;
};

const TestComponent: React.FC<TestComponentProps> = ({
  subjectName,
  themeName,
  testName,
  testId,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number[]>
  >({});
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, loading } = useQuery(TEST_QUERY, {
    variables: { id: testId },
  });

  const [submitTestResult] = useMutation(SUBMIT_TEST_RESULT_MUTATION, {
    update(cache, { data }: any) {
      const newResult = data?.submitTestResult;
      if (!newResult) return;

      try {
        const existing: any = cache.readQuery({ query: MY_RESULTS_QUERY });
        const prev = existing?.myResults || [];
        cache.writeQuery({
          query: MY_RESULTS_QUERY,
          data: { myResults: [newResult, ...prev] },
        });
      } catch (e) {
        // ignore
      }

      try {
        const testId = newResult?.testId || testData?.id;
        if (testId) {
          const id = cache.identify({ __typename: "Test", id: testId });
          cache.modify({
            id,
            fields: {
              timesSolved(prev: number) {
                return (prev || 0) + 1;
              },
            },
          });
        }
      } catch (e) {
        // ignore
      }
    },
  });

  const testData = data?.test;
  const questions: any[] = testData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const allAnswered =
    questions.length > 0 &&
    questions.every((q: any) => (selectedAnswers[q.id] || []).length > 0);

  const handleAnswerChange = (
    questionId: number,
    answerId: number,
    checked: boolean,
  ) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, answerId] };
      } else {
        return {
          ...prev,
          [questionId]: current.filter((id) => id !== answerId),
        };
      }
    });
  };

  const calculateScore = async () => {
    if (!testData || !user) return;

    const solutions: { questionId: number; userAnswers: number[] }[] = [];

    for (const question of questions) {
      const selected = selectedAnswers[question.id] || [];
      solutions.push({ questionId: question.id, userAnswers: selected });
    }

    try {
      const res = await submitTestResult({
        variables: {
          testId: testData.id,
          subject: subjectName,
          theme: themeName,
          solutions,
        },
      });

      const resultData = res.data?.submitTestResult;
      navigate("/solution/result", { state: { result: resultData } });
    } catch (error: any) {
      toast.error("Ошибка при отправке результатов");
      console.error(error);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (!testData) return <Typography>Тест не найден</Typography>;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5">{testName}</Typography>
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: "flex", fontSize: 20 }}>
          <Box component={"span"} fontWeight={600} pr={1}>
            Предмет:
          </Box>
          {subjectName}
        </Box>
        <Box sx={{ display: "flex", fontSize: 20 }}>
          <Box component={"span"} fontWeight={600} pr={1}>
            Тема:
          </Box>
          {themeName}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
          my: 2,
        }}
      >
        <Tooltip title="Предыдущий вопрос">
          <span>
            <IconButton
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              aria-label="previous-question"
            >
              <ArrowBackIcon />
            </IconButton>
          </span>
        </Tooltip>

        {questions.map((q: any, idx: number) => {
          const answered = (selectedAnswers[q.id] || []).length > 0;
          const isActive = idx === currentQuestionIndex;
          return (
            <Button
              key={q.id}
              variant={isActive ? "contained" : "outlined"}
              color={isActive ? "primary" : undefined}
              onClick={() => setCurrentQuestionIndex(idx)}
              sx={
                !isActive && answered
                  ? {
                      backgroundColor: "orange",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#ff9800" },
                    }
                  : undefined
              }
            >
              {idx + 1}
            </Button>
          );
        })}

        <Tooltip title="Следующий вопрос">
          <span>
            <IconButton
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(questions.length - 1, prev + 1),
                )
              }
              disabled={currentQuestionIndex === questions.length - 1}
              aria-label="next-question"
            >
              <ArrowForwardIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {currentQuestion && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Вопрос {currentQuestionIndex + 1} из {questions.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {currentQuestion.questionText}
            </Typography>

            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}
            >
              {currentQuestion.answers.map((answer: any) => (
                <FormControlLabel
                  key={answer.id}
                  control={
                    <Checkbox
                      checked={(
                        selectedAnswers[currentQuestion.id] || []
                      ).includes(answer.id)}
                      onChange={(e) =>
                        handleAnswerChange(
                          currentQuestion.id,
                          answer.id,
                          e.target.checked,
                        )
                      }
                    />
                  }
                  label={answer.answerText}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          onClick={calculateScore}
          disabled={!allAnswered}
        >
          Завершить тест
        </Button>
      </Box>
    </Box>
  );
};

export default TestComponent;
