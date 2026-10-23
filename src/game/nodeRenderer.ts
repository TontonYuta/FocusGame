import { OrbitNode } from './types';

export function createNodeDom(
  node: OrbitNode,
  containerWidth: number,
  onPointerDown: (node: OrbitNode) => void
): HTMLElement {
  const el = document.createElement('div');
  el.id = node.id;
  const isMobile = containerWidth < 480;
  const nodeSize = isMobile ? 46 : 54;

  el.className = 'orbit-node absolute flex flex-col items-center justify-center rounded-2xl select-none cursor-pointer transition-transform duration-100 active:scale-95 z-20 touch-manipulation';
  el.style.width = `${nodeSize}px`;
  el.style.height = `${nodeSize}px`;
  el.style.left = '50%';
  el.style.top = '50%';
  el.style.transform = 'translate(-50%, -50%)';

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    onPointerDown(node);
  });

  return el;
}

export function renderNodeAppearance(
  node: OrbitNode,
  el: HTMLElement,
  currentTargetType: 'math' | 'vocab' | 'schulte'
) {
  if (node.isBomb) {
    el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl bg-purple-950/90 border-2 border-purple-500 text-purple-200 shadow-lg glow-purple cursor-pointer select-none z-20 touch-manipulation transition-transform active:scale-90';
    el.innerHTML = '<span class="text-base sm:text-xl">💣</span>';
    return;
  }

  el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl border-2 border-cyan-500/80 bg-slate-900/95 text-slate-100 shadow-md glow-cyan hover:border-cyan-400 cursor-pointer select-none z-20 p-1 touch-manipulation transition-transform active:scale-90';

  if (currentTargetType === 'math') {
    el.innerHTML = `<span class="node-main-text font-mono text-base sm:text-lg font-black tracking-tight text-white leading-none">${node.number}</span>`;
  } else {
    const word = node.vocab ? node.vocab.en : '';
    const wordSizeClass = word.length > 7 ? 'text-[9.5px] sm:text-[10.5px]' : 'text-xs sm:text-sm';
    el.innerHTML = `<span class="node-main-text node-word-text ${wordSizeClass} font-bold tracking-tight text-white max-w-[54px] truncate text-center leading-none">${word}</span>`;
  }
}

export function createSchulteNodeDom(
  node: OrbitNode,
  containerWidth: number,
  onPointerDown: (node: OrbitNode) => void
): HTMLElement {
  const el = document.createElement('div');
  el.id = node.id;
  const isMobile = containerWidth < 480;
  const nodeSize = isMobile ? 44 : 52;

  el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl bg-slate-900/90 border-2 border-indigo-500/80 text-white font-mono font-black text-lg sm:text-xl shadow-lg hover:border-cyan-400 cursor-pointer select-none transition-all active:scale-90 z-20 touch-manipulation';
  el.style.width = `${nodeSize}px`;
  el.style.height = `${nodeSize}px`;
  el.style.left = '50%';
  el.style.top = '50%';
  el.style.transform = 'translate(-50%, -50%)';
  el.innerHTML = `<span class="node-main-text">${node.number}</span>`;

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    onPointerDown(node);
  });

  return el;
}
