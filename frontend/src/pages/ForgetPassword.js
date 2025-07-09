import React, { useState } from 'react';
import axios from 'axios';


const BKEP = 'http://localhost:3001'

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BKEP}/api/auth/forget-password`, { email });
            console.log(response.data.resetToken)
            localStorage.setItem('reset_token', response.data.resetToken)
            setMessage(response.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Forget Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Email</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgetPassword;
