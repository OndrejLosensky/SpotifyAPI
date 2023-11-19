    document.addEventListener("DOMContentLoaded", function() {
    // Replace 'YOUR_ACCESS_TOKEN' with your actual access token
    let accessToken = 'BQBkRVRtpoGshoARj9nov8ujejBva6LRAyAmINd1W0WXeuXU_AqN_ToF71hdM75WIjyKCtUE5mtJWJ1SX2s_bysmyiAUNdu0piJ-M0In63lpPnzkaq1K3YcKnHk';

    // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual values
    const clientId = '293dcee6ecde4116bb53b61373415d40';
    const clientSecret = 'd0f053c0b4ec4f25874cf95cb2a952b6';

    const artistInput = document.getElementById('artist-input');
    const searchButton = document.getElementById('search-button');

    // Add event listener for keypress on the input field
    artistInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Add event listener for click on the search button
    searchButton.addEventListener('click', function() {
        performSearch();
    });

    // Function to perform the search
    function performSearch() {
        const artistName = artistInput.value.trim();

        if (artistName) {
            // Call the function to fetch top tracks for the searched artist
            fetchTopTracksForArtistByName(artistName);
        } else {
            console.log('Please enter an artist name.');
        }
    }

    // Function to fetch top tracks for a specific artist by name
    function fetchTopTracksForArtistByName(artistName) {
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const artistId = data.artists.items[0].id;
            // Call the function to fetch top tracks for the found artist
            fetchTopTracksForArtist(artistId);
        })
        .catch(error => {
            console.error(`Error searching for artist ${artistName}:`, error);
        });
    }
    // Function to refresh the access token
    function refreshAccessToken() {
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
            console.log("Access token refreshed:", accessToken);
        })
        .catch(error => {
            console.error("Error refreshing access token:", error);
        });
    }

    // Function to fetch top tracks for a specific artist
    function fetchTopTracksForArtist(artistId) {
        fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=CZ`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const topTracks = data.tracks;
            // Handle the data and update the HTML
            displayTracks(topTracks);
        })
        .catch(error => {
            console.error(`Error fetching top tracks for artist ${artistId}:`, error);
        });
    }

    // Initial request for top tracks for a specific artist
    // Replace 'ARTIST_ID' with the actual artist ID you want to fetch tracks for
    const artistId = ''; // 5iYtjtFv6SvHX95ny4fVEz //3FCo1sUkVbwKnO2m0Z7Bp9
    fetchTopTracksForArtist(artistId);

    // Set up token refresh every 30 minutes
    setInterval(refreshAccessToken, 30 * 60 * 1000);

    function displayTracks(tracks) {
        const tracksContainer = document.getElementById('tracks-container');
        const chosenArtistHeading = document.getElementById('chosen-artist');

        // Check if the container element is found
        if (!tracksContainer) {
            console.error('Error: Tracks container not found.');
            return;
        }

        // Clear existing content
        tracksContainer.innerHTML = '';

        chosenArtistHeading.textContent = `${tracks[0].artists[0].name}`;


        // Loop through each track and display its information
        tracks.forEach(track => {
            const trackInfo = document.createElement('div');
            trackInfo.classList.add('track-info');
            

            const trackName = document.createElement('h2');
            const trackLink = document.createElement('a'); // Add this line
            trackLink.href = track.external_urls.spotify; // Add this line
            trackLink.target = '_blank'; // Open link in a new tab
            trackLink.textContent = track.name; // Add this line
            trackName.appendChild(trackLink); // Add this line

            const artists = document.createElement('p');
            artists.textContent = `Artists: ${track.artists ? track.artists.map(artist => artist.name).join(', ') : 'N/A'}`;

            const album = document.createElement('p');
            album.textContent = `Album: ${track.album ? track.album.name : 'N/A'}`;

            const popularity = document.createElement('p');
            popularity.textContent = `Popularity: ${track.popularity}`;

             // Image
             const image = document.createElement('img');
             image.src = track.album && track.album.images.length > 0 ? track.album.images[0].url : 'placeholder-image.jpg';
             image.alt = track.name;
 

            // Duration
            const duration = document.createElement('p');
            duration.textContent = `Duration: ${msToMinSec(track.duration_ms)}s`;

            // Append elements to the container
            trackInfo.appendChild(trackName);
            trackInfo.appendChild(artists);
            trackInfo.appendChild(album);
            trackInfo.appendChild(popularity);
            trackInfo.appendChild(duration);
            trackInfo.appendChild(image);

            // Append the track info container to the main container
            tracksContainer.appendChild(trackInfo);
        });
    }

    // Function to convert milliseconds to minutes and seconds
    function msToMinSec(duration) {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    }
});