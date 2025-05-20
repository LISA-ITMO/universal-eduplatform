import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../store/users";
import { API_TESTS } from "../utils/api/apiTests";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";

type TestComponentProps = {
  subjectName: string;
  themeName: string;
  testId: number;
};

type Answer = { id: number; answer_text: string };
type Question = {
  id: number;
  question_text: string;
  question_points: number;
  answers: Answer[];
};

type TestData = {
  id: number;
  max_points: number;
  questions: Question[];
};

const TestComponent: React.FC<TestComponentProps> = ({
  subjectName,
  themeName,
  testId,
}) => {
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number[]>
  >({});
  const [score, setScore] = useState<number | null>(null);
  const user = useUsers((state) => state.user);
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();

  useEffect(() => {
    API_TESTS.tests.get({ id: testId }).then((data) => setTestData(data.data));
  }, [testId]);

  const handleAnswerChange = (
    questionId: number,
    answerId: number,
    checked: boolean
  ) => {
    setSelectedAnswers((prev) => {
      const answers = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: checked
          ? [...answers, answerId]
          : answers.filter((id) => id !== answerId),
      };
    });
  };

  const isQuestionAnswered = (questionId: number) =>
    selectedAnswers[questionId]?.length > 0;

  const onSubmit = async () => {
    if (!testData) return;
    let totalScore = 0;
    const solutions = await Promise.all(
      testData.questions.map(async (question) => {
        const correctAnswers = await API_TESTS.tests.getQuestionAnswer({
          id: question.id,
        });
        const correctIds = correctAnswers.data.map((a: Answer) => a.id);
        const userAnswers = selectedAnswers[question.id] || [];

        if (
          userAnswers.length === correctIds.length &&
          userAnswers.every((id) => correctIds.includes(id))
        ) {
          totalScore += question.question_points;
        }

        return userAnswers.map((answerId) => ({
          id_question: question.id,
          user_answer: Number(answerId),
        }));
      })
    );

    setScore(totalScore);
    API_TESTS.results.grade({
      userId: user?.id,
      testId,
      subject: subjectName,
      theme: themeName,
      results: solutions.flat(),
      points: totalScore,
    });
  };

  if (!testData) return <Typography>Загрузка...</Typography>;

  if (score !== null) {
    return (
      <Card sx={{ mt: 10, mx: 5, backgroundColor: "#efefef", maxWidth: 600 }}>
        <CardContent>
          <Box>
            <Box>
              <Box>
                <Box component={"span"} sx={{ fontSize: 18 }}>
                  Количество баллов:{" "}
                </Box>
                <Box component={"span"} sx={{ fontSize: 18, fontWeight: 600 }}>
                  {score}
                </Box>
              </Box>
              <Box>
                <Box component={"span"} sx={{ fontSize: 18 }}>
                  Максимальный балл на тест:{" "}
                </Box>
                <Box component={"span"} sx={{ fontSize: 18, fontWeight: 600 }}>
                  {testData.max_points}
                </Box>
              </Box>
            </Box>
            <Box sx={{ pt: 3 }}>
              <Button onClick={() => navigate("/solution")} variant="contained">
                Перейти к тестам
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const question = testData.questions[currentQuestionIndex];

  return (
    <Box sx={{ mt: 10, mx: 5 }}>
      <Box>
        <Box component={"span"} sx={{ fontSize: 18 }}>
          Тест по предмету:{" "}
        </Box>
        <Box component={"span"} sx={{ fontSize: 18, fontWeight: 600 }}>
          {subjectName}
        </Box>
      </Box>
      <Box>
        <Box component={"span"} sx={{ fontSize: 18 }}>
          Тема:{" "}
        </Box>
        <Box component={"span"} sx={{ fontSize: 18, fontWeight: 600 }}>
          {themeName}
        </Box>
      </Box>
      <Box sx={{ py: 3, maxWidth: 600 }}>
        <Divider />
      </Box>
      <Box>
        <Button
          sx={{ mr: 3 }}
          size="small"
          variant="contained"
          startIcon={<WestIcon />}
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
        >
          <Box sx={{ fontSize: "12px", textTransform: "none" }}>
            Предыдущий вопрос
          </Box>
        </Button>
        {testData.questions.map((q, index) => (
          <Button
            sx={{ minWidth: "30px", mx: 0.5 }}
            size="small"
            key={q.id}
            variant={
              currentQuestionIndex === index || isQuestionAnswered(q.id)
                ? "contained"
                : "outlined"
            }
            color={
              currentQuestionIndex === index
                ? "primary"
                : isQuestionAnswered(q.id)
                ? "warning"
                : undefined
            }
            onClick={() => setCurrentQuestionIndex(index)}
          >
            <Box sx={{ fontSize: "12px", textTransform: "none" }}>
              {index + 1}
            </Box>
          </Button>
        ))}
        <Button
          sx={{ ml: 3 }}
          size="small"
          variant="contained"
          endIcon={<EastIcon />}
          disabled={currentQuestionIndex === testData.questions.length - 1}
          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
        >
          <Box sx={{ fontSize: "12px", textTransform: "none" }}>
            Следующий вопрос
          </Box>
        </Button>
      </Box>
      <Box sx={{ py: 2 }}>
        <Button
          size="small"
          disabled={
            Object.keys(selectedAnswers).length !== testData.questions.length ||
            !Object.keys(selectedAnswers)
              .map((index) =>
                selectedAnswers[Number(index)].length ? true : false
              )
              .every((value) => value === true)
          }
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="success"
        >
          <Box sx={{ fontSize: "12px", textTransform: "none" }}>
            {" "}
            Завершить попытку
          </Box>
        </Button>
      </Box>
      <Card
        sx={{
          mt: 3,
          backgroundColor: "#efefef",
          maxWidth: 900,
        }}
      >
        <CardContent>
          <Box sx={{ fontSize: 18, fontWeight: 600 }}>
            Вопрос {currentQuestionIndex + 1}
          </Box>
          <Box sx={{ fontSize: 18, py: 1 }}>{question.question_text}</Box>
          <Box sx={{ py: 1, maxWidth: 400 }}>
            <Divider />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {question.answers.map((answer, index) => (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ fontSize: "16px", pr: 2 }}> {index + 1}.</Box>
                <Controller
                  key={answer.id}
                  name={`question_${question.id}`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            selectedAnswers[question.id]?.includes(answer.id) ||
                            false
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              question.id,
                              answer.id,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={answer.answer_text}
                    />
                  )}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestComponent;
