import { Button, Stack, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import ResultTest from "./ResultTest";
import { UserContext } from "../providers/UserProvider";
import { API_TESTS } from "../utils/api/apiTests";
import { useUsers } from "../store/users";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const SolutionTest2 = ({
  subjectName,
  themeName,
  setCountCorrect,
  subjectId,
  themeId,
  testId,
}) => {
  const [questions, setQuestions] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [value, setValue] = useState(-1);
  const [disabledBtn, setDisablesBtn] = useState(false);
  const [qNumber, setQNumber] = useState(0);
  const [match, setMatch] = useState(0);
  const [done, setDone] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const { user } = useUsers();

  useEffect(() => {
    if (user) {
      API_TESTS.tests
        .get({ id: testId })
        .then((res) => {
          setQuestions(res.data.questions);
          setQuestionCount(res.data.questions.length);
          console.log(res);
        })
        .catch((e) => {
          console.log("err-", e);
        });
    } else console.log("NOT AUTH");
  }, []);

  useEffect(() => {
    if (done) {
      API_TESTS.results.grade({
        userId: user?.id,
        testId,
        subject: subjectName,
        theme: themeName,
        results: solutions,
        points: match,
      });
    }
  }, [done]);

  useEffect(() => {
    if (isLastQuestion) {
    }
  }, [isLastQuestion]);

  const formSubmit = (e) => {
    e.preventDefault();
    const questionId = questions[qNumber].id;
    console.log(value);
    console.log(
      "ANSW: ",
      questions[qNumber].answers.find((a) => a.id == value).answer_text
    );
    API_TESTS.tests
      .getQuestionAnswer({ id: questionId })
      .then((res) => {
        console.log(res);
        const solution = {
          id_question: questionId,
          user_answer: questions[qNumber].answers.find((a) => a.id == value)
            .answer_text,
        };
        solutions.push(solution);

        if (value == res.data[0].id) {
          setMatch((prev) => ++prev);
        }

        const currNumber = qNumber + 1;
        setQNumber(currNumber);

        if (currNumber === questionCount - 1) {
          setIsLastQuestion(true);
        }

        if (isLastQuestion) setDone(true);

        setValue(-1);
      })

      .catch((e) => {
        console.error("GET-ANSWER-BY-QUESTION:", e);
      });
  };

  const handleFinishTest = () => {
    console.log("done!", done);
  };

  const handleChange = (e) => {};

  return (
    <>
      {questions &&
        (!done ? (
          <form onSubmit={formSubmit}>
            <FormControl>
              <RadioGroup
                onChange={(e) => setValue(e.target.value)}
                value={value}
              >
                <Stack direction="column" padding={"0 10px"}>
                  <Text
                    fontSize="xl"
                    fontWeight={500}
                    padding={"5px 10px"}
                  >{`Вопрос №${qNumber + 1}`}</Text>
                  <Text
                    fontSize="xl"
                    marginBottom={5}
                    backgroundColor={"lightgrey"}
                    padding={"5px 10px"}
                    borderRadius={20}
                  >
                    {questions[qNumber].question_text}
                  </Text>

                  {questions[qNumber]?.answers.map((a) => (
                    <>
                      <FormControlLabel
                        value={String(a.id)}
                        control={<Radio />}
                        label={a.answer_text}
                      />
                    </>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <Button
              type={"submit"}
              colorScheme={!isLastQuestion ? "blue" : "green"}
              isDisabled={value === -1}
              marginTop={10}
            >
              {!isLastQuestion ? "Next question" : "Get result"}
            </Button>

            {/* {!isLastQuestion ? (
            <Button type="submit" colorScheme="blue">
              Next question
            </Button>
          ) : 
          (
            <Button type="submit" colorScheme="green" isDisabled={value === -1}>
              Get result
            </Button>
              )
        } */}
          </form>
        ) : (
          <ResultTest countCorrect={match} />
        ))}
    </>
  );
};

export default SolutionTest2;
