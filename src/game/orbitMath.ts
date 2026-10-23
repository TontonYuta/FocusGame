import { OrbitNode } from './types';

/**
 * Calculates responsive concentric orbit radii for given ring count.
 */
export function calculateRingRadii(
  ringsCount: number,
  arenaRect: DOMRect,
  hubElement: HTMLElement
): { ringRadii: number[]; centerX: number; centerY: number } {
  const centerX = arenaRect.width / 2;
  const centerY = arenaRect.height / 2;
  const isMobile = arenaRect.width < 480;

  const hubRect = hubElement.getBoundingClientRect();
  const hubRadius = (hubRect.width / 2) || (isMobile ? 48 : 64);
  const nodeRadius = isMobile ? 23 : 27;
  const innerMargin = isMobile ? 14 : 20;

  const minOrbit = hubRadius + nodeRadius + innerMargin;
  const maxRadius = Math.min(centerX, centerY) * 0.94;
  const maxOrbit = Math.max(minOrbit + 26, maxRadius - nodeRadius - (isMobile ? 4 : 8));

  let ringRadii: number[] = [];
  if (ringsCount === 1) {
    ringRadii = [(minOrbit + maxOrbit) / 2];
  } else if (ringsCount === 2) {
    ringRadii = [
      minOrbit + (maxOrbit - minOrbit) * 0.2,
      maxOrbit
    ];
  } else {
    ringRadii = [
      minOrbit,
      minOrbit + (maxOrbit - minOrbit) * 0.52,
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
 * Moves nodes along their circular orbits and sets left/top style
 */
export function updateNodePositions(
  nodes: OrbitNode[],
  ringRadii: number[],
  centerX: number,
  centerY: number,
  ringDirections: number[],
  baseSpeed: number,
  speedFactor: number
) {
  nodes.forEach(node => {
    const ringDir = ringDirections[node.ringIndex] || 1;
    const deltaAngle = ringDir * baseSpeed * speedFactor;

    node.angle = (node.angle + deltaAngle) % (2 * Math.PI);

    const r = ringRadii[node.ringIndex] || ringRadii[0] || 100;
    const x = centerX + r * Math.cos(node.angle);
    const y = centerY + r * Math.sin(node.angle);

    if (node.domElement) {
      node.domElement.style.left = `${x}px`;
      node.domElement.style.top = `${y}px`;
    }
  });
}
