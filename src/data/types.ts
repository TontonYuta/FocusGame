export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface VocabItem {
  id: string;
  en: string;
  vi: string;
  level: CEFRLevel;
  cat: 'daily' | 'toeic' | 'academic' | 'tech';
  ipa: string;
  hint: string;
}
