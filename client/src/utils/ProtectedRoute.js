import React from 'react';
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({allowedRoles}) => {

    //Gets locally stored user
    const user = localStorage.getItem('user');
    const roles = (!localStorage.getItem('roles')) ? [] : localStorage.getItem('roles').split(",");

    // console.log("ROLES: " + roles)
    // console.log("ALLOWED ROLES: " + allowedRoles)
    // console.log("CONDITION: " + roles?.some(role => allowedRoles?.includes(role)))

    return(
        // Checks if user exists, if yes proceeds to page, if not proceeds to login
        user
            ? allowedRoles 
                ? roles?.some(role => allowedRoles?.includes(role))
                    ? <Outlet/>
                    : <Navigate to="/unauthorized"/>
                : <Outlet/>   
            : <Navigate to="/"/>
    );
}

export default ProtectedRoute;