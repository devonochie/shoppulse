import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios"


declare module 'axios' {
    interface AxiosRequestConfig {
        _retry?: boolean;
        _skipAuthRefresh?: boolean;
    }
}


const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_USRL || 'http://localhost:3000/api/v1',
    withCredentials: true,
    timeout: 30000 
})

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig )=>  {
        return config
    },
    (error: AxiosError ) => {
        return Promise.reject(error)
    }
)

// Response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse ) => response,
    async (error: AxiosError ) => {
        const originalRequest = error.config

        if(error.response?.status === 401 && originalRequest &&  !originalRequest._retry) {
            originalRequest._retry = true

            try {
                await axiosInstance.post("/auth/refresh-token", {}, {
                    withCredentials: true,
                    _skipAuthRefresh: true
                })

                return axiosInstance(originalRequest)
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
        
    }
    
)


export default axiosInstance