import React, {useEffect, useState} from 'react';
import {Button, FormControl, FormLabel, Input, Select, useToast, VStack} from '@chakra-ui/react';
import {API_SUBJECTS} from '@utils/api/apiSubjects';

const AddTheme = () => {
    const [subjectId, setSubjectId] = useState('');
    const [theme, setTheme] = useState('');

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

        API_SUBJECTS.themes.add({subjectId, theme})
            .then((res) => {
                toast({ title: `По предмету ${subjects.find((item) => item?.id == subjectId)?.name_subject} создана новая тема: ${theme}`, status: 'success' });
                setSubjectId('');
                setTheme('');
                // loadSubjectList();
            })
            .catch((err) => {
                toast({title: `Не удалось создать новую тему, пожалуйста попробуйте позже`, status: 'error'})
            })

    }

    return (
        <form onSubmit={handleSubmit}>
            <VStack mt={'20px'} mx={'auto'} w={'500px'} spacing={'25px'}>
                <FormControl isRequired>
                    <FormLabel>Предмет:</FormLabel>
                    <Select
                        placeholder="Выберите предмет"
                        value={subjectId}
                        onChange={e => setSubjectId(e.target.value)}
                    >
                        {subjects.map((item) => {
                            return <option style={{color: 'black'}} key={`option-game-${item?.id}`} value={item?.id}>{item?.name_subject}</option>
                        })}
                    </Select>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Новая тема:</FormLabel>
                    <Input
                        placeholder="Введите название новой темы"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                    />
                </FormControl>

                <Button colorScheme={'green'} type={'submit'}>
                    Добавить тему
                </Button>
            </VStack>
        </form>
    );
};

export default AddTheme;