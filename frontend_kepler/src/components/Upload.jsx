import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';



const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT 
const numCPUs = import.meta.env.VITE_REACT_APP_NUM_CPUS


export default function Upload()
{
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [jobName, setJobName] = useState('');
    const [cpus, setCpus] = useState('');
    const [memory, setMemory] = useState('');
    const [time, setTime] = useState('');
    const [submit, setSubmit] = useState("Submit");
    const [uploadResponse, setUploadResponse] = useState('');


    const handleUpload = async (e) => {
        e.preventDefault();
        setSubmit(<Spinner animation="border" role="status" size="sm" />);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobName', jobName);
        formData.append('cpus', cpus);
        formData.append('memory', memory);
        formData.append('time', time);
        const response = await fetch(`http://${apiUrl}:${apiPort}/api/users/stagejob`, {
            method: 'POST',
            body: formData,
            headers: {
                'kepler-token': localStorage.getItem('kepler-token')
            }
        });
    
        const data = await response.json();

        if(response.ok) {
            console.log('Job submitted successfully');
            setUploadResponse(<Alert variant="success" className="mt-3">{data.message}</Alert>);
            setTimeout(() => {
                setSubmit("Submit");
                setUploadResponse('');
                handleClose();
                setJobName('');
                setCpus('');
                setMemory('');
                setTime('');
                setFile(null);
            }, 3000);


        } 
        else {
            console.error(response.message);
            setSubmit("Submit");
            setUploadResponse(<Alert variant="danger" className="mt-3">{data.message}</Alert>);
        }
    }

    const handleTimeChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9:]/g, ""); // Allow numeric characters and colon
    
        // Count the number of colons in the input
        const colonCount = (value.match(/:/g) || []).length;
    
        if (colonCount < 1 && value.length > 2) {
            // Insert first colon after two digits
            value = value.slice(0, 2) + ":" + value.slice(2);
        }
        if (colonCount < 2 && value.length > 5) {
            // Insert second colon after five characters
            value = value.slice(0, 5) + ":" + value.slice(5);
        }
        // Limit length to 8 characters (hh:mm:ss)
        value = value.slice(0, 8);
        setTime(value);
    };





    return(
        <>
        <Button variant='secondary' onClick={handleShow}>New <i class="bi bi-plus"></i></Button>

        <Modal show={show} onHide={handleClose} centered data-bs-theme="">
            <Modal.Header closeButton>
                <Modal.Title>Create New Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpload}>
                    <Form.Group className="mb-3" controlId="">
                        <Form.Label>Job Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Job Name" onChange={(e) => setJobName(e.target.value)} value={jobName} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCPU">
                        <Form.Label>Number of CPUs</Form.Label>
                        <Form.Control type="number" placeholder="Enter Number of CPUs" onChange={(e) => {setCpus(e.target.value)}} value={cpus} required min={1} max={numCPUs} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMemory">
                        <Form.Label>Amount of Memory (MB)</Form.Label>
                        <Form.Control type="number" placeholder="Amount of Memory MB" onChange={(e) => {setMemory(e.target.value)}} value={memory} required min={1} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTime">
                        <Form.Label>Time Allotment (hh:mm:ss)</Form.Label>
                        <Form.Control type="text" placeholder="hh:mm:ss" onChange={handleTimeChange} value={time} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Upload File</Form.Label>
                        <Form.Control type="file" onChange={(e) => {setFile(e.target.value)}} value={file} required />
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