import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Navbar from 'react-bootstrap/Navbar';
import Alert from 'react-bootstrap/Alert';
import HandleLogin from './HandleLogin';
import TokenValidation from './TokenValidation';



const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigate();


    const handleSubmit = async (e) => {
        
        e.preventDefault();
        


        if (await HandleLogin(email, password))
        {
            navigation("/dashboard");
        }
        else 
        {
            setMessage("failed");
        }
        
    };

    

    useEffect(() => {
        TokenValidation(navigation)
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
                    <Form onSubmit={handleSubmit} data-testid='submitForm'>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                                <Form.Control 
                                    type="email" 
                                    placeholder="name@example.com" 
                                    required onChange={(e) => setEmail(e.target.value)} 
                                    data-testid='email'
                                    name='email' // for formdata purposes
                                    value={email} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    required onChange={(e) => setPassword(e.target.value)} 
                                    data-testid='password'
                                    name='password' // for formdata purposes
                                    value={password} />
                            </FloatingLabel>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button type="submit" size="lg" variant="secondary" data-testid='submitLogin'>Login</Button>
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