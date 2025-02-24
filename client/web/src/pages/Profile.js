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

  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState({})
  const [themes, setThemes] = useState({})

  const [analytic, setAnalytic] = useState(null)

  useEffect(() => {
    createSets()
   
   
  }, [results]);

  const handleButton = () => {
    API_TESTS.results
      .getAllResults({ id: user.info.id })
      .then((res) => {
        console.log("LOAD RES-", res.data);
        setResults(res.data);
      })
      .then(() => {
        // setSubjects(new Set(Array.from(results.map(r => r.subject))))
        // setThemes(new Set(Array.from(results.map(r => r.theme))))
        // createSets()
        countAnalyticsCourse()
      })
     
      .catch((err) => console.log(err));
  };

  const createSets = () => {
    setSubjects(Array.from(new Set(Array.from(results.map(r => r.subject)))))
    setThemes(Array.from(new Set(Array.from(results.map(r => r.theme)))))
    console.log(subjects)
    console.log(themes)
  }

  const countAnalyticsCourse = () => {
    for (let s of subjects) {
      let filter_result = results.filter(r => r.subject == s)
      let points = Array.from(filter_result.map(r => r.points_user))
      points.sort(function(a, b) { return a - b; });

      let a
      if (points.length % 2 == 0 ) {
        const m = points.length / 2
        a = ((points[m] + points[m-1]) / 2 ).toFixed(2)
        setAnalytic(a)
      } else {
        const m = Math.floor(points.length / 2)
        a = points[m].toFixed(2)
        setAnalytic(a)
      }


    }
  }

  return (
    <>
      <Flex direction={"column"}>
        <ProfileCard title="ПРОФИЛЬ" user={user.info} />
        <Divider marginBottom={5}/>

        {/* {subjects?.length && (
          <Text fontWeight={800} fontSize={24}>АНАЛИТИЧНОСТЬ</Text>
        )} */}
        
       
        <Text fontWeight={800} fontSize={24} borderBottom={'1px solid gray'} marginBottom={5}>ЦИФРОВОЕ ПОРТФОЛИО СТУДЕНТА</Text>
        {subjects?.length && ( <>
          
          {subjects.map(s => <>
            <Box border={'1px solid gray'} width={'fit-content'} padding={3}>
            <Text marginRight={5} fontSize={22} borderBottom={'1px solid black'} >По курсу <strong>{s}</strong>:</Text>
            
            <Text fontWeight={800} fontSize={18} color={'blue'}>АНАЛИТИЧНОСТЬ</Text>
          <Text color={'green'} fontWeight={600}> {analytic}</Text>
          
          

          <Text fontWeight={800} fontSize={20} color={'orange'}>КРЕАТИВНОСТЬ</Text>
          <Text color={'green'} fontWeight={600}> {0.85}</Text>
            </Box>
            

          <Divider marginBottom={5} color={'black'}/>
          </>)}
        </>
          
        )}


      

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
