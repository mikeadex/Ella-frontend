import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import axios from 'axios'; // added axios import

function ProtectedRoutes({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => {
            setIsAuthorized(false);
        });
    })

    const refreshToken = async () => {
        try {
            const refresh = localStorage.getItem(REFRESH_TOKEN); // changed "refresh" to REFRESH_TOKEN
            if (!refresh) {
                throw new Error("No refresh token");
            }

            const response = await axios.post(
                'api/token/refresh', // changed URL to match original code
                {
                  refresh: refresh, // changed refresh to refresh: refresh
                }
            );

            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            setIsAuthorized(true);
            return response.data.access;
        } catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthorized(false);
            throw error;
        }

    }

    const auth = async () => {
        /****
         * Check if we have access token in local storage
         * If we have access token, check if it is expired
         * If it is expired, check if we have refresh token
         * If we have refresh token, call the refresh token endpoint
         * If we don't have refresh token, redirect to login page
         */
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false)
            return;
        }
        // if we have to token, decode it
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now)
        {
            await refreshToken();
        }
        else {
            setIsAuthorized(true);
        }

    }

    if (isAuthorized === null) {
        return <div>Loading....</div>
    }

    return isAuthorized ? children : <Navigate to='/login' />
}

export default ProtectedRoutes;