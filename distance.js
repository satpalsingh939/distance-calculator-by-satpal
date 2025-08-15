document.getElementById("distanceForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const city1 = document.getElementById("toCity").value;
    const city2 = document.getElementById("fromCity").value;

    if (city1 && city2) {
        calculateDistance(city1, city2);
    } else {
        alert("Please enter both Cities..");
    }
});

function calculateDistance(city1, city2) {
    const apiKey = "2002720c60684a67bb54c87f71a88534";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city1)}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const originCoords = data.results[0]?.geometry;
            if (originCoords) {
                const originLat = originCoords.lat;
                const originLng = originCoords.lng;

                // Now get the destination coordinates
                const destinationUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city2)}&key=${apiKey}`;

                fetch(destinationUrl)
                    .then(response => response.json())
                    .then(data => {
                        const destinationCoords = data.results[0]?.geometry;
                        if (destinationCoords) {
                            const destinationLat = destinationCoords.lat;
                            const destinationLng = destinationCoords.lng;

                            // Calculate the distance between origin and destination using Haversine formula
                            const distance = haversineDistance(originLat, originLng, destinationLat, destinationLng);
                            document.getElementById("displayBlk").textContent = `Distance From ${city1} To ${city2} Is : ${distance.toFixed(2)} km`;
                        } else {
                            document.getElementById("displayBlk").textContent = "Destination not found.";
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching destination:", error);
                        document.getElementById("displayBlk").textContent = "Error calculating distance.";
                    });
            } else {
                document.getElementById("displayBlk").textContent = "Origin not found.";
            }
        })
        .catch(error => {
            console.error("Error fetching origin:", error);
            document.getElementById("displayBlk").textContent = "Error calculating distance.";
        });
}

// Haversine formula to calculate the distance between two points on Earth
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}