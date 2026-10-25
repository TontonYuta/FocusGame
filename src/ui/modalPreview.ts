import { VocabItem } from '../data/vocabulary';
import { audio } from '../services/audio';
import { storage } from '../services/storage';

let onStartCallback: (() => void) | null = null;

export function initModalPreview() {
  const modal = document.getElementById('modalVocabPreview');
  const btnStart = document.getElementById('btnConfirmStartAfterPreview');
  const btnClose = document.getElementById('btnCloseVocabPreview');
  const toggleSetting = document.getElementById('chkAutoPreviewSetting') as HTMLInputElement | null;

  if (toggleSetting) {
    toggleSetting.checked = storage.getPreviewVocabSetting();
    toggleSetting.addEventListener('change', () => {
      storage.setPreviewVocabSetting(toggleSetting.checked);
    });
  }

  btnStart?.addEventListener('click', () => {
    modal?.classList.add('hidden');
    if (onStartCallback) {
      const cb = onStartCallback;
      onStartCallback = null;
      cb();
    }
  });

  btnClose?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });
}

export function showVocabPreviewDeck(
  words: VocabItem[],
  modeTitle: string,
  onStart: () => void
) {
  const modal = document.getElementById('modalVocabPreview');
  const listEl = document.getElementById('previewVocabList');
  const titleEl = document.getElementById('previewDeckTitle');
  const countEl = document.getElementById('previewDeckCount');
  const toggleSetting = document.getElementById('chkAutoPreviewSetting') as HTMLInputElement | null;

  if (toggleSetting) {
    toggleSetting.checked = storage.getPreviewVocabSetting();
  }

  if (titleEl) titleEl.innerText = modeTitle;
  if (countEl) countEl.innerText = `${words.length} Từ Vựng`;

  onStartCallback = onStart;

  if (listEl) {
    listEl.innerHTML = words.map(item => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-white tracking-wide">${item.en}</span>
            <span class="text-[11px] font-mono text-cyan-400">${item.ipa}</span>
            <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300">${item.level}</span>
          </div>
          <div class="text-xs text-slate-300 mt-0.5">${item.vi}</div>
        </div>
        <button type="button" class="btn-preview-speak w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-cyan-400 flex items-center justify-center transition active:scale-95" data-word="${item.en}">
          🔊
        </button>
      </div>
    `).join('');

    listEl.querySelectorAll<HTMLButtonElement>('.btn-preview-speak').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = btn.dataset.word;
        if (w) audio.speakWord(w);
      });
    });
  }

  modal?.classList.remove('hidden');
}
