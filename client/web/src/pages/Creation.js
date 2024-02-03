import React, {useEffect} from 'react';
import {Flex, useColorModeValue, VStack} from '@chakra-ui/react';
import {useParams} from 'react-router-dom';
import SelectCourse from '@components/CreationTest/SelectCourse';
import CreationTest from '@components/CreationTest/CreationTest';
import {API_SUBJECTS} from '@utils/api/apiSubjects';


const subjects = [{id: 1, name: 'Свободный предмет'}]
const themes = [{id: 1, name: 'Свободная тема'}]


const Creation = () => {
    const bg = useColorModeValue('gray.100', 'gray.900');

    // const [subjects, setSubjects] = ([]);
    // const [themes, setThemes] = ([]);

    useEffect(() => {

        API_SUBJECTS.subjects.list()
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {

            })
    },[]);

    const { subjectId, themeId } = useParams();

    return (
        <Flex position={'relative'} zIndex={105} w={'100%'} minH={'100vh'} maxH={'100vh'} p={'60px 10px 30px 0'} justifyContent={'center'} alignItems={'center'}>
            <VStack overflowY={'auto'} alignItems={'flex-start'} minH={'350px'} maxW={'800px'} w={'100%'} minW={'400px'} p={'20px'} bg={bg} maxH={'100%'}
                    spacing={'20px'}>
                {subjectId === undefined && themeId === undefined && <SelectCourse subjects={subjects} themes={themes} />}
                {subjectId !== undefined && themeId !== undefined && <CreationTest subjectName={'Свободный предмет'} themeName={'Свободная тема'} subjectId={subjectId} themeId={themeId} />}

            </VStack>
        </Flex>);
};

export default Creation;