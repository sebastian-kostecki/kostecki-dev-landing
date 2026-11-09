/** Returns the host of `url`; on an invalid URL logs the error and falls back to the input. */
export function hostOf(url: string): string {
  try {
    return new URL(url).host
  } catch (error) {
    console.error(`hostOf: invalid link "${url}"`, error)
    return url
  }
}

export function isRepo(url: string): boolean {
  return hostOf(url) === 'github.com'
}
