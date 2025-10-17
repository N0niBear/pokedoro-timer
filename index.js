function updateDateTime() {
    const now = new Date();

    const options = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric' 
    };
   
    const dateString = now.toLocaleDateString(undefined, options);
    const timeString = now.toLocaleTimeString();

    document.getElementById('date').textContent = dateString;
    document.getElementById('time').textContent = timeString;
}

updateDateTime();
setInterval(updateDateTime, 1000);
