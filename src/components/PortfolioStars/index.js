import { useRef, useEffect } from "react";

const DEPTH = 700;
const SPREAD = 420;
const COLORS = [
  [255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
  [185, 215, 255], [185, 215, 255], [255, 230, 200],
  [160, 200, 255], [210, 170, 255],
];

const makeParticle = (z) => {
  const [r, g, b] = COLORS[Math.floor(Math.random() * COLORS.length)];
  const depth = z !== undefined ? z : Math.random() * DEPTH;
  return {
    x: (Math.random() - 0.5) * DEPTH * 2.2,
    y: (Math.random() - 0.5) * DEPTH * 2.2,
    z: depth, pz: depth, r, g, b,
  };
};

const PortfolioStars = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let raf, w, h, cx, cy, tx, ty;
    const particles = Array.from({ length: 520 }, () => makeParticle());

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = tx = w / 2;
      cy = ty = h / 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => {
      tx = w / 2 + 0.22 * (e.clientX - w / 2);
      ty = h / 2 + 0.22 * (e.clientY - h / 2);
    };
    window.addEventListener("mousemove", onMouse);

    const draw = () => {
      cx += 0.035 * (tx - cx);
      cy += 0.035 * (ty - cy);

      ctx.fillStyle = "rgba(2,3,14,0.2)";
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 260);
      glow.addColorStop(0, "rgba(40,60,180,0.10)");
      glow.addColorStop(0.5, "rgba(20,10,80,0.06)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p) => {
        p.pz = p.z;
        p.z -= 0.2;
        if (p.z <= 1) {
          Object.assign(p, makeParticle(DEPTH));
          return;
        }
        const px = cx + (p.x / p.z) * SPREAD;
        const py = cy + (p.y / p.z) * SPREAD;
        const ox = cx + (p.x / p.pz) * SPREAD;
        const oy = cy + (p.y / p.pz) * SPREAD;
        if (px < -20 || px > w + 20 || py < -20 || py > h + 20) return;

        const life = 1 - p.z / DEPTH;
        const alpha = Math.min(1, 2 * life);
        const size = Math.max(0.3, 3.2 * life);

        const trail = ctx.createLinearGradient(ox, oy, px, py);
        trail.addColorStop(0, `rgba(${p.r},${p.g},${p.b},0)`);
        trail.addColorStop(1, `rgba(${p.r},${p.g},${p.b},${0.85 * alpha})`);
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trail;
        ctx.lineWidth = Math.max(0.3, 0.55 * size);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.3, 0.45 * size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        ctx.fill();

        if (life > 0.7) {
          const halo = ctx.createRadialGradient(px, py, 0, px, py, 4 * size);
          halo.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${0.4 * (life - 0.7)})`);
          halo.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(px, py, 4 * size, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={ref} className="po_stars_canvas" />;
};

export default PortfolioStars;
