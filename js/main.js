// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hero Text Animation
    setTimeout(() => {
        document.querySelectorAll('.reveal-text').forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate Numbers if it's a stats container
                if (entry.target.classList.contains('stats-container')) {
                    animateNumbers();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));

    // Number Counter Animation
    let numbersAnimated = false;
    function animateNumbers() {
        if (numbersAnimated) return;
        numbersAnimated = true;
        
        document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    el.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target;
                }
            };
            updateCounter();
        });
    }

    // Branch Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // logic to filter branches would go here
        });
    });

    // Form submission
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = currentLang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully';
            btn.style.background = '#10B981'; // Green
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    }
});
