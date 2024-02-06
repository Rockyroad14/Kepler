import React, { useState } from "react"
import DashNavbar from "./DashNavbar";
import '../Dashboard.css';



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
            <div>
                <div>
                    <table>
                        <caption>Process Queue</caption>
                        
                    </table>
                </div>
            </div>
        </>
    );
};
