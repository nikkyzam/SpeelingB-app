# Admins (grown-up accounts)

Admin status is determined by a **Firebase Auth custom claim** named `admin`.
The flag lives inside the user's signed ID token, so it is tamper-proof and is
checked in two places:

- **The app** (`AuthService`) reads `admin` from the token on every auth state
  change and sets `user.isAdmin`, which reveals the **Settings → Grown-up
  Tools** section.
- **Firestore security rules** (`firestore.rules`) allow admins to read/write
  any child's `users/{uid}` document (everyone else can only touch their own).

There is no "self-appoint" — the first admin must be designated manually. That's
the correct, secure design.

### The claim is never written down

`isAdmin` lives in memory for the life of a page session and nowhere else. It is
stripped before anything durable is written and forced off on anything read back
(`src/services/auth/adminClaim.ts`), because a value in `localStorage` or in a
synced Firestore document is one a child could edit:

- the Zustand `user-storage` `partialize` strips it, and `merge` denies it;
- `UserContext` strips it from the legacy `user` key;
- `FirebaseSync` strips it on upload and denies it on download.

Regression tests live in `__tests__/unit/services/auth/AdminClaim.test.ts`. If
you add another place the user object is persisted or transmitted, it must pass
through those helpers too.

## Make someone an admin

1. **They must sign up first** (an account/UID has to exist).
2. **Get a service-account key** (once):
   Firebase Console → ⚙️ Project settings → **Service accounts** →
   **Generate new private key**. Save it as `serviceAccountKey.json` in the
   project root. **Never commit it** — it's gitignored.
3. **Run the script:**
   ```bash
   node scripts/set-admin.mjs someone@example.com          # grant admin
   node scripts/set-admin.mjs someone@example.com --revoke # remove admin
   ```
   The same key is used by `scripts/delete-user.mjs` (see *Removing a child*).
4. **They sign out and back in** (the token refreshes with the new claim; it can
   otherwise take up to ~1 hour). After re-login, the **Grown-up Tools** section
   appears in Settings.

## What the console can do

**Settings → Grown-up Tools** lists every child with, for each one:

| | |
| --- | --- |
| At a glance | words learnt, words spelled right, day streak, today against their goal, when they last played |
| Word levels | Which Bee levels their daily words come from — one, or a blend. Picking more than one interleaves them in proportion, so every group of five mixes rather than working through One Bee for a year first. Changing it restarts them at the first group, because the blend changes the word order. Three Bee is shown but disabled: no Three Bee words are loaded yet. |
| Daily words | 3–20 new words a day |
| Stars ⭐ | set the balance directly; totals stay coherent (total = left + already spent) |
| Games | open every game for today without the quiz, or lock them again |
| Start today again | clears today's words, quiz and game unlock; everything learnt before today is untouched |
| Recent changes | who changed what, and when |
| Remove | erase everything about a child and lock them out — see below |

Level, daily words and stars are drafted and written together with **Save
changes**, and reach the child the next time they sign in. The two day controls
write immediately — that is the point of them.

Every write leaves a line in that child's `adminLog`, readable under **Recent
changes**. Stars buy real-world rewards, so a balance that jumps should be
answerable.

## Removing a child

**Settings → Grown-up Tools → Remove [name]…** offers a copy of their data to
download, then asks you to type their name. It then erases their words, stars,
badges and streak, and signs them out on every device.

It does **not** delete their Firebase Auth login. The browser SDK can only
delete the account it is signed in as — removing somebody else's login needs the
Admin SDK. So the in-app removal writes a *tombstone* on their document instead
of deleting it outright, which does two necessary jobs:

- a device that is still signed in would otherwise re-upload its local copy on
  the next sync and quietly resurrect the child;
- signing in again would otherwise create a fresh, blank account.

`FirebaseSync` sees the tombstone, clears that device completely and signs them
out. From the family's point of view the child is gone. The login is an empty
shell that can do nothing.

To take the login away for good:

```bash
node scripts/delete-user.mjs someone@example.com --dry-run  # show what would go
node scripts/delete-user.mjs someone@example.com            # back up, ask, delete
```

It writes `<email>-backup.json` first (pass `--no-backup` to skip) and asks you
to retype the email. It deletes the Firestore document *before* the login, so a
failure part-way through never leaves data nobody can reach.

You cannot remove your own account from the console — that control is disabled
for the signed-in grown-up. Use the script if you really mean it.

**One caveat while the app is used by more than one family:** any admin can
remove any child, not only their own (see the access audit's F-06). Scope the
rules to a household before that happens.

## Deploy the security rules

The rules only take effect once deployed:
```bash
firebase deploy --only firestore:rules
```
(Requires the Firestore database to exist for project `spellingb-5ebae`.)

## How to verify

- Log in as a non-admin → no Grown-up Tools in Settings.
- Grant admin, re-login → Grown-up Tools appears with the full console.
- Forge the flag as a non-admin and reload — the section must stay hidden:
  ```js
  const s = JSON.parse(localStorage.getItem('user-storage'))
  s.state.user.isAdmin = true
  localStorage.setItem('user-storage', JSON.stringify(s))
  ```
- With rules deployed, a non-admin cannot read/write another user's document.
