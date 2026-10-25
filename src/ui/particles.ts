/**
 * Lightweight GPU particle burst effect using Web Animations API.
 * Zero external dependencies, self-cleaning.
 */

export function spawnParticleBurst(
  container: HTMLElement,
  x: number,
  y: number,
  palette: string[] = ['#06b6d4', '#38bdf8', '#f59e0b', '#10b981', '#ffffff']
) {
  const particleCount = 12;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    const size = Math.floor(Math.random() * 4) + 4; // 4..7px
    const color = palette[Math.floor(Math.random() * palette.length)];
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.floor(Math.random() * 45) + 25; // 25..70px
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    p.style.position = 'absolute';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.borderRadius = '9999px';
    p.style.backgroundColor = color;
    p.style.boxShadow = `0 0 8px ${color}`;
    p.style.pointerEvents = 'none';
    p.style.zIndex = '35';
    p.style.willChange = 'transform, opacity';

    container.appendChild(p);

    const anim = p.animate(
      [
        { transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1)', opacity: 1 },
        { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 }
      ],
      {
        duration: 400 + Math.random() * 150,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      }
    );

    anim.onfinish = () => {
      p.remove();
    };
  }
}
