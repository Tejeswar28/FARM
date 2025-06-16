// Additional Mobile Menu Improvements
document.addEventListener('DOMContentLoaded', function() {
    // Ensure the mobile menu toggle is visible on small screens
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    
    // Close mobile menu when window is resized to desktop width
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && siteNav.classList.contains('active')) {
            siteNav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon && icon.classList.contains('fa-times')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Add touch events for mobile
    if ('ontouchstart' in window) {
        // Handle touch events for mobile menu
        document.addEventListener('touchstart', function(event) {
            const isClickInsideNav = siteNav.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (siteNav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
                siteNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Enhance accessibility
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        mobileMenuToggle.setAttribute('role', 'button');
        mobileMenuToggle.setAttribute('tabindex', '0');
        
        // Add keyboard support
        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileMenuToggle.click();
            }
        });
    }
    
    // Add aria attributes to nav links for accessibility
    const navLinks = document.querySelectorAll('.site-nav .nav-link');
    navLinks.forEach(link => {
        // Add expanded state for current page
        if (link.getAttribute('href') === window.location.pathname) {
            link.setAttribute('aria-current', 'page');
            link.classList.add('current-page');
        }
    });
});
