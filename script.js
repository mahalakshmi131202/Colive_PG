document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.space-card, .amenity-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Room Type Filtering
    const searchBtn = document.getElementById('search-btn');
    const roomTypeSelect = document.getElementById('room-type-select');
    const spaceCards = document.querySelectorAll('.space-card');

    if (searchBtn && roomTypeSelect) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any form submission style defaults

            const selectedType = roomTypeSelect.value;

            spaceCards.forEach(card => {
                const cardType = card.getAttribute('data-category');

                if (selectedType === 'all' || selectedType === cardType) {
                    card.style.display = 'block';
                    // Re-trigger animation if needed, or just let it stay visible
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.display = 'none';
                }
            });

            // smooth scroll to spaces section
            const spacesSection = document.getElementById('spaces');
            if (spacesSection) {
                spacesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Google Sheets Contact Form Submission
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx-f1zz0aI929G4fhVajm7fB41OiKWX5F5iU9GI43YjaoghMD1w6aXnJWEze2H5KKXn/exec';
    // ^^^ REPLACE THIS WITH YOUR OWN GOOGLE SCRIPT URL
    // Instructions for Owner:
    // 1. Create a Google Sheet
    // 2. Go to Extensions > Apps Script
    // 3. Paste the standard "Submit Form to Sheet" script (available in many online tutorials)
    // 4. Deploy > New Deployment > Web App > Who has access: "Anyone"
    // 5. Copy the generated Web App URL and paste it into the 'scriptURL' variable above.

    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('formMessage');
    const submitPath = document.querySelector('#ownerContactForm button');
    const btnText = document.getElementById('btnText');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            // Visual feedback
            if (submitPath) {
                submitPath.disabled = true;
                btnText.innerHTML = 'Sending...';
            }

            // Check if URL is configured
            if (scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' || scriptURL === '' || !scriptURL.includes('script.google.com')) {
                // Simulation Mode for Demo purposes so the UI can be tested
                setTimeout(() => {
                    msg.innerHTML = "Thank you! Your details have been sent to the owner.";
                    msg.className = "form-message success";
                    form.reset();
                    if (submitPath) {
                        submitPath.disabled = false;
                        btnText.innerHTML = 'Request Call Back';
                    }
                    setTimeout(() => {
                        msg.innerHTML = "";
                        msg.className = "form-message";
                    }, 5000);
                }, 1500);
                console.warn("Google Script URL not set. Simulating submission.");
                return;
            }

            fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: new FormData(form) })
                .then(response => {
                    // With 'no-cors' we can't check response.ok, but the request was sent.
                    msg.innerHTML = "Thank you! Your details have been sent to the owner.";
                    msg.className = "form-message success";
                    form.reset();
                    if (submitPath) {
                        submitPath.disabled = false;
                        btnText.innerHTML = 'Request Call Back';
                    }
                    setTimeout(function () {
                        msg.innerHTML = "";
                        msg.className = "form-message";
                    }, 5000);
                })
                .catch(error => {
                    msg.innerHTML = "Error! Please check your internet connection.";
                    msg.className = "form-message error";
                    if (submitPath) {
                        submitPath.disabled = false;
                        btnText.innerHTML = 'Request Call Back';
                    }
                    console.error('Error!', error.message);
                    alert("If you are the owner: Ensure your Google Script is deployed as Web App with 'Who has access' set to 'Anyone'.");
                });
        });
    }

});
