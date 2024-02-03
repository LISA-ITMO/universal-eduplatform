import React from 'react';
import {
    Box,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react';
import AddSubject from '@components/Moderation/AddSubject';
import DeleteSubject from '@components/Moderation/DeleteSubject';
import AddTheme from '@components/Moderation/AddTheme';
import DeleteTheme from '@components/Moderation/DeleteTheme';

const Moderation = () => {
    return (
        <Box w={'100%'} minH={'100vh'} maxH={'100vh'}>
            <Tabs mt={'1px'} size='md' isFitted variant='enclosed' isLazy>
                <TabList>
                    <Tab>Создать предмет</Tab>
                    <Tab borderRight={'0.5px solid #3F444E'} borderTopRightRadius={'0px'}>Удалить предмет</Tab>
                    <Tab borderLeft={'0.5px solid #3F444E'} borderTopLeftRadius={'0px'}>Добавить тему</Tab>
                    <Tab>Удалить тему</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <AddSubject />
                    </TabPanel>
                    <TabPanel>
                        <DeleteSubject />
                    </TabPanel>
                    <TabPanel>
                        <AddTheme />
                    </TabPanel>
                    <TabPanel>
                        <DeleteTheme />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default Moderation;