const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL
const apiPort = import.meta.env.VITE_REACT_APP_BASE_PORT


const HandleLogin = async (email, password) => {
    
    try {
        console.log("Login Button clicked");
        console.log('Email:', email);
        console.log('Password:', password);
        const response = await fetch(`http://${apiUrl}:${apiPort}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if(response.ok) {
            // Redirect to the Dashboard 
            console.log('Login sucessful');
            const { token } = await response.json();

            localStorage.setItem('kepler-token', token);
            return true

            
        }
        else {
            // Handle the error
            console.log('Login Failed');
            return false
        }   
        

    }

    catch (error) {
        console.error('Error occured:', error);
    }
};

export default HandleLogin