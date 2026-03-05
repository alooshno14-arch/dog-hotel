// ============================================
// Loving Homes - Main JavaScript File v3.0
// كل الوظائف في ملف واحد
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // =========================
    // 1. DARK MODE SYSTEM
    // =========================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeToggle?.querySelector('i')) {
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
        } else {
            body.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeToggle?.querySelector('i')) {
                themeToggle.querySelector('i').className = 'fas fa-moon';
            }
        }
    }

    const savedTheme = localStorage.getItem('pethotel_theme') || 'light';
    applyTheme(savedTheme);

    themeToggle?.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('pethotel_theme', newTheme);
        applyTheme(newTheme);
    });
    
    // =========================
    // 2. NOTIFICATION SYSTEM (عالمي - لجميع الصفحات)
    // =========================
    window.showNotification = function(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed; top: 100px; left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'linear-gradient(135deg, #52b788, #2d6a4f)' : '#e74c3c'};
            color: white; padding: 25px 35px; border-radius: 15px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.3); z-index: 9999;
            max-width: 500px; width: 90%; text-align: right;
            line-height: 1.8; white-space: pre-line;
            animation: slideDown 0.5s ease-out; direction: rtl;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        notification.innerHTML = `
            <div style="display:flex;align-items:flex-start;gap:15px;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" 
                   style="font-size:1.8rem;margin-top:3px;"></i>
                <div style="flex:1;font-size:1rem;">${message}</div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background:rgba(255,255,255,0.2);border:none;color:white;
                               width:30px;height:30px;border-radius:50%;cursor:pointer;
                               font-size:1rem;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
            @keyframes slideUp{from{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(-20px)}}
        `;
        if (!document.getElementById('notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease-out forwards';
            setTimeout(() => notification.remove(), 500);
        }, 15000);
    };
    
    // =========================
    // 3. BOOKING FORM HANDLER (يعمل فقط في صفحة الحجز)
    // =========================
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        const today = new Date().toISOString().split('T')[0];
        const checkIn = document.getElementById('checkIn');
        const checkOut = document.getElementById('checkOut');
        
        if (checkIn) checkIn.min = today;
        
        if (checkIn && checkOut) {
            checkIn.addEventListener('change', function() {
                checkOut.min = this.value;
                const nextDay = new Date(this.value);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOut.value = nextDay.toISOString().split('T')[0];
            });
        }
        
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const data = {
                ownerName: document.getElementById('ownerName')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                petName: document.getElementById('petName')?.value || '',
                checkIn: checkIn?.value || '',
                checkOut: checkOut?.value || '',
                package: document.getElementById('package')?.value || ''
            };
            
            if (data.checkOut && data.checkIn && new Date(data.checkOut) <= new Date(data.checkIn)) {
                showNotification('⚠️ يجب أن يكون تاريخ الخروج بعد تاريخ الدخول', 'error');
                return;
            }
            
            const days = Math.ceil((new Date(data.checkOut) - new Date(data.checkIn)) / (1000*60*60*24)) || 1;
            const packages = { 'daily': 'حزمة اليوم', 'classic': 'الكلاسيكية', 'premium': 'المميزة', 'custom': 'مخصصة' };
            
            const msg = `✅ تم استلام طلب الحجز بنجاح!\n\n📋 تفاصيل الحجز:\n━━━━━━━━━━━━━━━━\n👤 اسم المالك: ${data.ownerName}\n📞 رقم الهاتف: ${data.phone}\n🐕 اسم الكلب: ${data.petName}\n📅 من: ${data.checkIn}\n📅 إلى: ${data.checkOut}\n⏱️ عدد الأيام: ${days}\n📦 الحزمة: ${packages[data.package]}\n━━━━━━━━━━━━━━━━\n\n📞 سنتواصل معك خلال 24 ساعة.\n\nشكراً لثقتك بنا! 🐾`;
            
            showNotification(msg, 'success');
            bookingForm.reset();
            if (checkIn) checkIn.min = today;
            if (checkOut) checkOut.min = '';
        });
    }
    
    // =========================
    // 4. SCROLL REVEAL ANIMATIONS
    // =========================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .service-card, .package-card, .value-card, .team-card, .stat-card').forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
    
    // =========================
    // 5. SCROLL PROGRESS BAR
    // =========================
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
        progressBar.style.width = progress + '%';
    });
    
    // =========================
    // 6. BACK TO TOP BUTTON
    // =========================
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // =========================
    // 7. STATS COUNTER (للصفحة "من نحن")
    // =========================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    if (statNumbers.length > 0) {
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        const suffix = target === 24 ? '/7' : target === 10 ? '+' : '+';
                        stat.textContent = target.toLocaleString() + suffix;
                    }
                };
                
                updateCount();
            });
        };
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStats();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statsObserver.observe(statsSection);
        }
    }
    // =========================
// 7. MULTI-LANGUAGE SYSTEM
// =========================

const translations = {
    'ar': {
        'nav-home': 'الرئيسية',
        'nav-about': 'من نحن',
        'nav-services': 'خدماتنا',
        'nav-pricing': 'الأسعار',
        'nav-booking': 'احجز الآن',
        'header-title': 'احجز الآن',
        'header-p': 'املأ النموذج وسنتواصل معك لتأكيد الحجز',
        'footer-copy': '© 2024 فندق الحيوانات الأليفة. جميع الحقوق محفوظة'
        // أضف هنا باقي الكلمات التي تريد ترجمتها
    },
    'en': {
        'nav-home': 'Home',
        'nav-about': 'About Us',
        'nav-services': 'Services',
        'nav-pricing': 'Pricing',
        'nav-booking': 'Book Now',
        'header-title': 'Book Now',
        'header-p': 'Fill the form and we will contact you',
        'footer-copy': '© 2024 Loving Homes. All rights reserved'
    }
};

const langToggle = document.getElementById('langToggle');

function applyLanguage(lang) {
    // 1. تغيير اتجاه الصفحة
    if (lang === 'en') {
        document.body.classList.add('en-mode');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        langToggle.querySelector('.lang-text').innerText = 'AR';
    } else {
        document.body.classList.remove('en-mode');
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        langToggle.querySelector('.lang-text').innerText = 'EN';
    }

    // 2. البحث عن كل العناصر التي تحمل خاصية data-i18n وترجمتها
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });

    localStorage.setItem('pethotel_lang', lang);
}

// تشغيل عند التحميل
const savedLang = localStorage.getItem('pethotel_lang') || 'ar';
applyLanguage(savedLang);

// تبديل اللغة عند النقر
langToggle?.addEventListener('click', () => {
    const currentLang = localStorage.getItem('pethotel_lang') === 'ar' ? 'en' : 'ar';
    applyLanguage(currentLang);
});
});
