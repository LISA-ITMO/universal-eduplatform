import { API_TESTS } from "@app/utils/api/apiTests";
import {
  Button,
  ButtonGroup,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import ResultTest from "./ResultTest";
import { UserContext } from "@app/providers/UserProvider";

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
  const { user } = useContext(UserContext);

  useEffect(() => {
    API_TESTS.tests
      .get({ id: testId })
      .then((res) => {
        console.log("Res from getTest", res.data);
        setQuestions(res.data.questions);
        setQuestionCount(res.data.questions.length);
      })
      .catch((e) => {
        console.log("err-", e);
      });
  }, []);

  useEffect(() => {
    console.log("done!", done);
    if (done) {
      API_TESTS.results.grade({
        userId: user.info.id,
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

    console.log("Form submitting");
    console.log("value:", value);
    console.log("question:", questionId);

    // if (qNumber === questionCount - 1) {
    //     setIsLastQuestion(true)
    // }

    API_TESTS.tests
      .getQuestionAnswer({ id: questionId })
      .then((res) => {
        console.log("Question answer", res.data);

        const solution = {
          id_question: questionId,
          user_answer: res.data[0].answer_text,
        };
        solutions.push(solution);

        if (value == res.data[0].id) {
          setMatch((prev) => ++prev);
        }

        console.log("match", match);

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

  return (
    <>
      {questions &&
        (!done ? (
          <form onSubmit={formSubmit}>
            <RadioGroup onChange={setValue} value={value}>
              <Stack direction="column">
                {questions[qNumber]?.answers.map((a) => (
                  <Radio key={a.id} value={String(a.id)} isRequired={true}>
                    {a.answer_text}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            {/* <button>Next question</button> */}
            {/* {!isLastQuestion && (
            <Button type={"submit"} colorScheme="blue">
              Next question
            </Button>
          )} */}

            <Button
              type={"submit"}
              colorScheme={!isLastQuestion ? "blue" : "green"}
              isDisabled={value === -1}
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
