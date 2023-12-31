import {useState, createContext, useEffect, FC, Dispatch, SetStateAction, ReactNode} from 'react'
import {jwtDecode} from "jwt-decode";

interface IProps {
    children: ReactNode
}

export interface IAuth {
    isAuthenticated: boolean;
    user: string;
}

interface IContext {
    auth: IAuth
    setAuth: Dispatch<SetStateAction<IAuth>>
}

export const AuthContext = createContext<Partial<IContext>>({})

const AuthProvider: FC<IProps> = ({ children }) => {

    const [auth, setAuth] = useState<IAuth>({
        isAuthenticated: false,
        user: 'Anonymous'
    })

    const checkActiveToken = () => {
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token');
            if (token) {
                console.log(`For debugging purposes, current token is:${token}`);
                const decodedToken = jwtDecode<any>(token);
                console.log("Decoded token:", decodedToken);
                console.log("Token expiration:", new Date(decodedToken.exp * 1000));
                console.log("Current date:", new Date());

                const dateNow = new Date();
                if (decodedToken.exp * 1000 < dateNow.getTime()) {
                    setAuth(prev => ({
                        ...prev,
                        isAuthenticated: false
                    }))
                    return
                }
                setAuth(prev => ({
                    ...prev,
                    isAuthenticated: true,
                    user: decodedToken.username
                }))
            }
        }
    }

    useEffect(() => {
        checkActiveToken()
    }, [])


    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider