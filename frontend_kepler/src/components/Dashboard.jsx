import React, { useEffect, useState} from "react"
import DashNavbar from "./DashNavbar";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from 'react-router-dom';




export default function DashBoard() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (file) {
            console.log("Uploading File...");

            const formData = new FormData();

            formData.apppend("file", file);




        }
    }

    // On page load, check for JSON Web Token in local storage with user's credentials, if none, redirect to login page
    useEffect(() => {
        const token = localStorage.getItem("kepler-token");
        if (!token) {
            navigate("/");
        }
    }, []); 






    return(
        <>
            <DashNavbar/>
            <Container className="pt-5">
                <Row>
                    <Col>
                        <h2>Active Job Queue</h2>
                        <Table className="table-striped">
                            <thead>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Puppy Sim</td>
                                    <td>Running...</td>
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
                        <h2>Inactive Job Queue</h2>
                        <Table>
                            <thead>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Puppy Sim</td>
                                    <td>Staged</td>
                                    <td>Action Buttons</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
