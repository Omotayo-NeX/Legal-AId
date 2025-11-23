// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation for feature cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .step');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Header shadow on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// Update store links (you can update these with actual app store links when available)
const appStoreLink = '#'; // Replace with actual App Store link
const playStoreLink = '#'; // Replace with actual Google Play link

document.querySelectorAll('.store-button').forEach(button => {
    if (button.textContent.includes('App Store')) {
        button.href = appStoreLink;
    } else if (button.textContent.includes('Google Play')) {
        button.href = playStoreLink;
    }
});

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
});

// Supabase Configuration
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";
const TABLE_NAME = "waitlist";

// Waitlist Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const waitlistForm = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form values
            const formData = new FormData(waitlistForm);

            // Collect checked legal areas
            const legalAreasCheckboxes = waitlistForm.querySelectorAll('input[name="legalAreas"]:checked');
            const legalAreas = Array.from(legalAreasCheckboxes).map(cb => cb.value).join(', ');

            // Prepare data for Supabase
            const data = {
                full_name: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone') || null,
                country: formData.get('country') || null,
                user_type: formData.get('userType'),
                legal_areas: legalAreas || null,
                referral_source: formData.get('referralSource'),
                beta_access: formData.get('betaAccess')
            };

            try {
                // Send to Supabase
                const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Success
                    formMessage.textContent = 'Thank you! You are now on the Legal AI.D waitlist.';
                    formMessage.className = 'form-message success';
                    waitlistForm.reset();

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formMessage.className = 'form-message';
                    }, 5000);
                } else {
                    // Error
                    throw new Error('Submission failed');
                }
            } catch (error) {
                // Show error message
                formMessage.textContent = 'Something went wrong. Please try again.';
                formMessage.className = 'form-message error';

                // Hide error message after 5 seconds
                setTimeout(() => {
                    formMessage.className = 'form-message';
                }, 5000);
            }
        });
    }
});
