/* ============================================
   🔗 NETWORK GRAPH BACKGROUND
   Data Science inspired — subtle connected nodes
   ============================================ */
(function () {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const nodes = [];
    const CONNECTION_DIST = 150;
    const mouse = { x: -1000, y: -1000 };

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function spawn() {
        const count = Math.min(50, Math.floor((W * H) / 40000));
        nodes.length = 0;
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                r: Math.random() * 1.5 + 0.8,
                baseO: 0.06 + Math.random() * 0.08, // Very subtle
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.005 + Math.random() * 0.01
            });
        }
    }

    // Track mouse for interactive effect
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function loop() {
        ctx.clearRect(0, 0, W, H);

        // Update nodes
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            n.pulse += n.pulseSpeed;

            // Wrap around
            if (n.x < -20) n.x = W + 20;
            if (n.x > W + 20) n.x = -20;
            if (n.y < -20) n.y = H + 20;
            if (n.y > H + 20) n.y = -20;

            // Mouse repulsion (very subtle)
            const mdx = n.x - mouse.x;
            const mdy = n.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < 120) {
                const force = (120 - mDist) / 120 * 0.15;
                n.x += (mdx / mDist) * force;
                n.y += (mdy / mDist) * force;
            }
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(184, 134, 11, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        nodes.forEach(n => {
            const pulseO = Math.sin(n.pulse) * 0.05 + n.baseO * 1.5;

            // Node dot
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(184, 134, 11, ${pulseO})`;
            ctx.fill();

            // Subtle glow
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(184, 134, 11, ${pulseO * 0.25})`;
            ctx.fill();
        });

        requestAnimationFrame(loop);
    }

    resize();
    spawn();
    loop();
    window.addEventListener('resize', () => { resize(); spawn(); });
})();
