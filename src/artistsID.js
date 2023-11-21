document.addEventListener("DOMContentLoaded", function () {
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

  // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual values
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
  //const artistId = ''; // 5iYtjtFv6SvHX95ny4fVEz //3FCo1sUkVbwKnO2m0Z7Bp9
  //fetchTopTracksForArtist(artistId);

  // Set up token refresh every 30 minutes
  setInterval(fetchAccessToken, 30 * 60 * 1000);

  document.addEventListener("DOMContentLoaded", function () {
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
  
    // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual values
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
    //const artistId = ''; // 5iYtjtFv6SvHX95ny4fVEz //3FCo1sUkVbwKnO2m0Z7Bp9
    //fetchTopTracksForArtist(artistId);
  
    // Set up token refresh every 30 minutes
    setInterval(fetchAccessToken, 30 * 60 * 1000);
  
    const displayOptionsButton = document.getElementById('display-options-button');
    const displayOptionSelect = document.getElementById('display-option');
  
    // Add event listener for the display options button
    displayOptionsButton.addEventListener('click', function () {
      // Get the selected display option
      const selectedOption = displayOptionSelect.value;
  
      // Call the corresponding display function based on the option
      switch (selectedOption) {
        case 'large-cards':
          // Clear existing content
          console.log("Large-card")
          tracksContainer.innerHTML = '';
          // Display large cards
          tracks.forEach(track => {
            displayTracks(track);
          });
          break;
  
        case 'small-cards':
          // Clear existing content
          console.log("Small-card")
          tracksContainer.innerHTML = '';
          // Display small cards
          tracks.forEach(track => {
            displaySmallCard(track, tracksContainer);
          });
          break;
  
        default:
          console.error('Invalid display option');
      }
    });
  
    function displaySmallCard(track, container) {
      const trackInfo = document.createElement('div');
      trackInfo.classList.add('track-info');
  
      const trackName = document.createElement('h2');
      const trackLink = document.createElement('a');
      trackLink.href = track.external_urls.spotify;
      trackLink.target = '_blank';
      trackLink.textContent = track.name;
      trackName.appendChild(trackLink);
  
      // Image
      const image = document.createElement('img');
      image.src = track.album && track.album.images.length > 0 ? track.album.images[0].url : 'placeholder-image.jpg';
      image.alt = track.name;
  
      // Append elements to the container
      trackInfo.appendChild(trackName);
      trackInfo.appendChild(image);
  
      // Append the track info container to the main container
      container.appendChild(trackInfo);
    }
    
    function displayLargeCard(track, container) {
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
  
            const releaseDate = document.createElement('p');
            releaseDate.textContent = `Release Date: ${track.album ? track.album.release_date : 'N/A'}`;
  
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
            trackInfo.appendChild(releaseDate);
            trackInfo.appendChild(image);
  
            // Append the track info container to the main container
            tracksContainer.appendChild(trackInfo);
        });
    }
  
    function displayTracks(tracks) {
       
    }
  
    // Function to convert milliseconds to minutes and seconds
    function msToMinSec(duration) {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    }
  });
  


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

          const releaseDate = document.createElement('p');
          releaseDate.textContent = `Release Date: ${track.album ? track.album.release_date : 'N/A'}`;

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
          trackInfo.appendChild(releaseDate);
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
