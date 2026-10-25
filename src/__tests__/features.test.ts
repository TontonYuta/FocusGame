import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { isVersionGreater } from '../services/updater';
import { storage } from '../services/storage';
import { getAllVocabulary, getVocabPoolByLevel } from '../data/vocabulary';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

beforeAll(() => {
  if (typeof globalThis.localStorage === 'undefined') {
    (globalThis as any).localStorage = new LocalStorageMock();
  }
});

describe('In-App Updater Semver Comparison', () => {
  it('correctly detects newer versions', () => {
    expect(isVersionGreater('1.1.0', '1.0.0')).toBe(true);
    expect(isVersionGreater('1.0.1', '1.0.0')).toBe(true);
    expect(isVersionGreater('2.0.0', '1.9.9')).toBe(true);
    expect(isVersionGreater('1.2.3', '1.2.2')).toBe(true);
  });

  it('correctly detects current or older versions', () => {
    expect(isVersionGreater('1.0.0', '1.0.0')).toBe(false);
    expect(isVersionGreater('0.9.5', '1.0.0')).toBe(false);
    expect(isVersionGreater('1.0.0', '1.1.0')).toBe(false);
  });
});

describe('Custom Vocabulary & Storage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('manages custom vocabulary persistence', () => {
    expect(storage.getCustomVocab()).toHaveLength(0);

    const added = storage.addCustomVocab({
      en: 'mindfulness',
      vi: 'sự tỉnh thức',
      ipa: '/ˈmaɪndflnəs/'
    });

    expect(added.id).toContain('custom-');
    expect(added.en).toBe('mindfulness');

    const list = storage.getCustomVocab();
    expect(list).toHaveLength(1);
    expect(list[0].en).toBe('mindfulness');

    // Deletion
    storage.deleteCustomVocab(added.id);
    expect(storage.getCustomVocab()).toHaveLength(0);
  });

  it('merges custom vocabulary into global pool', () => {
    const baseCount = getAllVocabulary().length;

    storage.addCustomVocab({
      en: 'serendipity',
      vi: 'sự may mắn tình cờ',
      ipa: '/ˌserənˈdɪpəti/'
    });

    const updated = getAllVocabulary();
    expect(updated.length).toBe(baseCount + 1);
    expect(updated.some(v => v.en === 'serendipity')).toBe(true);

    const customPool = getVocabPoolByLevel('custom');
    expect(customPool.some(v => v.en === 'serendipity')).toBe(true);
  });

  it('persists pre-study preview setting', () => {
    expect(storage.getPreviewVocabSetting()).toBe(true); // Default true

    storage.setPreviewVocabSetting(false);
    expect(storage.getPreviewVocabSetting()).toBe(false);

    storage.setPreviewVocabSetting(true);
    expect(storage.getPreviewVocabSetting()).toBe(true);
  });
});
