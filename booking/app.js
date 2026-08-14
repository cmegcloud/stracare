// Menu & Modal Logic 
    function toggleSidebar() {
        document.querySelector('.sidebar').classList.toggle('active');
        document.querySelector('.sidebar-overlay').classList.toggle('active');
    }

    // Opens a specific modal & converts Header Hamburger to a Back Button
    function openModal(modalId) {
        closeAllModals(true); // pass true to prevent back button from resetting immediately
        document.getElementById(modalId).classList.add('active');
        
        // Hide Menu Button, Show Back Button in the permanently sticky header
        document.getElementById('btn-menu').style.display = 'none';
        document.getElementById('btn-back').style.display = 'flex';
    }

    // Function to toggle manual symptom input
    window.toggleCustomSymptom = function() {
        const select = document.getElementById('pat_symptom');
        const customInput = document.getElementById('pat_symptom_custom');
        if (select && customInput) {
            if (select.value === 'Other') {
                customInput.style.display = 'block';
                customInput.required = true;
            } else {
                customInput.style.display = 'none';
                customInput.required = false;
                customInput.value = '';
            }
        }
    };

    // Closes all modals & restores the Hamburger menu
    function closeAllModals(isOpening = false) {
        const modals = document.querySelectorAll('.fs-modal');
        modals.forEach(modal => modal.classList.remove('active'));
        
        if (!isOpening) {
            document.getElementById('btn-menu').style.display = 'flex';
            document.getElementById('btn-back').style.display = 'none';
        }
        
        // Ensure main content is scrolled to top if they exit a deeply scrolled modal
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openServiceDetails(id, title, img, desc) {
        document.getElementById('sp-title').innerText = title;
        document.getElementById('sp-desc').innerText = desc;
        let imgElem = document.getElementById('sp-img');
        imgElem.src = img;
        imgElem.onerror = function() { this.src = `https://placehold.co/400x300/0369A1/FFF?text=${encodeURIComponent(title)}` };
        document.getElementById('service-popup').classList.add('active');
    }

    function closeServicePopup(e) {
        if (!e || e.target === document.getElementById('service-popup') || !e.target.closest('.popup-content')) {
            document.getElementById('service-popup').classList.remove('active');
        }
    }

    function closeSuccessPopup() {
        document.getElementById('success-popup').classList.remove('active');
        // Because the ticket popup sits above everything, closing it acts like returning to home screen
        document.getElementById('btn-menu').style.display = 'flex';
        document.getElementById('btn-back').style.display = 'none';
    }

    // Auto-Animated Carousel Logic
    function scrollCarousel(direction, isAuto = false) {
        const container = document.getElementById('servicesCarousel');
        if(!container) return;
        const scrollAmount = container.clientWidth * 0.8; 
        if (isAuto && (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10)) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
        }
    }

    let carouselInterval = setInterval(() => scrollCarousel(1, true), 3000);
    const carouselContainer = document.getElementById('servicesCarousel');
    if(carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carouselContainer.addEventListener('touchstart', () => clearInterval(carouselInterval), {passive: true});
    }

    function toggleTheme() {
        const body = document.body;
        const icon = document.getElementById('theme-icon');
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            icon.setAttribute('data-lucide', 'moon');
        } else {
            body.setAttribute('data-theme', 'dark');
            icon.setAttribute('data-lucide', 'sun');
        }
        window.lucide.createIcons();
    }

    function setActiveNav(element) {
        if(!element) return;
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }

    // GPS Auto-Detect
    function getLocation() {
        const status = document.getElementById('location-status');
        const addressInput = document.getElementById('pat_address');
        const latVal = document.getElementById('lat_val');
        const lngVal = document.getElementById('lng_val');

        status.style.display = 'block';
        status.textContent = 'Locating... Please allow location access.';
        status.style.color = 'var(--text-muted)';

        if (!navigator.geolocation) {
            status.textContent = 'Geolocation is not supported by your browser.';
            status.style.color = 'red';
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    latVal.value = lat;
                    lngVal.value = lon;
                    
                    status.innerHTML = `<span style="color:var(--primary-color); font-weight:600;"><i data-lucide="check-circle" style="width:14px; height:14px; vertical-align:-2px;"></i> Location securely attached!</span>`;
                    window.lucide.createIcons();

                    if(addressInput.value.trim() === '') {
                        addressInput.value = `[Auto-GPS Linked: ${lat.toFixed(5)}, ${lon.toFixed(5)}]\n`;
                    }
                }, 
                (err) => {
                    status.textContent = 'Unable to retrieve your location. Please type manually.';
                    status.style.color = 'red';
                }
            );
        }
    }

    // JPEG Download Script using HTML2Canvas
    function downloadTicket() {
        const ticketNode = document.getElementById('capture-ticket');
        html2canvas(ticketNode, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'STRA_CARE_Booking.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        });
    }

    // --- PWA Installation Script ---
    let deferredPrompt;
    
    // Capture the install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    // Attach click listener to all buttons with 'pwa-install-btn' class
    const installButtons = document.querySelectorAll('.pwa-install-btn');
    installButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
            } else {
                // Fallback for iOS users or already installed
                alert('To install on iOS: tap the Share button (square with arrow) at the bottom and select "Add to Home Screen".');
            }
            // Close sidebar if clicked from there
            if(document.querySelector('.sidebar').classList.contains('active')) {
                toggleSidebar();
            }
        });
    });

    // Hide install buttons if the app is already successfully installed
    window.addEventListener('appinstalled', () => {
        console.log('App was installed');
        installButtons.forEach(btn => btn.style.display = 'none');
    });
