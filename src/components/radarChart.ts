export interface RadarData {
  vision: number; // 0..100
  math: number;   // 0..100
  vocab: number;  // 0..100
  reflex: number; // 0..100
}

export function drawRadarChart(canvas: HTMLCanvasElement, data: RadarData) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2 + 6;
  const radius = Math.min(centerX, centerY) - 38;

  ctx.clearRect(0, 0, width, height);

  // 4 Axes:
  // 0: Top (Vision - Tinh Mắt)
  // 1: Right (Math - Tính Nhẩm)
  // 2: Bottom (Vocab - Từ Vựng)
  // 3: Left (Reflex - Phản Xạ Tay)
  const labels = [
    { name: 'Tinh Mắt', color: '#06b6d4', score: data.vision },
    { name: 'Tính Nhẩm', color: '#f59e0b', score: data.math },
    { name: 'Từ Vựng', color: '#10b981', score: data.vocab },
    { name: 'Phản Xạ Tay', color: '#f43f5e', score: data.reflex }
  ];

  const totalAxes = 4;
  const angles = [
    -Math.PI / 2,        // Top
    0,                   // Right
    Math.PI / 2,         // Bottom
    Math.PI              // Left
  ];

  // Draw concentric polygon rings (25%, 50%, 75%, 100%)
  const steps = [0.25, 0.5, 0.75, 1.0];
  steps.forEach(ratio => {
    ctx.beginPath();
    for (let i = 0; i < totalAxes; i++) {
      const angle = angles[i];
      const r = radius * ratio;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = ratio === 1.0 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = ratio === 1.0 ? 1.5 : 1;
    ctx.stroke();

    // Subtle level text
    if (ratio === 0.5 || ratio === 1.0) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(ratio * 100)}`, centerX - 4, centerY - radius * ratio + 3);
    }
  });

  // Draw spokes
  for (let i = 0; i < totalAxes; i++) {
    const angle = angles[i];
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw data polygon
  const scores = [data.vision, data.math, data.vocab, data.reflex];
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < totalAxes; i++) {
    const normalized = Math.max(0.12, Math.min(1.0, scores[i] / 100));
    const r = radius * normalized;
    const x = centerX + r * Math.cos(angles[i]);
    const y = centerY + r * Math.sin(angles[i]);
    points.push({ x, y });
  }

  // Fill polygon with radiant cyan-indigo gradient
  ctx.beginPath();
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.closePath();

  const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(6, 182, 212, 0.5)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.25)');
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw glowing data vertices
  points.forEach((pt, i) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = labels[i].color;
    ctx.shadowColor = labels[i].color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  });

  // Draw labels and score indicators
  labels.forEach((lbl, i) => {
    const angle = angles[i];
    const offset = 22;
    const lx = centerX + (radius + offset) * Math.cos(angle);
    const ly = centerY + (radius + offset) * Math.sin(angle);

    ctx.fillStyle = lbl.color;
    ctx.font = 'bold 11px "Inter", sans-serif';

    if (i === 0) { // Top
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(lbl.name, lx, ly - 2);
    } else if (i === 1) { // Right
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(lbl.name, lx + 4, ly);
    } else if (i === 2) { // Bottom
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(lbl.name, lx, ly + 2);
    } else { // Left
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(lbl.name, lx - 4, ly);
    }
  });
}
