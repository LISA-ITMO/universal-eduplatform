import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
  Collapse,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DownloadIcon from "@mui/icons-material/Download";
import dayjs from "dayjs";
import { useLazyQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useAuth } from "@quiz-platform/ui";
import { MY_RESULTS_QUERY, MY_ANALYTICS_QUERY } from "@quiz-platform/ui";
import { ProfileCard } from "../components/ProfileCard";

const Profile = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  // themes currently unused in this view; keep if needed later
  // const [themes, setThemes] = useState<string[]>([]);
  const [isHiddenResults, setIsHiddenResults] = useState<boolean[]>([]);
  const [analytic, setAnalytic] = useState<Record<string, any>>({});

  // Lazy queries: only executed when user requests to see results/analytics.
  const [loadResults, { data: resultsData }] = useLazyQuery(MY_RESULTS_QUERY, {
    fetchPolicy: "network-only",
  });

  const [loadAnalytics, { data: myAnalyticsData }] = useLazyQuery(
    MY_ANALYTICS_QUERY,
    {
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (resultsData?.myResults) {
      setResults(resultsData.myResults);
      createSets(resultsData.myResults);
    }
  }, [resultsData]);

  // When analytics data arrives, set it for all subjects (placeholder until
  // per-subject queries are added on the server).
  useEffect(() => {
    if (myAnalyticsData?.myAnalytics && subjects.length > 0) {
      const Analytic: Record<string, any> = {};
      subjects.forEach((s) => {
        Analytic[s] = {
          analyticity: myAnalyticsData.myAnalytics.analyticity,
          leadership: myAnalyticsData.myAnalytics.leadership,
        };
      });
      setAnalytic(Analytic);
    }
  }, [myAnalyticsData, subjects]);

  useEffect(() => {
    if (subjects.length !== 0 && results.length !== 0) {
      const fetchAnalytics = async () => {
        const Analytic: Record<string, any> = {};
        const promises = subjects.map(async (s) => {
          const result = results.find((r) => r.subject === s);
          if (!result) return;

          try {
            // TODO: Add analytics queries when available
            // For now, we'll use placeholder data
            Analytic[s] = {
              analyticity: 0,
              leadership: 0,
            };
          } catch (error) {
            console.error("Error fetching analytics for subject", s, error);
          }
        });

        await Promise.all(promises);
        setAnalytic(Analytic);
      };

      fetchAnalytics();
    }
  }, [subjects, results]);

  const createSets = (resultsData: any[]) => {
    setSubjects([...new Set(resultsData.map((r: any) => r.subject))]);
  };

  const handleButton = async () => {
    try {
      if (!user?.id) {
        toast.error("Пользователь не авторизован");
        return;
      }
      const res = await loadResults();
      const data = res?.data;
      if (data?.myResults) {
        setResults(data.myResults);
        createSets(data.myResults);

        // fetch analytics on demand
        try {
          await loadAnalytics();
        } catch (e) {
          // ignore analytics load failures
        }

        toast.success("Результаты загружены");
      }
    } catch (error: any) {
      toast.error("Ошибка при загрузке результатов");
      console.error("Failed to load results:", error);
    }
  };

  const toggleVisibility = (index: number) => {
    const newHiddenResults = [...isHiddenResults];
    newHiddenResults[index] = !newHiddenResults[index];
    setIsHiddenResults(newHiddenResults);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ProfileCard />

      <Box sx={{ mb: 2, mx: 3, fontSize: 22, fontWeight: 600 }}>
        Цифровое портфолио студента
      </Box>

      {subjects?.length ? (
        subjects.map((subject, index) => (
          <Box key={subject}>
            <Box sx={{ my: 1, mx: 3, maxWidth: "900px" }}>
              <Box sx={{ border: "1px solid black", borderRadius: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => toggleVisibility(index)}>
                      {isHiddenResults[index] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                    <Box>
                      <Box
                        component="span"
                        sx={{ fontWeight: 600, fontSize: 18 }}
                      >
                        Курс:
                      </Box>
                      <Box component="span" sx={{ whiteSpace: "pre" }}>
                        {" " + subject}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "150px 50px",
                    }}
                  >
                    <Box sx={{ fontWeight: 600, fontSize: 18, color: "blue" }}>
                      Аналитичность:
                    </Box>
                    <Box sx={{ fontWeight: 600, fontSize: 18, color: "green" }}>
                      {analytic[subject]
                        ? analytic[subject].analyticity
                        : "loading"}
                    </Box>
                    <Box
                      sx={{ fontWeight: 600, fontSize: 18, color: "orange" }}
                    >
                      Креативность:
                    </Box>
                    <Box sx={{ fontWeight: 600, fontSize: 18, color: "green" }}>
                      {analytic[subject]
                        ? analytic[subject].leadership
                        : "loading"}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mx: 3, maxWidth: "900px" }}>
              <Collapse in={isHiddenResults[index]}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {results?.length &&
                    results
                      .filter((result) => result.subject === subject)
                      .map((result) => (
                        <Card
                          key={result.id}
                          sx={{
                            minWidth: 400,
                            backgroundColor: "#efefef",
                            m: 1,
                          }}
                        >
                          <CardContent>
                            <Box>
                              <Box component="span">Id Теста: </Box>
                              <Box component="span">{result.testId}</Box>
                            </Box>
                            <Box>
                              <Box component="span">Тема: </Box>
                              <Box component="span">{result.theme}</Box>
                            </Box>
                            <Box sx={{ my: 1 }}>
                              <Divider />
                            </Box>
                            <Box>
                              <Box component="span">Баллы: </Box>
                              <Box component="span">{result.pointsUser}</Box>
                            </Box>
                            <Box>
                              <Box component="span">Всего вопросов: </Box>
                              <Box component="span">
                                {result.solutions?.length || 0}
                              </Box>
                            </Box>
                            <Box>
                              <Box component="span">Дата прохождения: </Box>
                              <Box component="span">
                                {dayjs(result.passingDate).format(
                                  "DD.MM.YY HH:mm"
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                </Box>
              </Collapse>
            </Box>
          </Box>
        ))
      ) : (
        <Button
          sx={{ mx: 3 }}
          onClick={handleButton}
          variant="outlined"
          startIcon={<DownloadIcon />}
        >
          Загрузить результаты
        </Button>
      )}
    </Box>
  );
};

export default Profile;
