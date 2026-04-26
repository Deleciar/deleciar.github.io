import { useRef, useEffect } from "react";

// Engineering-themed matrix rain: hydraulics, Greek letters, structural maths
const chars = "0123456789πφΔΣΩ∇√∫∂∞≈±αβγδεηθλμνρστωQVPAHgkn";
const pick = () => chars[Math.floor(chars.length * Math.random())];

const LAYERS = [
  { fs: 11, speed: 11, alpha: 0.13, r:  0, g: 155, b: 190, density: 0.42 },
  { fs: 15, speed: 18, alpha: 0.34, r:  0, g: 185, b: 215, density: 0.30 },
  { fs: 20, speed: 27, alpha: 0.56, r: 15, g: 210, b: 195, density: 0.13 },
];

const MatrixCanvas = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, w, h, drops;

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      drops = [];
      LAYERS.forEach((layer) => {
        const colW = 1.2 * layer.fs;
        const cols = Math.ceil(w / colW);
        for (let c = 0; c < cols; c++) {
          if (Math.random() > layer.density) continue;
          const len = 10 + Math.floor(20 * Math.random());
          drops.push({
            li: LAYERS.indexOf(layer),
            x: c * colW,
            y: Math.random() * -h,
            speed: layer.speed * (0.7 + 0.6 * Math.random()),
            trail: Array.from({ length: len }, pick),
            timer: 0,
            interval: 0.10 + 0.15 * Math.random(),
            steel: Math.random() < 0.09,
          });
        }
      });
    };

    let last = 0;
    const draw = (ts) => {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;

      ctx.fillStyle = "rgba(2,5,12,0.13)";
      ctx.fillRect(0, 0, w, h);

      for (const drop of drops) {
        const layer = LAYERS[drop.li];
        drop.y += layer.speed * dt;
        drop.timer += dt;
        if (drop.timer >= drop.interval) {
          drop.timer = 0;
          drop.trail[Math.floor(Math.random() * drop.trail.length)] = pick();
        }

        ctx.font = `${layer.fs}px "Courier New", monospace`;

        for (let t = 0; t < drop.trail.length; t++) {
          const cy = drop.y - t * layer.fs;
          if (cy < -layer.fs || cy > h + layer.fs) continue;
          const fade = 1 - t / drop.trail.length;
          if (t === 0) {
            ctx.fillStyle = "rgba(195,242,235,0.92)";
          } else {
            const a = (layer.alpha * fade * fade).toFixed(3);
            ctx.fillStyle = drop.steel
              ? `rgba(160,190,210,${a})`
              : `rgba(${layer.r},${layer.g},${layer.b},${a})`;
          }
          ctx.fillText(drop.trail[t], drop.x, cy);
        }

        if (drop.y - drop.trail.length * layer.fs > h) {
          drop.y = -Math.random() * h * 0.4;
          drop.trail = Array.from({ length: drop.trail.length }, pick);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  return <canvas ref={ref} className="home_matrix_canvas" />;
};

export default MatrixCanvas;
