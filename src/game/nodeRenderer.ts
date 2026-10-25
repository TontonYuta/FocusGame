import { OrbitNode } from './types';

export function createNodeDom(
  node: OrbitNode,
  _containerWidth: number,
  onPointerDown: (node: OrbitNode) => void
): HTMLElement {
  const el = document.createElement('div');
  el.id = node.id;
  // NOTE: Outer element handles 60/120fps RAF physics positioning with ZERO transition to prevent jank.
  el.className = 'orbit-node absolute pointer-events-auto select-none cursor-pointer z-20 touch-none';
  el.style.left = '0px';
  el.style.top = '0px';
  el.style.transition = 'none';
  el.style.willChange = 'transform';
  el.style.transform = 'translate3d(0px, 0px, 0) translate(-50%, -50%)';

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    el.style.width = '42px';
    el.style.height = '42px';
    el.innerHTML = `
      <div class="node-inner w-full h-full flex items-center justify-center rounded-2xl bg-purple-950/90 border-2 border-purple-500 text-purple-200 shadow-lg glow-purple active:scale-85 active:brightness-125 transition-transform duration-75">
        <span class="text-base sm:text-lg select-none">💣</span>
      </div>`;
    return;
  }

  if (currentTargetType === 'math') {
    el.style.width = '46px';
    el.style.height = '46px';
    el.innerHTML = `
      <div class="node-inner w-full h-full flex items-center justify-center rounded-2xl border-2 border-cyan-500/80 bg-slate-900/95 text-slate-100 shadow-md glow-cyan active:scale-85 active:border-cyan-300 active:brightness-125 transition-transform duration-75">
        <span class="font-mono text-base sm:text-lg font-black tracking-tight text-white leading-none select-none">${node.number}</span>
      </div>`;
  } else {
    // Vocab word node: adaptive pill width, responsive font size, no truncation
    const word = node.vocab ? node.vocab.en : '';
    const len = word.length;
    const fontClass = len >= 11
      ? 'text-[9px] sm:text-[10px]'
      : len >= 8
        ? 'text-[10px] sm:text-[11px]'
        : len >= 5
          ? 'text-[11px] sm:text-xs'
          : 'text-xs sm:text-sm';

    el.style.width = 'auto';
    el.style.height = '38px';
    el.innerHTML = `
      <div class="node-inner w-full h-full flex items-center justify-center px-2.5 sm:px-3 rounded-full border-2 border-cyan-500/80 bg-slate-900/95 text-slate-100 shadow-md glow-cyan active:scale-85 active:border-cyan-300 active:brightness-125 transition-transform duration-75 min-w-[50px] max-w-[94px] sm:max-w-[115px]">
        <span class="${fontClass} font-bold tracking-tight text-white whitespace-nowrap text-center leading-none truncate select-none">${word}</span>
      </div>`;
  }
}

export function createSchulteNodeDom(
  node: OrbitNode,
  _containerWidth: number,
  onPointerDown: (node: OrbitNode) => void
): HTMLElement {
  const el = document.createElement('div');
  el.id = node.id;
  el.className = 'orbit-node absolute pointer-events-auto select-none cursor-pointer z-20 touch-none';
  el.style.width = '46px';
  el.style.height = '46px';
  el.style.left = '0px';
  el.style.top = '0px';
  el.style.transition = 'none';
  el.style.willChange = 'transform';
  el.style.transform = 'translate3d(0px, 0px, 0) translate(-50%, -50%)';
  el.innerHTML = `
    <div class="schulte-inner w-full h-full flex items-center justify-center rounded-2xl bg-slate-900/90 border-2 border-indigo-500/80 text-white font-mono font-black text-lg sm:text-xl shadow-lg active:scale-85 active:border-cyan-300 transition-transform duration-75">
      <span class="select-none">${node.number}</span>
    </div>`;

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPointerDown(node);
  });

  return el;
}
