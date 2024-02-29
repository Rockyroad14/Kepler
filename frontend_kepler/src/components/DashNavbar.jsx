import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import Admin from "./Admin"


export default function DashNavbar() {
    
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');

  const handleShowAdmin = () => setShowAdmin(true);
  const handleCloseAdmin = () => setShowAdmin(false);
  const handleShowProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);

  const getUserRole = () => {
    return 1;
  }

  useEffect(() => {
    const userRole = getUserRole();
    setIsAdmin(userRole);
  })

  const handleSignOut = () => {

  }
    
  return(
    <>
      <Navbar expand="lg"  className="bg-body-tertiary" data-bs-theme="dark" fixed="top">
        <Container>
          <Navbar.Brand>
            <img src="/icons8-planet-emoji-32.png" className="d-inline-block align top"></img>
            Kepler Cluster
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-right" variant="blue">
            <Nav className="mr-auto" variant="underline">
              <Link to="/dashboard" className="nav-link">
                Home
              </Link>
              {isAdmin === 1 && (<Nav.Link onClick={handleShowAdmin}>Admin</Nav.Link>)}
              <Nav.Link onClick={handleShowProfile}>Profile</Nav.Link>
              <Nav.Link onClick={handleSignOut}>Sign Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={showAdmin} onHide={handleCloseAdmin} placement="end" data-bs-theme="dark">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Admin/>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showProfile} onHide={handleCloseProfile} placement="end" data-bs-theme="dark">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profile</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Add Component Here...
        </Offcanvas.Body>
      </Offcanvas>
    </>
    );
};
