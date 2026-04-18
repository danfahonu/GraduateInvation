/* ============================================
   🎓 MAIN.JS — Elegant Invitation Edition
   Envelope · Countdown · Scroll Reveal
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    const intro = $('#intro');
    const envelope = $('#envelope');
    const bgMusic = $('#bg-music');
    const musicBtn = $('#music-btn');
    const scrollBar = $('#scroll-bar');
    let playing = false;

    // ===== INTRO GOLDEN STARS =====
    const sc = $('#intro-canvas');
    if (sc) {
        const ctx = sc.getContext('2d');
        let sw, sh;
        const dots = [];
        function initDots() {
            sw = sc.width = window.innerWidth;
            sh = sc.height = window.innerHeight;
            dots.length = 0;
            for (let i = 0; i < 60; i++) {
                dots.push({
                    x: Math.random() * sw,
                    y: Math.random() * sh,
                    r: Math.random() * 1.2 + 0.2,
                    o: Math.random(),
                    sp: Math.random() * 0.006 + 0.002,
                    d: 1
                });
            }
        }
        function drawDots() {
            ctx.clearRect(0, 0, sw, sh);
            dots.forEach(s => {
                s.o += s.sp * s.d;
                if (s.o >= 0.6) s.d = -1;
                if (s.o <= 0.05) s.d = 1;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                const isGold = Math.random() > 0.4;
                ctx.fillStyle = isGold
                    ? `rgba(212, 175, 55, ${s.o * 0.7})`
                    : `rgba(250, 248, 240, ${s.o * 0.4})`;
                ctx.fill();
            });
            if (!intro.classList.contains('gone')) requestAnimationFrame(drawDots);
        }
        initDots(); drawDots();
        window.addEventListener('resize', initDots);
    }

    // ===== GOLD CONFETTI =====
    function boom() {
        const box = $('#confetti-box');
        const cols = ['#d4af37', '#e8c962', '#c5a028', '#faf8f0', '#b8943a', '#f0e6b8'];
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.classList.add('confetti');
            const sz = Math.random() * 7 + 3;
            p.style.left = Math.random() * 100 + '%';
            p.style.width = sz + 'px';
            p.style.height = (Math.random() > 0.5 ? sz * 1.5 : sz) + 'px';
            p.style.background = cols[Math.floor(Math.random() * cols.length)];
            p.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';
            p.style.animationDuration = (Math.random() * 2 + 2) + 's';
            p.style.animationDelay = (Math.random() * 0.6) + 's';
            box.appendChild(p);
            setTimeout(() => p.remove(), 4500);
        }
    }

    // ===== OPEN ENVELOPE =====
    intro.addEventListener('click', () => {
        if (envelope.classList.contains('opened')) return;
        envelope.classList.add('opened');
        setTimeout(boom, 500);

        bgMusic.volume = 0.45;
        if (bgMusic.currentTime < 183) bgMusic.currentTime = 183;
        bgMusic.play().then(() => { playing = true; musicBtn.classList.add('playing'); }).catch(() => {});

        setTimeout(() => {
            intro.classList.add('gone');
            document.body.classList.remove('no-scroll');
            $('#main').style.display = 'block';
            musicBtn.classList.add('show');
            setTimeout(() => revealCards(), 200);
        }, 1800);
    });

    // ===== MUSIC =====
    musicBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (playing) { bgMusic.pause(); musicBtn.classList.remove('playing'); }
        else { bgMusic.play().catch(() => {}); musicBtn.classList.add('playing'); }
        playing = !playing;
    });

    // ===== COUNTDOWN =====
    const target = new Date('2026-04-22T15:30:00+07:00').getTime();
    const els = { d: $('#cd-d'), h: $('#cd-h'), m: $('#cd-m'), s: $('#cd-s') };
    let prev = { d: '', h: '', m: '', s: '' };

    function upCD() {
        const diff = Math.max(0, target - Date.now());
        const v = {
            d: String(Math.floor(diff / 864e5)).padStart(2, '0'),
            h: String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0'),
            m: String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0'),
            s: String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0')
        };
        for (const k in v) {
            if (v[k] !== prev[k]) {
                els[k].textContent = v[k];
                els[k].classList.remove('tick');
                void els[k].offsetWidth;
                els[k].classList.add('tick');
            }
        }
        prev = v;
    }
    upCD();
    setInterval(upCD, 1000);

    // ===== SCROLL PROGRESS =====
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
        scrollBar.style.width = pct + '%';
    });

    // ===== SCROLL REVEAL (Intersection Observer + Stagger) =====
    const cards = $$('.anim-card');
    let revealedInitially = false;

    function revealCards() {
        if (revealedInitially) return;
        revealedInitially = true;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        cards.forEach((card, i) => {
            card.style.transitionDelay = (i * 0.15) + 's';
            observer.observe(card);
        });

        // Show the first card immediately
        if (cards.length > 0) {
            cards[0].classList.add('visible');
        }
    }
});
