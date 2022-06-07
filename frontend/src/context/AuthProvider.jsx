import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom'
import axiosClient from '../config/axiosClient';

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [userLoading, setUserLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        const authenticateUser = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                console.log('No User token has been set');
                setUserLoading(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                }
            }

            try {
                // Get data using the localStorage token 
                const { data } = await axiosClient('/users/profile', config)

                // Set data in auth context
                setAuth(data);

                navigate('/projects')
            } catch (error) {
                console.log(error)
            }

            setUserLoading(false)

        }

        authenticateUser()
    }, [])

    const authCloseSession = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                userLoading,
                setAuth,
                authCloseSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;