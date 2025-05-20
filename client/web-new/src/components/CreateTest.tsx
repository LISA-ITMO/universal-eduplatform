import React, { ChangeEvent, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { TextField, Button, Checkbox, Container, Box } from "@mui/material";
import { API_TESTS } from "../utils/api/apiTests";
import { useUsers } from "../store/users";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

interface TestCreationPageProps {
  subjectName: string;
  themeName: string;
  subjectId: string;
  themeId: string;
}

interface Question {
  question_text: string;
  answers: { answer_text: string; is_correct: boolean }[];
  addition_info: string;
  question_points: number;
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

  const onSubmit = (data: any) => {
    const questions: Question[] = data.questions.map((q: any) => ({
      question_text: q.question_text,
      answers: q.answers.slice(0, q.answerCount),
      addition_info: "null",
      question_points: Number(q.question_points),
    }));
    const points = questions.reduce(
      (acc, q) => acc + Number(q.question_points),
      0
    );

    API_TESTS.tests
      .add({
        authorId: useUsers.getState().user?.id,
        questions,
        subjectId,
        themeId,
        max_points: Number(points),
      })
      .then((data) => {
        if (data.status === 201) {
          toast.success("Тест успешно добавлен", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          navigate("/creation");
        } else
          toast.error("Ошибка сохранения теста", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
      });
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
    <Container>
      <Box sx={{ mb: 5 }}>
        <Box>
          <Box component={"span"} sx={{ fontSize: 18 }}>
            Тест по предмету:{" "}
          </Box>
          <Box component={"span"} sx={{ fontWeight: 600, fontSize: 18 }}>
            {subjectName}
          </Box>
        </Box>
        <Box>
          <Box component={"span"} sx={{ fontSize: 18 }}>
            Тема:{" "}
          </Box>
          <Box component={"span"} sx={{ fontWeight: 600, fontSize: 18 }}>
            {themeName}
          </Box>
        </Box>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                onChange={(e) => validateNumberProps(e, "questionCount", 1, 10)}
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

            {/* Поле для текста вопроса */}
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
                  helperText={errors.questions?.[index]?.question_text?.message}
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

        <Button type="submit" variant="contained" color="primary">
          Создать тест
        </Button>
      </form>
    </Container>
  );
};
