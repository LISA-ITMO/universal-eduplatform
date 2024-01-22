import React, { useEffect } from 'react';
import { Route } from "react-router-dom";
import {QUIZ_TOKEN} from 'utils/common';


function ProtectedRoute({ children, path, redirectPath, isAllowed }) {
    // const isAuthenticated = localStorage.getItem(QUIZ_TOKEN);
    //
    // useEffect(() => {
    //     if (user.token === null || Object.keys(user).length === 0 ) {
    //         user.get;
    //     }
    // }, []);
    //
    // if (!isAllowed) {
    //     return <Navigate to="/login" />;
    // }
    //
    // return user.isLoading || Object.keys(user).length === 0 ? <Loader /> : <Route {...Props} />;
}

export default ProtectedRoute;
