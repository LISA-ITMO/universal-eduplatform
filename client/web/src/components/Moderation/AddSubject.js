import React, {useState} from 'react';
import {Button, FormControl, FormErrorMessage, FormLabel, Input, Select, useToast, VStack} from '@chakra-ui/react';
import {API_SUBJECTS} from '@utils/api/apiSubjects';

const AddSubject = () => {
    const [subject, setSubject] = useState('');

    const toast = useToast({
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        API_SUBJECTS.subjects.add({subject})
            .then((res) => {
                toast({ title: `Предмет ${subject} успешно создан`, status: 'success' });
                setSubject('');
            })
            .catch((err) => {
                toast({title: `Предмет ${subject} не удалось создать, пожалуйста попробуйте позже`, status: 'error'})
            })
    }

    return (
        <form onSubmit={handleSubmit}>
        <VStack mt={'20px'} mx={'auto'} w={'500px'} spacing={'25px'}>
            <FormControl isRequired>
                <FormLabel>Название нового предмета:</FormLabel>
                <Input

                    placeholder="Введите название нового предмета"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                />
            </FormControl>

            <Button colorScheme={'green'} type={'submit'}>
                Создать предмет
            </Button>
        </VStack>
        </form>
    );
};

export default AddSubject;