import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useQuery } from "@apollo/client";
import {
  AI_BOT_USERID_QUERY,
  TESTS_BY_AUTHOR_QUERY,
} from "@quiz-platform/ui/src/graphql/queries";

const AiModerationPage: React.FC = () => {
  const { data: idData } = useQuery(AI_BOT_USERID_QUERY as any);
  const botUserId = idData?.aiBotUserId;

  const { data, loading, refetch } = useQuery(TESTS_BY_AUTHOR_QUERY as any, {
    variables: { authorId: botUserId || -1 },
    skip: !botUserId,
  });

  const tests = data?.testsByAuthor || [];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Модерация тестов бота
      </Typography>
      {!botUserId ? (
        <Typography color="text.secondary">
          Бот не найден или не авторизован
        </Typography>
      ) : loading ? (
        <Typography>Загрузка...</Typography>
      ) : (
        <Box>
          {tests.length === 0 ? (
            <Typography>Тесты бота не найдены</Typography>
          ) : (
            tests.map((t: any) => (
              <Box
                key={t.id}
                sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 1 }}
              >
                <Typography>
                  <strong>{t.name}</strong> (id: {t.id})
                </Typography>
                <Typography>
                  Вопросов: {t.questionsCount} — Решений: {t.timesSolved}
                </Typography>
                <Button sx={{ mt: 1 }} onClick={() => refetch()}>
                  Обновить
                </Button>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default AiModerationPage;
