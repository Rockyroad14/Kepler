// Admin.js
import React, { useState, useEffect } from 'react';
import DashNavbar from "./DashNavbar";

const Admin = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    const handleCreateUser = async (event) => {
        event.preventDefault();
        
        let userType = 2;
        const user = { name, email, password, userType}; // userType is set to 'user' as an example
    
        try {
            const response = await fetch('http://localhost:3000/api/createuser', {
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
        } catch (error) {
            console.error('Error creating user', error);
        }
    };

    const handleUpgradeUser = (event) => {
        event.preventDefault();
        // Here you can handle the user upgrade, e.g., send the selectedUser to an API
        console.log({ selectedUser });
    };

    // Fetch users from your API when the component mounts
    // useEffect(() => {
    //     fetch('/api/users') // replace with your API endpoint
    //         .then(response => response.json())
    //         .then(data => setUsers(data));
    // }, []);

    return (
        <>
        <DashNavbar/>
        <div>
            <h1>Admin Page</h1>
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
                </label>
                <label>
                    Show Password:
                    <input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} />
                </label>
                <button type="submit">Create User</button>
            </form>

            <h2>Upgrade User to Admin</h2>
            <form onSubmit={handleUpgradeUser}>
                <label>
                    Select User:
                    <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Upgrade User</button>
            </form>
        </div>
        </>
    );
}

export default Admin;