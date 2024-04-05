const token= localStorage.getItem('token')

if(!token){
    alert("login is needed")
    window.location.href='/'
}

fetch('/dashboard/verify', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            if (!response.ok) {
                // alert("you arent a manager")
                window.location.href= 'http://localhost:3000'
                throw new Error(`Network response was not ok (${response.status})`);
            }
            if (response.status===200){
                alert("success")
                updateTransactions()
                setInterval(updateTransactions, 5000);
            }
            // alert('success');
        })
        .then(responseText => {
            console.log('Response Text:', responseText);
        })
        .catch(error => console.error('Error:', error));



const tbody = document.querySelector('#transaction-history tbody');
function updateTransactions() {
    fetch('/dashboard/transactions',{
        headers:{
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .then(data => {
            const newTbody = document.createElement('tbody');
            data.forEach(entry => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>${entry.type !== null ? entry.type : ''}</td>
                <td>${entry.from_user !== null ? entry.from_user : ''}</td>
                <td>${entry.to_user !== null ? entry.to_user : ''}</td>
                <td>${entry.amount !== null ? entry.amount : ''}</td>
                <td>${entry.status !== null ? entry.status : ''}</td>
            `;
                newTbody.appendChild(tr);
            });
            const oldTbody = document.querySelector('#transaction-history tbody');
            oldTbody.parentNode.replaceChild(newTbody, oldTbody);
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('deposit-form').addEventListener('submit', async (event)=>{
    event.preventDefault()
    const username= document.getElementById('username').value
    const amount= parseInt(document.getElementById('amount').value)

    await fetch('/dashboard/deposit',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, amount})
    })
        .then(response => {
            if (response.status===200) {
                tbody.innerHTML=''
                updateTransactions()
            }
        })
        .catch(error=> console.error('err: ', error))
})

document.getElementById('withdraw-form').addEventListener('submit', async (event)=>{
    event.preventDefault()

    const username= document.getElementById('withdraw-username').value
    const amount= document.getElementById('withdraw-amount').value

    await fetch('/dashboard/withdraw',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, amount})
    })
        .then(response => {
            if (response.status===200) {
                tbody.innerHTML=''
                updateTransactions()
            }
            if(response.status===403){
                alert('insufficient balance')
            }
        })
        .catch(error=> console.error('err: ', error))
})

document.getElementById('transfer-form').addEventListener('submit', async (event)=>{
    event.preventDefault()

    const username1= document.getElementById('transfer-username1').value
    const username2= document.getElementById('transfer-username2').value
    const amount= document.getElementById('transfer-amount').value

    await fetch('/dashboard/transfer',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username1, username2, amount})
    })
        .then(response => {
            if (response.status===200) {
                tbody.innerHTML=''
                updateTransactions()
            }
            if(response.status===403){
                alert('insufficient balance')
            }
        })
        .catch(error=> console.error('err: ', error))
})

document.getElementById('logout').addEventListener('click',()=>{
    alert('thankyou for visiting')
    localStorage.removeItem('token')
    window.location.href= 'http://localhost:3000'
})

