const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT

const getUserRole = async () => {
    const token = localStorage.getItem("kepler-token");
    const response = await fetch(`http://${apiUrl}:${apiPort}/api/users/usertype`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "kepler-token": token
        }
    })

    if(response.ok){
        console.log("User is an admin");
        // setIsAdmin(true);
        return true;
    } else {
        console.log("User is not an admin");
        return false;
    }
}

export default getUserRole;
