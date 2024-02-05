import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Text,
    Textarea,
    useColorModeValue, RadioGroup, Stack, Radio, useToast
} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import {COUNT_QUESTION} from '@utils/common';
import {API_TESTS} from '@utils/api/apiTests';

const COUNT_VARIANTS = 5;
const TIME_FOR_QUESTION = 60;


const Variants = ({variants, isShowAnswer}) => {
    const borderColor = useColorModeValue('gray.400', 'gray.600');


    const answers = () => {
        const variantsRender = [];

        for (let i = 0; i < COUNT_VARIANTS ;i++) {
            variantsRender.push(
                <Stack mt={'15px'} alignItems={'center'} key={`question-subject-theme-${i}`} direction='row'>
                    <Radio isReadOnly={isShowAnswer} borderColor={borderColor} value={`${i}`} />
                    <Text fontSize={'20px'}>
                        {variants[i]?.answer_text}
                    </Text>
                </Stack>);
        }

        return variantsRender;
    }
    return (
        <Box>
            <FormControl isRequired>
                <FormLabel fontWeight={'600'} fontSize={'18px'} mb={'2px'}>Выберите правильный вариант ответа</FormLabel>
                {answers()}
            </FormControl>
        </Box>
    )

}

// const tt = {''}

let answers = [];
let test = {};

const SolutionTest = ({subjectId, subjectName, themeId, themeName, testId, setCountCorrect}) => {
    const bgButton = useColorModeValue('gray.200', 'gray.700');
    const bgInput = useColorModeValue('gray.200', 'gray.800');
    // const [questions, setQuestions] = useState([]);
    // const [test, setTest] = useState({});
    const [currentTime, setCurrentTime] = useState(0);
    const [isTimeIsUp, setIsIsTimeIsUp] = useState(false);
    const [isGetAnswer, setIsGetAnswer] = useState(false);
    const [currentCount, setCurrentCount] = useState(0);
    const [problem, setProblem] = useState('');
    const [variants, setVariants] = useState({});
    const [rightAnswers, setRightAnswers] = useState([]);
    const [rightAnswer, setRightAnswer] = useState('-1');
    const [info, setInfo] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();

    const toastIdRef = React.useRef();

    const toast = useToast({
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
    });

    const loadTest = () => {
        toastIdRef.current = toast({ description: 'Идет загрузка теста, пожалуйста, подождите', status: 'loading'});

        return API_TESTS.tests.get({id: testId})
            .then((res) => {
                test = res.data;
                setQuestion(0);
                toast.update(toastIdRef.current, { description: 'Тест загружен', status: 'success'})
            })
            .catch(() => {
                toast.update(toastIdRef.current, { description: 'Не удалось загрузить тест, пожалуйста, попробуйте снова', status: 'error'})
            })
    }

    const loadRightAnswer = () => {
        API_TESTS.tests.getAnswers({id: testId})
            .then((res) => {
                setRightAnswers(res.data?.map((item) => item?.correct_answer))
                for (let i = 0; i < res.data?.length; i++) {
                    test.questions[i].question_id = res.data[i].question_id;
                }
            })
            .catch(() => {})
    }

    const setTimerToEnd = () => {

    };

    const setQuestion = (count) => {
        setProblem(test?.questions[count]?.question_text);
        setVariants(test?.questions[count]?.answers);
        setInfo(test?.questions[count]?.addition_info);
        setRightAnswer('-1');
        setIsGetAnswer(false);
        setIsIsTimeIsUp(false);
    }

    useEffect( () => {
        answers = [];
        test = {};
        setCountCorrect(0);
        loadTest().then(() => {
            loadRightAnswer();
        })

    }, [])

    useEffect(() => {
        if (currentCount !== 0)
            setQuestion(currentCount);
    }, [currentCount])

    const handleNextQuestion = () => {
        if (currentCount < COUNT_QUESTION-1) {
            setCurrentCount((prev) => ++prev);
        }
        else {
            toastIdRef.current = toast({ description: 'Отправляем результаты теста, пожалуйста, подождите', status: 'loading'});

            API_TESTS.results.grade({userId: 1, results: answers, testId: testId})
                .then(() => {
                    toast.update(toastIdRef.current, { description: 'Результаты сохранены', status: 'success'});
                    navigate(`/solution/${subjectId}/${themeId}/${testId}/result`);
                })
                .catch(() => {
                    toast.update(toastIdRef.current, { description: 'Не удалось сохранить результаты, пожалуйста, попробуйте снова', status: 'error'})
                })
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        answers.push({question_id: test.questions[currentCount].question_id, answer: variants?.[rightAnswer]?.answer_text});
        if (variants?.[rightAnswer]?.answer_text === rightAnswers[currentCount])
            setCountCorrect((prev) => ++prev);
        setIsGetAnswer(true);


        // if (currentCount < COUNT_QUESTION-1) {
        //     setCurrentCount(prev => ++prev);
        //     questions.push({'question_text': problem, 'answers': Object.values(variants).map((item) => ({'answer_text': item})), 'correct_answer': Object.values(variants)[rightAnswer], 'addition_info': info})
        //     setProblem('');
        //     setVariants({
        //         0: '',
        //         1: '',
        //         2: '',
        //         3: '',
        //         4: '',
        //     });
        //     setRightAnswer('-1');
        //     setInfo('');
        // }
        // else {
        //
        //     if (currentCount == COUNT_QUESTION-1) {
        //         setCurrentCount(prev => ++prev);
        //         questions.push({'question_text': problem, 'answers': Object.values(variants).map((item) => ({'answer_text': item})), 'correct_answer': Object.values(variants)[rightAnswer], 'addition_info': info})
        //     }
        //
        //     toastIdRef.current = toast({ description: 'Идет сохранение теста в системе, пожалуйста, подождите', status: 'loading'});
        //
        //     API_TESTS.tests.add({authorId: 1, questions: questions, subjectId: subjectId, themeId:themeId})
        //         .then(() => {
        //             setProblem('');
        //             setVariants({
        //                 0: '',
        //                 1: '',
        //                 2: '',
        //                 3: '',
        //                 4: '',
        //             });
        //             setRightAnswer('-1');
        //             setInfo('');
        //             questions = [];
        //             answers = [];
        //             setCurrentCount(0);
        //             toast.update(toastIdRef.current, { description: 'Тест успешно сохранен в системе', status: 'success'})
        //             navigate('/creation');
        //         })
        //         .catch(() => {
        //             toast.update(toastIdRef.current, { description: 'Не удалось сохранить тест в системе, пожалуйста, попробуйте снова', status: 'error'})
        //         })
        // }

    }

    return (
        <Box w={'100%'}>
            <form onSubmit={handleSubmit}>
                <Text fontSize={'18px'}>Решение теста c id: '{testId}' по предмету '{subjectName}' на тему '{themeName}' вопрос {`${currentCount < COUNT_QUESTION ? currentCount+1 : currentCount}`}</Text>
                <Text mt={'10px'} fontSize={'18px'}>Времени осталось на {`${currentCount < COUNT_QUESTION ? currentCount+1 : currentCount}`} вопрос: -1 секунд</Text>
                <FormControl mt={'15px'}>
                    <FormLabel fontWeight={'600'} fontSize={'18px'} mb={'2px'}>Вопрос:</FormLabel>
                    <Text
                        fontSize={'20px'}
                        fontWeight={'400'}
                        // onChange={e => setProblem(e.target.value)}
                    >
                        {problem}
                        </Text>
                </FormControl>
                <RadioGroup mt={'20px'} value={rightAnswer} onChange={setRightAnswer}>
                    <Variants isShowAnswer={isGetAnswer || isTimeIsUp} variants={variants} />
                </RadioGroup>
                {(isGetAnswer || isTimeIsUp) &&
                    <FormControl mt={'30px'}>
                        <FormLabel mb={'2px'}>Дополнительная информация:</FormLabel>
                        <Textarea
                            bg={bgInput}
                            placeholder="Введите дополнительную информацию"
                            value={info}
                            onChange={e => setInfo(e.target.value)}
                        />
                    </FormControl>
                }
                <Flex w={'100%'} mt={'50px'} justifyContent={'center'} alignItems={'center'}>
                    {(!isGetAnswer && !isTimeIsUp) ?
                        <Button bg={bgButton} type={'submit'} w={'100%'} maxW={'300px'}>
                            Записать ответ
                        </Button>
                        :
                        <Button isDisabled={isDisabled} bg={bgButton} onClick={handleNextQuestion} w={'100%'} maxW={'300px'}>
                            {currentCount < COUNT_QUESTION-1 ? 'Следующий вопрос' : 'Получить результат'}
                        </Button>
                    }
                </Flex>
            </form>
        </Box>)
};

export default SolutionTest;