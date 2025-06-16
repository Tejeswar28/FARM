// Placeholder for custom JS (sliders, map, animations)
// Initialize mobile menu
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            siteNav.classList.toggle('active');
            // Toggle between menu and close icons
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
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
        
        // Close menu when clicking a nav link
        const navLinks = document.querySelectorAll('.site-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                siteNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
      // Initialize Swiper sliders
    if (window.Swiper) {
        // Main gallery swiper
        const swipers = document.querySelectorAll('.swiper');
        swipers.forEach(function(swiperEl) {
            new Swiper(swiperEl, {
                loop: true,
                loopAdditionalSlides: 3,
                autoplay: { 
                    delay: 3000,
                    disableOnInteraction: false 
                },
                pagination: { 
                    el: '.swiper-pagination', 
                    clickable: true 
                },
                navigation: { 
                    nextEl: '.swiper-button-next', 
                    prevEl: '.swiper-button-prev' 
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                speed: 1000
            });
        });
        
        // Gallery preview swiper (on home page)
        const gallerySwipers = document.querySelectorAll('.gallery-swiper');
        gallerySwipers.forEach(function(swiperEl) {
            new Swiper(swiperEl, {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                loopAdditionalSlides: 3,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                }
            });        });        // Video slider (on home page) - Smooth continuous effect
        const videoSwipers = document.querySelectorAll('.video-swiper');
        videoSwipers.forEach(function(swiperEl) {
            new Swiper(swiperEl, {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                loopAdditionalSlides: 5, // Add more slides for smoother infinite loop
                speed: 800, // Faster transition for more dynamic effect
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false
                },
                effect: 'slide',
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true // Dynamic bullets for better pagination
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    480: {
                        slidesPerView: 1.5, // Show partial next slide on small screens
                        spaceBetween: 15
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    992: {
                        slidesPerView: 2.5, // Show partial next slide on large screens for better UX
                        spaceBetween: 25
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                }
            });
        });
    }
    
    // Initialize Particles.js for animated background
    if (document.getElementById('particles-js')) {
        if (window.particlesJS) {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 100,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#2e8b57"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 5,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#2e8b57",
                        "opacity": 0.2,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        }
    }
    
    // Add scroll animation for elements
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate__animated');
                element.classList.add(element.dataset.animation || 'animate__fadeIn');
            }
        });
    };
    
    // Add animate-on-scroll class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(function(section) {
        if (!section.classList.contains('hero')) {
            section.classList.add('animate-on-scroll');
            if (!section.dataset.animation) {
                section.dataset.animation = 'animate__fadeIn';
            }
        }
    });
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Handle YouTube video form
    const quickAddForm = document.getElementById('quickAddVideoForm');
    const youtubeUrlInput = document.getElementById('youtubeUrl');
    const videoTitleInput = document.getElementById('videoTitle');
    const videoDescInput = document.getElementById('videoDescription');
    const videoPreviewContainer = document.getElementById('videoPreview');
    const randomVideoButtons = document.querySelectorAll('.random-video-btn');
    
    // Function to extract YouTube video ID
    function extractYoutubeId(url) {
        const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[1].length === 11) ? match[1] : false;
    }
    
    // Function to preview YouTube video
    function previewYoutubeVideo(url) {
        const videoId = extractYoutubeId(url);
        
        if (videoId) {
            videoPreviewContainer.innerHTML = `
                <h4>Video Preview:</h4>
                <div class="video-preview-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 500px; margin: 0 auto;">
                    <iframe 
                        class="video-preview-frame"
                        src="https://www.youtube.com/embed/${videoId}" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
            videoPreviewContainer.classList.add('active');
            return true;
        }
        
        alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
        videoPreviewContainer.classList.remove('active');
        return false;
    }
    
    // Handle YouTube URL input change for live preview
    youtubeUrlInput.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            previewYoutubeVideo(this.value);
        }
    });
    
    // Handle random video button clicks
    randomVideoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const url = this.dataset.url;
            const title = this.dataset.title;
            
            youtubeUrlInput.value = url;
            videoTitleInput.value = title;
            videoDescInput.value = `A video about ${title.toLowerCase()}`;
            
            previewYoutubeVideo(url);
        });
    });
    
    // Handle form submission
    quickAddForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const url = youtubeUrlInput.value.trim();
        const title = videoTitleInput.value.trim();
        const description = videoDescInput.value.trim();
        
        if (!url || !title) {
            alert('Please provide both a YouTube URL and a title');
            return;
        }
        
        if (!previewYoutubeVideo(url)) {
            return;
        }
        
        // Send AJAX request to save the video
        fetch('/gallery/add-youtube-video/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                url: url,
                title: title,
                description: description
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Video added successfully!');
                
                // Clear the form
                youtubeUrlInput.value = '';
                videoTitleInput.value = '';
                videoDescInput.value = '';
                videoPreviewContainer.innerHTML = '';
                videoPreviewContainer.classList.remove('active');
                
                // Optionally reload the page to show the new video
                if (data.reload) {
                    window.location.reload();
                }
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the video.');
        });
    });
    
    // Helper function to get CSRF token
    function getCsrfToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }
    
    // Handle video suggestion form
    const suggestForm = document.getElementById('suggestVideoForm');
    if (suggestForm) {
        suggestForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const urlInput = document.getElementById('suggestYoutubeUrl');
            const nameInput = document.getElementById('suggestName');
            const emailInput = document.getElementById('suggestEmail');
            
            const url = urlInput.value.trim();
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            
            if (!url) {
                alert('Please provide a YouTube URL');
                return;
            }
            
            // Validate YouTube URL
            const videoId = extractYoutubeId(url);
            if (!videoId) {
                alert('Please enter a valid YouTube URL');
                return;
            }
            
            // For demonstration purposes, show an alert about the suggestion
            const thankYouMessage = `Thank you${name ? ' ' + name : ''}! Your video suggestion has been received.${email ? ' We\'ll notify you when it\'s approved.' : ''}`;
            alert(thankYouMessage);
              // In a real implementation, send this data to your backend
            fetch('/gallery/suggest-video/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    url: url,
                    name: name,
                    email: email
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message || 'Thank you for your suggestion!');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Thank you for your suggestion! Our team will review it soon.');
            });
            
            // Clear the form
            urlInput.value = '';
            nameInput.value = '';
            emailInput.value = '';
        });
    }
    
    // For demonstration purposes, show random videos when the page loads
    const demoRandomButtons = document.querySelectorAll('.random-video-btn');
    if (demoRandomButtons.length > 0) {
        // Select a random button to simulate a click
        const randomIndex = Math.floor(Math.random() * demoRandomButtons.length);
        
        // If not on an admin account, show the video in the video preview area
        if (!document.getElementById('quickAddVideoForm')) {
            const randomButton = demoRandomButtons[randomIndex];
            const url = randomButton.dataset.url;
            const videoId = extractYoutubeId(url);
            
            if (videoId) {
                const randomVideosContainer = document.querySelector('.random-videos-container');
                
                if (randomVideosContainer) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'random-video-preview';
                    previewDiv.innerHTML = `
                        <h4>Featured Video: ${randomButton.textContent}</h4>
                        <div class="video-preview-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 600px; margin: 20px auto;">
                            <iframe 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                                src="https://www.youtube.com/embed/${videoId}?autoplay=0" 
                                title="${randomButton.textContent}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                    `;
                    
                    randomVideosContainer.appendChild(previewDiv);
                }
            }
        }
    }
});
