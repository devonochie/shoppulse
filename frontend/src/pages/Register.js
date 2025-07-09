import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';

const Register = () => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const {register} = useContext(AuthContext)
   const navigate = useNavigate()

   const handleSubmit = async (e) => {
      e.preventDefault()

      try {
         const response = await register({email, password})
            console.log(response);
            alert("Registering successful!");
            navigate('/login')
      } catch (error) {
         if (error.response && error.response.status === 409) { 
            alert("Email already exists. Redirecting to login page.");
            navigate('/login');
          } else {
            console.error("Registration failed:", error);
            alert("Unable to register, please try again.");
          }
      }
   }
  return (
   <div className="register-page">
   <h2>Register</h2>
   <form onSubmit={handleSubmit}>
     <div>
       <label>Email:</label>
       <input
         type="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         required
       />
     </div>
     <div>
       <label>Password:</label>
       <input
         type="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         required
       />
     </div>
     {/* <div>
       <label>Role:</label>
       <input
       placeholder='admin or user'
         type="text"
         value={role}
         onChange={(e) => setRole(e.target.value)}
         required
       />
     </div> */}
     <button type="submit">Register</button>
   </form>
   <p>Already have an account? <a href="/login">Login here</a></p>
 </div>
  )
}

export default Register
