let players = [];

function addPlayer() {
    const playerName = document.getElementById('playerName').value;
    let startingStack = parseFloat(document.getElementById('startingStack').value);

    // Ensure startingStack is non-negative
    startingStack = Math.max(0, startingStack);

    if (playerName && startingStack >= 0) {
        players.push({
            name: playerName,
            startingStack: startingStack,
            endingStack: 0
        });

        document.getElementById('playerName').value = '';
        document.getElementById('startingStack').value = '';

        renderPlayers();
    } else {
        alert('Please ensure the starting stack is non-negative.');
    }
}

function deletePlayer(index) {
    players.splice(index, 1);
    renderPlayers();
}

function renderPlayers() {
    const playersList = document.querySelector('.players-list');
    playersList.innerHTML = '';

    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.innerHTML = `
            <span>${player.name}</span>
            <span>$${player.startingStack.toFixed(2)}</span>
            <input type="number" placeholder="Ending Stack" min="0" onchange="updateEndingStack(${index}, this.value)">
            <button onclick="deletePlayer(${index})">Delete</button>
        `;
        playersList.appendChild(playerDiv);
    });
}

function updateEndingStack(index, value) {
    let endingStack = parseFloat(value);
    // Ensure endingStack is non-negative
    endingStack = Math.max(0, endingStack);
    players[index].endingStack = endingStack;
}

function calculateDebt() {
    const resultsDiv = document.querySelector('.results');
    resultsDiv.innerHTML = '';

    let totalDebt = 0;

    players.forEach(player => {
        const difference = player.endingStack - player.startingStack;
        totalDebt += difference;
    });

    if (totalDebt !== 0) {
        resultsDiv.innerHTML = 'The debts do not balance out. Please check the stacks.';
        return;
    }

    players.forEach(playerA => {
        const differenceA = playerA.endingStack - playerA.startingStack;
        if (differenceA < 0) {
            players.forEach(playerB => {
                const differenceB = playerB.endingStack - playerB.startingStack;
                if (differenceB > 0) {
                    const owedAmount = Math.min(-differenceA, differenceB);
                    resultsDiv.innerHTML += `<p>${playerA.name} owes ${playerB.name} $${owedAmount.toFixed(2)}</p>`;
                    playerA.endingStack += owedAmount;
                    playerB.endingStack -= owedAmount;
                }
            });
        }
    });
}