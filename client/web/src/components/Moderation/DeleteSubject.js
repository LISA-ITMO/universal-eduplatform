import React, {useEffect, useState} from 'react';
import {Button, FormControl, FormLabel, Input, Select, useToast, VStack} from '@chakra-ui/react';
import {API_SUBJECTS} from '@utils/api/apiSubjects';

const DeleteSubject = () => {
    const [id, setId] = useState('')
    const [subjects, setSubjects] = useState([]);
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

    useEffect(() => {
       loadSubjectList();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        API_SUBJECTS.subjects.delete({id})
            .then((res) => {
                toast({ title: `Предмет ${subjects.find((item) => item?.id == id)?.name_subject} удален`, status: 'success' });
                setId('');
                loadSubjectList();
            })
            .catch((err) => {
                toast({title: `Предмет ${subjects.find((item) => item?.id == id)?.name_subject} не удалось удалить, пожалуйста попробуйте позже`, status: 'error'})
            })
    }


    return (
        <form onSubmit={handleSubmit}>
            <VStack mt={'20px'} mx={'auto'} w={'500px'} spacing={'25px'}>
                <FormControl isRequired>
                    <FormLabel>Предмет:</FormLabel>
                    <Select
                        placeholder="Выберите предмет"
                        color={id === '' ? 'gray' : 'black'}
                        value={id}
                        onChange={e => setId(e.target.value)}
                    >
                        {subjects.map((item) => {
                            return <option style={{color: 'black'}} key={`option-game-${item?.id}`} value={item?.id}>{item?.name_subject}</option>
                        })}
                    </Select>
                </FormControl>

                <Button colorScheme={'red'} type={'submit'}>
                    Удалить предмет
                </Button>
            </VStack>
        </form>
    );
};

export default DeleteSubject;