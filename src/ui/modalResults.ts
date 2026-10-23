import { MatchStats } from '../game/types';
import { drawRadarChart } from '../components/radarChart';
import { audio } from '../services/audio';

export interface ModalResultsCallbacks {
  onMenu: () => void;
  onRetry: () => void;
  onNext: () => void;
}

export function initModalResults(callbacks: ModalResultsCallbacks) {
  const modal = document.getElementById('modalAnalytics');
  document.getElementById('btnAnalyticsMenu')?.addEventListener('click', () => {
    modal?.classList.add('hidden');
    callbacks.onMenu();
  });
  document.getElementById('btnAnalyticsRetry')?.addEventListener('click', () => {
    modal?.classList.add('hidden');
    callbacks.onRetry();
  });
  document.getElementById('btnAnalyticsNext')?.addEventListener('click', () => {
    modal?.classList.add('hidden');
    callbacks.onNext();
  });
}

export function showMatchResults(stats: MatchStats) {
  const modal = document.getElementById('modalAnalytics');
  if (!modal) return;

  const titleEl = document.getElementById('analyticsTitle');
  const subEl = document.getElementById('analyticsSubtitle');
  const starsEl = document.getElementById('analyticsStars');
  const statScore = document.getElementById('statTotalScore');
  const statTime = document.getElementById('statClearTime');
  const statAcc = document.getElementById('statAccuracy');
  const statRx = document.getElementById('statAvgReflex');

  if (titleEl) titleEl.innerText = stats.isWin ? 'HOÀN THÀNH!' : 'CHƯA ĐẠT';
  if (subEl) subEl.innerText = stats.isWin ? `Đã hoàn thành ${stats.levelName}` : 'Thời gian đã hết hoặc chạm bom. Hãy thử lại!';

  if (statScore) statScore.innerText = String(stats.score);
  if (statTime) statTime.innerText = `${stats.timeSpentSec}s`;
  if (statAcc) statAcc.innerText = `${stats.accuracy}%`;
  if (statRx) statRx.innerText = `${stats.avgReflexMs}ms`;

  if (starsEl) {
    starsEl.innerHTML = Array.from({ length: 3 }, (_, i) => {
      const active = i < stats.stars;
      const fill = active ? 'text-amber-400 fill-amber-400' : 'text-slate-700 fill-slate-700';
      return `<svg class="w-7 h-7 ${fill}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }).join('');
  }

  // Draw Radar
  const canvas = document.getElementById('radarChartCanvas') as HTMLCanvasElement | null;
  if (canvas) {
    drawRadarChart(canvas, {
      vision: stats.visionScore,
      math: stats.mathScore,
      vocab: stats.vocabScore,
      reflex: stats.reflexScore
    });
  }
  const sVision = document.getElementById('radarScoreVision');
  const sMath = document.getElementById('radarScoreMath');
  const sVocab = document.getElementById('radarScoreVocab');
  const sReflex = document.getElementById('radarScoreReflex');
  if (sVision) sVision.innerText = String(stats.visionScore);
  if (sMath) sMath.innerText = String(stats.mathScore);
  if (sVocab) sVocab.innerText = String(stats.vocabScore);
  if (sReflex) sReflex.innerText = String(stats.reflexScore);

  // Words List
  const wordsContainer = document.getElementById('analyticsWordsList');
  if (wordsContainer) {
    if (stats.reviewedWords.length === 0) {
      wordsContainer.innerHTML = '<div class="text-[11px] text-slate-500 italic py-1">Không có từ vựng trong màn này</div>';
    } else {
      wordsContainer.innerHTML = stats.reviewedWords.map(item => `
        <div class="flex items-center justify-between p-2 rounded-xl bg-slate-950 border ${item.wasWrong ? 'border-rose-900/60' : 'border-slate-800'}">
          <div>
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <span>${item.vocab.en}</span>
              <span class="text-[10px] font-mono text-slate-400">${item.vocab.ipa}</span>
            </div>
            <div class="text-[11px] text-slate-400">${item.vocab.vi}</div>
          </div>
          <button type="button" class="btn-speak-word w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-cyan-400" data-word="${item.vocab.en}">
            🔊
          </button>
        </div>
      `).join('');

      wordsContainer.querySelectorAll<HTMLButtonElement>('.btn-speak-word').forEach(btn => {
        btn.addEventListener('click', () => {
          const w = btn.dataset.word;
          if (w) audio.speakWord(w);
        });
      });
    }
  }

  modal.classList.remove('hidden');
}
