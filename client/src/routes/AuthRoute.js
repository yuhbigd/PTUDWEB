import React from "react";
import { Navigate, Outlet} from 'react-router-dom'
import { useSelector } from "react-redux";

const AuthRoute = (props) => {
    const Auth =  useSelector(state => state.userRe)

    if (true) {
        return <Outlet></Outlet>
    }else {
        return <Navigate to='/login'></Navigate>
    }
}

export default AuthRoute