/**
 * YouTube Integration Script for Shuddhi Farms Website
 * Handles admin-only video addition and form interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Network status tracking
    const networkStatus = document.getElementById('networkStatus');
    const networkStatusText = document.querySelector('.network-status-text');
    const networkStatusIcon = document.querySelector('.network-status-icon i');
    
    // Track online/offline status
    function updateOnlineStatus() {
        if (navigator.onLine) {
            networkStatus.classList.remove('offline');
            networkStatus.classList.add('online');
            networkStatusText.textContent = 'Connected';
            networkStatusIcon.className = 'fas fa-wifi';
            
            // Hide any offline messages
            const offlineMessages = document.querySelectorAll('.offline-message');
            offlineMessages.forEach(msg => msg.style.display = 'none');
            
            // Send any pending requests
            processPendingRequests();
        } else {
            networkStatus.classList.remove('online');
            networkStatus.classList.add('offline');
            networkStatusText.textContent = 'Offline';
            networkStatusIcon.className = 'fas fa-wifi-slash';
            
            // Show offline messages
            const offlineMessages = document.querySelectorAll('.offline-message');
            offlineMessages.forEach(msg => msg.style.display = 'block');
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
    
    // Initialize forms if they exist (admin only)
    const quickAddForm = document.getElementById('quickAddVideoForm');
    if (quickAddForm) {
        initializeQuickAddForm(quickAddForm);
    }
    
    const suggestForm = document.getElementById('suggestVideoForm');
    if (suggestForm) {
        initializeSuggestForm(suggestForm);
    }
    
    // Example videos on buttons
    const randomButtons = document.querySelectorAll('.random-video-btn');
    if (randomButtons.length > 0) {
        randomButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Check which form we should populate
                const youtubeUrl = quickAddForm ? document.getElementById('youtubeUrl') : null;
                const videoTitle = quickAddForm ? document.getElementById('videoTitle') : null;
                
                const suggestYoutubeUrl = suggestForm ? document.getElementById('suggestYoutubeUrl') : null;
                
                if (youtubeUrl && videoTitle) {
                    youtubeUrl.value = this.dataset.url;
                    videoTitle.value = this.dataset.title;
                    previewVideo('youtubeUrl', 'videoPreview');
                } else if (suggestYoutubeUrl) {
                    suggestYoutubeUrl.value = this.dataset.url;
                    previewVideo('suggestYoutubeUrl', 'suggestPreview');
                }
            });
        });
    }
    
    // Queue for offline requests
    function savePendingRequest(endpoint, data) {
        const pendingRequests = JSON.parse(localStorage.getItem('pendingVideoRequests') || '[]');
        pendingRequests.push({
            endpoint: endpoint,
            data: data,
            timestamp: new Date().getTime()
        });
        localStorage.setItem('pendingVideoRequests', JSON.stringify(pendingRequests));
    }
    
    function processPendingRequests() {
        if (!navigator.onLine) return;
        
        const pendingRequests = JSON.parse(localStorage.getItem('pendingVideoRequests') || '[]');
        if (pendingRequests.length === 0) return;
        
        // Process each request
        const updatedRequests = [];
        
        pendingRequests.forEach(request => {
            // Only process requests less than 24 hours old
            const age = (new Date().getTime() - request.timestamp) / (1000 * 60 * 60);
            if (age < 24) {
                sendRequest(request.endpoint, request.data)
                    .then(response => {
                        if (!response.ok) {
                            // Keep in queue if server error
                            if (response.status >= 500) {
                                updatedRequests.push(request);
                            }
                        }
                    })
                    .catch(() => {
                        // Keep in queue on network error
                        updatedRequests.push(request);
                    });
            }
        });
        
        localStorage.setItem('pendingVideoRequests', JSON.stringify(updatedRequests));
    }
    
    // Helper to send fetch request
    function sendRequest(endpoint, data) {
        return fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify(data)
        });
    }
    
    // Get CSRF token from cookies
    function getCsrfToken() {
        const name = 'csrftoken';
        const cookieValue = document.cookie.split('; ')
            .find(row => row.startsWith(name))?.split('=')[1];
        return cookieValue || '';
    }
    
    // Function to preview video from URL input
    function previewVideo(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const url = input.value.trim();
        
        if (!url) {
            preview.innerHTML = '';
            return;
        }
        
        // Show loading indicator
        const loadingId = inputId === 'youtubeUrl' ? 'videoUrlLoading' : 'suggestUrlLoading';
        const loading = document.getElementById(loadingId);
        if (loading) loading.style.display = 'flex';
        
        // Extract video ID
        const videoId = extractYoutubeId(url);
        
        if (videoId) {
            // Create embed
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            preview.innerHTML = `
                <div class="video-preview-wrapper">
                    <iframe src="${embedUrl}" title="YouTube Video Preview" frameborder="0" allowfullscreen></iframe>
                </div>
                <p class="preview-caption">Video Preview</p>
            `;
        } else {
            preview.innerHTML = `<p class="preview-error">Invalid YouTube URL. Please enter a valid YouTube video link.</p>`;
        }
        
        // Hide loading
        if (loading) loading.style.display = 'none';
    }
    
    // Extract YouTube video ID from URL
    function extractYoutubeId(url) {
        if (!url) return null;
        
        // Regular YouTube URLs
        const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[1].length === 11) ? match[1] : null;
    }
    
    // Initialize the quick add form (admin only)
    function initializeQuickAddForm(form) {
        const urlInput = document.getElementById('youtubeUrl');
        const preview = document.getElementById('videoPreview');
        const submitBtn = document.getElementById('addVideoBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Preview video as user types
        urlInput.addEventListener('input', function() {
            previewVideo('youtubeUrl', 'videoPreview');
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const url = document.getElementById('youtubeUrl').value.trim();
            const title = document.getElementById('videoTitle').value.trim();
            const description = document.getElementById('videoDescription')?.value.trim() || '';
            
            if (!url || !title) {
                alert('Please enter both a YouTube URL and a title');
                return;
            }
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            submitBtn.disabled = true;
            
            const data = {
                url: url,
                title: title,
                description: description
            };
            
            if (navigator.onLine) {
                // Send request
                sendRequest('/gallery/add-youtube-video/', data)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Clear form
                            form.reset();
                            preview.innerHTML = '';
                            
                            // Show success message
                            alert('Video added successfully!');
                            
                            // Reload if needed
                            if (data.reload) {
                                window.location.reload();
                            }
                        } else {
                            alert('Error: ' + (data.error || 'Unknown error'));
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to add video. Please try again.');
                    })
                    .finally(() => {
                        // Reset button
                        btnText.style.display = 'inline-block';
                        btnLoading.style.display = 'none';
                        submitBtn.disabled = false;
                    });
            } else {
                // Save for later
                savePendingRequest('/gallery/add-youtube-video/', data);
                
                // Show offline message
                alert('You are offline. Your video will be added when you reconnect.');
                
                // Reset form and button
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Initialize the suggest form (admin only)
    function initializeSuggestForm(form) {
        const urlInput = document.getElementById('suggestYoutubeUrl');
        const preview = document.getElementById('suggestPreview');
        const submitBtn = document.getElementById('suggestVideoBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Preview video as user types
        urlInput.addEventListener('input', function() {
            previewVideo('suggestYoutubeUrl', 'suggestPreview');
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const url = document.getElementById('suggestYoutubeUrl').value.trim();
            const name = document.getElementById('suggestName')?.value.trim() || '';
            const email = document.getElementById('suggestEmail')?.value.trim() || '';
            
            if (!url) {
                alert('Please enter a YouTube URL');
                return;
            }
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            submitBtn.disabled = true;
            
            const data = {
                url: url,
                name: name,
                email: email
            };
            
            if (navigator.onLine) {
                // Send request
                sendRequest('/gallery/suggest-video/', data)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Clear form
                            form.reset();
                            preview.innerHTML = '';
                            
                            // Show success message
                            alert('Video suggestion submitted successfully!');
                        } else {
                            alert('Error: ' + (data.error || 'Unknown error'));
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to submit suggestion. Please try again.');
                    })
                    .finally(() => {
                        // Reset button
                        btnText.style.display = 'inline-block';
                        btnLoading.style.display = 'none';
                        submitBtn.disabled = false;
                    });
            } else {
                // Save for later
                savePendingRequest('/gallery/suggest-video/', data);
                
                // Show offline message
                alert('You are offline. Your suggestion will be submitted when you reconnect.');
                
                // Reset form and button
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
});
