import { checkAppUpdate, CURRENT_APP_VERSION, ReleaseInfo } from '../services/updater';

export function initModalUpdate() {
  const modal = document.getElementById('modalUpdate');
  const btnOpen = document.getElementById('btnCheckUpdate');
  const btnClose = document.getElementById('btnCloseUpdateModal');
  const updateDot = document.getElementById('updateDotBadge');

  const contentLoading = document.getElementById('updateLoadingState');
  const contentLatest = document.getElementById('updateLatestState');
  const contentAvailable = document.getElementById('updateAvailableState');
  const contentError = document.getElementById('updateErrorState');

  const txtCurrentVer = document.getElementById('updateCurrentVer');
  const txtNewVer = document.getElementById('updateNewVer');
  const txtReleaseNotes = document.getElementById('updateReleaseNotes');
  const btnDownloadApk = document.getElementById('btnDownloadApk') as HTMLAnchorElement | null;
  const txtErrorMsg = document.getElementById('updateErrorMessage');

  if (txtCurrentVer) txtCurrentVer.innerText = CURRENT_APP_VERSION;

  function setViewState(state: 'loading' | 'latest' | 'available' | 'error') {
    contentLoading?.classList.toggle('hidden', state !== 'loading');
    contentLatest?.classList.toggle('hidden', state !== 'latest');
    contentAvailable?.classList.toggle('hidden', state !== 'available');
    contentError?.classList.toggle('hidden', state !== 'error');
  }

  async function performCheck(showModal = true) {
    if (showModal) {
      modal?.classList.remove('hidden');
      setViewState('loading');
    }

    try {
      const info: ReleaseInfo = await checkAppUpdate();

      if (info.hasUpdate) {
        updateDot?.classList.remove('hidden');
        if (txtNewVer) txtNewVer.innerText = info.tagName;
        if (txtReleaseNotes) txtReleaseNotes.innerText = info.body || 'Bản cập nhật tối ưu hóa hiệu năng và cải tiến trải nghiệm.';
        if (btnDownloadApk) {
          btnDownloadApk.href = info.apkDownloadUrl;
          btnDownloadApk.target = '_blank';
        }
        if (showModal) setViewState('available');
      } else {
        updateDot?.classList.add('hidden');
        if (showModal) setViewState('latest');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ GitHub';
      if (txtErrorMsg) txtErrorMsg.innerText = msg;
      if (showModal) setViewState('error');
    }
  }

  btnOpen?.addEventListener('click', () => {
    performCheck(true);
  });

  btnClose?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  document.getElementById('btnRetryCheckUpdate')?.addEventListener('click', () => {
    performCheck(true);
  });

  // Background check once on launch without opening modal
  setTimeout(() => {
    performCheck(false);
  }, 2500);
}
