import React, { useEffect, useState} from "react"
import DashNavbar from "./DashNavbar";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from 'react-router-dom';
import Placeholder from "react-bootstrap/Placeholder";
import Upload from "./Upload";
import ProgressBar from "react-bootstrap/ProgressBar";

const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT


export default function DashBoard() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);

    // Token Validation Function
    const tokenValidation = async () => {
        const token = localStorage.getItem("kepler-token");
        const response = await fetch(`http://${apiUrl}:${apiPort}/api/tokenlogin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        if (response.ok) {
            console.log("Token validated successfully");
        } else {
            console.log("Token validation failed");
            // Remove token from local storage
            localStorage.removeItem("kepler-token");
            navigate("/");
        }
    }

    // After tokenValidation, load active, staged, and Completed jobs into corresponding tables
    const loadJobQueues = async () => {

    }




    // On page load, check for JSON Web Token in local storage with user's credentials, if none, redirect to login page
    useEffect(() => {
        tokenValidation();
    }, []); 






    return(
        <>
            <DashNavbar/>
            <Container className="pt-5">
                <Row>
                    <Col sm={11}>
                        <h4>Active Job Queue</h4>
                    </Col>
                    <Col className="justify-content-end">
                        <Upload/>
                    </Col>
                </Row>
                <Row>
                    <Col>

                        <Table className="table-striped">
                            <thead>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </thead>
                            <tbody id="activeTable">
                                <tr>
                                    <td>Puppy Sim</td>
                                    <td>Running... <ProgressBar animated now={100} /></td>
                                    <td>Actions Buttons</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Container className="pt-5">
                <Row>
                    <Col>
                        <h4>Staged Jobs</h4>
                        <Table>
                            <thead>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </thead>
                            <tbody id="inactiveTable">
                                <tr>
                                    <td>Star Sim</td>
                                    <td>Completed <ProgressBar variant="success" now={100} /></td>
                                    <td>Actions Buttons</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Container className="pt-5">
                <Row>
                    <Col>
                        <h4>Completed Jobs</h4>
                        <Table>
                            <thead>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </thead>
                            <tbody id="completedTable">
                                <tr>
                                    <td>Star Sim</td>
                                    <td>Completed</td>
                                    <td>Actions Buttons</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
