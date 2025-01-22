// form.jsx
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function  Form({route, method}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        setError('');
        e.preventDefault();

        try {
            let payload;
            if (method === 'login') {
                payload = { email, password };
                route = '/api/auth/login/';
            } else if (method === 'register') {
                if (password != password2) {
                    throw new Error("password does not match");
                }
                payload = {
                    email, 
                    password1: password, 
                    password2: password2
                };
                route = '/api/auth/registration/'
            } else if (method === 'reset-password') {
                payload = {email};
                route = '/api/auth/password/reset/';
            }

            const res = await api.post(route, payload);

            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/');
            } else if (method === 'register') {
                // show verification message
                setError('Please check your email to verify your account.');
            } else if (method === 'reset-password') {
                setError('Password reset instructions have been set to your email');
            }
        } catch(error) {
            setError(error.response?.data?.detail || error.message || 'An error occured');
        } finally {
            setLoading(false);
        }
    }

    const getTitle = () => {
        switch (method) {
            case 'login': return 'login';
            case 'register': return 'register';
            case 'reset-password': return 'Reset Password';
            default: return '';
        }
    }



    const name = method === 'login' ? "login" : "register"

    return <form onSubmit={handleSubmit} className="form-container">
        <h2>{getTitle}</h2>
        {error && <div className="error-message">{error}</div>}
        <input
            className="form-input"
            type='email'
            value= {email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
        />
        {method !== 'reset-password' && (
            <input
            className="form-input"
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
        />
        )}
        {method === 'register' && (
            <input
            className="form-input"
            type='password'
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder='Confirm Password'
        />
        )}
        <button className="form-button" type="submit" disabled={loading}>
            {loading ? 'Loading...' : getTitle()}
        </button>
        { method === 'login' && (
            <div className="form-links">
                <a href="/register">Create an account</a>
                <a href="/reset-password">Forgot password?</a>
            </div>
        )}
        </form>
}


export default Form;