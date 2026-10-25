import { OrbitNode, GameConfig } from './types';
import { generateMathProblem, MathProblem } from '../services/mathGenerator';
import { getRandomVocab, getVocabPoolByLevel, VocabItem } from '../data/vocabulary';
import { renderNodeAppearance } from './nodeRenderer';

export interface TargetResult {
  currentMath: MathProblem | null;
  currentVocab: VocabItem | null;
  previousMathAnswer: number;
}

export function generateNextTarget(
  nodes: OrbitNode[],
  turnType: 'math' | 'vocab',
  config: GameConfig,
  previousMathAnswer: number
): TargetResult {
  // Reset all nodes
  nodes.forEach(n => {
    n.isTarget = false;
    n.isDecoyNumber = false;
    n.isDecoyWord = false;
    n.isBomb = false;
  });

  const indices = Array.from({ length: nodes.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const targetIdx = indices[0];
  const bombIdx = config.allowBomb && nodes.length > 2 ? indices[1] : -1;

  let currentMath: MathProblem | null = null;
  let currentVocab: VocabItem | null = null;
  let newPrevAnswer = previousMathAnswer;

  if (turnType === 'math') {
    const activeLevel = config.mathLevel || (config.difficulty === 'easy' ? 1 : config.difficulty === 'medium' ? 2 : 3);
    const mathProblem = generateMathProblem(
      activeLevel,
      config.isChainedMath ? previousMathAnswer : undefined
    );
    currentMath = mathProblem;
    newPrevAnswer = mathProblem.result;

    const targetNode = nodes[targetIdx];
    targetNode.isTarget = true;
    targetNode.number = mathProblem.result;

    const usedNumbers = new Set<number>([mathProblem.result]);
    indices.slice(1).forEach(idx => {
      const n = nodes[idx];
      if (idx === bombIdx) {
        n.isBomb = true;
        return;
      }
      let decoy = mathProblem.result;
      let attempts = 0;
      while ((decoy === mathProblem.result || usedNumbers.has(decoy)) && attempts < 30) {
        const delta = (Math.floor(Math.random() * 8) + 1) * (Math.random() > 0.5 ? 1 : -1);
        decoy = Math.max(1, mathProblem.result + delta);
        attempts++;
      }
      if (usedNumbers.has(decoy)) {
        decoy = mathProblem.result + attempts + 2;
      }
      usedNumbers.add(decoy);
      n.number = decoy;
      n.isDecoyNumber = true;
    });
  } else {
    // Vocab Turn
    const pool = getVocabPoolByLevel(config.cefrLevel || 'A1');
    const target = getRandomVocab(pool);
    currentVocab = target;

    const targetNode = nodes[targetIdx];
    targetNode.isTarget = true;
    targetNode.vocab = target;

    const usedWords = new Set<string>([target.en]);
    indices.slice(1).forEach(idx => {
      const n = nodes[idx];
      if (idx === bombIdx) {
        n.isBomb = true;
        return;
      }
      let decoy = getRandomVocab(pool, target.en);
      let attempts = 0;
      while (usedWords.has(decoy.en) && attempts < 25) {
        decoy = getRandomVocab(pool, target.en);
        attempts++;
      }
      usedWords.add(decoy.en);
      n.vocab = decoy;
      n.isDecoyWord = true;
    });
  }

  // Update DOM visuals
  nodes.forEach(n => {
    if (n.domElement) {
      renderNodeAppearance(n, n.domElement, turnType);
    }
  });

  return { currentMath, currentVocab, previousMathAnswer: newPrevAnswer };
}
