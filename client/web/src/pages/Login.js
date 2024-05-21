import React, {useContext, useEffect} from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input, InputGroup, InputRightElement,
    Stack,
    Text, useColorModeValue, useMediaQuery, useToast
} from "@chakra-ui/react";
import {ColorModeSwitcher} from "@components/ColorModeSwitcher";
import {API_USER} from '@utils/api/apiUser';
import {QUIZ_TOKEN, QUIZ_TOKEN_REFRESH} from '@utils/common';
import {useNavigate} from 'react-router-dom';
import {cookies} from '@utils/api/apiUser';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';
import { UserContext } from '@app/providers/UserProvider';

const Login = ({setIsAuth, isRegistration}) => {
    const toast = useToast({
        position: 'bottom-right',
        duration: 3000,
        isClosable: true,
    });

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [show, setShow] = React.useState(false);
    const [errorNoUserName, setErrorNoUserName] = React.useState(false);
    const [errorNoEmail, setErrorNoEmail] = React.useState(false);
    const [errorNoPassword, setErrorNoPassword] = React.useState(false);
    const bg = useColorModeValue('gray.100', 'gray.900');
    const bgButton = useColorModeValue('gray.200', 'gray.700');
    const bgInput = useColorModeValue('gray.200', 'gray.800');
    const [isSmallerThan400] = useMediaQuery('(max-width: 400px)');

    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    useEffect(() => {
        if (!!cookies.get('access_token')) {
            navigate('/');
        }
    }, [])

    const handleLogin = e => {
        e.preventDefault();
        setErrorNoEmail(false);
        setErrorNoPassword(false);
        setErrorNoUserName(false);
        if (!email) {
            setErrorNoEmail(true);
        }
        if (isRegistration && !userName) {
            setErrorNoUserName(true);
        }
        if (!password) {
            setErrorNoPassword(true);
        }
        if (!isRegistration && userName && password) {
            API_USER.login({username: userName, password})
                .then((res) => {
                    
                    setUser({
                        info: res.data[0]
                    })
                    
                    cookies.set("access_token", res.data.access_token, {
                        path: "/",
                      });
                    cookies.set("refresh_token", res.data.refresh_token, {
                    path: "/",
                      });
                    // localStorage.setItem('access_token', res.data.access_token);
                    // localStorage.setItem('refresh_token', res.data.refresh_token);
                    setIsAuth(true);
                    navigate('/');
                    console.log('user:', res.data)
                })
                // .then(() => {
                    // API.authenticate
                    //     .me()
                    //     .then((res) => {
                    //       app.setUserName(res.name);
                    //       app.setUserId(res.id);
                    //       app.setRole(res.role);
                    //     })
                    //     .catch(() => {
                    //       toast({ title: 'Не удалось получить информацию о пользователе', status: 'error' })
                    //     })
                // })
                .catch((err) => {
                    toast({ title: 'Неверный логин или пароль', status: 'error' })
                    setPassword('');
                    // localStorage.setItem(QUIZ_TOKEN, "test");
                    // localStorage.setItem(QUIZ_TOKEN_REFRESH, "test");
                    // setIsAuth(true);
                    // navigate('/');
                })
        }
        if (isRegistration && email && password && userName) {
            API_USER.register({email, username: userName, password})
                .then((res) => {
                    toast({ description: 'Пользователь зарегистрирован', status: 'success' });
                    console.log('Регистрация:', res.data)
                    navigate('/login');
                })
                .catch((e) => {
                    console.log('err-', e)
                    toast({ title: "Не удается зарегистрироваться!\n",
                    description: Object.values(e.response.data.errors), status: 'error' });
                })
        }
    };

    return (
        // <Box h={400} bg={bg}>
        <form onSubmit={handleLogin}>
            <Flex minH={'100vh'} w={'100vw'} maxH={'100vh'} boxSizing={'content-box'} justifyContent={'center'} alignItems={'center'}>
                <Stack boxSizing={'content-box'} margin={'0 auto'} px={isSmallerThan400?'10px':'50px'} py={'50px'} minW={'220px'} width={'100%'} maxH={'100%'} maxWidth="450px" bg={bg}>
                    <Text fontSize={'24px'} fontWeight={'600'} textAlign={'center'}>Цифровая платформа</Text>
                    <Flex justifyContent={'flex-end'}>
                        <ColorModeSwitcher height={'40px'} width={'30px'}/>
                    </Flex>
                    <Text fontSize={'22px'} fontWeight={'400'} py={'5px'}
                          textAlign={'center'}>{isRegistration ? 'Регистрация' : 'Авторизация'}</Text>

                    {/* <TLoginButton
                            botName="Quiz_login_bot"
                            buttonSize={TLoginButtonSize.Large}
                            lang="en"
                            usePic={false}
                            cornerRadius={20}
                            onAuthCallback={(user) => {
                            console.log('Hello, user!', user);
                            }}
                            requestAccess={'write'}
                        /> */}
                    {isRegistration && <FormControl isInvalid={errorNoEmail && !email}>
                        <FormLabel>Email:</FormLabel>
                        <Input
                            bg={bgInput}
                            placeholder="Введите email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        {errorNoEmail && !email && (
                            <FormErrorMessage>
                                Поле email пустое
                            </FormErrorMessage>
                        )}
                    </FormControl>}
                    <FormControl isInvalid={errorNoUserName && !userName}>
                        <FormLabel>Username:</FormLabel>
                        <Input
                            bg={bgInput}
                            placeholder="Введите username"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                        />
                        {errorNoUserName && !userName && (
                            <FormErrorMessage>
                                Поле username пустое
                            </FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={errorNoPassword && !password}>
                        <FormLabel>Пароль:</FormLabel>
                        <InputGroup size="md">
                            <Input
                                bg={bgInput}
                                pr="4.5rem"
                                type={show ? 'text' : 'password'}
                                placeholder="Введите пароль"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button bg={bgButton} h="1.75rem" mr="8px" size="xs" border={useColorModeValue('solid #CBD5E0 1px', 'solid #4A5568 1px')}
                                        onClick={handleClick}>
                                    {show ? 'Скрыть' : 'Показать'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {errorNoPassword && !password && (
                            <FormErrorMessage>
                                Поле пароля пустое
                            </FormErrorMessage>
                        )}
                    </FormControl>
                    {
                        isRegistration ?
                            <Flex pt={'15px'} justifyContent={'space-between'} width="100%">
                                <Button bg={bgButton} type="submit" width="50%" variant="solid">
                                    Зарегистрироваться
                                </Button>
                                <Button bg={bgButton} onClick={() => navigate('/login')} width="40%" variant="solid">
                                   Авторизация
                                </Button>
                            </Flex>
                            :
                            <Flex pt={'15px'} justifyContent={'space-between'} width="100%">
                                <Button bg={bgButton} type="submit" width="45%" variant="solid">
                                    Войти
                                </Button>
                                <Button bg={bgButton} onClick={() => navigate('/register')} width="45%" variant="solid">
                                   Регистрация
                                </Button>
                            </Flex>
                    }
                </Stack>
            </Flex>
        </form>
    );
};

export default Login;