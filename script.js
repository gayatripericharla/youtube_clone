// --- Global Active Session Engine ---
let currentUser = { name: "" };

// --- 1. Authentic Login Form Event Pipeline ---
function handleLogin(event) {
    event.preventDefault(); // Prevents page reload
    
    const nameInput = document.getElementById('user-name-input');
    if (!nameInput || nameInput.value.trim() === "") return;

    // Capture dynamic login credentials
    currentUser.name = nameInput.value.trim();

    // Select view structures
    const loginOverlay = document.getElementById('login-overlay');
    const appWrapper = document.getElementById('app-wrapper');
    const dropdownLabel = document.getElementById('dropdown-user-name');

    // Generate and inject character symbol avatar
    initializeUserProfile();

    // Populate user profile string inside account widget panel header
    if (dropdownLabel) dropdownLabel.textContent = `Hi, ${currentUser.name}! 👋`;

    // Cross-fade views: Drop log screen, show the working main application dashboard
    if (loginOverlay) loginOverlay.style.setProperty('display', 'none', 'important');
    if (appWrapper) appWrapper.style.display = 'block';
}

// --- Dom Elements ---
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');
const videoCards = document.querySelectorAll('.video-card');
const modal = document.getElementById('video-modal');
const modalPlayer = document.getElementById('modal-player-container');
const closeBtn = document.querySelector('.close-btn');

const mainFeed = document.getElementById('main-feed-container');
const dynamicPage = document.getElementById('dynamic-page-container');
const chipsWrapper = document.querySelector('.chips-wrapper');
const profileAvatar = document.getElementById('user-profile-avatar');

// Dropdown Element Additions
const profileMenu = document.getElementById('profile-menu');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const logoutBtn = document.getElementById('logout-btn');

let watchedVideos = []; 

// --- 2. Dynamic Profile Character Initializer ---
function initializeUserProfile() {
    if (profileAvatar && currentUser && currentUser.name) {
        const cleanName = currentUser.name.trim();
        if (cleanName.length > 0) {
            const initialLetter = cleanName.charAt(0).toUpperCase();
            profileAvatar.innerHTML = `<span class="profile-avatar-letter">${initialLetter}</span>`;
        }
    }
}

// --- 3. Toggle Account Settings Dropdown Overlay Menu ---
if (profileAvatar) {
    profileAvatar.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops immediate window-click closing
        profileMenu.classList.toggle('active-menu');
    });
}

// --- 4. Toggle Theme ---
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
}

// --- 5. LOGOUT REVERSAL SYSTEM LOGIC ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        currentUser.name = "";
        document.getElementById('user-name-input').value = "";
        profileMenu.classList.remove('active-menu');

        document.getElementById('app-wrapper').style.display = 'none';
        document.getElementById('login-overlay').style.setProperty('display', 'flex', 'important');
    });
}

// Close Dropdown Menu when clicking anywhere else on the screen window interface
window.addEventListener('click', () => {
    if (profileMenu) profileMenu.classList.remove('active-menu');
});

// --- 6. Toggle Sidebar Window (UPDATED WITH FLUID OVERLAY SLIDE DRAWER LOGIC FOR MOBILES) ---
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
    } else {
        sidebar.classList.toggle('small-sidebar');
        content.classList.toggle('large-content');
    }
});

// Close mobile sidebar menu instantly if a user clicks outside the drawer view panel boundaries
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && e.target !== menuBtn) {
        sidebar.classList.remove('mobile-open');
    }
});

// --- 7. Video Micro-interactions (Hover Preview & Modals) ---
videoCards.forEach(card => {
    const videoId = card.getAttribute('data-video-id');
    const placeholder = card.querySelector('.video-placeholder');
    const originalHTML = placeholder.innerHTML;

    card.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            placeholder.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0" 
                allow="autoplay" style="pointer-events: none; width: 100%; height: 100%; object-fit: cover;"></iframe>`;
        }
    });

    card.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) placeholder.innerHTML = originalHTML;
    });

    card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 

        placeholder.innerHTML = originalHTML; 

        if (!watchedVideos.includes(videoId)) {
            watchedVideos.push(videoId); 
        }

        modal.style.display = 'flex';
        
        modalPlayer.innerHTML = `
            <iframe width="100%" height="100%" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0" 
            frameborder="0" 
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen="true"></iframe>`;
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalPlayer.innerHTML = ''; 
});

// --- 8. Search Bar Filters ---
document.getElementById('search-input').addEventListener('keyup', (e) => {
    const query = e.target.value.toLowerCase();
    videoCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(query) ? "block" : "none";
    });
});

// --- 9. Category Chips Navigation ---
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        dynamicPage.style.display = 'none';
        mainFeed.style.display = 'block';
        sidebar.classList.remove('mobile-open'); // Auto close menu drawer
        
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const selectedCat = chip.textContent.toLowerCase();

        videoCards.forEach(card => {
            const videoCat = card.getAttribute('data-category');
            card.style.display = (selectedCat === 'all' || selectedCat === videoCat) ? "block" : "none";
        });
    });
});

// --- 10. Active Watch History Page Filter ---
document.getElementById('history-btn').addEventListener('click', () => {
    dynamicPage.style.display = 'none';
    mainFeed.style.display = 'block';
    chipsWrapper.style.display = 'flex';
    sidebar.classList.remove('mobile-open');

    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    videoCards.forEach(card => {
        const videoId = card.getAttribute('data-video-id');
        card.style.display = watchedVideos.includes(videoId) ? "block" : "none";
    });
});

// --- 11. Home Navigation Tab Controller ---
document.getElementById('home-btn').addEventListener('click', () => {
    dynamicPage.style.display = 'none';
    dynamicPage.innerHTML = ''; 
    mainFeed.style.display = 'block';
    chipsWrapper.style.display = 'flex';
    sidebar.classList.remove('mobile-open');

    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    const allChip = document.querySelector('.chip'); 
    if (allChip) allChip.classList.add('active');

    videoCards.forEach(card => {
        card.style.display = "block";
    });
});

// --- 12. Complete Dynamic Page Multi-View Logic ---
function showDynamicPage(contentHtml) {
    if (mainFeed) mainFeed.style.setProperty('display', 'none', 'important');
    if (chipsWrapper) chipsWrapper.style.display = 'none';
    
    dynamicPage.innerHTML = contentHtml;
    dynamicPage.style.display = 'block';
}

// Shorts View Engine (NOW WITH 5 INTERACTIVE SHORTS CARDS)
document.getElementById('shorts-btn').addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    const shortsHtml = `
        <div class="shorts-wrapper" style="
            height: calc(100vh - 80px); 
            overflow-y: scroll; 
            scroll-snap-type: y mandatory; 
            display: flex; 
            flex-direction: column; 
            align-items: center;
            padding: 0px 0 40px 0;
            scrollbar-width: none;
        ">
            <style>
                .shorts-wrapper::-webkit-scrollbar { display: none; }
                .short-container { scroll-snap-align: center; scroll-snap-stop: always; }
            </style>

            <h2 style="margin-top: 25px; margin-bottom: 25px; text-align: center; width: 100%;">🔥 YouTube Shorts Feed</h2>

            <div class="short-container" data-video-id="u3Y6XN2ll_M" style="
                min-height: calc(100vh - 120px); 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center;
            ">
                <div class="video-holder-slot" style="width: 280px; height: 480px; background: #000; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); overflow: hidden;">
                    <img src="https://i.ytimg.com/vi/u3Y6XN2ll_M/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="margin-top: 12px; font-weight: bold; font-size: 16px;">Darling Status Mix</p>
            </div>

            <div class="short-container" data-video-id="Dva4BQrwdfY" style="
                min-height: calc(100vh - 120px); 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center;
            ">
                <div class="video-holder-slot" style="width: 280px; height: 480px; background: #000; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); overflow: hidden;">
                    <img src="https://i.ytimg.com/vi/Dva4BQrwdfY/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="margin-top: 12px; font-weight: bold; font-size: 16px;">Shin-chan Comedy</p>
            </div>

            <div class="short-container" data-video-id="kfNij2_UQT0" style="
                min-height: calc(100vh - 120px); 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center;
            ">
                <div class="video-holder-slot" style="width: 280px; height: 480px; background: #000; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); overflow: hidden;">
                    <img src="https://i.ytimg.com/vi/kfNij2_UQT0/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="margin-top: 12px; font-weight: bold; font-size: 16px;">Amma Comedy | Aura Things</p>
            </div>

            <div class="short-container" data-video-id="LTKk1DBLWRI" style="
                min-height: calc(100vh - 120px); 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center;
            ">
                <div class="video-holder-slot" style="width: 280px; height: 480px; background: #000; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); overflow: hidden;">
                    <img src="https://i.ytimg.com/vi/LTKk1DBLWRI/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="margin-top: 12px; font-weight: bold; font-size: 16px;">Radha Krishna | Adharam Madhuram</p>
            </div>

            <div class="short-container" data-video-id="3vFhQ_7vD_0" style="
                min-height: calc(100vh - 120px); 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center;
            ">
                <div class="video-holder-slot" style="width: 280px; height: 480px; background: #000; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); overflow: hidden;">
                    <img src="https://i.ytimg.com/vi/3vFhQ_7vD_0/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="margin-top: 12px; font-weight: bold; font-size: 16px;">Telugu Jabardasth Comedy</p>
            </div>

        </div>
    `;
    
    showDynamicPage(shortsHtml);

    const wrapper = document.querySelector('.shorts-wrapper');
    const containers = document.querySelectorAll('.short-container');

    const observerOptions = {
        root: wrapper,
        rootMargin: '0px',
        threshold: 0.6
    };

    const shortsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const videoId = entry.target.getAttribute('data-video-id');
            const holderSlot = entry.target.querySelector('.video-holder-slot');

            if (entry.isIntersecting) {
                holderSlot.innerHTML = `
                    <iframe width="100%" height="100%" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1" 
                    frameborder="0" allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>
                `;
            } else {
                holderSlot.innerHTML = `<img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;">`;
            }
        });
    }, observerOptions);

    containers.forEach(container => shortsObserver.observe(container));
});