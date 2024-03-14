
const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT

const TokenValidation = async () => {
    const token = localStorage.getItem("kepler-token");
    const response = await fetch(`http://${apiUrl}:${apiPort}/api/tokenlogin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });

    if (response.ok) {
        console.log("Token validated successfully");
        return true
    } else {
        console.log("Token validation failed");
        // Remove token from local storage
        localStorage.removeItem("kepler-token");
        return false
    }
}

export default TokenValidation