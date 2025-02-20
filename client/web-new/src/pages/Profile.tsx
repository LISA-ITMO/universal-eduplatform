import {
  Divider,
  Icon,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FaShareFromSquare } from "react-icons/fa6";
import { UserContext } from "../providers/UserProvider";
import { ProfileCard } from "../components/ProfileCard";
import { API_TESTS } from "../utils/api/apiTests";
import { useUsers } from "../store/users";
import { Box, Button } from "@mui/material";

const Profile = () => {
  const { user } = useUsers();

  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [themes, setThemes] = useState([]);

  const [analytic, setAnalytic] = useState({});

  useEffect(() => {
    createSets();
    console.log("subjects", subjects);
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
            student_id: user.info.id,
            subject_id: subject_id,
          });
        const leadershipResponse = await API_TESTS.results.getLeadershipCourse({
          student_id: user.info.id,
          subject_id: subject_id,
        });

        const analyticity = analyticityResponse.data;
        const leadership = leadershipResponse.data;

        Analytic[s] = { analyticity: analyticity, leadership: leadership };
      });

      Promise.all(promises)
        .then(() => {
          setAnalytic(Analytic);
          console.log("Analytic", analytic);
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
        console.log("LOAD RES-", res.data);
        setResults(res.data);
      })
      .catch((error) => {
        console.error("Failed to load results:", error);
      });
  };

  const createSets = () => {
    setSubjects(Array.from(new Set(Array.from(results.map((r) => r.subject)))));
    setThemes(Array.from(new Set(Array.from(results.map((r) => r.theme)))));
    console.log(subjects);
    console.log(themes);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <ProfileCard />

        <Box sx={{ fontSize: 22, fontWeight: "600" }}>
          ЦИФРОВОЕ ПОРТФОЛИО СТУДЕНТА
        </Box>
        {subjects?.length && (
          <>
            {subjects.map((subject, index) => {
              return (
                <React.Fragment key={index}>
                  <Box
                    border={"1px solid gray"}
                    width={"fit-content"}
                    padding={3}
                  >
                    <Text
                      marginRight={5}
                      fontSize={22}
                      borderBottom={"1px solid black"}
                    >
                      По курсу <strong>{subject}</strong>:
                    </Text>

                    <Text fontWeight={800} fontSize={20} color={"blue"}>
                      АНАЛИТИЧНОСТЬ
                    </Text>
                    <Text color={"green"} fontSize={20} fontWeight={600}>
                      {analytic[subject]
                        ? analytic[subject].analyticity
                        : "loading"}
                    </Text>

                    <Text fontWeight={800} fontSize={20} color={"orange"}>
                      КРЕАТИВНОСТЬ
                    </Text>
                    <Text color={"green"} fontSize={20} fontWeight={600}>
                      {analytic[subject]
                        ? analytic[subject].leadership
                        : "loading"}
                    </Text>
                  </Box>
                  <Divider marginBottom={5} color={"black"} />
                </React.Fragment>
              );
            })}
          </>
        )}

        <Button onClick={handleButton} variant="outlined">
          <Icon as={FaShareFromSquare}></Icon>Загрузить результаты
        </Button>

        {results?.length ? (
          <SimpleGrid columns={2} spacingX="40px" spacingY="20px">
            {results.map((r) => (
              <Box
                key={r.id}
                bg="#F9FAFA"
                height="auto"
                borderRadius={5}
                border={"1px"}
                borderColor={"GrayText"}
              >
                <Stat padding={"5px 15px"}>
                  <StatLabel
                    fontSize={"medium"}
                  >{`ТЕСТ (id: ${r.id})`}</StatLabel>
                  <StatLabel
                    fontSize={"medium"}
                  >{`Предмет: ${r.subject}`}</StatLabel>
                  <StatLabel
                    fontSize={"medium"}
                  >{`Тема: ${r.theme}`}</StatLabel>

                  <Divider borderColor={"grey"} />
                  <StatNumber>POINTS: {r.points_user}</StatNumber>
                  <StatHelpText>
                    Всего вопросов: {r.solutions.length}
                  </StatHelpText>
                  <StatHelpText>Date</StatHelpText>
                </Stat>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text align={"center"} fontWeight={"600"} marginTop={5}>
            Пока нет результатов
          </Text>
        )}
      </Box>
    </>
  );
};

export default Profile;
