/**
 * Attributes that stop a device from spelling the word for the child.
 *
 * On an iPad this is not a nicety: the keyboard's autocorrect will silently
 * fix a misspelling as the child types, and the predictive bar offers the
 * finished word above the keys. A spelling test where the device spells it is
 * not a spelling test.
 *
 * `autoCorrect` is the one that matters most and is Safari-specific — it is
 * missing from most tutorials, which is why it was missing here.
 *
 * Spread these onto every input where a child is being asked to spell:
 *
 *     <input {...NO_SPELLING_HELP} value={...} />
 *
 * A test scans the source and fails if a spelling input is missing them.
 */
export const NO_SPELLING_HELP = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
  // Keeps password managers and browser autofill out of a child's answer box.
  'data-lpignore': 'true',
  'data-form-type': 'other',
} as const
