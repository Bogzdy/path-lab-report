import axios from 'axios'
import {useAuthContext} from './AuthContext'
import {SERVER_URL,GET_NEW_TOKEN_URL} from '../constants/urls'
import { isExpired, decodeToken } from "react-jwt";

const useCustomAxios = () => {
    let {accessToken, refreshToken, setAccessToken} = useAuthContext()
    const isTokenExpired = isExpired(accessToken)

    const axiosInstance = axios.create({
        SERVER_URL,
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })

    axiosInstance.interceptors.request.use(async request => {
        if(!isTokenExpired) return request

        const response = await axios.post(
            GET_NEW_TOKEN_URL,
            {refresh: refreshToken}
        )
        localStorage.setItem('access', response.data.access)
        setAccessToken(response.data.access)
        request.headers.Authorization = `Bearer ${response.data.access}`
        return request
    })

    return axiosInstance
}
export default useCustomAxios