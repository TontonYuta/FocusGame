import { VOCABULARY_LIST, VocabItem, CEFRLevel, getVocabPoolByLevel } from '../data/vocabulary';
import { storage } from '../services/storage';
import { audio } from '../services/audio';

export function initModalNotebook() {
  const modal = document.getElementById('modalNotebook');
  const btnOpen = document.getElementById('btnOpenNotebook');
  const btnClose = document.getElementById('btnCloseNotebook');
  const listContainer = document.getElementById('notebookListContainer');
  const searchInput = document.getElementById('searchVocabInput') as HTMLInputElement | null;
  const btnClearMistakes = document.getElementById('btnClearMistakes');
  const badgeCount = document.getElementById('mistakeBadgeCount');
  const countTag = document.getElementById('notebookMistakeCountTag');

  let currentFilter = 'all';

  function updateBadge() {
    const mistakes = storage.getMistakenWords();
    const count = Object.keys(mistakes).length;
    if (badgeCount) {
      badgeCount.innerText = String(count);
      if (count > 0) badgeCount.classList.remove('hidden');
      else badgeCount.classList.add('hidden');
    }
    if (countTag) countTag.innerText = String(count);
  }

  function renderList() {
    if (!listContainer) return;
    const query = (searchInput?.value || '').trim().toLowerCase();
    const mistakes = storage.getMistakenWords();

    let pool: VocabItem[] = [];
    if (currentFilter === 'all') {
      pool = VOCABULARY_LIST;
    } else if (currentFilter === 'mistakes') {
      pool = VOCABULARY_LIST.filter(v => mistakes[v.en] && mistakes[v.en].count > 0);
    } else {
      pool = getVocabPoolByLevel(currentFilter as CEFRLevel);
    }

    if (query) {
      pool = pool.filter(v => v.en.toLowerCase().includes(query) || v.vi.toLowerCase().includes(query));
    }

    if (pool.length === 0) {
      listContainer.innerHTML = '<div class="text-xs text-slate-500 text-center py-8">Không có từ vựng phù hợp</div>';
      return;
    }

    listContainer.innerHTML = pool.map(item => {
      const errCount = mistakes[item.en]?.count || 0;
      return `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-white">${item.en}</span>
              <span class="text-[10px] font-mono text-cyan-400">${item.ipa}</span>
              <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300">${item.level}</span>
              ${errCount > 0 ? `<span class="text-[9px] px-1 py-0.2 bg-rose-950 text-rose-300 border border-rose-800 rounded font-bold">Sai ${errCount}x</span>` : ''}
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">${item.vi}</div>
          </div>
          <button type="button" class="btn-nb-speak w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-cyan-400 flex items-center justify-center transition active:scale-95" data-word="${item.en}">
            🔊
          </button>
        </div>
      `;
    }).join('');

    listContainer.querySelectorAll<HTMLButtonElement>('.btn-nb-speak').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = btn.dataset.word;
        if (w) audio.speakWord(w);
      });
    });
  }

  btnOpen?.addEventListener('click', () => {
    updateBadge();
    renderList();
    modal?.classList.remove('hidden');
  });

  btnClose?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  searchInput?.addEventListener('input', () => renderList());

  document.querySelectorAll<HTMLButtonElement>('.btnNotebookTab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btnNotebookTab').forEach(b => {
        b.className = 'btnNotebookTab px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white transition shrink-0 active:scale-95';
      });
      btn.className = 'btnNotebookTab px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950 transition shrink-0 active:scale-95';
      currentFilter = btn.dataset.filter || 'all';
      renderList();
    });
  });

  btnClearMistakes?.addEventListener('click', () => {
    storage.clearMistakes();
    updateBadge();
    renderList();
  });

  updateBadge();
}
