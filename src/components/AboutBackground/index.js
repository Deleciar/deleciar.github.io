import { useRef, useEffect } from "react";

// Civil-engineering colour blobs: water blue, navy, drainage teal, structural steel
const BLOBS = [
  { cx: 0.74, cy: 0.16, br: 0.36, ph: 0,   sp: 0.004, amp: 0.030, rgb: [0,  110, 180] },
  { cx: 0.14, cy: 0.60, br: 0.29, ph: 1.6,  sp: 0.003, amp: 0.022, rgb: [0,  70,  155] },
  { cx: 0.52, cy: 0.88, br: 0.27, ph: 3.0,  sp: 0.005, amp: 0.020, rgb: [0,  150, 130] },
  { cx: 0.29, cy: 0.32, br: 0.20, ph: 0.9,  sp: 0.006, amp: 0.015, rgb: [25, 85,  140] },
];

const makeParticle = (minR, maxR, alpha) => ({
  x: Math.random(),
  y: Math.random(),
  r: minR + Math.random() * (maxR - minR),
  a: alpha * (0.35 + 0.65 * Math.random()),
  ts: 0.006 + 0.014 * Math.random(),
  tp: Math.random() * Math.PI * 2,
  hue: Math.random() < 0.12 ? 190 + 55 * Math.random() : 0,
});

const AboutBackground = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let raf, w, h, frame = 0;
    let scrollY = 0, mx = 0, my = 0, smx = 0, smy = 0;

    const onScroll = () => { scrollY = window.scrollY; };
    const onMouse  = (e) => { mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5; };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse);

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const tiny   = Array.from({ length: 120 }, () => makeParticle(0.20, 0.55, 0.40));
    const medium = Array.from({ length:  55 }, () => makeParticle(0.50, 1.10, 0.58));
    const large  = Array.from({ length:  22 }, () => makeParticle(1.00, 2.00, 0.80));

    // Node network — like a drainage/structural mesh
    const nodes = Array.from({ length: 42 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: 22e-5 * (Math.random() - 0.5),
      vy: 22e-5 * (Math.random() - 0.5),
    }));

    const drawParticles = (arr, px, py) => {
      arr.forEach((p) => {
        const sx = ((p.x * w + smx * px * w) % w + w) % w;
        const sy = ((p.y * h + smy * py * h + scrollY * py * 0.6) % h + h) % h;
        const pulse = 0.62 + 0.38 * Math.sin(frame * p.ts + p.tp);
        const alpha = p.a * pulse;

        if (p.r > 1) {
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5.5 * p.r);
          g.addColorStop(0, p.hue
            ? `hsla(${p.hue},75%,80%,${0.40 * alpha})`
            : `rgba(200,220,255,${0.28 * alpha})`);
          g.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(sx, sy, 5.5 * p.r, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(sx, sy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue
          ? `hsla(${p.hue},68%,84%,${alpha})`
          : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
    };

    const draw = () => {
      smx += 0.04 * (mx - smx);
      smy += 0.04 * (my - smy);

      ctx.fillStyle = "#02030d";
      ctx.fillRect(0, 0, w, h);

      BLOBS.forEach((b) => {
        b.ph += b.sp;
        const radius = (b.br + Math.sin(b.ph) * b.amp) * Math.min(w, h);
        const bx = b.cx * w + 14 * smx;
        const by = b.cy * h + 14 * smy;
        const [r, g, bl] = b.rgb;
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
        grad.addColorStop(0,   `rgba(${r},${g},${bl},0.17)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${bl},0.07)`);
        grad.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(bx, by, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      drawParticles(tiny,   0.025, 0.035);
      drawParticles(medium, 0.060, 0.080);

      // Connection node mesh — resembles drainage / structural network
      const connDist = 0.175 * Math.min(w, h);
      nodes.forEach((n) => {
        n.x = (n.x + n.vx + 1) % 1;
        n.y = (n.y + n.vy + 1) % 1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * w;
          const dy = (nodes[i].y - nodes[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connDist) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.strokeStyle = `rgba(0,205,190,${0.22 * (1 - dist / connDist)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,210,195,0.45)";
        ctx.fill();
      });

      drawParticles(large, 0.130, 0.160);

      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} className="ab_bg_canvas" />;
};

export default AboutBackground;
