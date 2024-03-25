import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';



const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT 
const numCPUs = import.meta.env.VITE_REACT_APP_NUM_CPUS


export default function Upload()
{
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [container, setContainer] = useState(null);
    const [jobName, setJobName] = useState('');
    const [cpus, setCpus] = useState('');
    const [Nodes, setNodes] = useState('');
    const [memory, setMemory] = useState('');
    const [time, setTime] = useState('');
    const [submit, setSubmit] = useState("Submit");
    const [uploadResponse, setUploadResponse] = useState('');

    const handleFileChange = (e) => {
        let containered = e.target.files[0];

        if (containered && containered.name.endsWith('.tar')) {
            console.log('Valid file type');
            setContainer(containered);
        } else {
            console.log('Invalid file type. Please upload a .tar file');
            setContainer(null);
            setUploadResponse(<Alert variant="danger" className="mt-3">Invalid file type. Please upload a .tar file</Alert>);
        }
    }

    const handleResetStates = () => {
        setSubmit("Submit");
        setContainer(null);
        setJobName('');
        setCpus('');
        setNodes('');
        setMemory('');
        setTime('');
        setUploadResponse('');
    }


    const handleUpload = async (e) => {

        
        e.preventDefault();
        setSubmit(<Spinner animation="border" role="status" size="sm" />);

        // Grab the fileName from the container object
        const fileName = container.name;
        console.log(fileName);



        const formData = new FormData();
        formData.append('file', container);
        formData.append('containerName', fileName);
        formData.append('jobName', jobName);
        formData.append('cpus', cpus);
        formData.append('nodes', Nodes);
        formData.append('memory', memory);
        formData.append('maxTime', time);
        const response = await fetch(`http://${apiUrl}:${apiPort}/api/users/stagejob`, {
            method: 'POST',
            body: formData,
            headers: {
                'kepler-token': localStorage.getItem('kepler-token'),
                'encoding': 'multipart/form-data'
            }
        });
    
        const data = await response.json();

        if(response.ok) {
            console.log('Job submitted successfully');
            setUploadResponse(<Alert variant="success" className="mt-3">{data.message}</Alert>);
            setTimeout(() => {
                handleResetStates();
                handleClose();
            }, 3000);

        } 
        else if(response.status === 401) {
            console.error(data.message);
            setUploadResponse(<Alert variant="danger" className="mt-3">{data.message}</Alert>);
            handleResetStates();
            setTimeout(() => {
                localStorage.removeItem('kepler-token');
                navigate('/');
            }, 3000);

        }

        else {
            console.error(response.message);
            handleResetStates();
            setUploadResponse(<Alert variant="danger" className="mt-3">{data.message}</Alert>);
        }

    }

    const handleTimeChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9:-]/g, ""); // Allow numeric characters, colon, and dash

        // Count the number of colons and dashes in the input
        const colonCount = (value.match(/:/g) || []).length;
        const dashCount = (value.match(/-/g) || []).length;

        if (dashCount < 1 && value.length > 2) {
            // Insert dash after two digits
            value = value.slice(0, 2) + "-" + value.slice(2);
        }
        if (colonCount < 1 && value.length > 5) {
            // Insert first colon after five characters
            value = value.slice(0, 5) + ":" + value.slice(5);
        }
        if (colonCount < 2 && value.length > 8) {
            // Insert second colon after eight characters
            value = value.slice(0, 8) + ":" + value.slice(8);
        }
        // Limit length to 11 characters (dd-hh:mm:ss)
        value = value.slice(0, 11);

        // Check if the days are more than 14
        const days = parseInt(value.split("-")[0]);
        if (days > 14) {
            value = "14-00:00:00";
        } else if (days === 14) {
            const timeParts = value.split("-");
            if (timeParts[1] !== "00:00:00") {
                value = "14-00:00:00";
            }
        }

        setTime(value);
    };





    return(
        <>
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Upload New Job</Tooltip>}>
            <Button variant='primary' onClick={handleShow}><i class="bi bi-plus"></i></Button>
        </OverlayTrigger>

        <Modal show={show} onHide={handleClose} centered data-bs-theme="">
            <Modal.Header closeButton>
                <Modal.Title>Create New Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpload}>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Job Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Job Name" onChange={(e) => {setJobName(e.target.value)}} value={jobName} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCPU">
                        <Form.Label>Number of CPUs</Form.Label>
                        <Form.Control type="number" placeholder="Enter Number of CPUs" onChange={(e) => {setCpus(e.target.value)}} value={cpus} required min={1} max={numCPUs} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formNodes">
                        <Form.Label>Number of Nodes</Form.Label>
                        <Form.Control type="number" placeholder="Enter Number of Nodes" onChange={(e) => {setNodes(e.target.value)}} value={Nodes} required min={1} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMemory">
                        <Form.Label>Amount of Memory (MB)</Form.Label>
                        <Form.Control type="number" placeholder="Amount of Memory MB" onChange={(e) => {setMemory(e.target.value)}} value={memory} required min={1} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTime">
                        <Form.Label>Time Allotment (DD-HH:MM:SS)</Form.Label>
                        <Form.Control type="text" placeholder="DD-HH:MM:SS" onChange={handleTimeChange} value={time} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Upload Container</Form.Label>
                        <Form.Control type="file" accept=".tar" onChange={handleFileChange} required />
                    </Form.Group>
                    

                    <Button variant="primary" type="submit">
                        {submit}
                    </Button>
                </Form>
                {uploadResponse}
            </Modal.Body>
        </Modal>
        </>
    );
};