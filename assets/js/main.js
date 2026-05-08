const body = document.body;
const progressBar = document.getElementById('progressBar');
const themeToggle = document.getElementById('themeToggle');
const year = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const revealItems = document.querySelectorAll('.reveal');
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('site-theme');
const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

function setTheme(theme) {
    if (theme === 'light') {
        body.setAttribute('data-theme', 'light');
        themeToggle.textContent = '切换暗色';
    } else {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '切换亮色';
    }
    localStorage.setItem('site-theme', theme);
}

setTheme(initialTheme);

themeToggle.addEventListener('click', () => {
    const nextTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
});

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nameValue = formData.get('name') || '访客';
    const emailValue = formData.get('email') || '';
    const messageValue = formData.get('message') || '';

    const subject = encodeURIComponent(`来自个人网站的消息：${nameValue}`);
    const bodyText = encodeURIComponent(`姓名：${nameValue}\n邮箱：${emailValue}\n\n${messageValue}`);

    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${bodyText}`;
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.14 });

revealItems.forEach((item) => observer.observe(item));

const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

function syncActiveSection() {
    let activeId = 'home';

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 140) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${activeId}`) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progressBar.style.transform = `scaleX(${progress})`;
    syncActiveSection();
}

updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
