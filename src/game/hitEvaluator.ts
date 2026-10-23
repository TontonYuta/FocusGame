import { GameEngine } from './engine';
import { OrbitNode } from './types';
import { audio } from '../services/audio';
import { storage } from '../services/storage';

export function evaluateHit(engine: GameEngine, node: OrbitNode, arenaEl: HTMLElement): void {
  if (!engine.isRunning || engine.isPaused) return;
  engine.totalHits++;

  if (node.isBomb) {
    audio.playBomb();
    engine.combo = 1;
    engine.timeLeft = Math.max(0, engine.timeLeft - 5);
    arenaEl.classList.add('screen-shake');
    setTimeout(() => arenaEl.classList.remove('screen-shake'), 300);
    if (engine.timeLeft <= 0) engine.stopAndEnd(false);
    return;
  }

  const match = engine.targetType === 'math'
    ? (engine.mathProblem !== null && node.number === engine.mathProblem.result)
    : (engine.vocabItem !== null && !!node.vocab && node.vocab.en.toLowerCase() === engine.vocabItem.en.toLowerCase());

  if (match) {
    engine.correctHits++;
    engine.targetsDone++;
    engine.combo = Math.min(10, engine.combo + 1);
    const rx = performance.now() - engine.targetSpawnMs;
    engine.reactionTimes.push(rx);
    engine.score += (100 + Math.max(0, Math.floor((4000 - rx) / 30))) * engine.combo;
    audio.playCorrect();
    if (engine.combo >= 2) audio.playComboUp(engine.combo);
    if (engine.targetType === 'vocab' && node.vocab) {
      audio.speakWord(node.vocab.en);
      engine.wordsSeen.set(node.vocab.en, { vocab: node.vocab, wasWrong: false });
    }
    if (engine.targetsDone >= engine.config.targetCount) {
      engine.stopAndEnd(true);
    } else {
      engine.nextPrompt();
    }
  } else {
    engine.combo = 1;
    audio.playWrong();
    arenaEl.classList.add('screen-shake');
    setTimeout(() => arenaEl.classList.remove('screen-shake'), 300);
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
