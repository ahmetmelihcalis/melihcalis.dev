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

    const translations = {
        tr: {
            "nav-home": "Anasayfa",
            "nav-about": "Hakkımda",
            "nav-skills": "Yetenekler",
            "nav-projects": "Projeler",
            "nav-contact": "İletişim",
            "nav-cv": "CV İndir",
            "hero-greeting": "Merhaba, Ben Ahmet Melih Çalış",
            "hero-tagline": "Teknolojinin gücünü kullanarak dünyayı daha anlamlı bir yer haline getirelim!",
            "btn-contact": "Bana Ulaşın",
            "btn-projects": "Projelerim",
            "title-about": "Hakkımda",
            "about-p1": "İlab Grup bünyesinde yer alan SteelOrbis’te Yazılım Uzman Yardımcısı olarak çalışıyor, aynı zamanda Kocaeli Üniversitesi Yazılım Mühendisliği bölümünde öğrenim görüyorum. Yapay zeka teknolojilerini keşfetmeye ve bu alanda üretmeye büyük bir tutku duyuyorum. Hedefim, yapay zeka alanında bir kariyer inşa etmek ve bu teknolojinin gelişimine katkı sunmak.",
            "about-p2": "Bilgisayar başında vakit geçirmekten, yeni teknolojiler keşfetmekten ve sürekli öğrenmekten keyif alıyorum. Sürekli öğrenme anlayışı, çalışmalarımın temelini oluşturuyor; bu doğrultuda yeni araçlar ve teknolojilerle denemeler yapmaya her zaman açığım.",
            "about-p3": "Programlamanın dışında sıkı bir Formula 1 hayranıyım. Ayrıca seyahat etmeyi, tarih açısından zengin şehirleri keşfetmeyi ve farklı kültürler hakkında bilgi edinmeyi seviyorum.",
            "about-p4": "Küçük bir not daha, yazı yazmayı da severim :)",
            "title-skills": "Yetenekler",
            "skill-prog": "Programlama Dilleri",
            "skill-frame": "Frameworkler",
            "skill-tools": "Araçlar",
            "title-projects": "Projeler & Başarılar",
            "badge-featured": "Öne Çıkan Proje",
            "feat-proj-desc": "PharmAI, ilaçlara ilişkin temel bilgileri ve olası yan etkileri yapay zeka destekli analizlerle sunan bir bilgi platformudur. Doğal dil işleme teknolojileriyle ilaç verilerini özetler; etkileşim analizi ve ilaç karşılaştırma gibi özellikleri tek bir çatı altında toplar.",
            "feat-proj-title": "PharmAI — Yapay Zeka Destekli İlaç Bilgi Platformu",
            "feat-code": "Kodlar",
            "feat-video": "Video",
            "subtitle-other": "Diğer Çalışmalar",
            "proj-1-title": "GitHub Hesabım",
            "proj-1-desc": "GitHub’da paylaştığım makine öğrenmesi notlarım, kişisel portfolyo sitem ve tüm çalışmalarım.",
            "proj-2-title": "Kaggle Yolculuğum",
            "proj-2-desc": "Kaggle’da paylaştığım notebooklarım ve çalışmalarım.",
            "subtitle-awards": "Ödüller",
            "award-1-title": "Bootcamp Finalisti",
            "award-1-desc": "Yapay Zeka ve Teknoloji Akademisi 4. Dönem | Mezuniyet Bootcamp'i Finalisti - PharmAI",
            "award-2-title": "Ar-Ge Teşvik Ödülü Kazananı",
            "award-2-desc": "3. “Ulaşan ve Erişen Türkiye” Fikir Yarışması Ar-Ge Teşvik Ödülü Kazananı - Döngü-RAY",
            "subtitle-certs": "Sertifikalar",
            "cert-1-title": "Google ve Diğer Sertifikalarım",
            "cert-1-sub": "Profesyonel Sertifika",
            "cert-2-title": "Sertifier Sertifikalarım",
            "cert-2-sub": "Global AI Hub",
            "title-contact": "İletişime Geçelim",
            "contact-text": "Projeleriniz, fikirleriniz veya iş birliği için bana yazabilirsiniz.",
            "btn-send": "Mesaj Gönder"
        },
        en: {
            "nav-home": "Home",
            "nav-about": "About",
            "nav-skills": "Skills",
            "nav-projects": "Projects",
            "nav-contact": "Contact",
            "nav-cv": "Download CV",
            "hero-greeting": "Hi, I’m Ahmet Melih Çalış",
            "hero-tagline": "Let's use the power of technology to make the world a more meaningful place!",
            "btn-contact": "Contact Me",
            "btn-projects": "My Projects",
            "title-about": "About Me",
            "about-p1": "I work as an Associate Software Engineer at SteelOrbis, part of Ilab Grup, and I am also studying Software Engineering at Kocaeli University. I have a strong passion for exploring and building with AI technologies. My goal is to build a career in AI and contribute to the development of these technologies.",
            "about-p2": "I enjoy spending time on the computer, discovering new technologies, and continuously learning. A growth mindset underpins my work; I'm always open to experimenting with new tools and technologies.",
            "about-p3": "Outside of programming, I'm an avid Formula 1 fan. I also enjoy traveling, exploring historically rich cities, and learning about different cultures.",
            "about-p4": "One more note: I enjoy writing :)",
            "title-skills": "Skills",
            "skill-prog": "Programming Languages",
            "skill-frame": "Frameworks",
            "skill-tools": "Tools",
            "title-projects": "Projects & Achievements",
            "badge-featured": "Featured Project",
            "feat-proj-desc": "PharmAI is an information platform that provides core drug details and possible side effects through AI-powered analyses. It summarizes drug data using natural language processing technologies, and brings features such as interaction analysis and drug comparison together under a single roof.",
            "feat-proj-title": "PharmAI — AI-Powered Drug Information Platform",
            "feat-code": "Code",
            "feat-video": "Video",
            "subtitle-other": "Other Works",
            "proj-1-title": "My GitHub Account",
            "proj-1-desc": "My machine learning notes on GitHub, my personal portfolio site, and all my projects.",
            "proj-2-title": "My Kaggle Journey",
            "proj-2-desc": "My notebooks and works shared on Kaggle.",
            "subtitle-awards": "Awards",
            "award-1-title": "Bootcamp Finalist",
            "award-1-desc": "Artificial Intelligence and Technology Academy 4th Term | Graduation Bootcamp Finalist – PharmAI",
            "award-2-title": "R&D Incentive Award Winner",
            "award-2-desc": "3rd 'Ulaşan ve Erişen Türkiye' Idea Competition R&D Incentive Award Winner — Döngü-RAY",
            "subtitle-certs": "Certificates",
            "cert-1-title": "Google & Other Certificates",
            "cert-1-sub": "Professional Certificate",
            "cert-2-title": "Sertifier Certificates",
            "cert-2-sub": "Global AI Hub",
            "title-contact": "Get In Touch",
            "contact-text": "Feel free to reach out for projects or ideas.",
            "btn-send": "Send Message"
        }
    };

    const langToggle = document.getElementById('lang-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navbarNav = document.querySelector('.navbar-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const backToTopBtn = document.getElementById("back-to-top");
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
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    });



    let currentLang = localStorage.getItem('lang') || 'tr';
    if (!localStorage.getItem('lang')) {
        localStorage.setItem('lang', currentLang);
    }
    const typewriterWords = {
        tr: ["Yazılım Mühendisliği Öğrencisi", "İnovatif İnsan"],
        en: ["Software Engineering Student", "AI Enthusiast", "Future Innovator"]
    };

    function applyTextTranslations(lang) {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    function applyAttributeTranslations(lang) {
        document.querySelectorAll('[data-title]').forEach(element => {
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

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        updateLanguageToggle(lang);
        applyTextTranslations(lang);
        applyAttributeTranslations(lang);
        applyFormPlaceholders(lang);
        resetTypewriter();
    }

    function setTheme(isLight) {
        body.classList.toggle('light-mode', isLight);
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
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

    langToggle.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'tr' : 'en'));

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        navbarNav.classList.toggle('active');
        document.body.classList.toggle('menu-open', navbarNav.classList.contains('active'));
    });

    document.addEventListener('click', (e) => {
        const isMenuOpen = navbarNav.classList.contains('active');
        if (!isMenuOpen) return;
        const clickedInsideMenu = navbarNav.contains(e.target) || menuToggle.contains(e.target);
        if (!clickedInsideMenu) {
            menuToggle.classList.remove('is-active');
            navbarNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        navbarNav.classList.remove('active');
        document.body.classList.remove('menu-open');
    }));

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout;

    function typeEffect() {
        const words = typewriterWords[currentLang];
        const currentWord = words[wordIndex];
        const typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex < currentWord.length) {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeTimeout = setTimeout(typeEffect, typeSpeed);
        } else if (isDeleting && charIndex > 0) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeTimeout = setTimeout(typeEffect, typeSpeed);
        } else {
            if (!isDeleting) {
                isDeleting = true;
                typeTimeout = setTimeout(typeEffect, 2000);
            } else {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeTimeout = setTimeout(typeEffect, 500);
            }
        }
    }
    function resetTypewriter() {
        clearTimeout(typeTimeout);
        wordIndex = 0;
        charIndex = 0;
        isDeleting = false;
        typewriterElement.textContent = "";
        typeEffect();
    }

    function toggleBackToTopButton() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.style.display = "flex";
        } else {
            backToTopBtn.style.display = "none";
        }
    }

    window.onscroll = toggleBackToTopButton;

    backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    setLanguage(currentLang);

    function showFormMessage(message, type, timeoutMs) {
        formMessage.textContent = message;
        formMessage.style.color = FORM_MESSAGE_COLORS[type];
        setTimeout(() => { formMessage.textContent = ""; }, timeoutMs);
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
            website: formFields.website ? formFields.website.value : ""
        };
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setSubmitState(true);

        const formData = getFormData();
        const websiteHoneypot = formData.website;

        if (websiteHoneypot.trim() !== "") {
            showFormMessage(
                currentLang === 'en' ? "Bot submission blocked." : "Spam tespit edildi, gönderim engellendi.",
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
                    currentLang === 'en' ? "Message sent successfully!" : "Mesaj başarıyla gönderildi!",
                    'success',
                    5000
                );
                contactForm.reset();
            } else {
                throw new Error('Failed');
            }
        } catch (error) {
            showFormMessage(
                currentLang === 'en' ? "Failed to send message." : "Mesaj gönderilemedi.",
                'error',
                5000
            );
        } finally {
            setSubmitState(false);
        }
    });
});
