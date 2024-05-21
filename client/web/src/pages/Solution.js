import React, {useEffect, useState} from 'react';
import {Flex, useColorModeValue, VStack} from '@chakra-ui/react';
import {useLocation, useParams} from 'react-router-dom';
import SelectCourse from '@components/SelectCourse/SelectCourse';
import CreationTest from '@components/Test/CreationTest';
import {API_SUBJECTS} from '@utils/api/apiSubjects';
import SolutionTest from '@components/Test/SolutionTest';
import ResultTest from '@components/Test/ResultTest';
import SolutionTest2 from '@app/components/Test/SolutionTest2';


const Creation = () => {
    const bg = useColorModeValue('gray.100', 'gray.900');

    const [subjectName, setSubjectName] = useState('');
    const [themeName, setThemeName] = useState('');
    const [countCorrect, setCountCorrect] = useState(0);
    const location = useLocation();
    const {pathname} = location;


    // const [subjects, setSubjects] = ([]);
    // const [themes, setThemes] = ([]);

    const { subjectId, themeId, testId, points } = useParams();

    useEffect(() => {
        if (subjectId !== undefined && themeId !== undefined) {
            API_SUBJECTS.subjects.get({id: subjectId})
                .then((res) => {
                    setSubjectName(res.data[0].name_subject);
                })
                .catch(() => {
                    setSubjectName(subjectId);
                })

            API_SUBJECTS.themes.get({id: themeId})
                .then((res) => {
                    setThemeName(res.data[0].name_theme);
                })
                .catch(() => {
                    setThemeName(themeId);
                })
        }

    }, [subjectId, themeId])

    return (
        <Flex position={'relative'} zIndex={105} w={'100%'} minH={'100vh'} p={'20px 10px 30px 10px'} justifyContent={'center'} overflowY={'hidden'} alignItems={'center'}>
            <VStack overflowY={'visible'} alignItems={'flex-start'} minH={'350px'} maxW={'800px'} w={'100%'} p={'20px'} bg={bg}
                    spacing={'20px'}>
                {((subjectId === undefined || themeId === undefined || testId === undefined) && !pathname.includes('result')) && <SelectCourse path={'solution'} isSolution={true} goToText={'Перейти к решению теста'} />}
                {(subjectId !== undefined && themeId !== undefined && testId !== undefined && !pathname.includes('result')) && <SolutionTest2 subjectName={subjectName} themeName={themeName} setCountCorrect={setCountCorrect} subjectId={subjectId} themeId={themeId} testId={testId} />}
                {pathname.includes('result') && <ResultTest countCorrect={countCorrect} />}
                {/* <ResultTest countCorrect={countCorrect} /> */}

            </VStack>
        </Flex>);
};

export default Creation;