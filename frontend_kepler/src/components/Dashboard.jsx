import React, { useState } from "react"
import DashNavbar from "./DashNavbar";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";




export default function DashBoard() {

    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (file) {
            console.log("Uploading File...");

            const formData = new FormData();

            formData.apppend("file", file);




        }
    }





    return(
        <>
            <DashNavbar/>
            <Container>
                <Row>
                    <Col/>
                    <Col>
                        <Table>

                        </Table>
                    </Col>
                    <Col/>
                </Row>
            </Container>
        </>
    );
};
