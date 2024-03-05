import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Navbar from 'react-bootstrap/Navbar';
import Alert from 'react-bootstrap/Alert';



const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigate();


    const handleLogin = async (e) => {
        
        e.preventDefault();
        // Perform Logic for login
        try {
            console.log("Login Button clicked");
            console.log('Email:', email);
            console.log('Password:', password);
            const response = await fetch('http://localhost:3000/api/login', {
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

                localStorage.setItem('kepler-token', token);

                navigation("/dashboard");
            }
            else {
                // Handle the error
                setMessage('failed');
                console.error('Login Failed');
            }   

        }

        catch (error) {
            console.error('Error occured:', error);
        }
    };

    // On page load check for Token in local storage, if present, redirect to dashboard
    useEffect(() => {
        const token = localStorage.getItem('kepler-token');
        if (token) {
            navigation('/dashboard');
        }
    }, []);




    const paddingTopValue = '12%'; // You can use any valid CSS value here

    return(
        <>
        <Container>
            <Navbar expand="lg"  className="bg-body-tertiary" data-bs-theme="dark" fixed="top">
                <Container className="">
                    <Navbar.Brand>
                        <img src="/icons8-planet-emoji-32.png" className="d-inline-block align top"></img>
                        Kepler Cluster
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </Container>
        <Container fluid  style={{ paddingTop: paddingTopValue }}>
            <Row/>
            <Row className="align-items-center">
                <Col/>
                <Col>
                    <Container  style={{ paddingTop: paddingTopValue }}>
                        <Row>
                            <Col/>
                            <Col><h1>Login</h1></Col>
                            <Col/>
                        </Row>
                    </Container>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                                <Form.Control type="email" placeholder="name@example.com" required onChange={(e) => setEmail(e.target.value)} value={email} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} value={password} />
                            </FloatingLabel>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button type="submit" size="lg" variant="secondary">Login</Button>
                        </div>
                    </Form>
                    {message === 'failed' && <Alert variant='danger' className="mt-3">Login Failed. Please Try Again</Alert>}
                </Col>
                <Col/>
            </Row>
            <Row/>
        </Container>
        </>
    );
};

export default LoginPage;