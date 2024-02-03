import React, {useState} from 'react';
import {Box, Button, Flex, FormControl, FormLabel, Select, Tooltip, useColorModeValue} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';


const SelectCourse = ({subjects, themes}) => {
    const bgButton = useColorModeValue('gray.200', 'gray.700');
    const [subject, setSubject] = useState('');
    const [theme, setTheme] = useState('');

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate(`/creation/${subject}/${theme}`)
    }

    return (
        <Box w={'100%'}>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel ml="5px" whiteSpace={'nowrap'}>Предмет</FormLabel>
                    <Select value={subject} onChange={(e) => setSubject(e.target.value)}
                            placeholder={'Выберите предмет'} bg={bgButton} w={'250px'} mr={'25px'}>
                        {subjects.map((item) => <option key={`key-model-${item}`} value={item.id}>{item.name}</option>)}
                    </Select>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel ml="5px" whiteSpace={'nowrap'}>Тема</FormLabel>
                    <Select value={theme} onChange={(e) => setTheme(e.target.value)} placeholder={'Выберите тему'}
                            bg={bgButton} w={'250px'} mr={'25px'}>
                        {themes.map((item) => <option key={`key-model-${item}`} value={item.id}>{item.name}</option>)}
                    </Select>
                </FormControl>

                <Flex w={'100%'} mt={'70px'} justifyContent={'center'} alignItems={'center'}>
                    <Button bg={bgButton} type={'submit'} isDisabled={subject === '' && theme === ''} w={'300px'}>
                        Перейти к созданию теста
                    </Button>
                </Flex>
            </form>
        </Box>);
};

export default SelectCourse;