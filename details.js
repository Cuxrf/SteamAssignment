// ========================================
// GAME DETAILS PAGE
// This file handles the individual game page
// ========================================

// Store the current game's data
let gameData = null;


// ========================================
// HELPER FUNCTIONS
// ========================================

// Get the game ID from the URL
// Example: "details.html?id=5" returns "5"
function getGameId() {
    let urlParams = new URLSearchParams(window.location.search);
    let gameId = urlParams.get('id');
    return gameId;
}

// Extract YouTube video ID from a URL
// Example: "https://youtube.com/watch?v=ABC123" returns "ABC123"
function getYouTubeVideoId(url) {
    // Different patterns for YouTube URLs
    let patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    // Try each pattern
    for (let i = 0; i < patterns.length; i++) {
        let match = url.match(patterns[i]);
        if (match) {
            return match[1];
        }
    }
    
    // No match found
    return null;
}


// ========================================
// LOAD GAME DATA
// ========================================

// Load game data from games.json file
async function loadGameData() {
    try {
        // Figure out the path to games.json
        // (different if we're in the Components folder)
        let isInComponentsFolder = window.location.pathname.indexOf('/Assets/Components/') !== -1;
        let basePath = '';
        if (isInComponentsFolder) {
            basePath = '../../';
        }
        
        // Fetch the games.json file
        let response = await fetch(basePath + 'games.json?v=' + Date.now(), {
            cache: 'no-cache'
        });
        
        // Convert to JavaScript array
        let games = await response.json();
        
        // Get the game ID from URL and convert to number
        let gameId = parseInt(getGameId());
        
        // Find the game with matching ID
        gameData = null;
        for (let i = 0; i < games.length; i++) {
            if (games[i].id === gameId) {
                gameData = games[i];
                break;
            }
        }
        
        // If game found, display it. Otherwise, go back to home page.
        if (gameData) {
            displayGameDetails();
        } else {
            window.location.href = basePath + 'index.html';
        }
        
    } catch (error) {
        console.error('Error loading game data:', error);
        
        // On error, redirect to home page
        let isInComponentsFolder = window.location.pathname.indexOf('/Assets/Components/') !== -1;
        let basePath = isInComponentsFolder ? '../../' : '';
        window.location.href = basePath + 'index.html';
    }
}


// ========================================
// DISPLAY GAME DETAILS
// ========================================

// Show all the game information on the page
function displayGameDetails() {
    // Update the browser tab title
    document.getElementById('page-title').textContent = gameData.name + ' - Steam';
    
    // ---- HERO IMAGE (big image at top) ----
    let heroSection = document.getElementById('game-hero');
    let heroImage = gameData.image;
    heroSection.innerHTML = '<img src="' + heroImage + '" alt="' + gameData.name + '" class="game-hero-image">';
    
    // ---- DESCRIPTION ----
    document.getElementById('game-description').textContent = gameData.description;
    
    // ---- SIDEBAR TITLE ----
    document.getElementById('game-title-sidebar').textContent = gameData.name;
    
    // ---- PRICE ----
    let priceElement = document.getElementById('game-price');
    if (gameData.price === 0) {
        priceElement.textContent = 'Free to Play';
        priceElement.classList.add('free');
    } else {
        priceElement.textContent = '$' + gameData.price.toFixed(2);
    }
    
    // ---- PUBLISHER ----
    document.getElementById('game-publisher').textContent = gameData.publisher;
    
    // ---- RELEASE DATE ----
    document.getElementById('game-release').textContent = gameData.releaseDate;
    
    // ---- PLATFORMS ----
    let platformsContainer = document.getElementById('game-platforms');
    let platformsHTML = '';
    for (let i = 0; i < gameData.platform.length; i++) {
        platformsHTML += '<span class="platform-tag">' + gameData.platform[i] + '</span>';
    }
    platformsContainer.innerHTML = platformsHTML;
    
    // ---- TAGS ----
    let tagsContainer = document.getElementById('game-tags');
    let tagsHTML = '';
    for (let i = 0; i < gameData.tags.length; i++) {
        tagsHTML += '<span class="tag-item">' + gameData.tags[i] + '</span>';
    }
    tagsContainer.innerHTML = tagsHTML;
    
    // ---- MEDIA GALLERY (screenshots and videos) ----
    if (gameData.media && gameData.media.length > 0) {
        let mediaGrid = document.getElementById('media-grid');
        let mediaHTML = '';
        
        // Loop through each media item
        for (let i = 0; i < gameData.media.length; i++) {
            let mediaItem = gameData.media[i];
            
            if (mediaItem.type === 'image') {
                // It's an image
                mediaHTML += '<div class="media-item media-image">';
                mediaHTML += '    <img src="' + mediaItem.url + '" alt="' + gameData.name + ' screenshot">';
                mediaHTML += '</div>';
                
            } else if (mediaItem.type === 'youtube') {
                // It's a YouTube video
                let videoId = getYouTubeVideoId(mediaItem.url);
                
                if (videoId) {
                    mediaHTML += '<div class="media-item media-video">';
                    mediaHTML += '    <iframe ';
                    mediaHTML += '        src="https://www.youtube.com/embed/' + videoId + '" ';
                    mediaHTML += '        title="YouTube video player" ';
                    mediaHTML += '        frameborder="0" ';
                    mediaHTML += '        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ';
                    mediaHTML += '        allowfullscreen>';
                    mediaHTML += '    </iframe>';
                    mediaHTML += '</div>';
                }
            }
        }
        
        mediaGrid.innerHTML = mediaHTML;
        
    } else {
        // No media, hide the gallery section
        document.getElementById('media-gallery').style.display = 'none';
    }
}


// ========================================
// START WHEN PAGE LOADS
// ========================================

window.addEventListener('DOMContentLoaded', function() {
    loadGameData();
});
