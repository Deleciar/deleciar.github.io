import { useRef, useEffect } from "react";

// ── Real engineering equations, prominently featuring hydraulics,
//    Manning's, Bernoulli, quadratic, and structural mechanics ──
const EQUATIONS = [
  // Bernoulli's equation (multiple forms)
  "P + ½ρV² + ρgh = const",
  "P₁/ρg + V₁²/2g + z₁ = P₂/ρg + V₂²/2g + z₂",
  "H = p/γ + V²/2g + z",
  "Δh = V²/2g",

  // Manning's equation
  "V = (1/n) R^(2/3) S^(1/2)",
  "Q = (1/n) A R^(2/3) S^(1/2)",
  "n = 0.013  (concrete pipe)",
  "n = 0.035  (grass swale)",
  "n = 0.025  (natural stream)",

  // Hydraulic / fluid mechanics
  "Q = A · V",
  "Q = Cd · A · √(2gh)",
  "Q = C · i · A  (Rational Method)",
  "Re = ρVD / μ",
  "Fr = V / √(gD)",
  "hf = f · L · V² / (2gD)",
  "hf = 4fLV² / 2gD  (Darcy-Weisbach)",
  "v* = √(τ₀ / ρ)  (shear velocity)",
  "q = k · i  (Darcy's Law)",
  "Q = C · b · H^(3/2)  (weir)",
  "τ₀ = ρgRS  (bed shear stress)",

  // Quadratic formula
  "ax² + bx + c = 0",
  "x = (−b ± √(b² − 4ac)) / 2a",
  "Δ = b² − 4ac  (discriminant)",

  // Structural / mechanics
  "σ = M · y / I  (bending stress)",
  "τ = VQ / Ib  (shear stress)",
  "δ = PL³ / 3EI  (cantilever deflection)",
  "M = wL² / 8  (UDL midspan moment)",
  "ε = σ / E  (Hooke's Law)",
  "σ = F / A",
  "τ = c' + σ' tan(φ')  (Mohr-Coulomb)",

  // Stormwater / hydrology
  "Tc = (L^0.8 (S+1)^0.7) / (1140 √Y)",
  "S = Cc · log(σ'₁/σ'₀) / (1+e₀)",
  "i = a / (t + b)ⁿ  (IDF)",

  // Mathematics
  "a² + b² = c²  (Pythagoras)",
  "A = πr²",
  "∇²φ = 0  (Laplace)",
  "∂u/∂t = α · ∂²u/∂x²  (diffusion)",
  "∫₀^∞ e^(−x²) dx = √π / 2",
  "F = ma",
  "g = 9.81 m/s²",
  "ρ_w = 1000 kg/m³",
];

// ── Mini graph drawing helpers ──
const drawSine = (ctx, x, y, alpha) => {
  const W = 90, A = 14;
  ctx.beginPath();
  for (let i = 0; i <= W; i += 2) {
    const py = y - A * Math.sin((i / W) * Math.PI * 3);
    i === 0 ? ctx.moveTo(x + i, py) : ctx.lineTo(x + i, py);
  }
  ctx.strokeStyle = `rgba(0, 195, 185, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 2, y);
  ctx.lineTo(x + W + 2, y);
  ctx.strokeStyle = `rgba(0, 195, 185, ${alpha * 0.25})`;
  ctx.stroke();
};

const drawBell = (ctx, x, y, alpha) => {
  const W = 90, H = 30;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i <= W; i += 2) {
    const t = (i / W - 0.5) * 6;
    ctx.lineTo(x + i, y - H * Math.exp(-0.5 * t * t));
  }
  ctx.lineTo(x + W, y);
  ctx.strokeStyle = `rgba(75, 165, 220, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
};

const drawHydrograph = (ctx, x, y, alpha) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 28, y - 30);
  ctx.lineTo(x + 88, y);
  ctx.strokeStyle = `rgba(0, 190, 180, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + 3);
  ctx.lineTo(x + 88, y + 3);
  ctx.moveTo(x, y - 33);
  ctx.lineTo(x, y + 3);
  ctx.strokeStyle = `rgba(0, 190, 180, ${alpha * 0.3})`;
  ctx.stroke();
};

const drawParabola = (ctx, x, y, alpha) => {
  const W = 80, H = 28;
  ctx.beginPath();
  for (let i = 0; i <= W; i += 2) {
    const t = (i / W - 0.5) * 2;
    ctx.lineTo(x + i, y - H * (1 - t * t));
  }
  ctx.strokeStyle = `rgba(100, 175, 215, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
};

const GRAPH_FNS = [drawSine, drawBell, drawHydrograph, drawParabola];

const COLORS = [
  (a) => `rgba(0, 200, 188, ${a})`,    // teal
  (a) => `rgba(72, 162, 218, ${a})`,   // blue
  (a) => `rgba(148, 188, 208, ${a})`,  // steel grey
];

const MatrixCanvas = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h, halfW;
    let particles = [];

    const makePart = (prePopulate = false) => {
      const isGraph = Math.random() < 0.16;
      return {
        x: 20 + Math.random() * Math.max(10, (halfW || w / 2) - 50),
        y: prePopulate ? Math.random() * h : -(30 + Math.random() * 250),
        vy: 14 + Math.random() * 24,
        drift: (Math.random() - 0.5) * 20,
        dfreq: 0.15 + Math.random() * 0.32,
        dphase: Math.random() * Math.PI * 2,
        life: prePopulate ? 10 + Math.random() * 80 : 0,
        alpha: 0.10 + Math.random() * 0.24,
        isGraph,
        graphFn: isGraph
          ? GRAPH_FNS[Math.floor(Math.random() * GRAPH_FNS.length)]
          : null,
        text: isGraph
          ? null
          : EQUATIONS[Math.floor(Math.random() * EQUATIONS.length)],
        fontSize: 10 + Math.floor(Math.random() * 6),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      halfW = w / 2;
      particles = Array.from({ length: 42 }, (_, i) => makePart(i < 30));
    };

    let last = 0;
    const draw = (ts) => {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += dt;
        p.y += p.vy * dt;

        if (p.y > h + 80) {
          particles[i] = makePart(false);
          continue;
        }

        const cx = p.x + p.drift * Math.sin(p.dfreq * p.life + p.dphase);
        const fadeIn  = p.y < h * 0.14 ? Math.max(0, p.y / (h * 0.14)) : 1;
        const fadeOut = p.y > h * 0.83 ? Math.max(0, (h - p.y) / (h * 0.17)) : 1;
        const alpha   = p.alpha * fadeIn * fadeOut;
        if (alpha < 0.005) continue;

        if (p.isGraph) {
          ctx.save();
          p.graphFn(ctx, cx, p.y, alpha);
          ctx.restore();
        } else {
          ctx.font = `italic ${p.fontSize}px Georgia, 'Times New Roman', serif`;
          ctx.fillStyle = p.color(alpha);
          ctx.fillText(p.text, cx, p.y);
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
