document.getElementById('submit').addEventListener('click', function() {
    var player = document.getElementById('player').value;
    var wins = parseInt(document.getElementById('wins').value);
    var losses = parseInt(document.getElementById('losses').value);
    
    fetch('https://sports-modeling.onrender.com/proj_kills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player: player,
            wins: wins,
            losses: losses,
        }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result-name').textContent = `${player} [ ${wins} - ${losses} ]`;
        document.getElementById('result-projection').textContent = `Projected Kills: ${data.proj_kills}`;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});