/* ============================================
   ✨ GOLDEN DUST PARTICLES
   Subtle gold dust floating on dark background
   ============================================ */
(function () {
    const canvas = document.getElementById('golden-dust');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function spawn() {
        const count = Math.min(60, Math.floor((W * H) / 25000));
        particles.length = 0;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.5 + 0.3,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.1,
                o: Math.random() * 0.25 + 0.05,
                oDir: 1,
                oSpeed: Math.random() * 0.004 + 0.001,
                shimmerPhase: Math.random() * Math.PI * 2,
                shimmerSpeed: Math.random() * 0.02 + 0.005,
                // Gold color variations
                hue: 40 + Math.random() * 10, // 40-50 (gold range)
                sat: 60 + Math.random() * 30,
                light: 30 + Math.random() * 20 // 30-50 for slightly darker gold to show on white
            });
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            // Floating motion
            p.x += p.vx;
            p.y += p.vy;

            // Shimmer effect
            p.shimmerPhase += p.shimmerSpeed;
            const shimmer = Math.sin(p.shimmerPhase) * 0.15 + 0.85;

            // Opacity breathing
            p.o += p.oSpeed * p.oDir;
            if (p.o >= 0.6) p.oDir = -1;
            if (p.o <= 0.08) p.oDir = 1;

            // Wrap around edges
            if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
            if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
            if (p.x < -10) p.x = W + 10;
            if (p.x > W + 10) p.x = -10;

            const alpha = p.o * shimmer;

            // Draw dust particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha})`;
            ctx.fill();

            // Subtle glow for larger particles
            if (p.r > 1.0) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha * 0.08})`;
                ctx.fill();
            }
        });
        requestAnimationFrame(loop);
    }

    resize();
    spawn();
    loop();
    window.addEventListener('resize', () => { resize(); spawn(); });
})();
