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
        document.getElementById('results').textContent = JSON.stringify(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});



// document.addEventListener('DOMContentLoaded', (event) => {
//     fetch('https://sports-modeling.onrender.com/health')
//         .then(response => response.json())
//         .then(data => {
//             const contentDiv = document.getElementById('content');
//             contentDiv.textContent = JSON.stringify(data);
//         });
// });