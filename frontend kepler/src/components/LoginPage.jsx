import React, {useState} from 'react';
import Navbar from './Navbar';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Perform Logic for login
        console.log("Login Button clicked");
        console.log('Email:', email);
        console.log('Password:', password);
    }

    return(
        <div>
            <Navbar />
            <h1>Login Page</h1>
            <form>
                <label htmlFor='email'>Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button type='button' onClick={handleLogin}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;