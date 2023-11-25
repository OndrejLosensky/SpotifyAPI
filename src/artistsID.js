document.addEventListener("DOMContentLoaded", function () {
    let tracks = []; // Declare tracks as a global variable
  
    // Function to fetch access token when the DOM content is loaded
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
  
              // Call the function to fetch top tracks for the default artist
              //fetchTopTracksForArtistByName('redzed'); // You can replace 'redzed' with your default artist
          })
          .catch(error => {
              console.error("Error fetching access token:", error);
          });
    }
  
    const logo = document.getElementById('logo');
    const defaultContent = document.getElementById('default-content'); // Add this line
  
    // Add click event to the logo for refreshing the page
    if (logo) {
        logo.addEventListener('click', function () {
            location.reload();
        });
    }
  
    const clientId = '293dcee6ecde4116bb53b61373415d40';
    const clientSecret = 'd0f053c0b4ec4f25874cf95cb2a952b6';
  
    let accessToken = '';
  
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
  
    // Fetch access token when the DOM content is loaded
    fetchAccessToken();
    
  
    function performSearch() {
        const artistName = artistInput.value.trim();

        if (artistName) {
            // Hide the default artist description
            if (defaultArtistDescription) {
                defaultArtistDescription.style.display = 'none';
            }

            // Hide the default content
            if (defaultContent) {
                defaultContent.style.display = 'none';
            }

            // Call the function to fetch top tracks for the searched artist
            fetchTopTracksForArtistByName(artistName);

            // Call the function to fetch top albums for the searched artist
            fetchTopAlbumsForArtistByName(artistName);
        } else {
            alert('Please enter an artist name.');
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
  
    function fetchTopTracksForArtist(artistId) {
        fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=CZ`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.tracks && data.tracks.length > 0) {
                    tracks = data.tracks; // Update the global tracks variable
                    // Call the function to display tracks based on the selected option
                    displayTracks();
                } else {
                    console.error(`No tracks found for artist ${artistId}`);
                }
            })
            .catch(error => {
                console.error(`Error fetching top tracks for artist ${artistId}:`, error);
            });
    }
    function fetchTopAlbumsForArtistByName(artistName) {
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.artists && data.artists.items && data.artists.items.length > 0) {
                    const artistId = data.artists.items[0].id;
                    // Call the function to fetch top albums for the found artist
                    fetchTopAlbumsForArtist(artistId);
                } else {
                    console.error(`No artist found for the query: ${artistName}`);
                }
            })
            .catch(error => {
                console.error(`Error searching for artist ${artistName}:`, error);
            });
    }


    function fetchTopAlbumsForArtist(artistId) {
        fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=5&country=CZ`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const topAlbums = data.items;
                // Handle the data and update the HTML for albums
                displayTopAlbums(topAlbums);
            })
            .catch(error => {
                console.error(`Error fetching top albums for artist ${artistId}:`, error);
            });
    }

    

    // Set up token refresh every 30 minutes
    setInterval(fetchAccessToken, 30 * 60 * 1000);
  
    function displayTracks() {
      const tracksContainer = document.getElementById('tracks-container');
      const chosenArtistHeading = document.getElementById('chosen-artist');
      const displayOptionSelect = document.getElementById('display-option');
  
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

        const heading = document.createElement('h3');
        // heading.textContent = "Artists most favorite tracks" –– for displaying heading dynamically at the top of the track info container

        if (displayOptionSelect.value === 'small-cards') {
            // this creates CSS class
            trackInfo.classList.add('small-card');

            
            const trackName = document.createElement('h2');
            trackName.textContent = track.name;
            

            const image = document.createElement('img');
            image.src = track.album && track.album.images.length > 0 ? track.album.images[0].url : 'placeholder-image.jpg';
            image.alt = track.name;

            // this basically displays the info in the html container
            trackInfo.appendChild(trackName);
            trackInfo.appendChild(image);

        }
        else if(displayOptionSelect.value === 'image') {
            trackInfo.classList.add('image-card');

            
            const trackName = document.createElement('h2');
            trackName.textContent = track.name;
            

            const image = document.createElement('img');
            image.src = track.album && track.album.images.length > 0 ? track.album.images[0].url : 'placeholder-image.jpg';
            image.alt = track.name;

            trackInfo.appendChild(image);
        }
        else {
              const trackName = document.createElement('h2');
              const trackLink = document.createElement('a');
              trackLink.href = track.external_urls.spotify;
              trackLink.target = '_blank';
              trackLink.textContent = track.name;
              trackName.appendChild(trackLink);

                const album = document.createElement('p');
                album.textContent = `Album: ${track.album ? track.album.name : 'N/A'}`;

                const popularity = document.createElement('p');
                popularity.textContent = `Popularity: ${track.popularity}`;

                const releaseDate = document.createElement('p');
                releaseDate.textContent = `Release Date: ${track.album ? track.album.release_date : 'N/A'}`;
        
              // Append elements to the container
              trackInfo.appendChild(trackName);
              // Append other track information elements...
  
              // Image
              const image = document.createElement('img');
              image.src = track.album && track.album.images.length > 0 ? track.album.images[0].url : 'placeholder-image.jpg';
              image.alt = track.name;
  
              // Duration
              const duration = document.createElement('p');
              duration.textContent = `Duration: ${msToMinSec(track.duration_ms)}s`;
  
              // Append elements to the container
              trackInfo.appendChild(trackName);
              trackInfo.appendChild(album);
              trackInfo.appendChild(popularity);
              trackInfo.appendChild(duration);
              trackInfo.appendChild(releaseDate);
              trackInfo.appendChild(image);
          }
  
          // Append the track info container to the main container
          tracksContainer.appendChild(trackInfo);
      });
    }
  

    function displayTopAlbums(albums) {
        const albumsContainer = document.getElementById('albums-container');

        // Check if the container element is found
        if (!albumsContainer) {
            console.error('Error: Albums container not found.');
            return;
        }

        // Clear existing content
        albumsContainer.innerHTML = '';

        // Loop through each album and display its information
        albums.forEach(album => {
            const albumInfo = document.createElement('div');
            albumInfo.classList.add('album-info');

            const albumName = document.createElement('h2');
            const albumLink = document.createElement('a');
            albumLink.href = album.external_urls.spotify;
            albumLink.target = '_blank';
            albumLink.textContent = album.name;
            albumName.appendChild(albumLink);

            const image = document.createElement('img');
            image.src = album.images.length > 0 ? album.images[0].url : 'placeholder-image.jpg';
            image.alt = album.name;

            // Append elements to the container
            albumInfo.appendChild(albumName);
            albumInfo.appendChild(image);

            // Append the album info container to the main container
            albumsContainer.appendChild(albumInfo);
        });
    }
  
     // Add an event listener for changes in the select element
     const displayOptionSelect = document.getElementById('display-option');
     displayOptionSelect.addEventListener('change', function () {
         displayTracks(); // Call the displayTracks function when the option changes
         displayTopAlbums(); // Call the displayTopAlbums function when the option changes
     });


    // Function to convert milliseconds to minutes and seconds
    function msToMinSec(duration) {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    }
  });