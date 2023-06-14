document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://sports-modeling.onrender.com/health')
        .then(response => response.json())
        .then(data => {
            const contentDiv = document.getElementById('content');
            contentDiv.textContent = JSON.stringify(data);
        });
});