import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
// import api from '../api/api'

const AuthContext = createContext()


const BKEP = 'http://localhost:3001'

const AuthProvider = ({children}) => {
   const [user, setUser] = useState(null)

   useEffect(() => {
      const checkAuth = async () => {
         try {
            const {data} = await axios.get(`${BKEP}/api/auth/me`)
            setUser(data.user)
            
         } catch (e) {
            setUser(null)
         }
      }
      checkAuth()
   }, [])

   const register  = async (cred) => {
      const {data} = await axios.post(`${BKEP}/api/auth/register`, cred)
      setUser(data.user)
      localStorage.setItem('user_id', data.user._id);
      return data
      // localStorage.setItem('user_id', data.user?.user_id)
   }

   

   const login = async (cred) => {
      const {data} = await axios.post(`${BKEP}/api/auth/login`, cred)
      setUser(data.user)
      localStorage.setItem('user_id', data.user?._id)
      return data
      // localStorage.setItem('user_id', data.user?.user_id)
   }

   const logout = async () => {
      await axios.post(`${BKEP}/api/auth/logout`)
      setUser(null)
   }

   const resetPassword = async ( reset_token, newPassword ) => {
      const {data} = await axios.post(`${BKEP}/api/auth/reset-password`, {reset_token, newPassword});
      localStorage.setItem('reset-token', data.resetToken)
      console.log(data)
      return data
   }

   const values = {
      user,
      logout,
      login,
      register,
      resetPassword
    
   }

  return (
    <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider}
