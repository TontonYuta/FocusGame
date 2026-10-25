import { checkAppUpdate, downloadWithProgress, CURRENT_APP_VERSION, ReleaseInfo } from '../services/updater';

export function initModalUpdate() {
  const modal = document.getElementById('modalUpdate');
  const btnOpen = document.getElementById('btnCheckUpdate');
  const btnClose = document.getElementById('btnCloseUpdateModal');
  const updateDot = document.getElementById('updateDotBadge');

  const contentLoading = document.getElementById('updateLoadingState');
  const contentLatest = document.getElementById('updateLatestState');
  const contentAvailable = document.getElementById('updateAvailableState');
  const contentError = document.getElementById('updateErrorState');
  const contentProgress = document.getElementById('updateProgressState');

  const txtCurrentVer = document.getElementById('updateCurrentVer');
  const txtNewVer = document.getElementById('updateNewVer');
  const txtReleaseNotes = document.getElementById('updateReleaseNotes');
  const btnDownloadApk = document.getElementById('btnDownloadApk') as HTMLAnchorElement | null;
  const btnDirectUpdate = document.getElementById('btnDirectUpdate');
  const txtErrorMsg = document.getElementById('updateErrorMessage');

  // Progress Elements
  const elProgressPercent = document.getElementById('updateProgressPercent');
  const elProgressBar = document.getElementById('updateProgressBar');
  const elProgressBytes = document.getElementById('updateProgressBytes');
  const elProgressStatus = document.getElementById('updateProgressStatus');
  const elProgressLabel = document.getElementById('updateProgressLabel');

  let activeReleaseInfo: ReleaseInfo | null = null;

  if (txtCurrentVer) txtCurrentVer.innerText = CURRENT_APP_VERSION;

  function setViewState(state: 'loading' | 'latest' | 'available' | 'error' | 'progress') {
    contentLoading?.classList.toggle('hidden', state !== 'loading');
    contentLatest?.classList.toggle('hidden', state !== 'latest');
    contentAvailable?.classList.toggle('hidden', state !== 'available');
    contentError?.classList.toggle('hidden', state !== 'error');
    contentProgress?.classList.toggle('hidden', state !== 'progress');
  }

  async function performCheck(showModal = true) {
    if (showModal) {
      modal?.classList.remove('hidden');
      setViewState('loading');
    }

    try {
      const info: ReleaseInfo = await checkAppUpdate();
      activeReleaseInfo = info;

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

  // Handle direct in-app update with live stream progress
  btnDirectUpdate?.addEventListener('click', async () => {
    if (!activeReleaseInfo) return;

    setViewState('progress');
    const targetUrl = activeReleaseInfo.bundleZipUrl || activeReleaseInfo.apkDownloadUrl;

    try {
      if (elProgressLabel) elProgressLabel.innerText = 'Đang tải bản cập nhật vào app...';
      if (elProgressStatus) elProgressStatus.innerText = 'Đang truyền dữ liệu...';

      const blob = await downloadWithProgress(targetUrl, (pct, loaded, total) => {
        if (elProgressPercent) elProgressPercent.innerText = `${pct}%`;
        if (elProgressBar) elProgressBar.style.width = `${pct}%`;
        
        const loadedMb = (loaded / (1024 * 1024)).toFixed(1);
        const totalMb = total > 0 ? (total / (1024 * 1024)).toFixed(1) : '?';
        if (elProgressBytes) elProgressBytes.innerText = `${loadedMb} MB / ${totalMb} MB`;
      });

      if (elProgressLabel) elProgressLabel.innerText = 'Tải hoàn tất! Đang kích hoạt...';
      if (elProgressStatus) elProgressStatus.innerText = 'Sẵn sàng khởi động';

      // If bundle ZIP or running in web view
      const isBundle = targetUrl.endsWith('.zip') || targetUrl.includes('bundle');
      if (isBundle) {
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        // Trigger direct install intent
        const objectUrl = URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = objectUrl;
        tempLink.download = `FocusGame-${activeReleaseInfo.tagName}.apk`;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        setTimeout(() => {
          if (elProgressLabel) elProgressLabel.innerText = 'Đã mở trình cài đặt APK hệ thống';
          if (elProgressStatus) elProgressStatus.innerText = 'Bấm "Cài đặt" trên cửa sổ Android';
        }, 800);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi trong quá trình tải trực tiếp';
      if (txtErrorMsg) txtErrorMsg.innerText = msg;
      setViewState('error');
    }
  });

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
