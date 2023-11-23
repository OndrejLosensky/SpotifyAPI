document.addEventListener("DOMContentLoaded", function () {
    let accessToken = 'BQB0sCzrcryUBWDpkwQCcKKo2BkQWnT2NphfxLbCCndyg0CqZhuHu1nFFG_TKwcff0bWA-l8yNc9hKePG9pln5tvUHUy2LsuipWbkrVqU35wOvDhL1hEbbPkwLU';

    const clientId = '293dcee6ecde4116bb53b61373415d40';
    const clientSecret = 'd0f053c0b4ec4f25874cf95cb2a952b6';

    // Fetch access token when the DOM content is loaded
    function fetchAccessToken() {
        fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`
            },
            body: "grant_type=client_credentials&scope=user-top-read"
        })
            .then(response => response.json())
            .then(data => {
                accessToken = data.access_token;
                console.log("Access token fetched:", accessToken);

                // Call the function to fetch top artists
                fetchTopArtists();
            })
            .catch(error => {
                console.error("Error fetching access token:", error);
            });
    }

    // Function to fetch top artists
function fetchTopArtists() {
    fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const topArtists = data.items;
            // Handle the data and update the HTML
            displayTopArtists(topArtists);
        })
        .catch(error => {
            console.error("Error fetching top artists:", error);
        });
}

    // Function to display top artists
    function displayTopArtists(artists) {
        const artistsContainer = document.getElementById('artists-container');
        const chosenArtistHeading = document.getElementById('chosen-artist');

        // Check if the container element is found
        if (!artistsContainer) {
            console.error('Error: Artists container not found.');
            return;
        }

        // Clear existing content
        artistsContainer.innerHTML = '';

        // Loop through each artist and display its information
        artists.forEach(artist => {
            const artistInfo = document.createElement('div');
            artistInfo.classList.add('artist-info');

            const artistName = document.createElement('h2');
            const artistLink = document.createElement('a');
            artistLink.href = artist.external_urls.spotify;
            artistLink.target = '_blank';
            artistLink.textContent = artist.name;
            artistName.appendChild(artistLink);

            // Image
            const image = document.createElement('img');
            image.src = artist.images && artist.images.length > 0 ? artist.images[0].url : 'placeholder-image.jpg';
            image.alt = artist.name;

            // Append elements to the container
            artistInfo.appendChild(artistName);
            artistInfo.appendChild(image);

            // Append the artist info container to the main container
            artistsContainer.appendChild(artistInfo);
        });

        // Set the chosen artist heading
        chosenArtistHeading.textContent = 'Top 10 Artists (Last Month)';
    }

    // Initial fetch for top artists
    fetchAccessToken();

    // Set up token refresh every 30 minutes
    setInterval(fetchAccessToken, 30 * 60 * 1000);
});
