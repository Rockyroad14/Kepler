import React from "react";
import {Link} from 'react-router-dom';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";


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
      <Navbar expand="lg"  className="bg-body-tertiary" data-bs-theme="dark" sticky="top">
          <Navbar.Brand href="/dashboard">
            <img src="/icons8-planet-emoji-32.png" className="d-inline-block align top"></img>
            Kepler Cluster
          </Navbar.Brand>
      </Navbar>
        /*
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
                    <Link to='/' style={linkStyle} onClick={}>Sign Out</Link>
                </li>
            </ul>
        </nav>
        */
    );
};
