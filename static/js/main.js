
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes on page load
    animateOnLoad();
    
    // Fetch portfolio data
    fetch('/api/portfolio-data')
        .then(response => response.json())
        .then(data => {
            populateData(data);
        })
        .catch(error => {
            console.error('Error fetching portfolio data:', error);
        });

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('emailInput').value,
                message: document.getElementById('message').value
            };
            
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Error sending message: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
    
    // Add scroll animation observer for sections
    setupScrollAnimations();
});

function animateOnLoad() {
    // Add animation classes to elements with animate-fade-in class
    document.querySelectorAll('.animate-fade-in').forEach(element => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
            element.style.opacity = '1';
        }, 100);
    });
    
    // Add animation classes to elements with animate-slide-up class
    document.querySelectorAll('.animate-slide-up').forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
}

function setupScrollAnimations() {
    // Create an intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all sections except hero (which should animate on load)
    document.querySelectorAll('section:not(#hero)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
    
    // Add a CSS class when visible
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            section.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
}

function populateData(data) {
    // Set name and objective
    if (data.name) {
        document.getElementById('firstName').textContent = data.name.split(' ')[0];
    }
    
    if (data.objective) {
        document.getElementById('objective').textContent = data.objective;
    }
    
    // Populate contact information
    if (data.contact) {
        if (data.contact.email) {
            document.getElementById('email').textContent = data.contact.email;
        }
        
        if (data.contact.location) {
            document.getElementById('location').textContent = data.contact.location;
        }
        
        if (data.contact.phone) {
            document.getElementById('phone').textContent = data.contact.phone;
        }
    }
    
    // Populate education
    if (data.education && data.education.length > 0) {
        const educationList = document.getElementById('education-list');
        educationList.innerHTML = '';
        
        data.education.forEach(item => {
            const educationItem = document.createElement('div');
            educationItem.className = 'education-item';
            educationItem.innerHTML = `
                <h4>${item.institution}</h4>
                <p>${item.degree}</p>
                <div class="years">${item.years}</div>
            `;
            educationList.appendChild(educationItem);
        });
    }
    
    // Populate skills
    if (data.skills && data.skills.length > 0) {
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = '';
        
        data.skills.forEach(skill => {
            const skillItem = document.createElement('li');
            skillItem.className = 'skill-item';
            skillItem.textContent = skill;
            skillsList.appendChild(skillItem);
        });
    }
    
    // Populate languages
    if (data.languages) {
        const languageList = document.getElementById('language-list');
        languageList.innerHTML = '';
        
        Object.entries(data.languages).forEach(([language, level]) => {
            const languageItem = document.createElement('li');
            languageItem.className = 'language-item';
            languageItem.innerHTML = `
                <span>${language}</span>
                <span>${level}</span>
            `;
            languageList.appendChild(languageItem);
        });
    }
    
    // Populate social links
    if (data.social_media) {
        const socialLinks = document.getElementById('social-links');
        socialLinks.innerHTML = '';
        
        Object.entries(data.social_media).forEach(([platform, url]) => {
            const socialLink = document.createElement('a');
            socialLink.href = url;
            socialLink.className = 'social-link';
            socialLink.target = '_blank';
            socialLink.rel = 'noopener noreferrer';
            
            let icon;
            switch(platform.toLowerCase()) {
                case 'github':
                    icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
                    break;
                case 'linkedin':
                    icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
                    break;
                default:
                    icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
            }
            
            socialLink.innerHTML = icon;
            socialLink.setAttribute('aria-label', platform);
            socialLinks.appendChild(socialLink);
        });
    }
}
