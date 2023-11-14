import React, {useState} from 'react';
import Navbar from './Navbar';
import '../LoginPage.css'

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        
        e.preventDefault();
        // Perform Logic for login
        try {
            console.log("Login Button clicked");
            console.log('Email:', email);
            console.log('Password:', password);
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if(response.ok) {
                // Redirect to the Dashboard 
                console.log('Login sucessful');
                const { token } = await response.json();

                localStorage.setItem('token', token);

                history.pushState('/dashboard');
            }

            else {
                // Handle the error
                console.error('Login Failed');
            }   

        }

        catch (error) {
            console.error('Error occured:', error);
        }
    };

    return(
        <div>
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