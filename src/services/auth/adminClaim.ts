/**
 * Admin status is a claim on the Firebase ID token, not a property of the user.
 *
 * The token is signed by Firebase and re-read on every auth state change, so it
 * cannot be forged. The moment we copy that answer into anywhere the browser
 * can write — localStorage, a synced Firestore document — it stops being a
 * claim and becomes a wish. A child with a console could grant it to themselves
 * and the grown-up tools would appear.
 *
 * So: `isAdmin` lives in memory for the life of a page session and nowhere
 * else. Everything that writes the user object somewhere durable passes it
 * through here first.
 */

/** Anything shaped like our stored user. */
type MaybeUser = { isAdmin?: boolean } | null | undefined

/** A copy of `user` with the admin claim removed. Safe to persist or upload. */
export const withoutAdminClaim = <T extends MaybeUser>(user: T): T => {
  if (!user) return user
  const { isAdmin: _dropped, ...rest } = user as Record<string, unknown> & { isAdmin?: boolean }
  return rest as T
}

/**
 * A copy of `user` with the admin claim forced off — for data arriving FROM
 * storage or the server, where a `true` may have been planted. The real value
 * is put back by AuthService once the ID token has been read.
 */
export const withAdminClaimDenied = <T extends MaybeUser>(user: T): T => {
  if (!user) return user
  return { ...(user as object), isAdmin: false } as T
}
