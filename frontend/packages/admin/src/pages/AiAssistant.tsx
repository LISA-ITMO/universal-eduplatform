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
  Chip,
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
                      <Box sx={{ mt: 1 }}>
                        {r.payload && typeof r.payload === 'object' && r.payload.report ? (
                          <Box sx={{ p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                            {/* Резюме */}
                            {r.payload.report.summary && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                  ТестРезюме
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#34495e', whiteSpace: 'pre-wrap' }}>
                                  {r.payload.report.summary}
                                </Typography>
                              </Box>
                            )}

                            {/* Общая рекомендация */}
                            {r.payload.report.recommendation && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                  Рекомендация
                                </Typography>
                                <Chip
                                  label={r.payload.report.recommendation}
                                  color={r.payload.report.recommendation === 'оставить' ? 'success' : 'warning'}
                                  size="small"
                                  sx={{ fontWeight: 'bold' }}
                                />
                              </Box>
                            )}

                            {/* Вопросы */}
                            {r.payload.report.questions && r.payload.report.questions.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                                  Детали по вопросам
                                </Typography>
                                {r.payload.report.questions.map((q: any, idx: number) => (
                                  <Box
                                    key={q.questionId || idx}
                                    sx={{
                                      p: 1.5,
                                      mb: 1.5,
                                      border: '1px solid #e9ecef',
                                      borderRadius: 1,
                                      bgcolor: '#ffffff',
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Вопрос #{q.questionId || idx + 1}
                                      </Typography>
                                      {q.recommendation && (
                                        <Chip
                                          label={q.recommendation}
                                          size="small"
                                          color={q.recommendation === 'оставить' ? 'success' : 'warning'}
                                          sx={{ fontSize: '0.7rem' }}
                                        />
                                      )}
                                    </Box>
                                    {q.summary && (
                                      <Typography variant="body2" sx={{ color: '#495057', whiteSpace: 'pre-wrap' }}>
                                        {q.summary}
                                      </Typography>
                                    )}
                                    {q.issues && q.issues.length > 0 && (
                                      <Box sx={{ mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
                                          Проблемы:
                                        </Typography>
                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                          {q.issues.map((issue: any, i: number) => (
                                            <li key={i}>
                                              <Typography variant="caption" sx={{ color: '#dc3545' }}>
                                                {typeof issue === 'string' ? issue : JSON.stringify(issue)}
                                              </Typography>
                                            </li>
                                          ))}
                                        </ul>
                                      </Box>
                                    )}
                                    {q.userAnswers && q.userAnswers.length > 0 && (
                                      <Box sx={{ mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: '#6c757d' }}>
                                          Ответы пользователя: {q.userAnswers.join(', ')}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </Box>
                        ) : r.payload && typeof r.payload === 'object' && r.payload.report && r.payload.report.questions ? (
                          <Box sx={{ p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                              Анализ прохождения теста
                            </Typography>
                            {r.payload.report.summary && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                  Тест Резюме
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#34495e', whiteSpace: 'pre-wrap' }}>
                                  {r.payload.report.summary}
                                </Typography>
                              </Box>
                            )}
                            {r.payload.parsedSolutions && r.payload.parsedSolutions.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                  Ответы пользователя
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {r.payload.parsedSolutions.map((s: any) => (
                                    <Chip
                                      key={s.questionId}
                                      label={`Вопрос ${s.questionId}: ${s.userAnswers.join(', ')}`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                            {r.payload.report.questions && r.payload.report.questions.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                                  Детали по вопросам
                                </Typography>
                                {r.payload.report.questions.map((q: any, idx: number) => {
                                  const solution = r.payload.parsedSolutions?.find((s: any) => s.questionId === q.questionId);
                                  const validityLabel = q.validity === 'valid' ? 'Корректный' : q.validity === 'invalid' ? 'Некорректный' : 'Неизвестно';
                                  const chipColor = q.validity === 'valid' ? 'success' : q.validity === 'invalid' ? 'error' : 'warning';
                                  return (
                                    <Box
                                      key={q.questionId || idx}
                                      sx={{
                                        p: 1.5,
                                        mb: 1.5,
                                        border: '1px solid #e9ecef',
                                        borderRadius: 1,
                                        bgcolor: '#ffffff',
                                      }}
                                    >
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                          Вопрос #{q.questionId || idx + 1}
                                        </Typography>
                                        {q.validity && (
                                          <Chip
                                            label={validityLabel}
                                            size="small"
                                            color={chipColor}
                                            sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                                          />
                                        )}
                                      </Box>
                                      {q.note && (
                                        <Typography variant="body2" sx={{ color: '#6c757d', whiteSpace: 'pre-wrap' }}>
                                          {q.note}
                                        </Typography>
                                      )}
                                      {solution && (
                                        <Box sx={{ mt: 0.5 }}>
                                          <Typography variant="caption" sx={{ color: '#6c757d' }}>
                                            Ответы пользователя: {solution.userAnswers.join(', ')}
                                          </Typography>
                                        </Box>
                                      )}
                                    </Box>
                                  );
                                })}
                              </Box>
                            )}
                            {r.payload.modelResponse?.error && (
                              <Box sx={{ mt: 2, p: 1, bgcolor: '#fff3cd', borderRadius: 1 }}>
                                <Typography variant="caption" sx={{ color: '#856404' }}>
                                  Ошибка модели: {r.payload.modelResponse.error}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        ) : r.payload && typeof r.payload === 'object' && r.payload.createdTestId && r.payload.modelResponse ? (
                          <Box sx={{ p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                              Сгенерированный тест
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                <strong>ID созданного теста:</strong> {r.payload.createdTestId}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                <strong>Формат:</strong> {r.payload.modelResponse.formatVersion || 'N/A'}
                              </Typography>
                            </Box>
                            {r.payload.modelResponse.test && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                                  Тест: {r.payload.modelResponse.test.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                                  Максимальный балл: {r.payload.modelResponse.test.maxPoints}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  {r.payload.modelResponse.test.questions.map((q: any, idx: number) => (
                                    <Box
                                      key={idx}
                                      sx={{
                                        p: 1.5,
                                        mb: 1.5,
                                        border: '1px solid #e9ecef',
                                        borderRadius: 1,
                                        bgcolor: '#ffffff',
                                      }}
                                    >
                                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                        Вопрос {idx + 1} (баллов: {q.points})
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: '#495057', mb: 0.5 }}>
                                        {q.text}
                                      </Typography>
                                      <Box sx={{ ml: 1 }}>
                                        {q.answers.map((a: any, aidx: number) => (
                                          <Typography
                                            key={aidx}
                                            variant="body2"
                                            sx={{
                                              color: a.isCorrect ? '#2e7d32' : '#d32f2f',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 0.5,
                                              fontWeight: a.isCorrect ? 'bold' : 'normal',
                                            }}
                                          >
                                            {a.isCorrect ? '✅' : '❌'} {a.text}
                                          </Typography>
                                        ))}
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <pre style={{ whiteSpace: "pre-wrap" }}>
                            {typeof r.payload === 'string' ? r.payload : JSON.stringify(r.payload, null, 2)}
                          </pre>
                        )}
                      </Box>
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
