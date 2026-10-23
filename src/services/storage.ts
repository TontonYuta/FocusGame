/**
 * LocalStorage persistence layer for user progress, stats, and mistakes review
 */

export interface MistakeRecord {
  wordEn: string;
  count: number;
  lastMistakeAt: number;
}

export interface LevelRecord {
  stars: number; // 0 to 3
  highScore: number;
  bestTimeSec: number;
}

const STORAGE_KEYS = {
  UNLOCKED_LEVELS: 'spinning_mind_unlocked_levels',
  LEVEL_RECORDS: 'spinning_mind_level_records',
  MISTAKEN_WORDS: 'spinning_mind_mistaken_words',
  SCHULTE_BEST_TIME: 'spinning_mind_schulte_best_time',
  DEV_UNLOCK_ALL: 'spinning_mind_dev_unlock_all',
  SOUND_ENABLED: 'spinning_mind_sound_enabled',
  SPEECH_ENABLED: 'spinning_mind_speech_enabled',
  GLOBAL_CATEGORY: 'spinning_mind_global_category'
};

class StorageService {
  public getUnlockedLevels(): number[] {
    try {
      const isDevUnlocked = this.getDevUnlockAll();
      if (isDevUnlocked) return [1, 2, 3, 4, 5, 6];
      const data = localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [1];
  }

  public unlockLevel(levelNum: number): void {
    const current = this.getUnlockedLevels();
    if (!current.includes(levelNum)) {
      current.push(levelNum);
      current.sort((a, b) => a - b);
      try {
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(current));
      } catch {
        // Ignore
      }
    }
  }

  public getDevUnlockAll(): boolean {
    return localStorage.getItem(STORAGE_KEYS.DEV_UNLOCK_ALL) === 'true';
  }

  public setDevUnlockAll(value: boolean): void {
    localStorage.setItem(STORAGE_KEYS.DEV_UNLOCK_ALL, value ? 'true' : 'false');
  }

  public getLevelRecords(): Record<number, LevelRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEVEL_RECORDS);
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return {};
  }

  public saveLevelRecord(levelNum: number, stars: number, score: number, timeSec: number): void {
    const records = this.getLevelRecords();
    const prev = records[levelNum] || { stars: 0, highScore: 0, bestTimeSec: 9999 };

    records[levelNum] = {
      stars: Math.max(prev.stars, stars),
      highScore: Math.max(prev.highScore, score),
      bestTimeSec: Math.min(prev.bestTimeSec, timeSec)
    };

    try {
      localStorage.setItem(STORAGE_KEYS.LEVEL_RECORDS, JSON.stringify(records));
    } catch {
      // Ignore
    }
  }

  public getMistakenWords(): Record<string, MistakeRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKEN_WORDS);
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return {};
  }

  public recordMistake(wordEn: string): void {
    const list = this.getMistakenWords();
    if (!list[wordEn]) {
      list[wordEn] = { wordEn, count: 1, lastMistakeAt: Date.now() };
    } else {
      list[wordEn].count += 1;
      list[wordEn].lastMistakeAt = Date.now();
    }
    try {
      localStorage.setItem(STORAGE_KEYS.MISTAKEN_WORDS, JSON.stringify(list));
    } catch {
      // Ignore
    }
  }

  public clearMistakes(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.MISTAKEN_WORDS);
    } catch {
      // Ignore
    }
  }

  public getSchulteBestTime(): number | null {
    const val = localStorage.getItem(STORAGE_KEYS.SCHULTE_BEST_TIME);
    return val ? parseFloat(val) : null;
  }

  public saveSchulteBestTime(timeMs: number): void {
    const current = this.getSchulteBestTime();
    if (!current || timeMs < current) {
      localStorage.setItem(STORAGE_KEYS.SCHULTE_BEST_TIME, timeMs.toString());
    }
  }

  public getSoundSetting(): boolean {
    const item = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return item !== 'false';
  }

  public setSoundSetting(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled ? 'true' : 'false');
  }

  public getSpeechSetting(): boolean {
    const item = localStorage.getItem(STORAGE_KEYS.SPEECH_ENABLED);
    return item !== 'false';
  }

  public setSpeechSetting(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEYS.SPEECH_ENABLED, enabled ? 'true' : 'false');
  }

  public getGlobalCategory(): string {
    return localStorage.getItem(STORAGE_KEYS.GLOBAL_CATEGORY) || 'mixed';
  }

  public setGlobalCategory(cat: string): void {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_CATEGORY, cat);
  }
}

export const storage = new StorageService();
