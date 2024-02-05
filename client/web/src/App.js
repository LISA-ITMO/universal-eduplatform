import {useContext, Suspense, useState} from 'react';
import {ChakraProvider, HStack, theme} from '@chakra-ui/react';
import {Route, Navigate, Routes, BrowserRouter} from "react-router-dom";
import {UserContext} from '@providers/UserProvider';
import Loader from '@components/Loader';
import {QUIZ_TOKEN} from '@utils/common';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import MainPanel from '@components/MainPanel';
import Courses from '@pages/Courses';
import Requests from '@pages/Requests';
import Creation from '@pages/Creation';
import Solution from '@pages/Solution';
import Students from '@pages/Students';
import Moderation from '@pages/Moderation';


function App() {
    // const [isAuth, setIsAuth] = useState(!!localStorage.getItem(QUIZ_TOKEN));
    const [isAuth, setIsAuth] = useState(true);
    const [isFullPanel, setIsFullPanel] = useState(true);

    const {user, setUser} = useContext(UserContext);
    // const { t } = useTranslation();


    // useEffect(() => {
    //   if  ()
    // }, [user])

    return (
        <ChakraProvider theme={theme}>
            <HStack position={'relative'} overflowY={'auto'} spacing={'0px'} minH={'100vh'} h={'100%'} w={'100%'}
                    justifyContent={'stretch'} alignItems={'stretch'}>
                <Suspense fallback={<Loader/>}>
                    {/*basename*/}
                    <BrowserRouter>
                        {isAuth && <MainPanel setIsFullPanel={setIsFullPanel} isFullPanel={isFullPanel} logout={() => {setIsAuth(false)}} />}

                        <Routes>
                            <Route exact path="/" element={isAuth ? <Profile/> : <Navigate to="/login" replace/>}/>


                            <Route path={'/courses'} element={isAuth ? <Courses /> : <Navigate to="/login"/>}/>
                            <Route path={'/requests'} element={isAuth ? <Requests /> : <Navigate to="/login"/>}/>
                            <Route path={'/creation/info?/:subjectId?/:themeId?/'} element={isAuth ? <Creation /> : <Navigate to="/login"/>}/>
                            <Route path={'/solution/:subjectId?/:themeId?/:testId?/result?'} element={isAuth ? <Solution /> : <Navigate to="/login"/>}/>
                            <Route path={'/students'} element={isAuth ? <Students /> : <Navigate to="/login"/>}/>
                            <Route path={'/moderation'} element={isAuth && !!localStorage.getItem(QUIZ_TOKEN) ? <Moderation /> : <Navigate to="/login"/>}/>


                            <Route path='/login' element={<Login setIsAuth={setIsAuth} isRegistration={false}/>}/>
                            <Route path='/register' element={<Login setIsAuth={setIsAuth} isRegistration={true}/>}/>


                            <Route
                                path="*"
                                element={<Navigate to="/" replace/>}
                            />
                        </Routes>
                    </BrowserRouter>
                </Suspense>
                {/*<Text>{t('Hello')}</Text>*/}
            </HStack>
        </ChakraProvider>
    );
}


export default App;
