import ProfileCard from "@app/components/Profile/ProfileCard";
import { UserContext } from "@app/providers/UserProvider";
import { API_TESTS } from "@app/utils/api/apiTests";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useConst,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FaShareFromSquare } from "react-icons/fa6";

const Profile = () => {
  const { user } = useContext(UserContext);

  const [results, setResults] = useState();

  useEffect(() => {}, []);

  const handleButton = () => {
    API_TESTS.results
      .getAllResults({ id: user.info.id })
      .then((res) => {
        console.log("LOAD RES-", res.data);
        setResults(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Flex direction={"column"}>
        <ProfileCard title="ПРОФИЛЬ" user={user.info} />
        <Divider marginBottom={5}/>
        <Button onClick={handleButton} variant='outline' colorScheme={"teal"}>
          <Icon as={FaShareFromSquare}></Icon>Загрузить результаты
        </Button>

        {results?.length ? (
          <SimpleGrid columns={2} spacingX="40px" spacingY="20px">
         
            {results.map((r) => (
              <Box key={r.id} bg="#F9FAFA" height="auto" borderRadius={5} border={"1px"} borderColor={"GrayText"}>
                <Stat padding={"5px 15px"} >
                  <StatLabel fontSize={"medium"}>{`ТЕСТ (id: ${r.id})`}</StatLabel>
                  <StatLabel fontSize={"medium"}>{`Предмет: ${r.subject}`}</StatLabel>
                  <StatLabel fontSize={"medium"}>{`Тема: ${r.theme}`}</StatLabel>

                  <Divider borderColor={"grey"}/>
                  <StatNumber>POINTS: {r.points_user}</StatNumber>
                  <StatHelpText>Всего вопросов: {r.solutions.length}</StatHelpText>
                  <StatHelpText>Date</StatHelpText>
                </Stat>
              </Box>
            ))}
          </SimpleGrid>
        )
    : <Text align={"center"} fontWeight={"600"} marginTop={5}>Пока нет результатов</Text>
    }
      </Flex>
    </>
  );
};

export default Profile;
