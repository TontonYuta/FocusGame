import { OrbitNode } from './types';

/**
 * Calculates responsive concentric orbit radii for given ring count.
 * Prevents node clipping at mobile screen edges and prevents overlap with central hub.
 */
export function calculateRingRadii(
  ringsCount: number,
  arenaRect: DOMRect,
  hubElement: HTMLElement
): { ringRadii: number[]; centerX: number; centerY: number } {
  const centerX = arenaRect.width / 2;
  const centerY = arenaRect.height / 2;
  const isMobile = arenaRect.width < 480;
  const isSmallMobile = arenaRect.width < 380;

  // Real central hub radius with responsive fallback
  const hubRect = hubElement.getBoundingClientRect();
  const hubRadius = (hubRect.width > 0 ? hubRect.width / 2 : 0) || (isSmallMobile ? 40 : isMobile ? 44 : 56);

  // Maximum node half-width to prevent clipping at left/right edges (especially for vocab word pills)
  // Max word pill width is ~84px on mobile, so half-width is 42px + 10px screen edge margin = 52px
  const maxNodeHalfWidth = isSmallMobile ? 44 : isMobile ? 48 : 56;
  const innerMargin = isSmallMobile ? 12 : isMobile ? 16 : 22;

  const minOrbit = hubRadius + maxNodeHalfWidth * 0.5 + innerMargin;
  const maxRadius = Math.min(centerX, centerY);
  const maxOrbit = Math.max(minOrbit + 30, maxRadius - maxNodeHalfWidth - (isSmallMobile ? 4 : isMobile ? 8 : 14));

  let ringRadii: number[] = [];
  if (ringsCount === 1) {
    ringRadii = [(minOrbit + maxOrbit) / 2];
  } else if (ringsCount === 2) {
    ringRadii = [
      minOrbit,
      maxOrbit
    ];
  } else {
    ringRadii = [
      minOrbit,
      minOrbit + (maxOrbit - minOrbit) * 0.50,
      maxOrbit
    ];
  }

  return { ringRadii, centerX, centerY };
}

/**
 * Updates DOM guides to match real calculated radii
 */
export function syncOrbitGuides(ringRadii: number[]) {
  const guides = [
    document.getElementById('ringGuide1'),
    document.getElementById('ringGuide2'),
    document.getElementById('ringGuide3'),
  ];
  guides.forEach((g, idx) => {
    if (!g) return;
    if (idx < ringRadii.length) {
      g.style.display = 'block';
      const diameter = Math.round(ringRadii[idx] * 2);
      g.style.width = `${diameter}px`;
      g.style.height = `${diameter}px`;
    } else {
      g.style.display = 'none';
    }
  });
}

/**
 * High-performance GPU-accelerated orbit physics loop.
 * Uses translate3d for subpixel smooth motion and frame-rate independence.
 */
export function updateNodePositions(
  nodes: OrbitNode[],
  ringRadii: number[],
  centerX: number,
  centerY: number,
  ringDirections: number[],
  baseSpeed: number,
  speedFactor: number,
  dtScale: number
) {
  const count = nodes.length;
  for (let i = 0; i < count; i++) {
    const node = nodes[i];
    const ringDir = ringDirections[node.ringIndex] || 1;
    const deltaAngle = ringDir * baseSpeed * speedFactor * dtScale;

    node.angle = (node.angle + deltaAngle) % (2 * Math.PI);

    const r = ringRadii[node.ringIndex] || ringRadii[0] || 100;
    const x = centerX + r * Math.cos(node.angle);
    const y = centerY + r * Math.sin(node.angle);

    if (node.domElement) {
      // GPU accelerated composite layer update with zero transition delay
      node.domElement.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
  }
}
