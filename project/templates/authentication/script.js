document.addEventListener('DOMContentLoaded', function () {
    const dayNightToggle = document.getElementById('dayNightToggle');
    const body = document.body;

    function updateDayNightToggle() {
        const currentHour = new Date().getHours();

        if (currentHour >= 6 && currentHour < 18) {
            // Daytime: Show sun
            dayNightToggle.src = 'img/sun.png'; 
            dayNightToggle.alt = 'Sun';
            // Set background color to white for daytime
            body.style.backgroundColor = '#ffffff';
        } else {
            // Nighttime: Show moon
            dayNightToggle.src = 'img/moon.png'; 
            dayNightToggle.alt = 'Moon';
            // Set background color to black for nighttime (dark mode)
            body.style.backgroundColor = '#242322';
        }
    }

    // Initial update on page load
    updateDayNightToggle();

    // Set up an interval to update every minute 
    setInterval(updateDayNightToggle, 60000);
});