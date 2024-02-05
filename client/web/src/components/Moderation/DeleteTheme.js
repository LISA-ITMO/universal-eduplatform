import React, {useEffect, useState} from 'react';
import {Button, FormControl, FormLabel, Input, Select, useToast, VStack} from '@chakra-ui/react';
import {API_SUBJECTS} from '@utils/api/apiSubjects';

const DeleteTheme = () => {
    const [subjectId, setSubjectId] = useState('');
    const [themeId, setThemeId] = useState('');

    const [subjects, setSubjects] = useState([]);
    const [themes, setThemes] = useState([]);
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
        toastIdRef.current = toast({ description: `Загрузка списка тем по предмету: '${subjects.find((item) => item?.id == subjectId)?.name_subject}'`, status: 'loading'});
        API_SUBJECTS.themes.getBySubjectId({id:subjectId})
            .then((res) => {
                setThemes(res.data);
                toast.update(toastIdRef.current, { description: `Список тем по предмету: '${subjects.find((item) => item?.id == subjectId)?.name_subject}' загружен`, status: 'success'})
            })
            .catch(() => {
                toast.update(toastIdRef.current, { description: `Не удалось загрузить список тем по предмету: '${subjects.find((item) => item?.id == subjectId)?.name_subject}'`, status: 'error'})
            })
    }

    useEffect(() => {
        loadSubjectList();
    }, [])

    useEffect(() => {
        if (subjectId !== '')
            loadThemeList();
    }, [subjectId])

    const handleSubmit = (e) => {
        e.preventDefault();

        API_SUBJECTS.themes.delete({id: themeId})
            .then((res) => {
                toast({ title: `По предмету '${subjects.find((item) => item?.id == subjectId)?.name_subject}' удалена тема: '${themes.find((item) => item?.id == themeId)?.name_theme}'`, status: 'success' });
                setThemeId('');
                loadThemeList();
            })
            .catch(() => {
                toast({title: `По предмету '${subjects.find((item) => item?.id == subjectId)?.name_subject}' не удалось удалить тему '${themes.find((item) => item?.id == themeId)?.name_theme}', пожалуйста попробуйте позже`, status: 'error'})
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
                    <FormLabel>Тема:</FormLabel>
                    <Select
                        placeholder="Выберите тему"
                        color={themeId === '' ? 'gray' : 'black'}
                        value={themeId}
                        onChange={e => setThemeId(e.target.value)}
                    >
                        {themes.map((item) => {
                            return <option style={{color: 'black'}} key={`option-game-${item?.id}`} value={item?.id}>{item?.name_theme}</option>
                        })}
                    </Select>
                </FormControl>

                <Button colorScheme={'red'} type={'submit'}>
                    Удалить тему
                </Button>
            </VStack>
        </form>
    );
};

export default DeleteTheme;