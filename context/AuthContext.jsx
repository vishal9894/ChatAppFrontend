import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"
import { io } from "socket.io-client"

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null)
    const [onlinehUser, setOnlineUser] = useState([])
    const [socket, setSocket] = useState(null)

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check")
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }

    // loign fucntion to handl user

    const login = async (state , Credentials) =>{
        try{
            const {data} = await axios.post(`/api/auth/${state}` , Credentials);
            if(data.success){
                setAuthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token)
                localStorage.setItem("token" ,data.token)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    //logout

    const logout = async () =>{
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUser([])
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out sucessfully")
        socket.dsconnect();
    }
    // update user profle 


    const updateProfile = async (body) =>{
        try{
            const {data} = await axios.put("/api/auth/update-profile" ,body);
            if(data.success){
                setAuthUser(data.user)
                toast.success("profile update sucessfully")
            }
        }catch(error){
            toast.error(error.message)
        }
    }



    //connect socket function to handle socket connection and online user updates

    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket)
        newSocket.on("getOnlineUser", (userIds) => {
            setOnlineUser(userIds)
        })
    }

    useEffect(() => {

        if (token) {
            axios.defaults.headers.common["token"] = token;
        }

        checkAuth();

    }, [])


    const value = { axios, authUser, onlinehUser, socket , login , logout,updateProfile };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
