alert("message")

document.getElementById('customerForm').addEventListener('submit',async (event)=>{
    event.preventDefault()
    const username= document.getElementById('username').value
    const password = document.getElementById('password').value

    const response= await fetch('/dashboard/signup',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })

})