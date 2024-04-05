document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Username:', username);
    console.log('Password:', password);

    const response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        if(data.designation==='manager'){
            const token = data.token;
            localStorage.setItem('token', token);
            window.location.href = '/dashboard';
        }
        else{
            const token = data.token;
            localStorage.setItem('token', token);
            window.location.href = `/${data.username}`;
        }
    } else {
        alert(data.message);
    }
});



