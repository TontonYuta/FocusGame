import { GameConfig, OrbitNode } from './types';
import { getRandomVocab, getVocabPoolByCategory } from '../data/vocabulary';
import { createNodeDom, createSchulteNodeDom } from './nodeRenderer';

export function spawnOrbitNodes(
  config: GameConfig,
  container: HTMLElement,
  containerWidth: number,
  onTap: (node: OrbitNode) => void
): OrbitNode[] {
  container.innerHTML = '';
  const nodes: OrbitNode[] = [];
  const dist = config.rings === 1 ? [config.nodeCount]
    : config.rings === 2 ? [Math.floor(config.nodeCount * 0.44), Math.ceil(config.nodeCount * 0.56)]
    : [
        Math.floor(config.nodeCount * 0.26),
        Math.floor(config.nodeCount * 0.34),
        config.nodeCount - Math.floor(config.nodeCount * 0.26) - Math.floor(config.nodeCount * 0.34)
      ];

  let idx = 0;
  dist.forEach((count, r) => {
    const step = (2 * Math.PI) / count;
    for (let i = 0; i < count; i++) {
      const node: OrbitNode = {
        id: `node-${idx++}`,
        ringIndex: r,
        angle: i * step,
        number: i + 1,
        vocab: getRandomVocab(getVocabPoolByCategory('daily')),
        gesture: 'tap',
        isTarget: false,
        isDecoyNumber: false,
        isDecoyWord: false,
        isBomb: false,
        domElement: null
      };
      const el = createNodeDom(node, containerWidth, onTap);
      node.domElement = el;
      container.appendChild(el);
      nodes.push(node);
    }
  });
  return nodes;
}

export function spawnSchulteOrbitNodes(
  container: HTMLElement,
  containerWidth: number,
  onTap: (node: OrbitNode) => void
): OrbitNode[] {
  container.innerHTML = '';
  const nodes: OrbitNode[] = [];
  const dist = [8, 10, 12];
  const nums = Array.from({ length: 30 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
  let nIdx = 0;

  dist.forEach((count, r) => {
    const step = (2 * Math.PI) / count;
    for (let i = 0; i < count; i++) {
      const num = nums[nIdx++];
      const node: OrbitNode = {
        id: `schulte-${num}`,
        ringIndex: r,
        angle: i * step,
        number: num,
        vocab: getRandomVocab(getVocabPoolByCategory('daily')),
        gesture: 'tap',
        isTarget: num === 1,
        isDecoyNumber: false,
        isDecoyWord: false,
        isBomb: false,
        domElement: null
      };
      const el = createSchulteNodeDom(node, containerWidth, onTap);
      node.domElement = el;
      container.appendChild(el);
      nodes.push(node);
    }
  });
  return nodes;
}
