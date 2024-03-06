import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';



export default function Upload()
{
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            console.log("Upload Button clicked");
            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file }),
            });

            if(response.ok) {
                console.log('Upload sucessful');
            }
            else {
                console.error('Upload Failed');
            }   

        }

        catch (error) {
            console.error('Error occured:', error);
        }
    };





    return(
        <>
        <Button variant='secondary' onClick={handleShow}>New <i class="bi bi-plus"></i></Button>

        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpload}>
                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Upload File</Form.Label>
                        <Form.Control type="file" onChange={(e) => {setFile(e.target.value)}} value={file} />
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