import React, { useEffect, useState } from "react"
import DashNavbar from "./DashNavbar";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from 'react-router-dom';
import Placeholder from "react-bootstrap/Placeholder";
import Upload from "./Upload";
import ProgressBar from "react-bootstrap/ProgressBar";
import TokenValidation from "./TokenValidation";
import Button from "react-bootstrap/Button";

const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT


export default function DashBoard() {

    const navigation = useNavigate();
    const [tableData, setTableData] = useState({ activeJobs: [], stagedJobs: [], completedJobs: [] });

    // Token Validation Function
    async function validateToken() {
        if (!(await TokenValidation())) {
            navigation("/");
        }
    }

    // After tokenValidation, load active, staged, and Completed jobs into corresponding tables
    const loadJobQueues = async () => {
        const token = localStorage.getItem("kepler-token");
        const response = await fetch(`http://${apiUrl}:${apiPort}/api/users/loadtables`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token }),
        });

        const data = await response.json();
        console.log(data);
        setTableData(data);
    }

    // Handles deletion of a staged or completed job
    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this job?");
        if (confirm) {
            const token = localStorage.getItem("kepler-token");
            const response = await fetch(`http://${apiUrl}:${apiPort}/api/users/deletejob`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token, jobId: id }),
            });

            if (response.ok) {
                handleRefresh();
            }

            else {
                console.log("Job deletion failed", response.status, response.statusText);
            }

        }
    }

    // Handles the download of a completed job
    const handleDownload = async (id) => {
        const token = localStorage.getItem("kepler-token");



    }

    // Handles the cancelation of an active job
    const handleCancel = async (id) => {
        const token = localStorage.getItem("kepler-token");

    }

    // Handles clearing the all of the tables of jobs. Used in the handleRefresh function
    const handleClearQueues = async () => {
        setTableData({ activeJobs: [], stagedJobs: [], completedJobs: [] });
    }

    const handleRefresh = async () => {
        handleClearQueues();
        loadJobQueues();
    }

    // On page load, check for JSON Web Token in local storage with user's credentials, if none, redirect to login page
    useEffect(() => {
        validateToken()
        loadJobQueues();
    }, []); 






    return(
        <>
            <DashNavbar/>
            <Container className="pt-5">
                <Row>
                    <Col sm={11}>
                        <h4>Active Job Queue</h4>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex align-items-center justify-content-end">
                        <Button onClick={handleRefresh} variant="secondary"><i class="bi bi-arrow-clockwise"></i></Button>
                        <div className="ms-1">
                            <Upload/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>

                        <Table className="table-striped" hover>
                            <thead>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </thead>
                            <tbody id="activeTable">
                            {tableData.activeJobs.length === 0 ? (
                                <>
                                    <Placeholder as="tr" animation="glow" bg="dark">
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                    </Placeholder>
                                    <Placeholder as="tr" animation="glow">
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                    </Placeholder>
                                    <Placeholder as="tr" animation="glow" bg="dark">
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                    </Placeholder>
                                </>
                            ) : (
                                tableData.activeJobs.map(job => (
                                <tr key={job._id}>
                                    <td>{job.jobName}</td>
                                    <td>{job.stateCode}</td>
                                    <td>
                                        {job.isAuthor && (
                                            <>
                                                <Button variant="danger">cancel</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Container className="pt-5">
                <Row>
                    <Col>
                        <h4>Staged Jobs</h4>
                        <Table hover className="table-striped">
                            <thead>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </thead>
                            <tbody id="inactiveTable">
                                {tableData.stagedJobs.length === 0 ? (
                                    <>
                                        <Placeholder as="tr" animation="glow" bg="dark">
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        </Placeholder>
                                        <Placeholder as="tr" animation="glow">
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        </Placeholder>
                                        <Placeholder as="tr" animation="glow" bg="dark">
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        </Placeholder>
                                    </>
                                    ) : (
                                        tableData.stagedJobs.map(job => (
                                        <tr key={job._id}>
                                            <td>{job.jobName}</td>
                                            <td colSpan={4}>
                                                <ProgressBar now={100} variant="info" className="mt-3" animated></ProgressBar>
                                            </td>
                                            <td className="text-end" colSpan={4}>
                                                <Button onClick={() => handleDelete(job._id)} variant="outline-danger"><i class="bi bi-x-circle"></i> Delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Container className="pt-5">
                <Row>
                    <Col>
                        <h4>Completed Jobs</h4>
                        <Table hover className="table-striped">
                            <thead>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </thead>
                            <tbody id="completedTable">
                                {tableData.completedJobs.length === 0 ? (
                                    <>
                                        <Placeholder as="tr" animation="glow" bg="dark">
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        </Placeholder>
                                        <Placeholder as="tr" animation="glow">
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        </Placeholder>
                                        <Placeholder as="tr" animation="glow" bg="dark">
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                            <td><Placeholder xs={12} bg="dark" size="sm" /></td>
                                        </Placeholder>
                                    </>
                                    ) : (
                                        tableData.completedJobs.map(job => (
                                        <tr key={job._id}>
                                            <td>{job.jobName}</td>
                                            <td>{job.stateCode}<ProgressBar variant="success" now={100}></ProgressBar></td>
                                            <td>
                                                <Button>download</Button>
                                                <Button onClick={() => handleDelete(job._id)} variant="danger">delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
