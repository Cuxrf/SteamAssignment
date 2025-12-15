// ============================================================
// COMPONENT LOADER - Dynamic Navigation Component Loader
// Handles loading reusable navigation components (sidebar and
// header) from an external HTML file and manages mobile menu.
// ============================================================


// ============================================================
// SECTION 1: MOBILE MENU FUNCTIONALITY
// Handles mobile navigation toggle, overlay, and auto-close.
// ============================================================

function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (menuToggle && sidebar && overlay) {
        // Toggle sidebar when hamburger menu is clicked
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
        });

        // Close sidebar when clicking overlay
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        });

        // Auto-close sidebar when nav items are clicked
        const navItems = sidebar.querySelectorAll('.nav-item, .install-button');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
        });
    }
}


// ============================================================
// SECTION 2: RESPONSIVE RESIZE HANDLER
// Closes mobile menu when resized to desktop (>768px).
// ============================================================

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        }
    }
});


// ============================================================
// SECTION 3: COMPONENT LOADING
// Fetches NavComponents.html and injects sidebar/header.
// ============================================================

async function loadComponents() {
    try {
        // Determine path based on current page location
        const isInComponentsFolder = window.location.pathname.includes('/Assets/Components/');
        const basePath = isInComponentsFolder ? '' : 'Assets/Components/';

        // Fetch and parse component templates
        const navResponse = await fetch(basePath + 'NavComponents.html');
        const navHtml = await navResponse.text();
        const parser = new DOMParser();
        const navDoc = parser.parseFromString(navHtml, 'text/html');

        // Get template elements
        const sidebarTemplate = navDoc.getElementById('sidebar-component');
        const headerTemplate = navDoc.getElementById('header-component');

        // Inject sidebar
        const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
        if (sidebarPlaceholder && sidebarTemplate) {
            const sidebarContent = sidebarTemplate.content.cloneNode(true);
            sidebarPlaceholder.replaceWith(sidebarContent);
        }

        // Inject header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder && headerTemplate) {
            const headerContent = headerTemplate.content.cloneNode(true);
            headerPlaceholder.replaceWith(headerContent);
        }

        setupMobileMenu();

    } catch (error) {
        console.error('Error loading components:', error);
    }
}


// ============================================================
// SECTION 4: INITIALIZATION
// Triggers component loading when DOM is ready.
// ============================================================

window.addEventListener('DOMContentLoaded', loadComponents);
