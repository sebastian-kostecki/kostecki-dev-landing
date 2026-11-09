// Pure helpers for the archive proof block. Does not import src/generated/archive.json,
// so tests run without the build script. The URL pattern is intentionally duplicated in
// scripts/lib/archive-count.mjs (src/ does not import .mjs: no allowJs in the app tsconfigs).

/** URL of a folder in the `context/archive` of one of the two public repos. */
export const ARCHIVE_FOLDER_URL =
  /^https:\/\/github\.com\/sebastian-kostecki\/(?:root-keeper|household-treasurer)\/tree\/main\/context\/archive\/[\w.-]+$/

/** Last path segment of the folder URL without the `YYYY-MM-DD-` prefix. */
export function archiveFolderLabel(url: string): string {
  const folder = url.split('/').pop() ?? url
  return folder.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}
