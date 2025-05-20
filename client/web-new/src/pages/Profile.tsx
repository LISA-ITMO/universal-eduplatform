import {
  Icon,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaShareFromSquare } from "react-icons/fa6";
import { ProfileCard } from "../components/ProfileCard";
import { API_TESTS } from "../utils/api/apiTests";
import { useUsers } from "../store/users";
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

const Profile = () => {
  const { user } = useUsers();

  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [themes, setThemes] = useState([]);

  const [analytic, setAnalytic] = useState({});

  useEffect(() => {
    createSets();
  }, [results]);

  useEffect(() => {
    if (subjects.length !== 0 && results.length !== 0) {
      let Analytic = {};
      let promises = subjects.map(async (s) => {
        let filter_results = Array.from(results.filter((r) => r.subject == s));
        let testId = filter_results[0].id_test;
        const testResponse = await API_TESTS.tests.get({ id: testId });
        var details = testResponse.data;
        let subject_id = details.subject_id;

        const analyticityResponse =
          await API_TESTS.results.getAnalyticityCourse({
            student_id: user?.id,
            subject_id: subject_id,
          });
        const leadershipResponse = await API_TESTS.results.getLeadershipCourse({
          student_id: user?.id,
          subject_id: subject_id,
        });

        const analyticity = analyticityResponse.data;
        const leadership = leadershipResponse.data;

        Analytic[s] = { analyticity: analyticity, leadership: leadership };
      });

      Promise.all(promises)
        .then(() => {
          setAnalytic(Analytic);
        })
        .catch((error) => {
          console.error("Error fetching test details for subject", error);
        });
    }
  }, [subjects]);

  const handleButton = () => {
    API_TESTS.results
      .getAllResults({ id: user?.id })
      .then((res) => {
        setResults(res.data);
      })
      .catch((error) => {
        console.error("Failed to load results:", error);
      });
  };

  const createSets = () => {
    setSubjects(Array.from(new Set(Array.from(results.map((r) => r.subject)))));
    setThemes(Array.from(new Set(Array.from(results.map((r) => r.theme)))));
  };

  const [isHiddenResults, setIsHiddenResults] = useState([]);

  const toggleVisibility = (index) => {
    const newHiddenResults = [...isHiddenResults];
    newHiddenResults[index] = !newHiddenResults[index];
    setIsHiddenResults(newHiddenResults);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <ProfileCard />

        <Box sx={{ mb: 2, mx: 3, fontSize: 22, fontWeight: "600" }}>
          Цифровое портфолио студента
        </Box>

        {subjects?.length ? (
          subjects.map((subject, index) => (
            <>
              <Box sx={{ my: 1, mx: 3, maxWidth: "900px" }}>
                <Box sx={{ border: "1px solid black", borderRadius: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <IconButton onClick={() => toggleVisibility(index)}>
                          {isHiddenResults[index] ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </Box>
                      <Box>
                        <Box
                          component={"span"}
                          sx={{ fontWeight: 600, fontSize: 18 }}
                        >
                          Курс:
                        </Box>
                        <Box component={"span"} sx={{ whiteSpace: "pre" }}>
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
                      <Box
                        sx={{ fontWeight: 600, fontSize: 18, color: "blue" }}
                      >
                        Аналитичность:
                      </Box>
                      <Box
                        sx={{ fontWeight: 600, fontSize: 18, color: "green" }}
                      >
                        {analytic[subject]
                          ? analytic[subject].analyticity
                          : "loading"}
                      </Box>
                      <Box
                        sx={{
                          fontWeight: 600,
                          fontSize: 18,
                          color: "orange",
                        }}
                      >
                        Креативность:
                      </Box>
                      <Box
                        sx={{ fontWeight: 600, fontSize: 18, color: "green" }}
                      >
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
                          <>
                            <Card
                              sx={{
                                minWidth: 400,
                                backgroundColor: "#efefef",
                                m: 1,
                              }}
                            >
                              <CardContent>
                                <Box>
                                  <Box component={"span"}>Id Теста: </Box>
                                  <Box component={"span"}>{result.id_test}</Box>
                                </Box>
                                <Box>
                                  <Box component={"span"}>Тема: </Box>
                                  <Box component={"span"}>{result.theme}</Box>
                                </Box>
                                <Box sx={{ my: 1 }}>
                                  <Divider />
                                </Box>
                                <Box>
                                  <Box component={"span"}>Баллы: </Box>
                                  <Box component={"span"}>
                                    {result.points_user}
                                  </Box>
                                </Box>
                                <Box>
                                  <Box component={"span"}>Всего вопросов: </Box>
                                  <Box component={"span"}>
                                    {result.solutions.length}
                                  </Box>
                                </Box>
                                <Box>
                                  <Box component={"span"}>
                                    Дата прохождения:{" "}
                                  </Box>
                                  <Box component={"span"}>
                                    {dayjs(result.passing_date).format(
                                      "DD.MM.YY HH:mm"
                                    )}
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </>
                        ))}
                  </Box>
                </Collapse>
              </Box>
            </>
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
    </>
  );
};

export default Profile;
