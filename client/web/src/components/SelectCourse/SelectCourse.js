import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Select,
    Tooltip,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import {API_SUBJECTS} from '@utils/api/apiSubjects';
import {API_TESTS} from '@utils/api/apiTests';


const SelectCourse = ({path, goToText, isSolution}) => {
    const bgButton = useColorModeValue('gray.200', 'gray.700');
    const [subject, setSubject] = useState('');
    const [theme, setTheme] = useState('');
    const [test, setTest] = useState('');

    const [subjects, setSubjects] = useState([]);
    const [themes, setThemes] = useState([]);
    const [tests, setTests] = useState([]);

    const navigate = useNavigate();

    const toastIdRef = React.useRef();

    const toast = useToast({
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
    });

    const loadSubjectList = () => {
        toastIdRef.current = toast({ description: 'Загрузка списка предметов', status: 'loading'});
        API_SUBJECTS.subjects.list()
            .then((res) => {
                setSubjects(res.data);
                toast.update(toastIdRef.current, { description: 'Список предметов загружен', status: 'success'})
            })
            .catch(() => {
                toast.update(toastIdRef.current, { description: 'Список предметов не удалось загрузить', status: 'error'})
            })
    }

    const loadThemeList = () => {
        toastIdRef.current = toast({ description: `Загрузка списка тем по предмету: '${subjects.find((item) => item?.id == subject)?.name_subject}'`, status: 'loading'});
        API_SUBJECTS.themes.getBySubjectId({id:subject})
            .then((res) => {
                setThemes(res.data);
                toast.update(toastIdRef.current, { description: `Список тем по предмету: '${subjects.find((item) => item?.id == subject)?.name_subject}' загружен`, status: 'success'})
            })
            .catch(() => {
                toast.update(toastIdRef.current, { description: `Не удалось загрузить список тем по предмету: '${subjects.find((item) => item?.id == subject)?.name_subject}'`, status: 'error'})
            })
    }

    const loadTestList = () => {
        toastIdRef.current = toast({ description: `Загрузка тестов`, status: 'loading'});
        API_TESTS.tests.list({subjectId: subject, themeId: theme})
            .then((res) => {
                setTests(res.data);
                toast.update(toastIdRef.current, { description: `Список тестов загружен`, status: 'success'})
            })
            .catch(() => {
                toast.update(toastIdRef.current, { description: `Не удалось загрузить список тестов`, status: 'error'})
            })
    }

    useEffect(() => {
        loadSubjectList();
    }, [])

    useEffect(() => {
        if (subject !== '')
            loadThemeList();
    }, [subject])

    useEffect(() => {
        if (isSolution && theme !== '')
            loadTestList();
    }, [theme])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSolution)
            navigate(`/${path}/${subject}/${theme}/${test}`)
        else
            navigate(`/${path}/${subject}/${theme}`)
    }

    return (
        <Box w={'100%'}>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel ml="5px" whiteSpace={'nowrap'}>Предмет</FormLabel>
                    <Select value={subject} onChange={(e) => setSubject(e.target.value)}
                            placeholder={'Выберите предмет'} bg={bgButton} w={'100%'} maxW={'350px'} mr={'25px'}>
                        {subjects?.map((item) => <option key={`key-subject-${item?.id}`} value={item?.id}>{item?.name_subject}</option>)}
                    </Select>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel ml="5px" mt={'20px'} whiteSpace={'nowrap'}>Тема</FormLabel>
                    <Select value={theme} onChange={(e) => setTheme(e.target.value)} placeholder={'Выберите тему'}
                            bg={bgButton} w={'100%'} maxW={'350px'} mr={'25px'}>
                        {themes.map((item) => {
                            return <option style={{color: 'black'}} key={`option-theme-${item?.id}`} value={item?.id}>{item?.name_theme}</option>
                        })}
                    </Select>
                </FormControl>

                {isSolution && <FormControl isRequired>
                    <FormLabel ml="5px" mt={'20px'} whiteSpace={'nowrap'}>Тест</FormLabel>
                    <Select value={test} onChange={(e) => setTest(e.target.value)} placeholder={'Выберите тест'}
                            bg={bgButton} w={'100%'} maxW={'350px'} mr={'25px'}>
                        {tests.map((item) => {
                            return <option style={{color: 'black'}} key={`option-test-${item?.id}`} value={item?.id}>id: {item?.id}, автор: {item?.author_id}, эксперт: {item?.expert_id}, решено {item?.times_solved} раз</option>
                        })}
                    </Select>
                </FormControl>}


                <Flex w={'100%'} mt={'70px'} justifyContent={'center'} alignItems={'center'}>
                    <Button bg={bgButton} type={'submit'} isDisabled={subject === '' && theme === ''} w={'100%'} maxW={'300px'}>
                        {goToText}
                    </Button>
                </Flex>
            </form>
        </Box>);
};

export default SelectCourse;