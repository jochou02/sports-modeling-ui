/*
------------------------------------------------------------------------------------
BACKGROUND IMAGE ROTATING FUNCTIONALITY 
------------------------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", function(){

    var images = [
        'images/DRX.jpg', 
        'images/AsolBackground.jpg', 
        'images/Garen.jpg',
        'images/Hecarim.jpg',
        'images/Irelia.jpg',
        'images/Rakan.jpg',
        'images/Aatrox.jpg',
    ];
    var index = 0;

    function changeBackground() {
        document.getElementById('background-wrapper').style.backgroundImage = 'url(' + images[index] + ')';
    
        // Change the index to the next image, loop back to the start if necessary
        index = (index + 1) % images.length;
    }

    // Call the function once immediately, then again every 5 seconds
    changeBackground();
    setInterval(changeBackground, 5000);

    images.forEach(function(src) {
        var img = new Image();
        img.src = src;
    });
});

/*
------------------------------------------------------------------------------------
SUBMIT AND LOADING ANIMATION FUNCTION
------------------------------------------------------------------------------------
*/


document.getElementById('submit').addEventListener('click', function() {

    var player = document.getElementById('player').value;
    var wins = Number(document.getElementById('wins').value);
    var losses = Number(document.getElementById('losses').value);

    // Player name input validation check
    if (player.length == 0) {
        alert('Please enter a player!');
        return;
    }

    // Kills input validation check
    if (!Number.isInteger(wins) || !Number.isInteger(losses) || wins < 0 || losses < 0) {
        alert('Wins and losses must be a non negative integer!');
        return;
    }

    hideOutput();
    hideSubmit();
    hidePlayerNotFoundErr();
    hideGraph();
    showLoading();
    
    fetch('https://sports-modeling.onrender.com/player_info', {
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
    .then(response => {
        if (!response.ok) {
            throw new Error(response.json().error);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('result-name').textContent = `${player} [ ${wins} - ${losses} ]`;
        document.getElementById('result-projection').innerHTML = `Projected Kills: ${data.proj_kills}<br>Projected Deaths: ${data.proj_deaths}`;
        
        var playerData = data.player_data;

        var playerData = data.player_data;

        // Sort playerData by date in descending order and select only the last 10 entries
        playerData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        playerData = playerData.slice(0, 20);
    
        // Reverse the array to have the earliest of those on the left
        playerData.reverse();
    
        // Assign an id to each row
        playerData.forEach((game, i) => game.id = i);
    
        var victoryData = playerData
            .filter(game => game.Result === 'Victory')
            .map(game => ({ x: game.id, y: game.Kills, date: new Date(game.Date).toLocaleDateString() }));
    
        var defeatData = playerData
            .filter(game => game.Result === 'Defeat')
            .map(game => ({ x: game.id, y: game.Kills, date: new Date(game.Date).toLocaleDateString() }));
    
        var data = [{
            x: victoryData.map(game => game.x),
            y: victoryData.map(game => game.y),
            name: 'Victories',
            type: 'bar',
            marker: { color: 'green' },
            hovertemplate: victoryData.map(game => `${game.y} Kills<br>${game.date}<extra></extra>`) // Custom hovertemplate
        },
        {
            x: defeatData.map(game => game.x),
            y: defeatData.map(game => game.y),
            name: 'Defeats',
            type: 'bar',
            marker: { color: 'red' },
            hovertemplate: defeatData.map(game => `${game.y} Kills<br>${game.date}<extra></extra>`) // Custom hovertemplate
        }];
    
        var layout = {
            title: 'Kills - Last 20 Games',
            xaxis: { title: 'Matches' },
            yaxis: { title: 'Kills' },
            barmode: 'group' // Each bar is separate, not stacked
        };
    
        Plotly.newPlot('graph', data, layout);

        hideLoading();
        showGraph();
        showSubmit();
        showOutput();
    })
    .catch((error) => {
        document.getElementById('result-name').textContent = 'Error';
        document.getElementById('result-projection').textContent = error.message;

        hideLoading();
        showSubmit();
        showPlayerNotFoundErr();
    });
});


// Show submit button
function showSubmit () {
    document.getElementById('submit').style.display = 'inline-block';
}

// Hide submit button
function hideSubmit () {
    document.getElementById('submit').style.display = 'none';
}

// Show outputs
function showOutput() {
    document.getElementById('result-name').style.display = 'block';
    document.getElementById('result-projection').style.display = 'block'; 
}

// Hide outputs
function hideOutput(){
    document.getElementById('result-name').style.display = 'none';
    document.getElementById('result-projection').style.display = 'none';
}

// Show the loading indicator
function showLoading() {
    document.getElementsByClassName('lds-ellipsis')[0].style.display = 'block';
    document.getElementById('load-msg').style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
    document.getElementsByClassName('lds-ellipsis')[0].style.display = 'none';
    document.getElementById('load-msg').style.display = 'none';
}

// Show submit button
function showPlayerNotFoundErr() {
    document.getElementById('error-msg').style.display = 'block';
}

// Hide submit button
function hidePlayerNotFoundErr() {
    document.getElementById('error-msg').style.display = 'none';   
}

// Show graph
function showGraph() {
    document.getElementById('graph').style.visibility = 'visible';
}

// Hide graph
function hideGraph() {
    document.getElementById('graph').style.visibility = 'hidden'; 
}

/*
------------------------------------------------------------------------------------
PLAYER AUTOFILL FUNCTIONALITY 
------------------------------------------------------------------------------------
*/

let playersNames = [];

fetch('./all_players.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.split('\n'); // Split CSV into rows
        rows.shift(); // Remove header row

        playersNames = rows.map(row => {
            let columns = row.split(','); // Split row into columns
            return columns[0]; // Return player name (first column)
        });
    });

document.getElementById('player').addEventListener('input', function() {
    let input = this.value;

    // Clear old options
    let datalist = document.getElementById('players');
    datalist.innerHTML = '';

    // Filter players
    let matches = playersNames.filter(name => name.toLowerCase().includes(input.toLowerCase()));

    // Create new options
    matches.forEach(name => {
        let option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });
});