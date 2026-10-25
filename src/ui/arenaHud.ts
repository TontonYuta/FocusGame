import { HudData, GameConfig } from '../game/types';
import { MathProblem } from '../services/mathGenerator';
import { VocabItem } from '../data/vocabulary';

export function updateArenaHud(
  data: HudData,
  config: GameConfig,
  targetType: 'math' | 'vocab' | 'schulte',
  math: MathProblem | null,
  vocab: VocabItem | null,
  schulteTarget: number
) {
  const hudLevelTitle = document.getElementById('hudLevelTitle');
  const hudTargetCount = document.getElementById('hudTargetCount');
  const hudAccuracy = document.getElementById('hudAccuracy');
  const hudComboFire = document.getElementById('hudComboFire');
  const hudComboValue = document.getElementById('hudComboValue');
  const hudScore = document.getElementById('hudScore');
  const hudTimerSec = document.getElementById('hudTimerSec');
  const hudTimerCircle = document.getElementById('hudTimerCircle') as unknown as SVGCircleElement | null;
  const hubProgressCircle = document.getElementById('hubProgressCircle') as unknown as SVGCircleElement | null;
  const legendBomb = document.getElementById('legendBomb');

  if (hudLevelTitle) hudLevelTitle.innerText = config.name;
  if (hudTargetCount) {
    hudTargetCount.innerText = config.mode === 'survival' ? `${data.targetsDone} 🔥` : `${data.targetsDone}/${data.targetTotal}`;
  }
  if (hudAccuracy) hudAccuracy.innerText = `${data.accuracy}%`;

  if (hudComboValue) hudComboValue.innerText = `x${data.combo}`;
  if (hudComboFire) {
    if (data.combo >= 2) hudComboFire.classList.remove('hidden');
    else hudComboFire.classList.add('hidden');
  }

  if (hudScore) hudScore.innerText = String(data.score).padStart(4, '0');
  if (hudTimerSec) hudTimerSec.innerText = String(data.timeLeft);

  if (hudTimerCircle) {
    const circumference = 100.5;
    const progress = Math.max(0, data.timeLeft / (data.totalTime || 60));
    hudTimerCircle.style.strokeDashoffset = String(circumference * (1 - progress));
    hudTimerCircle.style.stroke = data.timeLeft <= 10 ? '#ef4444' : '#06b6d4';
  }

  if (hubProgressCircle) {
    const circumference = 400;
    const progress = Math.min(1, data.targetsDone / (data.targetTotal || 1));
    hubProgressCircle.style.strokeDashoffset = String(circumference * (1 - progress));
  }

  if (legendBomb) {
    if (config.allowBomb) legendBomb.classList.remove('hidden');
    else legendBomb.classList.add('hidden');
  }

  // Update Central Hub Prompt
  const hubMath = document.getElementById('hubMathExpression');
  const hubVocab = document.getElementById('hubVocabCue');

  if (targetType === 'math') {
    if (hubMath && math) {
      hubMath.innerText = math.expression;
      hubMath.className = 'font-mono text-xl sm:text-2xl md:text-3xl font-black text-amber-300 tracking-tight leading-none text-center';
      hubMath.classList.remove('hidden');
    }
    if (hubVocab) hubVocab.classList.add('hidden');
  } else if (targetType === 'vocab') {
    if (hubVocab && vocab) {
      hubVocab.innerText = vocab.vi;
      const viLen = vocab.vi.length;
      const viSizeClass = viLen >= 14 ? 'text-xs sm:text-base md:text-lg' : viLen >= 9 ? 'text-sm sm:text-lg md:text-xl' : 'text-base sm:text-xl md:text-2xl';
      hubVocab.className = `font-patrick ${viSizeClass} font-bold text-cyan-300 leading-tight text-center px-1 break-words`;
      hubVocab.classList.remove('hidden');
    }
    if (hubMath) hubMath.classList.add('hidden');
  } else {
    // Schulte
    if (hubMath) {
      hubMath.innerText = String(schulteTarget);
      hubMath.className = 'font-mono text-3xl sm:text-5xl md:text-6xl font-black text-white leading-none text-center';
      hubMath.classList.remove('hidden');
    }
    if (hubVocab) hubVocab.classList.add('hidden');
  }
}
