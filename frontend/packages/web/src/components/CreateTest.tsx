import React, { ChangeEvent, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  TextField,
  Button,
  Checkbox,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@quiz-platform/ui";
import {
  CREATE_TEST_MUTATION,
  CREATE_QUESTION_MUTATION,
  CREATE_ANSWER_MUTATION,
} from "@quiz-platform/ui";

interface TestCreationPageProps {
  subjectName: string;
  themeName: string;
  subjectId: string;
  themeId: string;
}

export const TestCreationPage: React.FC<TestCreationPageProps> = ({
  subjectName,
  themeName,
  subjectId,
  themeId,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      questionCount: 3,
      questions: Array(3).fill({
        question_text: "",
        answers: Array(5).fill({ answer_text: "", is_correct: false }),
        question_points: 1,
        answerCount: 5,
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const questionCount = watch("questionCount");
  const questions = watch("questions");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [createTest] = useMutation(CREATE_TEST_MUTATION);
  const [createQuestion] = useMutation(CREATE_QUESTION_MUTATION);
  const [createAnswer] = useMutation(CREATE_ANSWER_MUTATION);

  useEffect(() => {
    const difference = questionCount - fields.length;
    if (difference > 0) {
      for (let i = 0; i < difference; i++) {
        append({
          question_text: "",
          answers: Array(5).fill({ answer_text: "", is_correct: false }),
          question_points: 1,
          answerCount: 5,
        });
      }
    } else if (difference < 0) {
      for (let i = 0; i < -difference; i++) {
        remove(fields.length - 1);
      }
    }
  }, [questionCount, append, remove, fields.length]);

  const onSubmit = async (data: any) => {
    try {
      const points = data.questions.reduce(
        (acc: number, q: any) => acc + Number(q.question_points),
        0
      );

      const testResult = await createTest({
        variables: {
          subjectId: parseInt(subjectId),
          themeId: parseInt(themeId),
          maxPoints: points,
        },
      });

      const testId = testResult.data?.createTest?.id;
      if (!testId) throw new Error("Test ID not returned");

      for (const question of data.questions) {
        const questionResult = await createQuestion({
          variables: {
            testId,
            questionText: question.question_text,
            additionInfo: "null",
            questionPoints: Number(question.question_points),
          },
        });

        const questionId = questionResult.data?.createQuestion?.id;
        if (!questionId) continue;

        for (const answer of question.answers.slice(0, question.answerCount)) {
          await createAnswer({
            variables: {
              questionId,
              answerText: answer.answer_text,
              isCorrect: answer.is_correct,
            },
          });
        }
      }

      toast.success("Тест успешно добавлен");
      navigate("/");
    } catch (error: any) {
      toast.error("Ошибка при создании теста");
      console.error(error);
    }
  };

  const validateNumberProps = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    prop: string,
    min: number,
    max: number
  ) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value <= max && value >= min)
      setValue(
        prop as "questionCount" | `questions.${number}.${string}`,
        value
      );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          Создание теста: {subjectName} - {themeName}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <Box sx={{ fontWeight: 600, fontSize: 18, pr: 3 }}>
              Количество вопросов:
            </Box>
            <Controller
              name="questionCount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label=""
                  slotProps={{ htmlInput: { min: 1, max: 10 } }}
                  onChange={(e) =>
                    validateNumberProps(e, "questionCount", 1, 10)
                  }
                  size="small"
                  sx={{ mb: 3, minWidth: 80 }}
                />
              )}
            />
          </Box>

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{ mb: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
            >
              <Box sx={{ fontWeight: 600, fontSize: 22, pb: 3 }}>
                Вопрос {index + 1}
              </Box>

              {/* Поле для текста вопроса  */}
              <Controller
                name={`questions.${index}.question_text`}
                control={control}
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Введите вопрос"
                    fullWidth
                    size="small"
                    error={!!errors.questions?.[index]?.question_text}
                    helperText={
                      errors.questions?.[index]?.question_text?.message
                    }
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Box sx={{ display: "flex", alignItems: "baseline" }}>
                <Box sx={{ fontWeight: 600, fontSize: 18, pr: 3 }}>
                  Количество ответов:
                </Box>
                <Controller
                  name={`questions.${index}.answerCount`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label=""
                      slotProps={{ htmlInput: { min: 2, max: 10 } }}
                      onChange={(e) =>
                        validateNumberProps(
                          e,
                          `questions.${index}.answerCount`,
                          2,
                          10
                        )
                      }
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "baseline" }}>
                <Box sx={{ fontWeight: 600, fontSize: 18, pr: 3 }}>
                  Балл за правильный ответ:
                </Box>
                <Controller
                  name={`questions.${index}.question_points`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label=""
                      slotProps={{ htmlInput: { min: 1, max: 100 } }}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ fontWeight: 600, fontSize: 18, pb: 1 }}>
                Варианты ответов:
              </Box>
              {Array.from({ length: questions[index].answerCount }).map(
                (_, aIndex) => (
                  <Box
                    key={aIndex}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <Controller
                      name={`questions.${index}.answers.${aIndex}.is_correct`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                    <Controller
                      name={`questions.${index}.answers.${aIndex}.answer_text`}
                      control={control}
                      rules={{ required: "Обязательное поле" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={`Ответ ${aIndex + 1}`}
                          fullWidth
                          size="small"
                          error={
                            !!errors.questions?.[index]?.answers?.[aIndex]
                              ?.answer_text
                          }
                          helperText={
                            errors.questions?.[index]?.answers?.[aIndex]
                              ?.answer_text?.message
                          }
                        />
                      )}
                    />
                  </Box>
                )
              )}
            </Box>
          ))}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Создать тест
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
