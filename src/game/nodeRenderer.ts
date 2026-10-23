import { OrbitNode } from './types';

export function createNodeDom(
  node: OrbitNode,
  _containerWidth: number,
  onPointerDown: (node: OrbitNode) => void
): HTMLElement {
  const el = document.createElement('div');
  el.id = node.id;
  el.className = 'orbit-node absolute flex items-center justify-center select-none cursor-pointer z-20 touch-manipulation active:opacity-80 active:brightness-125';
  el.style.left = '0px';
  el.style.top = '0px';
  el.style.willChange = 'transform';
  el.style.transform = 'translate3d(0px, 0px, 0) translate(-50%, -50%)';

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
    el.style.width = '44px';
    el.style.height = '44px';
    el.style.minWidth = '';
    el.style.maxWidth = '';
    el.style.padding = '0';
    el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl bg-purple-950/90 border-2 border-purple-500 text-purple-200 shadow-lg glow-purple cursor-pointer select-none z-20 touch-manipulation active:opacity-80 active:brightness-125';
    el.innerHTML = '<span class="text-base sm:text-xl">💣</span>';
    return;
  }

  if (currentTargetType === 'math') {
    el.style.width = '48px';
    el.style.height = '48px';
    el.style.minWidth = '';
    el.style.maxWidth = '';
    el.style.padding = '0';
    el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl border-2 border-cyan-500/80 bg-slate-900/95 text-slate-100 shadow-md glow-cyan hover:border-cyan-400 cursor-pointer select-none z-20 touch-manipulation active:opacity-80 active:brightness-125';
    el.innerHTML = `<span class="node-main-text font-mono text-base sm:text-lg font-black tracking-tight text-white leading-none">${node.number}</span>`;
  } else {
    // Vocab word node: adaptive pill width, responsive font size, NO truncation!
    const word = node.vocab ? node.vocab.en : '';
    const len = word.length;
    const fontClass = len >= 11
      ? 'text-[8.5px] sm:text-[9.5px]'
      : len >= 8
        ? 'text-[10px] sm:text-[11px]'
        : len >= 5
          ? 'text-[11px] sm:text-xs'
          : 'text-xs sm:text-sm';

    el.style.width = 'auto';
    el.style.height = '38px';
    el.style.minWidth = '54px';
    el.style.maxWidth = '114px';
    el.style.padding = '0 10px';
    el.className = 'orbit-node absolute flex items-center justify-center rounded-full border-2 border-cyan-500/80 bg-slate-900/95 text-slate-100 shadow-md glow-cyan hover:border-cyan-400 cursor-pointer select-none z-20 touch-manipulation active:opacity-80 active:brightness-125';
    el.innerHTML = `<span class="node-main-text node-word-text ${fontClass} font-bold tracking-tight text-white whitespace-nowrap text-center leading-none">${word}</span>`;
  }
}

export function createSchulteNodeDom(
  node: OrbitNode,
  _containerWidth: number,
  onPointerDown: (node: OrbitNode) => void
): HTMLElement {
  const el = document.createElement('div');
  el.id = node.id;
  el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl bg-slate-900/90 border-2 border-indigo-500/80 text-white font-mono font-black text-lg sm:text-xl shadow-lg hover:border-cyan-400 cursor-pointer select-none z-20 touch-manipulation active:opacity-80 active:brightness-125';
  el.style.width = '46px';
  el.style.height = '46px';
  el.style.left = '0px';
  el.style.top = '0px';
  el.style.willChange = 'transform';
  el.style.transform = 'translate3d(0px, 0px, 0) translate(-50%, -50%)';
  el.innerHTML = `<span class="node-main-text">${node.number}</span>`;

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    onPointerDown(node);
  });

  return el;
}
