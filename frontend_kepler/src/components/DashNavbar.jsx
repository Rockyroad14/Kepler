import React from "react";
import {Link} from 'react-router-dom'

export default function DashNavbar() {
    
    const navbarStyle = {
        backgroundColor: '#333',
        padding: '10px',
        color: 'white',
      };
    
      const ulStyle = {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'space-around',
      };
    
      const liStyle = {
        marginRight: '10px',
      };
    
      const linkStyle = {
        color: 'white',
        textDecoration: 'none',
      };
    
    return(
        <nav style={navbarStyle}>
            <ul style={ulStyle}>
                <li style={liStyle}>
                    <Link to='/dashboard' style={linkStyle}>Home</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/admin" style={linkStyle}>Admin</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/profile" style={linkStyle}>Profile</Link>
                </li>
                <li style={liStyle}>
                    <Link to='/' style={linkStyle}>Sign Out</Link>
                </li>
            </ul>
        </nav>
    );
};
