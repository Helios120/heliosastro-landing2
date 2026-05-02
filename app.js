function setupCanvas(canvasId, mode) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let t = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function glow(x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    requestAnimationFrame(draw);
    t += mode === "hero" ? 0.006 : 0.012;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * (mode === "hero" ? 0.34 : 0.40);

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(0, 0, w, h);

    glow(cx, cy, R * 1.7, "rgba(0,220,255,0.055)");
    glow(cx, cy, R * 0.9, "rgba(255,211,105,0.045)");

    const branches = mode === "hero" ? 10 : 14;

    for (let b = 0; b < branches; b++) {
      ctx.beginPath();

      for (let i = 0; i <= 520; i++) {
        const p = i / 520;
        const a =
          p * Math.PI * (mode === "hero" ? 6 : 9) +
          b * Math.PI * 2 / branches +
          t;

        const wave = Math.sin(p * Math.PI * 10 + t * 2 + b) * 7;
        const r = R * p + wave;

        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const hue = (180 + b * 360 / branches + t * 30) % 360;
      ctx.strokeStyle = `hsla(${hue}, 100%, 68%, ${mode === "hero" ? 0.20 : 0.34})`;
      ctx.lineWidth = mode === "hero" ? 1 : 1.3;
      ctx.shadowBlur = mode === "hero" ? 8 : 14;
      ctx.shadowColor = `hsla(${hue}, 100%, 68%, 0.75)`;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if (mode !== "hero") {
      for (let i = 0; i < branches; i++) {
        const base = i * Math.PI * 2 / branches - Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(cx, cy);

        for (let j = 0; j <= 110; j++) {
          const p = j / 110;
          const curve = Math.sin(p * Math.PI) * 0.30;
          const a = base + curve + Math.sin(t + i) * 0.045;
          const r = R * 0.98 * p;

          ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }

        const hue = (i * 360 / branches + t * 50) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 68%, 0.42)`;
        ctx.lineWidth = 2.1;
        ctx.lineCap = "round";
        ctx.shadowBlur = 16;
        ctx.shadowColor = `hsla(${hue}, 100%, 68%, 0.75)`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    const photons = mode === "hero" ? 120 : 320;

    for (let i = 0; i < photons; i++) {
      const layer = i % branches;
      const phase = (t * 0.18 + i * 0.017) % 1;

      const a =
        layer * Math.PI * 2 / branches +
        phase * Math.PI * 3.4 +
        Math.sin(phase * Math.PI) * 0.8;

      const r = R * (0.10 + phase * 0.90);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;

      const hue = (180 + layer * 22 + phase * 180 + t * 10) % 360;
      const size = 1 + Math.sin(phase * Math.PI) * (mode === "hero" ? 2.3 : 3.8);

      glow(x, y, size * 7, `hsla(${hue}, 100%, 70%, 0.12)`);
      ctx.fillStyle = `hsla(${hue}, 100%, 78%, 0.82)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    glow(cx, cy, mode === "hero" ? 70 : 95, "rgba(255,255,255,0.16)");
    glow(cx, cy, mode === "hero" ? 30 : 38, "rgba(255,240,160,0.75)");

    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.beginPath();
    ctx.arc(cx, cy, mode === "hero" ? 5 : 7, 0, Math.PI * 2);
    ctx.fill();
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

setupCanvas("hero-canvas", "hero");
setupCanvas("lab-canvas", "lab");
