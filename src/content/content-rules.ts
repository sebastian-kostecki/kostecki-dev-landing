/** Stack names whose version numbers may appear in copy (e.g. "Laravel 13", "PHP 8.5"). */
const ALLOWED_VERSIONED = [
  'PHP',
  'Laravel',
  'React',
  'Vue',
  'Vuetify',
  'TypeScript',
  'Larastan',
  'Inertia',
]

/** Whole words that contain digits but are not scale claims. */
const ALLOWED_TERMS = ['e2e']

const ALLOWED_VERSION = new RegExp(`\\b(?:${ALLOWED_VERSIONED.join('|')}) \\d+(?:\\.\\d+)?`, 'gi')
const ALLOWED_TERM = new RegExp(`\\b(?:${ALLOWED_TERMS.join('|')})\\b`, 'gi')

/**
 * Returns the number-like fragments in `text` that make a scale claim
 * ("14 decyzji", "130+", "ponad 40"). Stack versions are ignored.
 * An empty array means the text is clean.
 */
export function scaleLiterals(text: string): string[] {
  const stripped = text.replace(ALLOWED_VERSION, ' ').replace(ALLOWED_TERM, ' ')
  return stripped.match(/\d+(?:[.,]\d+)*\+?/g) ?? []
}
