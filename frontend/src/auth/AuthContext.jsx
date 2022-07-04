import { createContext, useContext, useState } from "react";
import axios from "axios";
import { isExpired } from "react-jwt";
import { Navigate, useNavigate } from 'react-router-dom';
import { LOGOUT_URL } from '../constants/urls'


const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const userId = localStorage.getItem('userId')
        ? localStorage.getItem('userId')
        : null
    const userIsStaff = localStorage.getItem('isStaff')
        ? JSON.parse(localStorage.getItem('isStaff'))
        : null
    const [user, setUser] = useState({
        userId: userId,
        isStaff: userIsStaff
    })
    // TODO Not a good ideea to store accessToken in localStorage
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access')
        ? localStorage.getItem('access')
        : null)
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh')
        ? localStorage.getItem('refresh')
        : null)
    const navigate = useNavigate()


    const logout = (e) => {
        if (e.target.id == 'Logout') {
            axios.get(LOGOUT_URL)
                .then(() => {
                    setUser({
                        userId: null,
                        isStaff: null
                    })
                    setAccessToken(null)
                    setRefreshToken(null)
                    localStorage.clear()
                })
                .catch(e => console.log(e))
            navigate('/login', { replace: true })
        }

    }

    const value = {
        user: user,
        setUser: setUser,
        logout: logout,
        accessToken: accessToken,
        setAccessToken: setAccessToken,
        refreshToken: refreshToken,
        setRefreshToken: setRefreshToken
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export function RequireAuth({ children }) {
    const refreshToken = localStorage.getItem('refresh')
    const isRefreshTokenExpired = isExpired(refreshToken)

    if (refreshToken && !isRefreshTokenExpired) return children

    return <Navigate to="/login" replace={true} />
}

export function RequireStaff({ children }) {
    const isStaff = localStorage.getItem('isStaff')
    if (isStaff) return children
    return <Navigate to='/' />
}