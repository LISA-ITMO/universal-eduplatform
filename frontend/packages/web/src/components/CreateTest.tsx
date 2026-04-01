import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  TextField,
  Button,
  Checkbox,
  Container,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@quiz-platform/ui";
import {
  CREATE_TEST_MUTATION,
  CREATE_QUESTION_MUTATION,
  CREATE_ANSWER_MUTATION,
  TESTS_LIST_QUERY,
  TESTS_BY_AUTHOR_QUERY,
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
      testName: "",
      questions: [
        {
          question_text: "",
          question_points: 1,
          answers: [
            { answer_text: "", is_correct: false },
            { answer_text: "", is_correct: false },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [createTest] = useMutation(CREATE_TEST_MUTATION, {
    update(cache, { data }: any) {
      const created = data?.createTest;
      if (!created) return;
      const vars = {
        subjectId: parseInt(subjectId),
        themeId: parseInt(themeId),
      } as any;
      try {
        const existing: any = cache.readQuery({
          query: TESTS_LIST_QUERY,
          variables: vars,
        });
        const prev = existing?.testsBySubjectAndTheme || [];
        cache.writeQuery({
          query: TESTS_LIST_QUERY,
          variables: vars,
          data: { testsBySubjectAndTheme: [...prev, created] },
        });
      } catch (e) {
        // nothing to update in cache
      }
      try {
        if (user?.id) {
          const authorVars = { authorId: Number(user.id) } as any;
          const existingAuthor: any = cache.readQuery({
            query: TESTS_BY_AUTHOR_QUERY,
            variables: authorVars,
          });
          const prevAuthor = existingAuthor?.testsByAuthor || [];

          const testForAuthor = {
            id: created.id,
            name: created.name ?? "",
            questionsCount: created.questionsCount ?? 0,
            subjectId: created.subjectId,
            themeId: created.themeId,
            timesSolved: created.timesSolved ?? 0,
            maxPoints: created.maxPoints ?? 0,
            author: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              __typename: "UserType",
            },
            __typename: "Test",
          };

          cache.writeQuery({
            query: TESTS_BY_AUTHOR_QUERY,
            variables: authorVars,
            data: { testsByAuthor: [testForAuthor, ...prevAuthor] },
          });
        }
      } catch (e) {
        // ignore
      }
    },
  });
  const [createQuestion] = useMutation(CREATE_QUESTION_MUTATION);
  const [createAnswer] = useMutation(CREATE_ANSWER_MUTATION);

  const addQuestion = () => {
    append({
      question_text: "",
      question_points: 1,
      answers: [
        { answer_text: "", is_correct: false },
        { answer_text: "", is_correct: false },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    if (fields.length <= 1) {
      toast.error("Должен быть как минимум 1 вопрос");
      return;
    }
    remove(index);
  };

  useEffect(() => {
    if (fields.length === 0) addQuestion();
  }, [fields.length]);

  const onSubmit = async (data: any) => {
    try {
      const validationErrors: string[] = [];
      if (!data.testName || data.testName.trim() === "") {
        validationErrors.push("Наименование теста обязательно");
      }
      if (!data.questions || data.questions.length < 1) {
        validationErrors.push("Должен быть как минимум 1 вопрос");
      }
      data.questions.forEach((q: any, qi: number) => {
        if (!q.question_text || q.question_text.trim() === "")
          validationErrors.push(`Вопрос ${qi + 1}: текст вопроса обязателен`);
        if (!q.answers || q.answers.length < 2)
          validationErrors.push(
            `Вопрос ${qi + 1}: должно быть минимум 2 варианта ответа`,
          );
        const hasCorrect = q.answers.some((a: any) => a.is_correct);
        if (!hasCorrect)
          validationErrors.push(
            `Вопрос ${qi + 1}: должен быть минимум 1 правильный ответ`,
          );
        q.answers.forEach((a: any, ai: number) => {
          if (!a.answer_text || a.answer_text.trim() === "")
            validationErrors.push(
              `Вопрос ${qi + 1}, ответ ${ai + 1}: текст обязателен`,
            );
        });
      });
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]);
        return;
      }

      const points = data.questions.reduce(
        (acc: number, q: any) => acc + Number(q.question_points || 1),
        0,
      );

      const testResult = await createTest({
        variables: {
          subjectId: parseInt(subjectId),
          themeId: parseInt(themeId),
          maxPoints: points,
          ...(data.testName ? { name: data.testName } : {}),
        },
      });

      const testId = testResult.data?.createTest?.id;
      if (!testId) throw new Error("Test ID not returned");

      for (const q of data.questions) {
        const questionResult = await createQuestion({
          variables: {
            testId,
            questionText: q.question_text,
            additionInfo: q.additionInfo || "",
            questionPoints: Number(q.question_points || 1),
          },
        });

        const questionId = questionResult.data?.createQuestion?.id;
        if (!questionId) continue;

        for (const answer of q.answers) {
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

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          Создание теста: {subjectName} - {themeName}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="testName"
            control={control}
            rules={{ required: "Наименование теста обязательно" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Наименование теста"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                error={!!errors.testName}
                helperText={errors.testName?.message as any}
              />
            )}
          />
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ fontWeight: 600, fontSize: 18, pr: 1 }}>Вопросы</Box>
            <IconButton
              size="small"
              onClick={addQuestion}
              aria-label="add-question"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                mb: 4,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                position: "relative",
              }}
            >
              <Box sx={{ position: "absolute", right: 8, top: 8 }}>
                <IconButton
                  size="small"
                  onClick={() => removeQuestion(index)}
                  disabled={fields.length <= 1}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>

              <Box sx={{ fontWeight: 600, fontSize: 22, pb: 3 }}>
                Вопрос {index + 1}
              </Box>

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

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box sx={{ fontWeight: 600, fontSize: 18, pr: 3 }}>
                  Варианты ответов:
                </Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    const answers = questions[index].answers || [];
                    setValue(`questions.${index}.answers`, [
                      ...answers,
                      { answer_text: "", is_correct: false },
                    ]);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              <Box sx={{ fontWeight: 600, fontSize: 18, pb: 1 }}>
                Варианты ответов:
              </Box>
              {(questions[index].answers || []).map(
                (ans: any, aIndex: number) => (
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
                    <IconButton
                      size="small"
                      onClick={() => {
                        const answers = questions[index].answers || [];
                        if (answers.length <= 2) return;
                        const newAnswers = answers.filter(
                          (_: any, i: number) => i !== aIndex,
                        );
                        setValue(`questions.${index}.answers`, newAnswers);
                      }}
                      disabled={(questions[index].answers || []).length <= 2}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ),
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
