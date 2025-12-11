// ========================================
// GLOBAL VARIABLES
// These are variables that can be used anywhere in this file
// ========================================

let gamesData = [];           // Stores all games loaded from games.json
let currentPage = 1;          // Which page of games we're viewing (starts at 1)
let gamesPerPage = 12;        // How many games to show on each page
let currentFeaturedIndex = 0; // Which featured game is currently shown (for cycling)
let featuredGames = [];       // List of games marked as "featured"
let featuredInterval = null;  // Used for auto-cycling featured games
let username = '';            // The logged-in user's name
let filteredGames = [];       // Games that match the search query
let searchQuery = '';         // What the user typed in the search box


// ========================================
// LOGIN FUNCTIONS
// These functions handle user login with localStorage
// ========================================

// Check if user is already logged in
function checkLogin() {
    // Try to get username from browser storage
    let savedUsername = localStorage.getItem('steamUsername');
    let mainContainer = document.querySelector('.main-container');
    
    if (savedUsername) {
        // User is logged in - show the main page
        username = savedUsername;
        hideLoginModal();
        updateUsernameDisplay();
        
        // Add fade-in animation to main content
        if (mainContainer) {
            mainContainer.classList.add('fade-in');
        }
    } else {
        // User not logged in - show login popup
        showLoginModal();
    }
}

// Show the login popup
function showLoginModal() {
    let modal = document.getElementById('login-modal');
    
    if (modal) {
        modal.classList.remove('hide');
        modal.classList.add('show');
        
        // Focus on the username input box after a short delay
        setTimeout(function() {
            let input = document.getElementById('username-input');
            if (input) {
                input.focus();
            }
        }, 100);
    }
}

// Hide the login popup
function hideLoginModal() {
    let modal = document.getElementById('login-modal');
    let mainContainer = document.querySelector('.main-container');
    
    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hide');
        
        // Wait for animation to finish, then fully hide the modal
        setTimeout(function() {
            modal.style.display = 'none';
        }, 400);
        
        // Fade in the main content
        if (mainContainer) {
            mainContainer.classList.add('fade-in');
        }
    }
}

// Update the username shown on the page
function updateUsernameDisplay() {
    // Update sidebar username
    let sidebarUsername = document.getElementById('sidebar-username');
    if (sidebarUsername) {
        sidebarUsername.textContent = '@' + username;
    }
    
    // Update header username
    let headerUsername = document.getElementById('header-username');
    if (headerUsername) {
        headerUsername.textContent = username;
    }
    
    // Update friends modal username
    let friendsModalUsername = document.getElementById('friends-modal-username');
    if (friendsModalUsername) {
        friendsModalUsername.textContent = username;
    }
}

// Handle when user submits the login form
function handleLogin(event) {
    // Prevent the page from refreshing
    event.preventDefault();
    
    // Get what the user typed
    let usernameInput = document.getElementById('username-input');
    let enteredUsername = usernameInput.value.trim();
    
    // Only proceed if they typed something
    if (enteredUsername) {
        // Save username to browser storage
        localStorage.setItem('steamUsername', enteredUsername);
        username = enteredUsername;
        
        // Hide login popup and show their name
        hideLoginModal();
        updateUsernameDisplay();
    }
}

// Setup the login form to listen for submit
function setupLoginForm() {
    let loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Setup QR code flip animation
function setupQRFlip() {
    let qrContainer = document.getElementById('qr-flip-container');
    
    if (qrContainer) {
        qrContainer.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    }
}


// ========================================
// LOAD GAMES FROM JSON FILE
// ========================================

// Load all games from games.json file
async function loadGames() {
    try {
        // Fetch the games.json file (with cache busting)
        let response = await fetch('games.json?v=' + Date.now(), {
            cache: 'no-cache'
        });
        
        // Convert JSON text to JavaScript array
        gamesData = await response.json();
        
        // Filter out just the featured games
        featuredGames = [];
        for (let i = 0; i < gamesData.length; i++) {
            if (gamesData[i].featured === true) {
                featuredGames.push(gamesData[i]);
            }
        }
        
        // Display everything on the page
        displayFeaturedGame();
        displayGameGrid();
        setupPagination();
        
    } catch (error) {
        console.error('Error loading games:', error);
    }
}


// ========================================
// HELPER FUNCTIONS
// ========================================

// Extract YouTube video ID from a URL
// Example: "https://youtube.com/watch?v=ABC123" returns "ABC123"
function getYouTubeVideoId(url) {
    // If it's already just an 11-character ID, return it as-is
    if (url.length === 11 && url.indexOf('/') === -1 && url.indexOf('?') === -1) {
        return url;
    }
    
    // Try different URL patterns to extract the video ID
    let patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (let i = 0; i < patterns.length; i++) {
        let match = url.match(patterns[i]);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    // If nothing matched, return the original URL
    return url;
}


// ========================================
// DISPLAY FEATURED GAME
// The big game shown at the top of the page
// ========================================

function displayFeaturedGame() {
    updateFeaturedContent();
}

function updateFeaturedContent() {
    // Get the current featured game
    let featuredGame = featuredGames[currentFeaturedIndex];
    
    // Exit if no featured game exists
    if (!featuredGame) {
        return;
    }
    
    // Get the HTML elements we need to update
    let featuredContainer = document.getElementById('featured-game');
    let detailsContainer = document.getElementById('game-details');
    
    // Use high-res image if available, otherwise use regular image
    let imageUrl = featuredGame.featuredImage || featuredGame.image;
    
    // Build the featured game HTML
    let featuredHTML = '';
    featuredHTML += '<a href="Assets/Components/details.html?id=' + featuredGame.id + '" style="display: block; width: 100%; height: 100%;">';
    featuredHTML += '    <img src="' + imageUrl + '" alt="' + featuredGame.name + '" class="featured-image">';
    featuredHTML += '    <span class="featured-badge">Popular</span>';
    featuredHTML += '    <div class="featured-platforms">';
    
    // Add platform icons
    for (let i = 0; i < featuredGame.platform.length; i++) {
        featuredHTML += '<span class="platform-icon">' + featuredGame.platform[i] + '</span>';
    }
    
    featuredHTML += '    </div>';
    featuredHTML += '    <div class="featured-price">$ ' + featuredGame.price + '</div>';
    featuredHTML += '</a>';
    
    // Add carousel dots
    featuredHTML += '<div class="carousel-dots">';
    for (let i = 0; i < featuredGames.length; i++) {
        let activeClass = (i === currentFeaturedIndex) ? 'active' : '';
        featuredHTML += '<span class="dot ' + activeClass + '" data-index="' + i + '"></span>';
    }
    featuredHTML += '</div>';
    
    // Insert the HTML into the page
    featuredContainer.innerHTML = featuredHTML;
    
    // Add click events to carousel dots
    let dots = featuredContainer.querySelectorAll('.dot');
    for (let i = 0; i < dots.length; i++) {
        dots[i].addEventListener('click', function() {
            let index = parseInt(this.getAttribute('data-index'));
            currentFeaturedIndex = index;
            updateFeaturedContent();
        });
    }
    
    // Build the game details HTML
    let detailsHTML = '';
    detailsHTML += '<h1 class="game-title">' + featuredGame.name + '</h1>';
    detailsHTML += '<div class="game-tags">';
    
    // Add tags
    for (let i = 0; i < featuredGame.tags.length; i++) {
        detailsHTML += '<span class="tag">' + featuredGame.tags[i] + '</span>';
    }
    
    detailsHTML += '</div>';
    detailsHTML += '<p class="game-description">' + featuredGame.description + '</p>';
    detailsHTML += '<div class="game-info-row">';
    detailsHTML += '    <span class="info-label">Published:</span>';
    detailsHTML += '    <span class="info-value">' + featuredGame.publisher + '</span>';
    detailsHTML += '</div>';
    detailsHTML += '<div class="game-info-row">';
    detailsHTML += '    <span class="info-label">Platform:</span>';
    detailsHTML += '    <span class="info-value">' + featuredGame.platform.join(', ') + '</span>';
    detailsHTML += '</div>';
    detailsHTML += '<div class="game-info-row">';
    detailsHTML += '    <span class="info-label">Release date:</span>';
    detailsHTML += '    <span class="info-value">' + featuredGame.releaseDate + '</span>';
    detailsHTML += '</div>';
    
    // Add screenshots/videos section
    detailsHTML += '<div class="game-screenshots">';
    
    if (featuredGame.media && featuredGame.media.length > 0) {
        // Show first 2 media items, then a "+X more" card
        for (let i = 0; i < featuredGame.media.length; i++) {
            let mediaItem = featuredGame.media[i];
            
            if (i < 2) {
                // Show first 2 items normally
                if (mediaItem.type === 'youtube') {
                    let videoId = getYouTubeVideoId(mediaItem.url);
                    detailsHTML += '<iframe src="https://www.youtube.com/embed/' + videoId + '" ';
                    detailsHTML += 'class="screenshot video-embed" ';
                    detailsHTML += 'frameborder="0" ';
                    detailsHTML += 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ';
                    detailsHTML += 'allowfullscreen></iframe>';
                } else {
                    detailsHTML += '<img src="' + mediaItem.url + '" alt="Screenshot ' + (i + 1) + '" class="screenshot">';
                }
            } else if (i === 2) {
                // For the 3rd item, show a "+X more" card instead
                let remaining = featuredGame.media.length - 2;
                detailsHTML += '<div class="screenshot screenshot-more">+' + remaining + '</div>';
            }
            // Skip items after index 2
        }
    }
    
    detailsHTML += '</div>';
    
    // Insert details HTML into the page
    detailsContainer.innerHTML = detailsHTML;
}


// ========================================
// SEARCH FUNCTIONALITY
// ========================================

// Setup search input to listen for typing
function setupSearch() {
    let searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(event) {
            // Get what user typed, convert to lowercase
            searchQuery = event.target.value.toLowerCase().trim();
            filterGames();
        });
    }
}

// Filter games based on search query
function filterGames() {
    if (searchQuery === '') {
        // No search query - show all games
        filteredGames = gamesData;
    } else {
        // Filter games that match the search
        filteredGames = [];
        
        for (let i = 0; i < gamesData.length; i++) {
            let game = gamesData[i];
            let matchFound = false;
            
            // Check if name matches
            if (game.name.toLowerCase().indexOf(searchQuery) !== -1) {
                matchFound = true;
            }
            
            // Check if any tag matches
            for (let j = 0; j < game.tags.length; j++) {
                if (game.tags[j].toLowerCase().indexOf(searchQuery) !== -1) {
                    matchFound = true;
                }
            }
            
            // Check if description matches
            if (game.description.toLowerCase().indexOf(searchQuery) !== -1) {
                matchFound = true;
            }
            
            // Add game to results if it matched
            if (matchFound) {
                filteredGames.push(game);
            }
        }
    }
    
    // Go back to page 1 when search changes
    currentPage = 1;
    displayGameGrid();
    setupPagination();
}


// ========================================
// DISPLAY GAME GRID
// Shows the grid of game cards
// ========================================

function displayGameGrid() {
    // Decide which games to show (filtered or all)
    let gamesToUse;
    if (filteredGames.length > 0 || searchQuery !== '') {
        gamesToUse = filteredGames;
    } else {
        gamesToUse = gamesData;
    }
    
    // Get the grid container element
    let gridContainer = document.getElementById('game-grid');
    
    // Calculate which games to show on this page
    let startIndex = (currentPage - 1) * gamesPerPage;
    let endIndex = startIndex + gamesPerPage;
    let gamesToDisplay = gamesToUse.slice(startIndex, endIndex);
    
    // If no games found, show a message
    if (gamesToDisplay.length === 0) {
        gridContainer.innerHTML = '';
        gridContainer.innerHTML += '<div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #7b8a9a;">';
        gridContainer.innerHTML += '    <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>';
        gridContainer.innerHTML += '    <h3 style="font-size: 24px; color: #c7d5e0; margin-bottom: 10px;">No games found</h3>';
        gridContainer.innerHTML += '    <p style="font-size: 16px;">Try searching for something else</p>';
        gridContainer.innerHTML += '</div>';
        updatePaginationButtons();
        return;
    }
    
    // Build HTML for each game card
    let gridHTML = '';
    
    for (let i = 0; i < gamesToDisplay.length; i++) {
        let game = gamesToDisplay[i];
        
        gridHTML += '<a href="Assets/Components/details.html?id=' + game.id + '" class="game-card" style="text-decoration: none; color: inherit;">';
        gridHTML += '    <img src="' + game.image + '" alt="' + game.name + '" class="game-card-image">';
        gridHTML += '    <div class="game-card-overlay">';
        gridHTML += '        <div class="game-card-title">' + game.name + '</div>';
        gridHTML += '        <div class="game-card-price">$ ' + game.price + '</div>';
        gridHTML += '    </div>';
        gridHTML += '</a>';
    }
    
    // Insert HTML into the grid
    gridContainer.innerHTML = gridHTML;
    
    // Update pagination buttons
    updatePaginationButtons();
}


// ========================================
// PAGINATION SETUP
// Creates page number buttons (1, 2, 3, etc.)
// ========================================

function setupPagination() {
    // Decide which games to count (filtered or all)
    let gamesToUse;
    if (filteredGames.length > 0 || searchQuery !== '') {
        gamesToUse = filteredGames;
    } else {
        gamesToUse = gamesData;
    }
    
    // Calculate how many pages we need
    let totalPages = Math.ceil(gamesToUse.length / gamesPerPage);
    
    // Get the container for page numbers
    let pageNumbersContainer = document.getElementById('page-numbers');
    pageNumbersContainer.innerHTML = '';
    
    // Create a button for each page
    for (let i = 1; i <= totalPages; i++) {
        let pageBtn = document.createElement('div');
        pageBtn.className = 'page-number';
        pageBtn.textContent = i;
        
        // Mark current page as active
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        // Add click event to change page
        pageBtn.addEventListener('click', function() {
            currentPage = i;
            displayGameGrid();
            updatePaginationButtons();
        });
        
        pageNumbersContainer.appendChild(pageBtn);
    }
    
    // Setup Previous button click
    let prevBtn = document.getElementById('prev-btn');
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage = currentPage - 1;
            displayGameGrid();
        }
    });
    
    // Setup Next button click
    let nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage = currentPage + 1;
            displayGameGrid();
        }
    });
}


// ========================================
// UPDATE PAGINATION BUTTONS
// Enable/disable prev/next and highlight current page
// ========================================

function updatePaginationButtons() {
    // Decide which games to count (filtered or all)
    let gamesToUse;
    if (filteredGames.length > 0 || searchQuery !== '') {
        gamesToUse = filteredGames;
    } else {
        gamesToUse = gamesData;
    }
    
    // Calculate total pages
    let totalPages = Math.ceil(gamesToUse.length / gamesPerPage);
    
    // Get the prev/next buttons
    let prevBtn = document.getElementById('prev-btn');
    let nextBtn = document.getElementById('next-btn');
    
    // Disable prev button if on first page
    if (currentPage === 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    
    // Disable next button if on last page
    if (currentPage === totalPages) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
    
    // Update which page number is highlighted
    let pageButtons = document.querySelectorAll('.page-number');
    for (let i = 0; i < pageButtons.length; i++) {
        if (i + 1 === currentPage) {
            pageButtons[i].classList.add('active');
        } else {
            pageButtons[i].classList.remove('active');
        }
    }
}


// ========================================
// START THE APP WHEN PAGE LOADS
// ========================================

window.addEventListener('DOMContentLoaded', function() {
    // Setup all the components
    setupLoginForm();
    setupQRFlip();
    checkLogin();
    loadGames();
    
    // Wait a moment, then update username and setup search
    setTimeout(function() {
        updateUsernameDisplay();
        setupSearch();
    }, 100);
});
