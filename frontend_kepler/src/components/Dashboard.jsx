import React, { useState } from "react"
import Navbar from "./Navbar";



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
            <Navbar/>
        </>
    );
};
