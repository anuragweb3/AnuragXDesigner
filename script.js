document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.navbar');
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const statusDiv = document.getElementById('form-status');
            const originalText = btn.textContent;
            
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            
            if (!name || !email || !message) {
                statusDiv.style.display = 'block';
                statusDiv.style.backgroundColor = '#fee2e2';
                statusDiv.style.color = '#ef4444';
                statusDiv.textContent = 'Please fill out all fields.';
                return;
            }
            
            btn.textContent = 'Sending...';
            btn.disabled = true;
            
            try {
                // EmailJS service and template IDs
                const serviceID = 'service_lrsuyda';
                const templateID = 'template_le40ozk';

                await emailjs.sendForm(serviceID, templateID, form);
                
                statusDiv.style.display = 'block';
                statusDiv.style.backgroundColor = '#dcfce7';
                statusDiv.style.color = '#22c55e';
                statusDiv.textContent = 'Message sent successfully!';
                form.reset();
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#4ade80';
            } catch (error) {
                statusDiv.style.display = 'block';
                statusDiv.style.backgroundColor = '#fee2e2';
                statusDiv.style.color = '#ef4444';
                statusDiv.textContent = 'Failed to send message. Please try again.';
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            } finally {
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 5000);
            }
        });
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) { themeIcon.classList.replace('ph-moon', 'ph-sun'); }
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.replace('ph-sun', 'ph-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.replace('ph-moon', 'ph-sun');
            }
        });
    }

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon && icon.classList.contains('ph-x')) {
                    icon.classList.replace('ph-x', 'ph-list');
                }
            });
        });
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon && icon.classList.contains('ph-x')) {
                    icon.classList.replace('ph-x', 'ph-list');
                }
            }
        });
    }
});