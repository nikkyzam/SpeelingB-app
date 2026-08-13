# Admins (grown-up accounts)

Admin status is determined by a **Firebase Auth custom claim** named `admin`.
The flag lives inside the user's signed ID token, so it is tamper-proof and is
checked in two places:

- **The app** (`AuthService`) reads `admin` from the token and sets
  `user.isAdmin`, which reveals the **Settings → Grown-up Tools** section.
- **Firestore security rules** (`firestore.rules`) allow admins to read/write
  any child's `users/{uid}` document (everyone else can only touch their own).

There is no "self-appoint" — the first admin must be designated manually. That's
the correct, secure design.

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
4. **They sign out and back in** (the token refreshes with the new claim; it can
   otherwise take up to ~1 hour). After re-login, the **Grown-up Tools** section
   appears in Settings.

## Deploy the security rules

The rules only take effect once deployed:
```bash
firebase deploy --only firestore:rules
```
(Requires the Firestore database to exist for project `spellingb-5ebae`.)

## How to verify

- Log in as a non-admin → no Grown-up Tools in Settings.
- Grant admin, re-login → Grown-up Tools (with the daily-word control) appears.
- With rules deployed, a non-admin cannot read/write another user's document.
