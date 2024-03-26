fetch('/dashboard/transactions')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#transaction-history tbody');
        data.forEach(entry => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${entry.type}</td>
                <td>${entry.from_user}</td>
                <td>${entry.to_user}</td>
                <td>${entry.amount}</td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => console.error('Error:', error));

