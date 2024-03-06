import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Profile = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }
    
        // Get the token from local storage
        const token = localStorage.getItem('kepler-token');
        if (!token) {
            console.error('No token found.');
            return;
        }
    
        const response = await fetch('http://localhost:3000/api/users/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send the token in the Authorization header
            },
            body: JSON.stringify({ password: newPassword }),
        });
    
        if (!response.ok) {
            // Handle error
            console.error('An error occurred while updating the password.');
            return;
        }
    
        const data = await response.json();
        console.log(data.message);  // Logs 'Password updated successfully.'
    };

    return (
        <Container>
            <Form onSubmit={handleUpdatePassword}>
                <Container className="text-center"><h2><i class="bi bi-pencil-square"></i> Change Password</h2></Container>
                <Form.Group controlId="formNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </Form.Group>

                {!passwordsMatch && <Alert variant="danger">New passwords do not match!</Alert>}

                <Button variant="primary" type="submit">
                    Update Password
                </Button>
            </Form>
        </Container>
    );
}

export default Profile;