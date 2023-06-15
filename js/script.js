document.getElementById('submit').addEventListener('click', function() {
    var player = document.getElementById('player').value;
    var wins = parseInt(document.getElementById('wins').value);
    var losses = parseInt(document.getElementById('losses').value);

    // Hide output divs
    document.getElementById('result-name').style.display = 'none';
    document.getElementById('result-projection').style.display = 'none';

    // Hide submit button
    document.getElementById('submit').style.display = 'none';

    // Show the loading indicator
    document.getElementsByClassName('lds-ellipsis')[0].style.display = 'block';
    
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
        
        // Hide loading indicator
        document.getElementsByClassName('lds-ellipsis')[0].style.display = 'none';
        
        // Show submit button
        document.getElementById('submit').style.display = 'inline-block';

        // Show output divs
        document.getElementById('result-name').style.display = 'block';
        document.getElementById('result-projection').style.display = 'block'; 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});