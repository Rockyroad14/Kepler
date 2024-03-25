import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import Admin from "./Admin";
import Profile from "./Profile";
import { useNavigate } from 'react-router-dom';
import getUserRole from "./getUserRole";

const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT;


export default function DashNavbar() {
  
  const navigation = useNavigate();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleShowAdmin = () => setShowAdmin(true);
  const handleCloseAdmin = () => setShowAdmin(false);
  const handleShowProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);

  const GetUserRole = async () => {
    if ((await getUserRole())) {
      console.log("User is an admin");
      setIsAdmin(true);
    } else {
      console.log("User is not an admin");
    }
  }

  useEffect(() => {
    GetUserRole()
  })

  const handleSignOut = () => {
    localStorage.removeItem('kepler-token');
    navigation("/");
  }
    
  return(
    <>
      <Navbar expand="lg"  className="bg-body-tertiary" data-bs-theme="dark" sticky="top">
        <Container>
          <Navbar.Brand>
            <img src="/icons8-planet-emoji-32.png" className="d-inline-block align top"></img>
            Kepler Cluster
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-right" variant="blue">
            <Nav className="mr-auto" variant="underline">
              <Link to="/dashboard" className="nav-link">
                <i className="bi bi-house-fill"></i> Home</Link>
              {isAdmin == true && (<Nav.Link onClick={handleShowAdmin}><i className="bi bi-database-fill-gear"></i> Admin</Nav.Link>)}
              <Nav.Link onClick={handleShowProfile}><i className="bi bi-person-circle"></i> Profile</Nav.Link>
              <Nav.Link onClick={handleSignOut}>Sign Out <i className="bi bi-arrow-bar-right"></i></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={showAdmin} onHide={handleCloseAdmin} placement="end" data-bs-theme="dark">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><i class="bi bi-database-fill-gear"></i> Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Admin/>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showProfile} onHide={handleCloseProfile} placement="end" data-bs-theme="dark">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><i class="bi bi-person-circle"></i> Profile</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Profile/>
        </Offcanvas.Body>
      </Offcanvas>
    </>
    );
};
