document.addEventListener("DOMContentLoaded", function() {
    let accessToken = 'BQChTAYRPV8iKaJ2k69lp3mKky8x9TzjWh8svIfowqhGtcKs8mAXbL5V7KR2dd5Db0ljYVzPkB4mbzHASdFP5V384qQu_XF-3eWQCvWJLgkWT6j-vFDyS1tLH-E';

     // Function to fetch artist details including description and followers
     function fetchArtistDetails(artistId) {
        fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update the HTML with artist description and followers
            const artistDescription = document.getElementById('artist-description-text');
            const artistFollowers = document.getElementById('artist-followers');

            if (artistDescription && artistFollowers) {
                artistDescription.textContent = `Description: ${data.genres.join(', ')}`;
                artistFollowers.textContent = `Followers: ${data.followers.total}`;
            }
        })
        .catch(error => {
            console.error(`Error fetching artist details for artist ${artistId}:`, error);
        });
    }

    // Function to refresh the access token
    function refreshAccessToken() {
        // Your logic to refresh the access token
        // This could involve making a request to the Spotify API with your client ID and client secret
        // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual values

        const clientId = '293dcee6ecde4116bb53b61373415d40';
        const clientSecret = 'd0f053c0b4ec4f25874cf95cb2a952b6';

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

            // Now that you have a new access token, you can fetch and display artist information
            fetchTopArtists();
        })
        .catch(error => {
            console.error("Error refreshing access token:", error);
            console.log("Token refresh error response:", error.response); // Add this line
        });
    }

    // Function to fetch top artists
        function fetchTopArtists() {
            fetch("https://api.spotify.com/v1/me/top/artists", {
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
                displayArtists(topArtists);
            })
            .catch(error => {
                console.error(`Error fetching top artists at ${new Date()}:`, error);
                console.log("Full error object:", error);
                if (error.response) {
                    return error.response.text();
                } else {
                    console.log("No response body received.");
                    // Handle the case where the response body is undefined
                }
            })
            .then(responseText => {
                if (responseText) {
                    console.log("Response body:", responseText);
                }
            });
        }

    // Initial request for top artists
    fetchTopArtists();

    // Set up token refresh every 30 minutes
    setInterval(refreshAccessToken, 30 * 60 * 1000);document.addEventListener("DOMContentLoaded", function() {
        let accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your initial access token
    
        // Function to refresh the access token
        function refreshAccessToken() {
            // Your logic to refresh the access token
            // This could involve making a request to the Spotify API with your client ID and client secret
            // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual values
    
            const clientId = 'YOUR_CLIENT_ID';
            const clientSecret = 'YOUR_CLIENT_SECRET';
    
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
    
                // Now that you have a new access token, you can fetch and display top tracks
                fetchTopTracks();
            })
            .catch(error => {
                console.error("Error refreshing access token:", error);
            });
        }
    
        // Function to fetch top tracks
        function fetchTopTracks() {
            fetch("https://api.spotify.com/v1/me/top/tracks", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => response.json())
            .then(data => {
                const topTracks = data.items;
                // Handle the data and update the HTML
                displayTracks(topTracks);
            })
            .catch(error => {
                console.error('Error fetching top tracks:', error);
            });
        }
    
        // Initial request for top tracks
        fetchTopTracks();
    
        // Set up token refresh every 30 minutes
        setInterval(refreshAccessToken, 30 * 60 * 1000);
    
        function displayTracks(tracks) {
            const tracksContainer = document.getElementById('tracks-container');
    
            // Check if the container element is found
            if (!tracksContainer) {
                console.error('Error: Tracks container not found.');
                return;
            }
    
            // Clear existing content
            tracksContainer.innerHTML = '';
    
            // Loop through each track and display its information
            tracks.forEach(track => {
                const trackInfo = document.createElement('div');
                trackInfo.classList.add('track-info');
    
                // Create HTML elements to display track information
                const trackName = document.createElement('h2');
                trackName.textContent = track.name;
    
                const artists = document.createElement('p');
                artists.textContent = `Artists: ${track.artists ? track.artists.map(artist => artist.name).join(', ') : 'N/A'}`;
    
                const album = document.createElement('p');
                album.textContent = `Album: ${track.album ? track.album.name : 'N/A'}`;
    
                const popularity = document.createElement('p');
                popularity.textContent = `Popularity: ${track.popularity}`;
    
                // Duration
                const duration = document.createElement('p');
                duration.textContent = `Duration: ${msToMinSec(track.duration_ms)}`;
    
                // Append elements to the container
                trackInfo.appendChild(trackName);
                trackInfo.appendChild(artists);
                trackInfo.appendChild(album);
                trackInfo.appendChild(popularity);
                trackInfo.appendChild(duration);
    
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

    function displayArtists(artists) {
        const artistContainer = document.getElementById('artist-container');
    
        // Check if the container element is found
        if (!artistContainer) {
            console.error('Error: Artist container not found.');
            return;
        }
    
        // Clear existing content
        artistContainer.innerHTML = '';
    
        // Loop through each artist and display their information
        artists.forEach(artist => {
            const artistInfo = document.createElement('div');
            artistInfo.classList.add('artist-info');
    
            // Create HTML elements to display artist information
            const artistName = document.createElement('h2');
            artistName.textContent = artist.name;
    
            const popularity = document.createElement('p');
            popularity.textContent = `Popularity: ${artist.popularity}`;
    
            const genres = document.createElement('p');
            genres.textContent = `Genres: ${artist.genres ? artist.genres.join(', ') : 'N/A'}`;
    
            // Followers
            const followers = document.createElement('p');
            if (typeof artist.followers === 'object' && typeof artist.followers.total === 'number') {
                followers.textContent = `Followers: ${artist.followers.total}`;
            } else {
                followers.textContent = 'Followers: N/A';
            }
    
            const image = document.createElement('img');
            image.src = artist.images[0] ? artist.images[0].url : 'placeholder-image.jpg';
            image.alt = artist.name;
    
            // Append elements to the container
            artistInfo.appendChild(artistName);
            artistInfo.appendChild(popularity);
            artistInfo.appendChild(genres);
            artistInfo.appendChild(followers);
            artistInfo.appendChild(image);
    
            // Append the artist info container to the main container
            artistContainer.appendChild(artistInfo);
        });
    }
});
