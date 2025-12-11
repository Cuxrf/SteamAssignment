function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        });
        
        const navItems = sidebar.querySelectorAll('.nav-item, .install-button');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
        });
    }
}

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

async function loadComponents() {
    try {
        const isInComponentsFolder = window.location.pathname.includes('/Assets/Components/');
        const basePath = isInComponentsFolder ? '' : 'Assets/Components/';
        
        const navResponse = await fetch(basePath + 'NavComponents.html');
        const navHtml = await navResponse.text();
        
        const parser = new DOMParser();
        const navDoc = parser.parseFromString(navHtml, 'text/html');
        
        const sidebarTemplate = navDoc.getElementById('sidebar-component');
        const headerTemplate = navDoc.getElementById('header-component');
        
        const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
        if (sidebarPlaceholder && sidebarTemplate) {
            const sidebarContent = sidebarTemplate.content.cloneNode(true);
            sidebarPlaceholder.replaceWith(sidebarContent);
        }
        
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

window.addEventListener('DOMContentLoaded', loadComponents);
