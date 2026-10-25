/**
 * Service to check and manage in-app version updates via GitHub Releases API
 */

export interface ReleaseInfo {
  tagName: string;
  name: string;
  body: string;
  publishedAt: string;
  apkDownloadUrl: string;
  htmlUrl: string;
  hasUpdate: boolean;
  currentVersion: string;
}

export const CURRENT_APP_VERSION = 'v1.0.0';

export async function checkAppUpdate(): Promise<ReleaseInfo> {
  const repo = 'TontonYuta/FocusGame';
  const url = `https://api.github.com/repos/${repo}/releases/latest`;

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!res.ok) {
    throw new Error(`Không thể kết nối đến máy chủ cập nhật (${res.status})`);
  }

  const data = await res.json();
  const latestTag: string = data.tag_name || '';

  // Find direct .apk download asset if available
  let apkUrl = data.html_url;
  if (Array.isArray(data.assets)) {
    const apkAsset = data.assets.find((a: { name: string; browser_download_url: string }) =>
      a.name.toLowerCase().endsWith('.apk')
    );
    if (apkAsset && apkAsset.browser_download_url) {
      apkUrl = apkAsset.browser_download_url;
    }
  }

  const cleanCurrent = CURRENT_APP_VERSION.replace(/^v/, '').trim();
  const cleanLatest = latestTag.replace(/^v/, '').trim();

  const hasUpdate = cleanLatest !== '' && isVersionGreater(cleanLatest, cleanCurrent);

  return {
    tagName: latestTag,
    name: data.name || latestTag,
    body: data.body || '',
    publishedAt: data.published_at || '',
    apkDownloadUrl: apkUrl,
    htmlUrl: data.html_url || `https://github.com/${repo}/releases`,
    hasUpdate,
    currentVersion: CURRENT_APP_VERSION
  };
}

/**
 * Semver comparison: returns true if latest > current
 */
export function isVersionGreater(latest: string, current: string): boolean {
  const lParts = latest.split('.').map(n => parseInt(n, 10) || 0);
  const cParts = current.split('.').map(n => parseInt(n, 10) || 0);

  const len = Math.max(lParts.length, cParts.length);
  for (let i = 0; i < len; i++) {
    const l = lParts[i] || 0;
    const c = cParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}
