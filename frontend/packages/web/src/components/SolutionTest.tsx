import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
// react-hook-form not needed here
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useAuth } from "@quiz-platform/ui";
import { TEST_QUERY, SUBMIT_TEST_RESULT_MUTATION } from "@quiz-platform/ui";

type TestComponentProps = {
  subjectName: string;
  themeName: string;
  testId: number;
};

const TestComponent: React.FC<TestComponentProps> = ({
  subjectName,
  themeName,
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

  const [submitTestResult] = useMutation(SUBMIT_TEST_RESULT_MUTATION);

  const testData = data?.test;
  const questions = testData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // no form controller needed for dynamic multi-question selection

  const handleAnswerChange = (
    questionId: number,
    answerId: number,
    checked: boolean
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

    // Build solutions array: include all selected answers per question
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
      // Navigate to unified result page without ids, pass result in location state
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
      <Typography variant="h5" gutterBottom>
        {subjectName} - {themeName}
      </Typography>

      {currentQuestion && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Вопрос {currentQuestionIndex + 1} из {questions.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {currentQuestion.questionText}
            </Typography>

            <Box sx={{ mt: 2 }}>
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
                          e.target.checked
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

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
        >
          Назад
        </Button>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
          >
            Далее
          </Button>
        ) : (
          <Button variant="contained" onClick={calculateScore}>
            Завершить тест
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TestComponent;
