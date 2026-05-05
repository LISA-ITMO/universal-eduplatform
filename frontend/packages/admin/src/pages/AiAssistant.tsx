import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import {
  AI_BOT_AUTHORIZED_QUERY,
  AI_BOT_USERNAME_QUERY,
  AI_BOT_USERID_QUERY,
  AI_BOT_ACTIVE_QUERY,
  SUBJECTS_QUERY,
  AI_REPORTS_QUERY,
} from "@quiz-platform/ui/src/graphql/queries";
import {
  AUTHORIZE_AI_ASSISTANT_MUTATION,
  DEAUTHORIZE_AI_ASSISTANT_MUTATION,
  AI_RUN_TEST_MUTATION,
  AI_CREATE_TEST_MUTATION,
} from "@quiz-platform/ui/src/graphql/mutations";
import { toast } from "react-toastify";

const AiAssistantPage: React.FC = () => {
  const { data, refetch } = useQuery(AI_BOT_AUTHORIZED_QUERY as any);
  const { data: nameData } = useQuery(AI_BOT_USERNAME_QUERY as any);
  const { data: idData } = useQuery(AI_BOT_USERID_QUERY as any);
  const { data: botActiveData } = useQuery(AI_BOT_ACTIVE_QUERY as any);

  const [reportsPage, setReportsPage] = React.useState<number>(1);
  const [includeTakeTest, setIncludeTakeTest] = React.useState<boolean>(true);
  const [includeCreateTest, setIncludeCreateTest] =
    React.useState<boolean>(true);

  const { data: reportsData, refetch: refetchReports } = useQuery(
    AI_REPORTS_QUERY as any,
    {
      variables: {
        page: reportsPage,
        pageSize: 10,
        includeTakeTest,
        includeCreateTest,
      },
    },
  );
  const authorized = data?.aiBotAuthorized;
  const botActive = botActiveData?.aiBotActive;
  const username = nameData?.aiBotUsername;
  const botUserId = idData?.aiBotUserId;
  // reportsData.aiReports is a JSON string containing { items, totalCount }
  let reports: any[] = [];
  let reportsTotal = 0;
  if (reportsData?.aiReports) {
    try {
      const parsed = JSON.parse(reportsData.aiReports);
      reports = parsed.items || [];
      reportsTotal = parsed.totalCount || 0;
    } catch (e) {
      reports = [];
      reportsTotal = 0;
    }
  }

  const [authorize] = useMutation(AUTHORIZE_AI_ASSISTANT_MUTATION as any);
  const [deauthorize] = useMutation(DEAUTHORIZE_AI_ASSISTANT_MUTATION as any);
  const [runTest] = useMutation(AI_RUN_TEST_MUTATION as any);
  const [createTest] = useMutation(AI_CREATE_TEST_MUTATION as any);

  const [testId, setTestId] = React.useState<number | "">("");
  const [subjectId, setSubjectId] = React.useState<number | "">("");
  const [themeId, setThemeId] = React.useState<number | "">("");
  const [questionsCount, setQuestionsCount] = React.useState<number>(5);

  const { data: subjectsData } = useQuery(SUBJECTS_QUERY as any);
  const [themesData, setThemesData] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!subjectId) {
      setThemesData([]);
      setThemeId("");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query ThemesBySubject($subjectId: Int!) { themesBySubject(subjectId: $subjectId) { id nameTheme subjectId } }`,
            variables: { subjectId: Number(subjectId) },
          }),
        });
        const j = await res.json();
        setThemesData(j.data?.themesBySubject || []);
      } catch (e) {
        setThemesData([]);
      }
    })();
  }, [subjectId]);

  const handleAuthorize = async () => {
    try {
      const res = await authorize();
      toast.success(res.data.authorizeAiAssistant || "Авторизация успешна");
      await refetch();
    } catch (e: any) {
      toast.error(e.message || "Ошибка авторизации");
    }
  };

  const handleDeauthorize = async () => {
    try {
      const res = await deauthorize();
      toast.info(res.data.deauthorizeAiAssistant || "Бот деавторизован");
      await refetch();
    } catch (e: any) {
      toast.error(e.message || "Ошибка деавторизации");
    }
  };

  const handleRunTest = async () => {
    if (!testId) return toast.error("Введите id теста");
    try {
      const res = await runTest({ variables: { testId: Number(testId) } });
      toast.success(
        "Команда выполнена: " + (res.data.aiRunTest || "").slice(0, 200),
      );
      await refetchReports();
    } catch (e: any) {
      toast.error(e.message || "Ошибка при запуске");
    }
  };

  const handleCreateTest = async () => {
    if (!subjectId || !themeId)
      return toast.error("Выберите subjectId и themeId");
    try {
      const res = await createTest({
        variables: {
          subjectId: Number(subjectId),
          themeId: Number(themeId),
          questionsCount,
        },
      });
      toast.success(
        "Команда выполнена: " + (res.data.aiCreateTest || "").slice(0, 200),
      );
    } catch (e: any) {
      toast.error(e.message || "Ошибка при создании теста");
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        AI ассистент
      </Typography>

      <Box mb={2}>
        <Button
          variant="contained"
          onClick={handleAuthorize}
          disabled={authorized}
          sx={{ mr: 1 }}
        >
          Авторизовать AI ассистента
        </Button>
        <Button
          variant="outlined"
          onClick={handleDeauthorize}
          disabled={!authorized}
        >
          Разавторизовать AI ассистента
        </Button>
      </Box>

      {authorized ? (
        <Box sx={{ border: "1px solid #e0e0e0", p: 2, borderRadius: 1 }}>
          <Typography>Бот авторизован: {username}</Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center">
            <TextField
              label="ID теста"
              size="small"
              value={testId}
              onChange={(e) => setTestId(Number(e.target.value) || "")}
            />
            <Button
              variant="contained"
              onClick={handleRunTest}
              disabled={!testId || !!botActive}
            >
              Пройти тест
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Предмет</InputLabel>
              <Select
                label="Предмет"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value as any)}
              >
                <MenuItem value="">--</MenuItem>
                {(subjectsData?.subjects || []).map((s: any) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nameSubject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Тема</InputLabel>
              <Select
                label="Тема"
                value={themeId}
                onChange={(e) => setThemeId(e.target.value as any)}
                disabled={!subjectId}
              >
                <MenuItem value="">--</MenuItem>
                {themesData.map((t: any) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.nameTheme}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Questions"
              size="small"
              type="number"
              value={questionsCount}
              onChange={(e) => setQuestionsCount(Number(e.target.value) || 5)}
            />
            <Button
              variant="contained"
              onClick={handleCreateTest}
              disabled={!subjectId || !themeId || !!botActive}
            >
              Создать тест
            </Button>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">История действий бота</Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeTakeTest}
                    onChange={(e) => {
                      setIncludeTakeTest(e.target.checked);
                      setReportsPage(1);
                      refetchReports();
                    }}
                  />
                }
                label="Решение тестов"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeCreateTest}
                    onChange={(e) => {
                      setIncludeCreateTest(e.target.checked);
                      setReportsPage(1);
                      refetchReports();
                    }}
                  />
                }
                label="Формирование тестов"
              />
            </Stack>
            {reports.length === 0 ? (
              <Typography color="text.secondary">Записей не найдено</Typography>
            ) : (
              <Box sx={{ mt: 1 }}>
                {reports.map((r: any) => (
                  <Box
                    key={r.id}
                    sx={{
                      mb: 1,
                      p: 1,
                      border: "1px solid #eee",
                      borderRadius: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 13 }}>
                      <strong>Действие:</strong> {r.action}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>
                      <strong>Бот:</strong> {r.botUser?.username || r.botUserId}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>
                      <strong>Время:</strong>{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </Typography>
                    <details>
                      <summary>Показать отчёт</summary>
                      <pre style={{ whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(r.payload, null, 2)}
                      </pre>
                    </details>
                  </Box>
                ))}
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 2 }}
                  alignItems="center"
                >
                  <Button
                    disabled={reportsPage <= 1}
                    onClick={async () => {
                      setReportsPage((p) => Math.max(1, p - 1));
                      await refetchReports();
                    }}
                  >
                    Предыдущая
                  </Button>
                  <Typography>
                    Страница {reportsPage} /{" "}
                    {Math.max(1, Math.ceil(reportsTotal / 10))}
                  </Typography>
                  <Button
                    disabled={reportsPage >= Math.ceil(reportsTotal / 10)}
                    onClick={async () => {
                      setReportsPage((p) => p + 1);
                      await refetchReports();
                    }}
                  >
                    Следующая
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary">Бот не авторизован</Typography>
      )}
    </Box>
  );
};

export default AiAssistantPage;
