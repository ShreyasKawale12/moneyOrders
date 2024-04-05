const pathSegments = window.location.pathname.split('/');
const username = pathSegments[pathSegments.length - 1];
alert(username);
const token= localStorage.getItem('token')

if(!token){
    alert("login is needed")
    window.location.href= 'http://localhost:3000'
}

const tbody = document.querySelector('#transaction-history tbody');
fetch(`/${username}/transactions`, {
    headers:{
        'Authorization': `Bearer ${token}`
    },
})
    .then(response => response.json())
    .then(data => {
        const newTbody = document.createElement('tbody');
        data.reverse().forEach(entry => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${entry.type !== null ? entry.type : ''}</td>
                <td>${entry.from_user !== null ? entry.from_user : ''}</td>
                <td>${entry.to_user !== null ? entry.to_user : ''}</td>
                <td>${entry.amount !== null ? entry.amount : ''}</td>
            `;
            newTbody.appendChild(tr);
        });
        const oldTbody = document.querySelector('#transaction-history tbody');
        oldTbody.parentNode.replaceChild(newTbody, oldTbody);
    })
    .catch(error => console.error('Error:', error));


// Add an event listener to the form's submit event
document.getElementById('emailForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const records = document.getElementById('records').value;
    const user= document.getElementById('user').value
    const afterDate= document.getElementById('afterDate').value
    const beforeDate= document.getElementById('beforeDate').value
    // Send a POST request to the server
    const response = await fetch(`/${username}/email-transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ records, username, user, afterDate, beforeDate })
    });

    if (response.ok) {
        alert('Email sent successfully.');
    } else {
        console.error('Error:', response.statusText);
    }
});

document.getElementById('logout').addEventListener('click',()=>{
    localStorage.removeItem('token')
    window.location.href= 'http://localhost:3000'
})

