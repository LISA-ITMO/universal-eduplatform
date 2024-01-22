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
    useColorModeValue, RadioGroup, Stack, Radio
} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import {COUNT_QUESTION} from '@utils/common';
import {API_TESTS} from '@utils/api/apiTests';

const COUNT_VARIANTS = 5;

// TODO: array and count variants value

const Variants = ({variants, setVariants}) => {
        const bgInput = useColorModeValue('gray.200', 'gray.800');

       const answers = () => {
            const variantsRender = [];

           for (let i = 0; i < COUNT_VARIANTS ;i++) {
                variantsRender.push(
                    <Stack mt={'15px'} key={`question-subject-theme-${i}`} direction='row'>
                        <Radio value={`${i}`} />
                    <Input
                        bg={bgInput}
                        placeholder="Вариант ответа"
                        value={variants[i]}
                        onChange={e => setVariants((prev) => {
                            return {...prev, [i]:e.target.value}
                        })}
                    />
                    </Stack>);
            }

            return variantsRender;
        }
    return (
        <Box>
            <FormControl isRequired>
                <FormLabel mb={'2px'}>Варианты ответов</FormLabel>
                    {answers()}
                </FormControl>
        </Box>
    )

}

// const tt = {''}

let questions = [];

const CreationTest = ({subjectId, subjectName, themeId, themeName}) => {
    const bgButton = useColorModeValue('gray.200', 'gray.700');
    const bgInput = useColorModeValue('gray.200', 'gray.800');
    // const [questions, setQuestions] = useState([]);
    const [currentCount, setCurrentCount] = useState(0);
    const [problem, setProblem] = useState('');
    const [variants, setVariants] = useState({});
    const [rightAnswer, setRightAnswer] = useState('-1');
    const [info, setInfo] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        questions = [];
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentCount < COUNT_QUESTION-1) {
            setCurrentCount(prev => ++prev);
            questions.push({'question_text': problem, 'answers': Object.values(variants), 'correct_answer': Object.values(variants)[rightAnswer], 'addition_info': info})
        }
        else {

            questions.push({'question_text': problem, 'answers': Object.values(variants), 'correct_answer': Object.values(variants)[rightAnswer], 'addition_info': info})

            API_TESTS.tests.add({authorId: 1, questions: questions, subjectId: subjectId, themeId:themeId, expertId: 1}).then(() => {
                navigate(`/creation/${subjectId}/${themeId}`);
            }).catch(() => {
                navigate(`/creation/${subjectId}/${themeId}`);
            })
        }
        setProblem('');
        setVariants({
            0: '',
            1: '',
            2: '',
            3: '',
            4: '',
        });
        setRightAnswer('-1');
        setInfo('');

    }

    return (
        <Box w={'100%'}>
            <form onSubmit={handleSubmit}>
                <Text>Составление теста по предмету "Свободный предмет" на тему "Свободная тема" вопрос {`${currentCount+1}`}</Text>
                <FormControl isRequired mt={'15px'}>
                    <FormLabel mb={'2px'}>Вопрос</FormLabel>
                    <Input
                        bg={bgInput}
                        placeholder="Введите вопрос"
                        value={problem}
                        onChange={e => setProblem(e.target.value)}
                    />
                </FormControl>
                <RadioGroup mt={'40px'} value={rightAnswer} onChange={setRightAnswer}>
                    <Variants variants={variants} setVariants={setVariants} />
                </RadioGroup>
                <FormControl isRequired mt={'30px'}>
                    <FormLabel mb={'2px'}>Дополнительная информация:</FormLabel>
                    <Textarea
                        bg={bgInput}
                        placeholder="Введите дополнительную информацию"
                        value={info}
                        onChange={e => setInfo(e.target.value)}
                    />
                </FormControl>
            <Flex w={'100%'} mt={'70px'} justifyContent={'center'} alignItems={'center'}>
                <Button bg={bgButton} type={'submit'} w={'300px'}>
                    {currentCount < COUNT_QUESTION-1 ? 'Следующий вопрос' : 'Создать тест'}
                </Button>
            </Flex>
            </form>
        </Box>)
};

export default CreationTest;