document.addEventListener('DOMContentLoaded', () => {
    const CONTACT_API_PATH = '/api/contact';
    const PLACEHOLDER_TEXT = {
        tr: {
            name: 'Adınız',
            email: 'E-posta Adresiniz',
            message: 'Mesajınız'
        },
        en: {
            name: 'Your Name',
            email: 'Your Email',
            message: 'Your Message'
        }
    };
    const FORM_MESSAGE_COLORS = {
        success: '#2ecc71',
        error: '#e74c3c'
    };
    const API_ERROR_MESSAGES = {
        tr: {
            400: 'Gönderim doğrulanamadı.',
            422: 'Lütfen form alanlarını kontrol edin.',
            429: 'Çok sık deneme yaptınız. Lütfen bir dakika sonra tekrar deneyin.',
            500: 'Sunucuda beklenmeyen bir hata oluştu.',
            502: 'E-posta servisine şu anda ulaşılamıyor.',
            504: 'E-posta servisi zaman aşımına uğradı.',
            default: 'Mesaj gönderilemedi.'
        },
        en: {
            400: 'Your submission could not be verified.',
            422: 'Please check the form fields.',
            429: 'You have tried too often. Please wait a minute and try again.',
            500: 'An unexpected server error occurred.',
            502: 'The email service is unavailable right now.',
            504: 'The email service timed out.',
            default: 'Failed to send message.'
        }
    };

    const translations = {
        tr: {
            'nav-home': 'Anasayfa',
            'nav-about': 'Hakkımda',
            'nav-skills': 'Yetenekler',
            'nav-projects': 'Projeler',
            'nav-contact': 'İletişim',
            'nav-cv': 'CV İndir',
            'hero-greeting': 'Merhaba, Ben Ahmet Melih Çalış',
            'hero-tagline': 'Teknolojinin gücünü kullanarak dünyayı daha anlamlı bir yer haline getirelim!',
            'btn-contact': 'Bana Ulaşın',
            'btn-projects': 'Projelerim',
            'title-about': 'Hakkımda',
            'about-p1': 'İlab Grup bünyesinde yer alan SteelOrbis’te Yazılım Uzman Yardımcısı olarak çalışıyor, aynı zamanda Kocaeli Üniversitesi Yazılım Mühendisliği bölümünde öğrenim görüyorum. Yapay zeka teknolojilerini keşfetmeye ve bu alanda üretmeye büyük bir tutku duyuyorum. Hedefim, yapay zeka alanında bir kariyer inşa etmek ve bu teknolojinin gelişimine katkı sunmak.',
            'about-p2': 'Bilgisayar başında vakit geçirmekten, yeni teknolojiler keşfetmekten ve sürekli öğrenmekten keyif alıyorum. Sürekli öğrenme anlayışı, çalışmalarımın temelini oluşturuyor; bu doğrultuda yeni araçlar ve teknolojilerle denemeler yapmaya her zaman açığım.',
            'about-p3': 'Programlamanın dışında sıkı bir Formula 1 hayranıyım. Ayrıca seyahat etmeyi, tarih açısından zengin şehirleri keşfetmeyi ve farklı kültürler hakkında bilgi edinmeyi de seviyorum.',
            'title-skills': 'Yetenekler',
            'skill-prog': 'Programlama Dilleri',
            'skill-frame': 'Frameworkler',
            'skill-tools': 'Araçlar',
            'title-projects': 'Projeler & Başarılar',
            'badge-featured': 'Öne Çıkan Proje',
            'pinned-title': 'Öne Çıkan Projeler',
            'feat-proj-desc': 'PharmAI, ilaçlara ilişkin temel bilgileri ve olası yan etkileri yapay zeka destekli analizlerle sunan bir bilgi platformudur. Doğal dil işleme teknolojileriyle ilaç verilerini özetler; etkileşim analizi ve ilaç karşılaştırma gibi özellikleri tek bir çatı altında toplar.',
            'feat-proj-title': 'PharmAI — Yapay Zeka Destekli İlaç Bilgi Platformu',
            'feat-code': 'Kodlar',
            'feat-video': 'Video',
            'subtitle-other': 'Diğer Çalışmalar',
            'proj-1-title': 'GitHub Hesabım',
            'proj-1-desc': 'GitHub’da paylaştığım makine öğrenmesi notlarım, kişisel portfolyo sitem ve tüm çalışmalarım.',
            'proj-2-title': 'Kaggle Yolculuğum',
            'proj-2-desc': 'Kaggle’da paylaştığım notebooklarım ve çalışmalarım.',
            'subtitle-awards': 'Ödüller',
            'award-1-title': 'Bootcamp Finalisti',
            'award-1-desc': "Yapay Zeka ve Teknoloji Akademisi 4. Dönem | Mezuniyet Bootcamp'i Finalisti - PharmAI",
            'award-2-title': 'Ar-Ge Teşvik Ödülü Kazananı',
            'award-2-desc': '3. “Ulaşan ve Erişen Türkiye” Fikir Yarışması Ar-Ge Teşvik Ödülü Kazananı',
            'award-3-title': 'Ar-Ge Teşvik Ödülü Kazananı',
            'award-3-desc': '4. “Ulaşan ve Erişen Türkiye” Fikir Yarışması Ar-Ge Teşvik Ödülü Kazananı',
            'award-4-title': 'Base 41: Hackathon',
            'award-4-desc': "2.'lik - InsightMap",
            'subtitle-certs': 'Sertifikalar',
            'cert-1-title': 'Google ve Diğer Sertifikalarım',
            'cert-1-sub': 'Profesyonel Sertifika',
            'cert-2-title': 'Sertifier Sertifikalarım',
            'cert-2-sub': 'Global AI Hub',
            'title-contact': 'İletişime Geçelim',
            'contact-text': 'Projeleriniz, fikirleriniz veya iş birliği için bana yazabilirsiniz.',
            'btn-send': 'Mesaj Gönder'
        },
        en: {
            'nav-home': 'Home',
            'nav-about': 'About',
            'nav-skills': 'Skills',
            'nav-projects': 'Projects',
            'nav-contact': 'Contact',
            'nav-cv': 'Download CV',
            'hero-greeting': "Hi, I'm Ahmet Melih Çalış",
            'hero-tagline': "Let's use the power of technology to make the world a more meaningful place!",
            'btn-contact': 'Contact Me',
            'btn-projects': 'My Projects',
            'title-about': 'About Me',
            'about-p1': 'I work as an Associate Software Engineer at SteelOrbis, part of Ilab Grup, and I am also studying Software Engineering at Kocaeli University. I have a strong passion for exploring and building with AI technologies. My goal is to build a career in AI and contribute to the development of these technologies.',
            'about-p2': "I enjoy spending time on the computer, discovering new technologies, and continuously learning. A growth mindset underpins my work; I'm always open to experimenting with new tools and technologies.",
            'about-p3': "Outside of programming, I'm an avid Formula 1 fan. I enjoy traveling, exploring historically rich cities, and learning about different cultures as well.",
            'title-skills': 'Skills',
            'skill-prog': 'Programming Languages',
            'skill-frame': 'Frameworks',
            'skill-tools': 'Tools',
            'title-projects': 'Projects & Achievements',
            'badge-featured': 'Featured Project',
            'pinned-title': 'Featured Projects',
            'feat-proj-desc': 'PharmAI is an information platform that provides core drug details and possible side effects through AI-powered analyses. It summarizes drug data using natural language processing technologies, and brings features such as interaction analysis and drug comparison together under a single roof.',
            'feat-proj-title': 'PharmAI — AI-Powered Drug Information Platform',
            'feat-code': 'Code',
            'feat-video': 'Video',
            'subtitle-other': 'Other Works',
            'proj-1-title': 'My GitHub Account',
            'proj-1-desc': 'My machine learning notes on GitHub, my personal portfolio site, and all my projects.',
            'proj-2-title': 'My Kaggle Journey',
            'proj-2-desc': 'My notebooks and works shared on Kaggle.',
            'subtitle-awards': 'Awards',
            'award-1-title': 'Bootcamp Finalist',
            'award-1-desc': 'Artificial Intelligence and Technology Academy 4th Term | Graduation Bootcamp Finalist – PharmAI',
            'award-2-title': 'R&D Incentive Award Winner',
            'award-2-desc': 'R&D Incentive Award Winner at the 3rd Ulaşan ve Erişen Türkiye Idea Competition',
            'award-3-title': 'R&D Incentive Award Winner',
            'award-3-desc': 'R&D Incentive Award Winner at the 4th Ulaşan ve Erişen Türkiye Idea Competition',
            'award-4-title': 'Base 41: Hackathon',
            'award-4-desc': '2nd Place Winner InsightMap',
            'subtitle-certs': 'Certificates',
            'cert-1-title': 'Google & Other Certificates',
            'cert-1-sub': 'Professional Certificate',
            'cert-2-title': 'Sertifier Certificates',
            'cert-2-sub': 'Global AI Hub',
            'title-contact': 'Get In Touch',
            'contact-text': 'Feel free to reach out for projects or ideas.',
            'btn-send': 'Send Message'
        }
    };

    function applyPinnedLanguage(lang) {
        document.querySelectorAll('.repo-card').forEach((card) => {
            let translations = {};
            try {
                translations = JSON.parse(card.dataset.translations || '{}');
            } catch (error) {
                translations = {};
            }
            const text = translations[lang];
            card.querySelector('p').textContent = (typeof text === 'string' && text) || card.dataset.desc || '';
        });
    }

    const langToggle = document.getElementById('lang-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navbarNav = document.querySelector('.navbar-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const backToTopBtn = document.getElementById('back-to-top');
    const preloader = document.getElementById('preloader');
    const typewriterElement = document.getElementById('typewriter');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const sendButton = document.getElementById('sendBtn');
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        message: document.getElementById('message'),
        website: document.getElementById('website')
    };

    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    let currentLang = localStorage.getItem('lang') || 'tr';
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout;
    let formMessageTimeout;

    if (!localStorage.getItem('lang')) {
        localStorage.setItem('lang', currentLang);
    }

    const typewriterWords = {
        tr: ['Yapay Zeka Tutkunu', 'İnovatif İnsan'],
        en: ['AI Enthusiast', 'Future Innovator']
    };

    function applyTextTranslations(lang) {
        document.querySelectorAll('[data-lang]').forEach((element) => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    function applyAttributeTranslations(lang) {
        document.querySelectorAll('[data-title]').forEach((element) => {
            const key = element.getAttribute('data-title');
            if (translations[lang] && translations[lang][key]) {
                const text = translations[lang][key];
                element.title = text;
                element.setAttribute('aria-label', text);
            }
        });
    }

    function applyFormPlaceholders(lang) {
        formFields.name.placeholder = PLACEHOLDER_TEXT[lang].name;
        formFields.email.placeholder = PLACEHOLDER_TEXT[lang].email;
        formFields.message.placeholder = PLACEHOLDER_TEXT[lang].message;
    }

    function updateLanguageToggle(lang) {
        langToggle.textContent = lang.toUpperCase();
        langToggle.setAttribute('aria-label', lang === 'en' ? 'English (EN)' : 'Türkçe (TR)');
    }

    function typeEffect() {
        const words = typewriterWords[currentLang];
        const currentWord = words[wordIndex];
        const typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex < currentWord.length) {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex += 1;
            typeTimeout = setTimeout(typeEffect, typeSpeed);
        } else if (isDeleting && charIndex > 0) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex -= 1;
            typeTimeout = setTimeout(typeEffect, typeSpeed);
        } else if (!isDeleting) {
            isDeleting = true;
            typeTimeout = setTimeout(typeEffect, 2000);
        } else {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeTimeout = setTimeout(typeEffect, 500);
        }
    }

    function resetTypewriter() {
        clearTimeout(typeTimeout);
        wordIndex = 0;
        charIndex = 0;
        isDeleting = false;
        typewriterElement.textContent = '';
        typeEffect();
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        updateLanguageToggle(lang);
        applyTextTranslations(lang);
        applyAttributeTranslations(lang);
        applyFormPlaceholders(lang);
        applyPinnedLanguage(lang);
        resetTypewriter();
    }

    function setTheme(isLight) {
        body.classList.toggle('light-mode', isLight);
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    function toggleBackToTopButton() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }

    function showFormMessage(message, type, timeoutMs) {
        clearTimeout(formMessageTimeout);
        formMessage.textContent = message;
        formMessage.style.color = FORM_MESSAGE_COLORS[type];
        formMessageTimeout = setTimeout(() => {
            formMessage.textContent = '';
        }, timeoutMs);
    }

    function setSubmitState(isLoading) {
        sendButton.innerText = isLoading
            ? (currentLang === 'en' ? 'Sending...' : 'Gönderiliyor...')
            : translations[currentLang]['btn-send'];
        sendButton.disabled = isLoading;
    }

    function getFormData() {
        return {
            name: formFields.name.value,
            email: formFields.email.value,
            message: formFields.message.value,
            website: formFields.website ? formFields.website.value : ''
        };
    }

    function getApiErrorMessage(status, lang, fallbackDetail) {
        const statusMessage = API_ERROR_MESSAGES[lang][status];
        if (statusMessage) {
            return statusMessage;
        }

        return fallbackDetail || API_ERROR_MESSAGES[lang].default;
    }

    function normalizeErrorDetail(detail) {
        if (typeof detail === 'string') {
            return detail;
        }

        if (Array.isArray(detail)) {
            const messages = detail
                .map((item) => {
                    if (typeof item === 'string') {
                        return item;
                    }

                    if (item && typeof item === 'object' && typeof item.msg === 'string') {
                        return item.msg;
                    }

                    return '';
                })
                .filter(Boolean);

            return messages.join(' ');
        }

        if (detail && typeof detail === 'object' && typeof detail.msg === 'string') {
            return detail.msg;
        }

        return '';
    }

    async function getResponseError(response) {
        let fallbackDetail = '';

        try {
            const errorPayload = await response.json();
            fallbackDetail = normalizeErrorDetail(errorPayload.detail);
        } catch (error) {
            fallbackDetail = '';
        }

        return getApiErrorMessage(response.status, currentLang, fallbackDetail);
    }

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        setTheme(true);
    } else {
        setTheme(false);
    }

    themeToggle.addEventListener('click', () => {
        setTheme(!body.classList.contains('light-mode'));
    });

    langToggle.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'tr' : 'en');
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        navbarNav.classList.toggle('active');
        document.body.classList.toggle('menu-open', navbarNav.classList.contains('active'));
    });

    document.addEventListener('click', (event) => {
        const isMenuOpen = navbarNav.classList.contains('active');
        if (!isMenuOpen) {
            return;
        }

        const clickedInsideMenu = navbarNav.contains(event.target) || menuToggle.contains(event.target);
        if (!clickedInsideMenu) {
            menuToggle.classList.remove('is-active');
            navbarNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('is-active');
            navbarNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    window.onscroll = toggleBackToTopButton;

    backToTopBtn.addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    setLanguage(currentLang);

    /* ---------- Subtle page behaviour ---------- */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navbar = document.getElementById('navbar');

    function onScrollUpdate() {
        navbar.classList.toggle('scrolled', document.documentElement.scrollTop > 10);
    }
    window.addEventListener('scroll', onScrollUpdate, { passive: true });
    onScrollUpdate();

    const revealTargets = document.querySelectorAll(
        '.section-title, .about-card, .skill-card, .featured-project, .subsection-title, .project-card, .static-card, .cert-card, .contact-box'
    );
    revealTargets.forEach((el) => {
        el.classList.add('reveal');
        const index = Array.from(el.parentElement.children).indexOf(el);
        el.style.setProperty('--d', `${Math.min(index, 4) * 0.08}s`);
    });
    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
        revealTargets.forEach((el) => revealObserver.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('in'));
    }

    /* ---------- Calm background network ---------- */
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const pointer = { x: -9999, y: -9999 };
    let particles = [];
    let width = 0;
    let height = 0;
    let rgb = '0, 212, 255';

    function readAccent() {
        const hex = getComputedStyle(body).getPropertyValue('--accent').trim().replace('#', '');
        if (hex.length === 6) {
            rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ');
        }
    }

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(Math.floor((width * height) / 22000), 60);
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            r: Math.random() * 1.1 + 0.5
        }));
    }

    function drawFrame() {
        ctx.clearRect(0, 0, width, height);
        const linkDist = 130;
        for (let i = 0; i < particles.length; i += 1) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110 && dist > 0) {
                p.x += (dx / dist) * 0.5;
                p.y += (dy / dist) * 0.5;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, 0.65)`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j += 1) {
                const q = particles[j];
                const d = Math.hypot(p.x - q.x, p.y - q.y);
                if (d < linkDist) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${rgb}, ${0.2 * (1 - d / linkDist)})`;
                    ctx.stroke();
                }
            }
        }
    }

    resizeCanvas();
    readAccent();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    });
    new MutationObserver(readAccent).observe(body, { attributes: true, attributeFilter: ['class'] });
    if (reduceMotion) {
        drawFrame();
    } else {
        (function animate() {
            if (!document.hidden) {
                drawFrame();
            }
            requestAnimationFrame(animate);
        })();
    }

    /* ---------- Pinned GitHub repositories ---------- */
    const GITHUB_USER = 'ahmetmelihcalis';
    const PINNED_API = '/api/pinned';
    const pinnedSection = document.getElementById('pinned-section');
    const pinnedGrid = document.getElementById('pinned-grid');
    const featuredFallback = document.getElementById('featured-fallback');

    function buildRepoCard(repo) {
        const card = document.createElement('a');
        card.className = 'card repo-card';
        card.href = `https://github.com/${repo.author}/${repo.name}`;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        const head = document.createElement('div');
        head.className = 'repo-head';
        const icon = document.createElement('i');
        icon.className = 'fab fa-github';
        const title = document.createElement('h4');
        title.textContent = repo.author.toLowerCase() === GITHUB_USER ? repo.name : `${repo.author}/${repo.name}`;
        head.append(icon, title);

        card.dataset.repo = repo.name;
        card.dataset.desc = repo.description || '';
        card.dataset.translations = JSON.stringify(repo.translations && typeof repo.translations === 'object' ? repo.translations : {});
        const desc = document.createElement('p');
        desc.textContent = repo.description || '';

        const meta = document.createElement('div');
        meta.className = 'repo-meta';
        if (repo.language) {
            const lang = document.createElement('span');
            const swatch = document.createElement('i');
            swatch.className = 'repo-lang-dot';
            if (repo.languageColor) {
                swatch.style.background = repo.languageColor;
            }
            lang.append(swatch, document.createTextNode(repo.language));
            meta.append(lang);
        }
        [['fa-star', repo.stars], ['fa-code-branch', repo.forks]].forEach(([iconClass, count]) => {
            if (Number(count) > 0) {
                const item = document.createElement('span');
                const itemIcon = document.createElement('i');
                itemIcon.className = `fas ${iconClass}`;
                item.append(itemIcon, document.createTextNode(` ${Number(count)}`));
                meta.append(item);
            }
        });

        card.append(head, desc, meta);
        return card;
    }

    function renderPinned(repos) {
        if (!repos.length) {
            return false;
        }

        pinnedGrid.replaceChildren(...repos.map(buildRepoCard));
        pinnedGrid.dataset.count = String(repos.length);
        applyPinnedLanguage(currentLang);
        pinnedGrid.querySelectorAll('.card').forEach((card, index) => {
            card.classList.add('reveal');
            card.style.setProperty('--d', `${Math.min(index, 5) * 0.06}s`);
            requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('in')));
        });
        pinnedSection.hidden = false;
        featuredFallback.hidden = true;
        return true;
    }

    async function loadPinned() {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(PINNED_API, { signal: controller.signal });
            if (!response.ok) {
                throw new Error(`Pinned API ${response.status}`);
            }
            const { repos } = await response.json();
            renderPinned(Array.isArray(repos) ? repos : []);
        } catch (error) {
            /* keep the static featured project */
        } finally {
            clearTimeout(timer);
        }
    }
    loadPinned();

    const spyLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    if ('IntersectionObserver' in window) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    spyLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                    });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spyLinks
            .map((link) => document.querySelector(link.getAttribute('href')))
            .filter(Boolean)
            .forEach((section) => spyObserver.observe(section));
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        setSubmitState(true);

        const formData = getFormData();
        const websiteHoneypot = formData.website;

        if (websiteHoneypot.trim() !== '') {
            showFormMessage(
                currentLang === 'en' ? 'Bot submission blocked.' : 'Spam tespit edildi, gönderim engellendi.',
                'error',
                4000
            );
            setSubmitState(false);
            return;
        }

        try {
            const response = await fetch(CONTACT_API_PATH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showFormMessage(
                    currentLang === 'en' ? 'Message sent successfully!' : 'Mesaj başarıyla gönderildi!',
                    'success',
                    5000
                );
                contactForm.reset();
            } else {
                throw new Error(await getResponseError(response));
            }
        } catch (error) {
            showFormMessage(
                error.message || API_ERROR_MESSAGES[currentLang].default,
                'error',
                5000
            );
        } finally {
            setSubmitState(false);
        }
    });
});
