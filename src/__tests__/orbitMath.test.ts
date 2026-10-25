import { describe, it, expect } from 'vitest';
import { calculateRingRadii, updateNodePositions } from '../game/orbitMath';
import { OrbitNode } from '../game/types';

describe('orbitMath calculations', () => {
  const dummyArenaRect = {
    width: 400,
    height: 600,
    top: 0,
    left: 0,
    right: 400,
    bottom: 600,
    x: 0,
    y: 0,
    toJSON: () => {}
  } as DOMRect;

  const dummyHubElement = {
    getBoundingClientRect: () => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    })
  } as unknown as HTMLElement;

  it('calculates 1 ring radius correctly', () => {
    const { ringRadii, centerX, centerY } = calculateRingRadii(1, dummyArenaRect, dummyHubElement);
    expect(ringRadii).toHaveLength(1);
    expect(centerX).toBe(200);
    expect(centerY).toBe(300);
    expect(ringRadii[0]).toBeGreaterThan(50);
  });

  it('calculates 3 strictly concentric increasing rings', () => {
    const { ringRadii } = calculateRingRadii(3, dummyArenaRect, dummyHubElement);
    expect(ringRadii).toHaveLength(3);
    expect(ringRadii[0]).toBeLessThan(ringRadii[1]);
    expect(ringRadii[1]).toBeLessThan(ringRadii[2]);
  });

  it('updates node positions with clockwise and counter-clockwise directions', () => {
    const nodes: OrbitNode[] = [
      {
        id: 'node-0',
        ringIndex: 0,
        angle: 0,
        number: 1,
        vocab: { id: '1', en: 'cat', vi: 'mèo', level: 'A1', cat: 'daily', ipa: '/kæt/', hint: '' },
        gesture: 'tap',
        isTarget: false,
        isDecoyNumber: false,
        isDecoyWord: false,
        isBomb: false,
        domElement: null
      },
      {
        id: 'node-1',
        ringIndex: 1,
        angle: 0,
        number: 2,
        vocab: { id: '2', en: 'dog', vi: 'chó', level: 'A1', cat: 'daily', ipa: '/dɒɡ/', hint: '' },
        gesture: 'tap',
        isTarget: false,
        isDecoyNumber: false,
        isDecoyWord: false,
        isBomb: false,
        domElement: null
      }
    ];

    const ringRadii = [80, 140];
    const ringDirs = [1, -1]; // Ring 0 CW, Ring 1 CCW
    const baseSpeed = 0.01;

    updateNodePositions(nodes, ringRadii, 200, 200, ringDirs, baseSpeed, 1.0, 1.0);

    expect(nodes[0].angle).toBeGreaterThan(0); // CW increased
    expect(nodes[1].angle).toBeLessThan(0); // CCW decreased (or wrapped)
  });
});
