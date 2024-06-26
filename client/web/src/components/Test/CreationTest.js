import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  RadioGroup,
  Stack,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { COUNT_QUESTION } from "@utils/common";
import { API_TESTS } from "@utils/api/apiTests";
import { UserContext } from "@app/providers/UserProvider";

const COUNT_VARIANTS = 5;



// TODO: array and count variants value

const Variants = ({ variants, setVariants }) => {
  const bgInput = useColorModeValue("gray.200", "gray.800");
  const borderColor = useColorModeValue("gray.400", "gray.600");

  const answers = () => {
    const variantsRender = [];

    for (let i = 0; i < COUNT_VARIANTS; i++) {
      variantsRender.push(
        <Stack mt={"15px"} key={`question-subject-theme-${i}`} direction="row">
          <Radio borderColor={borderColor} value={`${i}`} />
          <Input
            bg={bgInput}
            placeholder="Вариант ответа"
            value={variants[i]}
            onChange={(e) =>
              setVariants((prev) => {
                return { ...prev, [i]: e.target.value };
              })
            }
          />
        </Stack>
      );
    }

    return variantsRender;
  };
  return (
    <Box>
      <FormControl isRequired>
        <FormLabel mb={"2px"}>Варианты ответов</FormLabel>
        {answers()}
      </FormControl>
    </Box>
  );
};

// const tt = {''}

let questions = [];
let answers = [];

const CreationTest = ({ subjectId, subjectName, themeId, themeName }) => {
  const bgButton = useColorModeValue("gray.200", "gray.700");
  const bgInput = useColorModeValue("gray.200", "gray.800");
  // const [questions, setQuestions] = useState([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [problem, setProblem] = useState("");
  const [variants, setVariants] = useState({});
  const [rightAnswer, setRightAnswer] = useState("-1");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const toastIdRef = React.useRef();

  const toast = useToast({
    position: "bottom-right",
    duration: 5000,
    isClosable: true,
  });

  useEffect(() => {
    questions = [];
    answers = [];
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCount < COUNT_QUESTION - 1) {
      setCurrentCount((prev) => ++prev);
      
      questions.push({
        question_text: problem,
        answers: Object.values(variants).map((item) => ({
          answer_text: item,
        //   correct_answer: Object.values(variants)[rightAnswer]
        is_correct: (item === Object.values(variants)[rightAnswer]) ? true : false
        })),
        addition_info: info,
        question_points: 0
      });
      

      setProblem("");
      setVariants({
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
      });
      setRightAnswer("-1");
      setInfo("");
    } else {

      if (currentCount == COUNT_QUESTION - 1) {
        setCurrentCount((prev) => ++prev);
        // questions.push({
        //   question_text: problem,
        //   answers: Object.values(variants).map((item) => ({
        //     answer_text: item,
        //   })),
        //   correct_answer: Object.values(variants)[rightAnswer],
        //   addition_info: info,
        // });
        questions.push({
            question_text: problem,
            answers: Object.values(variants).map((item) => ({
              answer_text: item,
            //   correct_answer: Object.values(variants)[rightAnswer]
            is_correct: (item === Object.values(variants)[rightAnswer]) ? true : false
            })),
            addition_info: info,
            question_points: 0
          });
      }

      toastIdRef.current = toast({
        description: "Идет сохранение теста в системе, пожалуйста, подождите",
        status: "loading",
      });

      API_TESTS.tests
        .add({
          authorId: user.info.id,
          questions: questions,
          subjectId: subjectId,
          themeId: themeId,
        })
        .then(() => {
          setProblem("");
          setVariants({
            0: "",
            1: "",
            2: "",
            3: "",
            4: "",
          });
          setRightAnswer("-1");
          setInfo("");
          questions = [];
          answers = [];
          setCurrentCount(0);
          toast.update(toastIdRef.current, {
            description: "Тест успешно сохранен в системе",
            status: "success",
          });
          navigate("/creation");
        })
        .catch(() => {
          toast.update(toastIdRef.current, {
            description:
              "Не удалось сохранить тест в системе, пожалуйста, попробуйте снова",
            status: "error",
          });
        });
    }
  };

  return (
    <Box w={"100%"}>
      <form onSubmit={handleSubmit}>
        <Text>
          Составление теста по предмету '{subjectName}' на тему '{themeName}'
          вопрос{" "}
          {`${currentCount < COUNT_QUESTION ? currentCount + 1 : currentCount}`}
        </Text>
        <FormControl isRequired mt={"15px"}>
          <FormLabel mb={"2px"}>Вопрос</FormLabel>
          <Input
            bg={bgInput}
            placeholder="Введите вопрос"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </FormControl>
        <RadioGroup mt={"40px"} value={rightAnswer} onChange={setRightAnswer}>
          <Variants variants={variants} setVariants={setVariants} />
        </RadioGroup>
        <FormControl isRequired mt={"30px"}>
          <FormLabel mb={"2px"}>Дополнительная информация:</FormLabel>
          <Textarea
            bg={bgInput}
            placeholder="Введите дополнительную информацию"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
        </FormControl>
        <Flex
          w={"100%"}
          mt={"50px"}
          mb={"35px"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Button
            noOfLines={1}
            overflowX={"hidden"}
            bg={bgButton}
            type={"submit"}
            w={"100%"}
            maxW={"300px"}
          >
            {currentCount < COUNT_QUESTION - 1
              ? "Следующий вопрос"
              : "Создать тест"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default CreationTest;
