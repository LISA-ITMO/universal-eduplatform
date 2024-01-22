import React from 'react';
import {Button, Tooltip, useColorModeValue, VStack} from '@chakra-ui/react';
import {AiOutlineSetting, AiOutlineVideoCameraAdd} from 'react-icons/ai';
import {MdOutlineEventNote} from 'react-icons/md';
import {FiPlay} from 'react-icons/fi';
import {HiOutlineDocumentReport} from 'react-icons/hi';
import {VscServerProcess} from 'react-icons/vsc';
import {useLocation, useNavigate} from 'react-router-dom';

const NavPanel = ({isFullPanel}) => {
    const bgButton = useColorModeValue('gray.200', 'gray.700');
    const bgButtonActive = useColorModeValue('blackAlpha.300', 'gray.600');
    const navigate = useNavigate();
    const location = useLocation();
    const {pathname} = location;

    return (
        <VStack w={'100%'} spacing={'10px'}>
            <Tooltip label={'Профиль'}><Button overflow={'hidden'} leftIcon={<AiOutlineSetting style={{height: '20px', width: '20px'}} />} h={'50px'} w={'90%'} bg={pathname === '/' ? bgButtonActive : bgButton} style={pathname === '/' ? {fontWeight: '500'} : {fontWeight: '400'}} onClick={() => {navigate('/')}} justifyContent={'start'}>{isFullPanel&&'Профиль'}</Button></Tooltip>
            <Tooltip label={'Предметы/эксперты'}><Button overflow={'hidden'} leftIcon={<AiOutlineSetting style={{height: '20px', width: '20px'}} />} h={'50px'} w={'90%'} bg={pathname === '/courses' ? bgButtonActive : bgButton} style={pathname === '/courses' ? {fontWeight: '500'} : {fontWeight: '400'}} onClick={() => {navigate('/courses')}} justifyContent={'start'}>{isFullPanel&&'Предметы/эксперты'}</Button></Tooltip>
            <Tooltip label={'Заявки'}><Button overflow={'hidden'} leftIcon={<AiOutlineSetting style={{height: '20px', width: '20px'}} />} h={'50px'} w={'90%'} bg={pathname === '/requests' ? bgButtonActive : bgButton} style={pathname === '/requests' ? {fontWeight: '500'} : {fontWeight: '400'}} onClick={() => {navigate('/requests')}} justifyContent={'start'}>{isFullPanel&&'Заявки'}</Button></Tooltip>
            <Tooltip label={'Составление тестов'}><Button overflow={'hidden'} leftIcon={<AiOutlineSetting style={{height: '20px', width: '20px'}} />} h={'50px'} w={'90%'} bg={pathname === '/creation' ? bgButtonActive : bgButton} style={pathname === '/creation' ? {fontWeight: '500'} : {fontWeight: '400'}} onClick={() => {navigate('/creation')}} justifyContent={'start'}>{isFullPanel&&'Составление тестов'}</Button></Tooltip>
            <Tooltip label={'Решение тестов'}><Button overflow={'hidden'} leftIcon={<AiOutlineSetting style={{height: '20px', width: '20px'}} />} h={'50px'} w={'90%'} bg={pathname === '/solution' ? bgButtonActive : bgButton} style={pathname === '/solution' ? {fontWeight: '500'} : {fontWeight: '400'}} onClick={() => {navigate('/solution')}} justifyContent={'start'}>{isFullPanel&&'Решение тестов'}</Button></Tooltip>
            {true && <Tooltip label={'Ученики'}><Button overflow={'hidden'} leftIcon={<AiOutlineSetting style={{height: '20px', width: '20px'}} />} h={'50px'} w={'90%'} bg={pathname === '/students' ? bgButtonActive : bgButton} style={pathname === '/students' ? {fontWeight: '500'} : {fontWeight: '400'}} onClick={() => {navigate('/students')}} justifyContent={'start'}>{isFullPanel&&'Ученики'}</Button></Tooltip>}
            {true && <Tooltip label={'Модерация тестов'}><Button overflow={'hidden'} leftIcon={<AiOutlineSetting style={{height: '20px', width: '20px'}} />} h={'50px'} w={'90%'} bg={pathname === '/moderation' ? bgButtonActive : bgButton} style={pathname === '/moderation' ? {fontWeight: '500'} : {fontWeight: '400'}} onClick={() => {navigate('/moderation')}} justifyContent={'start'}>{isFullPanel&&'Модерация тестов'}</Button></Tooltip>}
        </VStack>
    );
};

export default NavPanel;