// Admin.js
import React, { useState, useEffect } from 'react';
import DashNavbar from "./DashNavbar";
import Container from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT

const Admin = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    const getUserType = async (token) => {
        const response = await fetch(`http://${apiUrl}:${apiPort}/api/verifyAdminToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const { userType } = await response.json();
        return userType;
    };

    const handleCreateUser = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("kepler-token");

        const currentUserType = await getUserType(token);
        // Owner and Admin can create a user
        if (currentUserType !== 1 && currentUserType !== 0) {
            console.error('Only admins or owners can create a user.');
            return;
        }
        
        let userType = 2;
        const user = { name, email, password, userType}; // userType is set to 'user' as an example
    
        try {
            const response = await fetch(`http://${apiUrl}:${apiPort}/api/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
    
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }
    
            const data = await response.json();
            console.log(data.message); // 'User created successfully'
            setEmail('');
            setName('');
            setPassword('');
            setShowPassword(false);
            fetchUsers();
        } catch (error) {
            console.error('Error creating user', error);
        }
    };

    const handleUpgradeUser = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("kepler-token");

        const currentUserType = await getUserType(token);
        // Owner is type 0
        if (currentUserType !== 0) {
            console.error('Only admins can upgrade a user.');
            return;
        }

        const userToUpgrade = users.find(user => user.name === selectedUser);
        const admin = 1;
    
        if (!userToUpgrade) {
            console.error('User not found');
            return;
        }
    
        if (userToUpgrade.userType !== 2) {
            console.error('User is already an admin');
            return;
        }
    
        const response = await fetch(`http://${apiUrl}:${apiPort}/api/users/usertypeUpgrade`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userToUpgrade.email, userType: admin }),
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const user = await response.json();
        console.log('User type updated successfully', user);
    };

    const handleDeleteUser = async () => {
        try {
            const userToDelete = users.find(user => user.name === selectedUser);

            const token = localStorage.getItem("kepler-token");

            const currentUserType = await getUserType(token);
            // Owner can delete a user
            if (currentUserType !== 0) {
                console.error('Only admins can delete a user.');
                return;
            }

            if (!userToDelete) {
                console.error('User not found');
                return;
            }

            const response = await fetch(`http://${apiUrl}:${apiPort}/api/users`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( userToDelete ),
            });

    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Refresh the list of users
            const data = await response.json();
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    const fetchUsers = async () => {
        try {
          const response = await fetch(`http://${apiUrl}:${apiPort}/api/users`);
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const paddingTopValue = '1%'; 

    return (
        <>
        <Container fluid style={{ paddingTop: paddingTopValue }} className="align-items-center"> 
            <Container>
                <Row>
                    <Container className="text-center"><h2><i class="bi bi-person-fill-add"></i> Create New User</h2></Container>
                </Row>
                <Row>
                    <Container style={{ paddingTop: paddingTopValue }} className="d-flex justify-content-center align-items-center">
                        <Row style={{ paddingTop: paddingTopValue }}>
                            <Col md={12}>
                                <Form onSubmit={handleCreateUser}>
                                    <Row>
                                        <label>
                                                Email:{' '} 
                                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </label> <br/>
                                    </Row>
                                    <Row style={{ paddingTop: "3%" }}>
                                        <label>
                                            Name:{' '} 
                                            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                                        </label><br/>
                                    </Row>    
                                    <Row style={{ paddingTop: "3%" }}>
                                        <label>
                                            Password:{' '} 
                                            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
                                        </label><br/>
                                    </Row>
                                    <Row style={{ paddingTop: "3%" }}>
                                        <label>
                                            Show Password:{' '} 
                                            <input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} />
                                        </label><br/>
                                    </Row>
                                    <Row style={{ paddingTop: "3%" }}>
                                        <button type="submit" className='align-items-center btn btn-secondary'><i class="bi bi-plus"></i> Create User</button>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
            <Container style={{ paddingTop: paddingTopValue }}>
                    <Container className="text-center"><h2><i class="bi bi-person-fill-gear"></i> Manage Users</h2></Container>
                    <Container className="d-flex justify-content-center align-items-center">
                        <Row>
                            <Col md={12}>
                                <Form onSubmit={handleUpgradeUser}>
                                    <Row style={{ paddingTop: "3%" }}>
                                        <label>
                                            Select User: {' '}
                                            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                        </label><br/>
                                    </Row>
                                    <Row style={{ paddingTop: "3%" }}> 
                                        <Row><button type="submit" variant="secondary" class="btn btn-secondary" ><i class="bi bi-person-fill-up"></i> Upgrade User</button></Row>
                                        <Row style={{ paddingTop: paddingTopValue }}><button type="button" onClick={handleDeleteUser} class="btn btn-secondary"><i class="bi bi-person-fill-x"></i> Delete User</button></Row>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
            </Container>
        </Container>
        </>
    );
}

export default Admin;