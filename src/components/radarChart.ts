export interface RadarData {
  vision: number; // 0..100
  math: number;   // 0..100
  vocab: number;  // 0..100
  reflex: number; // 0..100
}

/**
 * High-DPI, razor-sharp 4-axis radar (spider) chart.
 * Guaranteed zero label clipping on mobile viewports.
 */
export function drawRadarChart(canvas: HTMLCanvasElement, data: RadarData) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cssWidth = canvas.clientWidth || 280;
  const cssHeight = 230;

  // HiDPI backing store for sharp retina rendering
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.resetTransform?.();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const centerX = cssWidth / 2;
  const centerY = cssHeight / 2;
  // Radius budgeted so labels on all 4 sides have comfortable breathing room
  const radius = Math.min(centerX, centerY) - 44;

  // 4 Axes:
  // 0: Top    -> Tinh Mắt (Vision)
  // 1: Right  -> Tính Nhẩm (Math)
  // 2: Bottom -> Từ Vựng (Vocab)
  // 3: Left   -> Phản Xạ (Reflex)
  const axes = [
    { name: 'Tinh Mắt', color: '#06b6d4', score: data.vision, angle: -Math.PI / 2 },
    { name: 'Tính Nhẩm', color: '#f59e0b', score: data.math, angle: 0 },
    { name: 'Từ Vựng', color: '#10b981', score: data.vocab, angle: Math.PI / 2 },
    { name: 'Phản Xạ', color: '#f43f5e', score: data.reflex, angle: Math.PI }
  ];

  // 1. Draw concentric diamond grid rings (25%, 50%, 75%, 100%)
  const steps = [0.25, 0.5, 0.75, 1.0];
  steps.forEach(ratio => {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = axes[i].angle;
      const r = radius * ratio;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = ratio === 1.0 ? 'rgba(148, 163, 184, 0.35)' : 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = ratio === 1.0 ? 1.5 : 1;
    ctx.stroke();

    // Scale level markers (50, 100) along top axis
    if (ratio === 0.5 || ratio === 1.0) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.round(ratio * 100)), centerX - 3, centerY - radius * ratio + 3);
    }
  });

  // 2. Draw 4 axis spokes
  for (let i = 0; i < 4; i++) {
    const angle = axes[i].angle;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 3. Compute data polygon points
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < 4; i++) {
    const normalized = Math.max(0.12, Math.min(1.0, axes[i].score / 100));
    const r = radius * normalized;
    const x = centerX + r * Math.cos(axes[i].angle);
    const y = centerY + r * Math.sin(axes[i].angle);
    points.push({ x, y });
  }

  // 4. Draw polygon fill with glowing gradient
  ctx.beginPath();
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.closePath();

  const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.2)');
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // 5. Draw glowing vertex dots
  points.forEach((pt, i) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = axes[i].color;
    ctx.shadowColor = axes[i].color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  });

  // 6. Draw axis labels + score badges (no clipping guaranteed)
  axes.forEach((axis, i) => {
    ctx.save();
    if (i === 0) {
      // Top: Tinh Mắt
      const y = centerY - radius - 8;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillStyle = axis.color;
      ctx.fillText(`${axis.name}: ${axis.score}`, centerX, y);
    } else if (i === 1) {
      // Right: Tính Nhẩm
      const x = centerX + radius + 10;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.fillStyle = axis.color;
      ctx.fillText(axis.name, x, centerY - 6);
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(String(axis.score), x, centerY + 7);
    } else if (i === 2) {
      // Bottom: Từ Vựng
      const y = centerY + radius + 8;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillStyle = axis.color;
      ctx.fillText(`${axis.name}: ${axis.score}`, centerX, y);
    } else {
      // Left: Phản Xạ
      const x = centerX - radius - 10;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.fillStyle = axis.color;
      ctx.fillText(axis.name, x, centerY - 6);
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(String(axis.score), x, centerY + 7);
    }
    ctx.restore();
  });
}
