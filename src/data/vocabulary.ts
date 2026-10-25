import { CEFRLevel, VocabItem } from './types';
import { storage } from '../services/storage';
import { VOCAB_A1 } from './vocabA1';
import { VOCAB_A2 } from './vocabA2';
import { VOCAB_B1 } from './vocabB1';
import { VOCAB_B2 } from './vocabB2';
import { VOCAB_C1 } from './vocabC1';

export * from './types';
export * from './vocabA1';
export * from './vocabA2';
export * from './vocabB1';
export * from './vocabB2';
export * from './vocabC1';

export const VOCABULARY_DATA: VocabItem[] = [
  ...VOCAB_A1,
  ...VOCAB_A2,
  ...VOCAB_B1,
  ...VOCAB_B2,
  ...VOCAB_C1
];

export const VOCABULARY_LIST = VOCABULARY_DATA;

export function getAllVocabulary(): VocabItem[] {
  const custom = storage.getCustomVocab();
  return [...custom, ...VOCABULARY_DATA];
}

/**
 * Filter vocabulary by CEFR Level ('A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'all' | 'custom')
 */
export function getVocabPoolByLevel(level: CEFRLevel | 'all' | 'custom'): VocabItem[] {
  if (level === 'custom') {
    const custom = storage.getCustomVocab();
    return custom.length > 0 ? custom : VOCABULARY_DATA;
  }
  if (level === 'all' || !level) {
    return getAllVocabulary();
  }
  return VOCABULARY_DATA.filter(v => v.level === level);
}

/**
 * Filter vocabulary by Category ('daily' | 'toeic' | 'academic' | 'tech' | 'a1' | 'mixed' | 'custom')
 */
export function getVocabPoolByCategory(category: string): VocabItem[] {
  if (category === 'custom') {
    return getVocabPoolByLevel('custom');
  }
  if (!category || category === 'mixed' || category === 'all') {
    return getAllVocabulary();
  }
  const upper = category.toUpperCase();
  if (['A1', 'A2', 'B1', 'B2', 'C1'].includes(upper)) {
    return getVocabPoolByLevel(upper as CEFRLevel);
  }
  return VOCABULARY_DATA.filter(v => v.cat === category);
}

/**
 * Pick a random vocabulary item from a pool, avoiding immediate repetition
 */
export function getRandomVocab(pool: VocabItem[], excludeEn?: string): VocabItem {
  const filtered = excludeEn ? pool.filter(p => p.en !== excludeEn) : pool;
  if (filtered.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
}
