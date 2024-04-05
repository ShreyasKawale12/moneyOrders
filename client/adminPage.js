const socket= io.connect()

socket.on('message', message => {
    const bankBalance = document.getElementById('bankBalance');
    bankBalance.innerText = message[0];

    const totalSent = document.getElementById('totalSent');
    totalSent.innerText = message[1];

    const totalReceived = document.getElementById('totalReceived');
    totalReceived.innerText = message[2];

    const receivedLastHour = document.getElementById('receivedLastHour');
    receivedLastHour.innerText = message[3];

    const sentLastHour = document.getElementById('sentLastHour');
    sentLastHour.innerText = message[4];
});


