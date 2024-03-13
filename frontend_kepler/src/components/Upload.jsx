import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';


const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT


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

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobName', jobName);
        formData.append('cpus', cpus);
        formData.append('memory', memory);
        formData.append('time', time);
        const response = await fetch(`http://${apiUrl}:${apiPort}/submit-job`, {
            method: 'POST',
            body: formData,
        });
        if(response.ok) {
            console.log('Job submitted successfully');
        } else {
            console.error('Error submitting job');
        }
    }





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
                        <Form.Control type="number" placeholder="Enter Number of CPUs" onChange={(e) => {setCpus(e.target.value)}} value={cpus} required min={1} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMemory">
                        <Form.Label>Amount of Memory (MB)</Form.Label>
                        <Form.Control type="number" placeholder="Amount of Memory MB" onChange={(e) => {setMemory(e.target.value)}} value={memory} required min={1} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTime">
                        <Form.Label>Time Allotment</Form.Label>
                        <Form.Control type="number" placeholder="Enter Time Allotment" onChange={(e) => {setTime(e.target.value)}} value={time} required min={1} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Upload File</Form.Label>
                        <Form.Control type="file" onChange={(e) => {setFile(e.target.value)}} value={file} required />
                    </Form.Group>
                    

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};