# Game Library Collection Website

## Overview
A Steam-inspired game library landing page built for a student final assignment. This project uses only vanilla HTML, CSS, and JavaScript (no frameworks) to create a clean, organized gaming website interface.

## Project Structure
```
├── index.html       # Main landing page with game grid
├── details.html     # Individual game details page
├── styles.css       # All styling (Steam-inspired dark theme)
├── script.js        # Index page JavaScript (login, games, search)
├── details.js       # Details page JavaScript (game data display)
├── games.json       # Game data storage
├── Assets/
│   ├── Components/  # Reusable HTML components
│   │   ├── NavComponents.html
│   │   ├── FriendsModal.html
│   │   ├── component-loader.js  # Loads components + mobile menu setup
│   │   └── friends-modal.js
│   └── Images/      # Game images and assets
└── replit.md        # Project documentation
```

## Features
- **Header Navigation**: Store, Community, About Us, Support links with search bar and user profile
- **Left Sidebar**: Navigation menu with Your store, Library, Friends, Github, and Install Steam button
- **Featured Game Section**: Large banner showcasing featured game with price, platform icons, and carousel dots
- **Game Details Page**: Dedicated page for each game showing:
  - Full-screen hero image with game title and tags
  - Complete game description
  - Media gallery with images and YouTube trailers
  - Purchase box with price and Add to Cart/Wishlist buttons
  - Game metadata (publisher, release date, platforms, tags)
- **Games Grid**: Grid layout displaying all non-featured games with clickable cards
- **Pagination System**: Navigate through games with Previous/Next buttons and clickable page numbers (12 games per page)
- **Friends Modal**: Draggable modal showing online friends and group chats
- **Dark Theme**: Steam-inspired color scheme with gradients and proper contrast
- **Responsive Layout**: Flexbox and Grid-based layout matching Steam's design
- **Search Functionality**: Filter games by title in real-time

## Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Custom styling with flexbox and grid (no frameworks)
- **Vanilla JavaScript**: ES6 async/await for fetching and displaying JSON data
- **JSON**: Game data storage

## How to Run
The website is served using Python's built-in HTTP server on port 5000:
```bash
python -m http.server 5000
```

Then open your browser and visit the webview to see the website in action.

## Game Data Structure
Each game in `games.json` contains:
- `id`: Unique identifier
- `name`: Game title
- `price`: Game price in dollars
- `image`: Featured image URL
- `featured`: Boolean for featured status
- `popular`: Boolean for popular/special offers
- `tags`: Array of game tags (genres, features)
- `description`: Game description text
- `publisher`: Publisher name
- `platform`: Array of platforms (PC, PS4, PS5, Xbox)
- `releaseDate`: Release date string
- `media`: Array of media objects with:
  - `type`: Media type ("image" or "youtube")
  - `url`: For images: full image URL. For YouTube: any YouTube URL format (youtube.com/watch?v=..., youtu.be/..., or just the video ID)

## Code Style
- Clean, descriptive class names (e.g., `.featured-game`, `.game-card`, `.sidebar-nav`)
- Well-commented and organized code suitable for student assignments
- No complex frameworks or libraries
- Simple, readable JavaScript with clear function names

## Recent Changes
- **December 11, 2025**: Merged shared.js into component-loader.js
  - Mobile menu functionality now integrated directly into component-loader.js
  - setupMobileMenu() is called automatically after components are loaded
  - Removed shared.js file and all references to it
  - One less HTTP request for better performance

- **November 23, 2025**: Redesigned game details page layout
  - Restructured layout: game image (460x215px) and purchase box on left, unified Details box on right
  - Removed name and tags overlay from hero image for cleaner presentation
  - Combined "About This Game", metadata (publisher, release date, platform), and tags into single Details box
  - Purchase box now displays game title and fits compactly under the hero image
  - Media gallery: images use 215px height, YouTube videos maintain 16:9 aspect ratio (no letterboxing)
  - Removed `featuredImage` property from God of War - now uses standard `image` link
  - Added comprehensive responsive design:
    - Desktop (>1200px): 460px left column
    - Tablet (1024-1200px): 400px left column
    - Mobile (<1024px): Single column stacked layout
  - Improved spacing and typography throughout Details box

- **November 23, 2025**: Added game details page functionality
  - Created details.html page with hero section, description, media gallery, and sidebar info
  - Implemented details.js to load and display individual game data from games.json
  - Made all game cards and featured games clickable, linking to details page with game ID
  - Separated shared JavaScript (mobile menu) into shared.js for code organization
  - Media gallery supports both images and YouTube video links

- **November 23, 2025**: Sidebar navigation updates
  - Removed "Points Shop" and "Recommended" buttons for cleaner navigation
  - Changed "Categories" to "Library" to better match Steam's interface
  - Updated Friends icon from ☺ to ☻ (filled smiley) for consistent styling
  - Fixed Friends modal to always open centered on screen (not bottom-right)

## Previous Changes
- **November 22, 2025**: Implemented full responsive design
  - Added comprehensive media queries for mobile phones (≤768px), tablets (769-1024px), and large screens (≥1440px, ≥1920px)
  - Mobile navigation: Hamburger menu toggle with sliding sidebar drawer from left
  - Dark overlay appears when mobile menu is open, clicking it closes the menu
  - Sidebar automatically closes when selecting navigation items or resizing to desktop view
  - Featured section stacks vertically on mobile and tablet for better readability
  - Game grid adapts: 1 column on mobile, 2 columns on tablets, 3 columns on desktop, 4-5 columns on large screens
  - Responsive typography and spacing adjustments for optimal viewing on all devices
  - Search bar becomes full-width on mobile
  - Header navigation links hidden on mobile to save space
  - All components (login modal, game cards, pagination) scale appropriately
  - Tested across phone, tablet, laptop, and desktop screen sizes

- **November 22, 2025**: Added smooth page transition animations
  - Login modal fades in smoothly (0.4s) when shown
  - Login modal content slides up elegantly as it appears (0.5s)
  - Login modal fades out smoothly (0.4s) when user logs in
  - Main content fades in gracefully (0.6s) after login
  - Transitions feel professional and polished without being too slow
  - Works for both new users logging in and returning users already logged in

- **November 22, 2025**: Added YouTube video support in media section
  - Changed "screenshots" to "media" in JSON structure to support multiple media types
  - Each media item now has a "type" field (either "image" or "youtube") and a "url" field
  - Updated JavaScript to render YouTube video embeds using iframes for youtube type media
  - Updated JavaScript to render images for image type media
  - Added CSS styling for video embeds to match image styling
  - Added defensive check to handle missing or empty media arrays
  - Featured games can now display YouTube trailers alongside screenshots
  - YouTube videos support multiple URL formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/..., or just the video ID
  - JavaScript automatically extracts video ID from any YouTube URL format

- **November 22, 2025**: Replaced SVG icons with Unicode characters
  - Replaced all complex SVG code with simple unicode symbols (◉, ★, ☰, 🛒, 📰, ▤, etc.)
  - Made code much cleaner and easier to read
  - Reduced HTML file size significantly
  - Beginner-friendly: no confusing SVG coordinates or paths
  - Used meaningful icons: 🛒 for Your store, 📰 for News, ▤ for Recommended (book)

- **November 22, 2025**: Code cleanup and optimization
  - Removed duplicate CS:GO game (kept Counter-Strike 2 as the main entry)
  - Reorganized HTML with clear comments and better structure for beginners
  - Reorganized CSS into clear sections with helpful comments (Reset, Layout, Sidebar, Header, Content, Featured Section, Game Grid, Pagination)
  - Refactored JavaScript to be more readable with extensive comments explaining each function
  - All code now follows beginner-friendly practices with clear explanations
  - Set only God of War: Ragnarök as the featured game (all other games moved to grid)
  - Total games: 14 games (1 featured, 13 in grid requiring 2 pages)

- **November 22, 2025**: Games section redesign
  - Converted "Special offers" section to "Games" section
  - Implemented 3x3 grid layout with smaller, uniform cards (180px height)
  - Added pagination system (9 games per page)
  - Updated to display all non-featured games instead of just popular ones
  - Added Previous/Next buttons and page number indicators
  - Removed special styling for first card (now all cards are uniform)

- **November 22, 2025**: Initial project creation
  - Created HTML structure matching Steam design
  - Implemented CSS styling with dark theme
  - Added JavaScript for dynamic game loading
  - Set up JSON data storage for games
  - Configured Python HTTP server workflow

## Future Enhancements
- Implement carousel navigation for featured games
- Add user reviews and ratings system
- Create user library/wishlist functionality
- Add game filtering by tags, price, platform
- Implement shopping cart functionality
- Add loading states for better UX
- Create About Us, Community, and Support pages
