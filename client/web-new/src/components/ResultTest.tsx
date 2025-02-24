import {Box, Button, Flex, Text, useColorModeValue} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import { COUNT_QUESTION } from '../utils/common';

const ResultTest = ({countCorrect}) => {
    const bgButton = useColorModeValue('gray.200', 'gray.700');
    const bgInput = useColorModeValue('gray.200', 'gray.800');

    const navigate = useNavigate();

    return (
        <Box w={'100%'}>
            <Text mt={'80px'} fontSize={'32px'} textAlign={'center'} w={'500'}>{(countCorrect > 0) ? 'Поздравляем!' : 'В следующий раз повезет!'} Верно решено {countCorrect}/{COUNT_QUESTION}</Text>
            <Flex w={'100%'} mt={'70px'} justifyContent={'center'} alignItems={'center'}>
                <Button noOfLines={1} overflowX={'hidden'} bg={bgButton} onClick={() => {navigate('/solution')}} w={'300px'}>
                    Перейти к выбору теста
                </Button>
            </Flex>
        </Box>
    );
};

export default ResultTest;