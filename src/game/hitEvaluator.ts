import { GameEngine } from './engine';
import { OrbitNode } from './types';
import { audio } from '../services/audio';
import { storage } from '../services/storage';
import { spawnParticleBurst } from '../ui/particles';

export function evaluateHit(engine: GameEngine, node: OrbitNode, arenaEl: HTMLElement): void {
  if (!engine.isRunning || engine.isPaused) return;
  engine.totalHits++;

  const isSurvival = engine.config.mode === 'survival';

  if (node.isBomb) {
    audio.playBomb();
    engine.combo = 1;
    const penalty = isSurvival ? 8 : 5;
    engine.timeLeft = Math.max(0, engine.timeLeft - penalty);
    arenaEl.classList.add('screen-shake');
    setTimeout(() => arenaEl.classList.remove('screen-shake'), 300);
    if (engine.timeLeft <= 0) engine.stopAndEnd(isSurvival ? engine.targetsDone >= 5 : false);
    return;
  }

  const match = engine.targetType === 'math'
    ? (engine.mathProblem !== null && node.number === engine.mathProblem.result)
    : (engine.vocabItem !== null && !!node.vocab && node.vocab.en.toLowerCase() === engine.vocabItem.en.toLowerCase());

  if (match) {
    engine.correctHits++;
    engine.targetsDone++;
    engine.combo = Math.min(10, engine.combo + 1);

    // Particle burst at node center
    if (node.domElement) {
      const rect = node.domElement.getBoundingClientRect();
      const arenaRect = arenaEl.getBoundingClientRect();
      const px = rect.left + rect.width / 2 - arenaRect.left;
      const py = rect.top + rect.height / 2 - arenaRect.top;
      spawnParticleBurst(arenaEl, px, py);
    }

    if (isSurvival) {
      engine.timeLeft = Math.min(45, Math.round((engine.timeLeft + 2.0) * 10) / 10);
    }

    const rx = performance.now() - engine.targetSpawnMs;
    engine.reactionTimes.push(rx);
    engine.score += (100 + Math.max(0, Math.floor((4000 - rx) / 30))) * engine.combo;
    audio.playCorrect();
    if (engine.combo >= 2) audio.playComboUp(engine.combo);
    if (engine.targetType === 'vocab' && node.vocab) {
      audio.speakWord(node.vocab.en);
      engine.wordsSeen.set(node.vocab.en, { vocab: node.vocab, wasWrong: false });
    }

    if (!isSurvival && engine.targetsDone >= engine.config.targetCount) {
      engine.stopAndEnd(true);
    } else {
      engine.nextPrompt();
    }
  } else {
    engine.combo = 1;
    audio.playWrong();
    arenaEl.classList.add('screen-shake');
    setTimeout(() => arenaEl.classList.remove('screen-shake'), 300);

    if (isSurvival) {
      engine.timeLeft = Math.max(0, Math.round((engine.timeLeft - 4.0) * 10) / 10);
      if (engine.timeLeft <= 0) {
        engine.stopAndEnd(engine.targetsDone >= 5);
        return;
      }
    }

    if (engine.targetType === 'vocab' && engine.vocabItem) {
      engine.wordsSeen.set(engine.vocabItem.en, { vocab: engine.vocabItem, wasWrong: true });
      storage.recordMistake(engine.vocabItem.en);
    }
  }
}

export function evaluateSchulteHit(engine: GameEngine, node: OrbitNode): void {
  if (node.number === engine.schulteTarget) {
    audio.playCorrect();
    node.domElement?.classList.add('bg-emerald-500', 'border-emerald-300', 'scale-90', 'opacity-40');

    if (node.domElement && engine.arena) {
      const rect = node.domElement.getBoundingClientRect();
      const arenaRect = engine.arena.getBoundingClientRect();
      const px = rect.left + rect.width / 2 - arenaRect.left;
      const py = rect.top + rect.height / 2 - arenaRect.top;
      spawnParticleBurst(engine.arena, px, py, ['#10b981', '#34d399', '#6ee7b7', '#ffffff']);
    }

    engine.schulteTarget++;
    engine.targetsDone++;
    engine.correctHits++;
    engine.totalHits++;
    if (engine.schulteTarget > 30) engine.stopAndEnd(true);
  } else {
    audio.playWrong();
    engine.totalHits++;
  }
}
