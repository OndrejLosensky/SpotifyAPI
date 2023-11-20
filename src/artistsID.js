document.addEventListener("DOMContentLoaded", function () {
    const logo = document.getElementById('logo');
  
    // Add click event to the logo for refreshing the page
    if (logo) {
      logo.addEventListener('click', function () {
        location.reload();
      });
    }
  
    // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual values
    const clientId = '293dcee6ecde4116bb53b61373415d40';
    const clientSecret = 'd0f053c0b4ec4f25874cf95cb2a952b6';
  
    let accessToken = 'BQA5F_Z6IITjoqOUvp2u7IUMITo6PUHY02D4rk-uFJ4BMB1lr96ifEYqMKo2x6JEW60YGEi0Wxigs4c5IxprrUxt6Fthmv-Ie9BcYWpFV086v7bMLYRUroZJYxg';
  
    const artistInput = document.getElementById('artist-input');
    const searchButton = document.getElementById('search-button');
    const defaultArtistDescription = document.getElementById('artist-description-text');
  
    // Add event listener for keypress on the input field
    artistInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        performSearch();
      }
    });
  
    // Add event listener for click on the search button
    searchButton.addEventListener('click', function () {
      performSearch();
    });
  
    // Function to perform the search
    function performSearch() {
      const artistName = artistInput.value.trim();
  
      if (artistName) {
        // Hide the default artist description
        if (defaultArtistDescription) {
          defaultArtistDescription.style.display = 'none';
        }
  
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
          if (data.artists && data.artists.items && data.artists.items.length > 0) {
            const artistId = data.artists.items[0].id;
            // Call the function to fetch top tracks for the found artist
            fetchTopTracksForArtist(artistId);
          } else {
            console.error(`No artist found for the query: ${artistName}`);
          }
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
        const trackLink = document.createElement('a');
        trackLink.href = track.external_urls.spotify;
        trackLink.target = '_blank';
        trackLink.textContent = track.name;
        trackName.appendChild(trackLink);
  
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
  