# AHP Studio — SSO Integration with Decision Labs

**Version:** 1.2  
**Date:** 2026-03-23  

## Overview

This document specifies how AHP Studio (https://ahpstudio.com) integrates with Decision Labs via Single Sign-On (SSO), allowing students and professors to launch AHP Studio from the Decision Labs dashboard without a separate login.

## Architecture

```
┌──────────────────┐         ┌──────────────────┐
│   Decision Labs  │         │    AHP Studio     │
│   (Next.js)      │         │  (Express.js)     │
│                  │         │                   │
│  1. User clicks  │  JWT    │  3. /auth/sso     │
│     "Launch"     │────────►│     verifies JWT  │
│                  │ (5 min) │     with public   │
│  2. POST /api/   │  RS256  │     key, then     │
│     tools/:id/   │         │     provisions    │
│     launch       │         │     user & sets   │
│  → signs JWT     │         │     session       │
│    with private  │         │                   │
│    key           │         │  4. Redirect to   │
│                  │         │     /dashboard    │
└──────────────────┘         └──────────────────┘
```

Tokens are signed with **RS256** (RSA asymmetric). Decision Labs holds the **private key** and signs tokens. AHP Studio holds only the **public key** and verifies tokens — it cannot forge tokens.

## Key Generation

Generate the RSA key pair with `ssh-keygen`:

```bash
# 1. Generate 2048-bit RSA key pair
ssh-keygen -t rsa -b 2048 -f ahp-studio-sso -N "" -C "decisionlab-ahp-sso"

# 2. Fix permissions and convert private key to PEM format
chmod 600 ahp-studio-sso
ssh-keygen -p -m pem -f ahp-studio-sso -N "" -P ""

# 3. Export public key in PEM format (for JWT verification)
ssh-keygen -e -m pkcs8 -f ahp-studio-sso.pub > ahp-studio-sso-public.pem
```

This produces two files:
- `ahp-studio-sso` — **Private key** (PEM/PKCS8) → Decision Labs env var
- `ahp-studio-sso.pub` — **Public key** (OpenSSH format, `ssh-rsa ...`) → AHP Studio env var

## Decision Labs Side (Already Implemented)

### Token Generation

When a user clicks "Launch" on AHP Studio, Decision Labs:

1. Calls `POST /api/tools/:id/launch`
2. Signs a **5-minute RS256 JWT** using the private key from `TOOL_SSO_PRIVATE_KEY_AHP_STUDIO`
3. Redirects user to `https://ahpstudio.com/auth/sso?token=<JWT>`

### JWT Payload

```json
{
  "userId": "uuid-from-decisionlab",
  "email": "student@university.edu",
  "role": "STUDENT",
  "tool": "ahp-studio",
  "firstName": "Jane",
  "lastName": "Doe",
  "iat": 1711152000,
  "exp": 1711152300
}
```

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Decision Labs user UUID |
| `email` | string | User's email (unique identifier for matching) |
| `role` | string | `ADMIN`, `PROFESSOR`, or `STUDENT` |
| `tool` | string | Always `"ahp-studio"` |
| `firstName` | string | User's first name |
| `lastName` | string | User's last name |
| `iat` | number | Issued-at timestamp |
| `exp` | number | Expiry timestamp (iat + 5 minutes) |

### Environment Variable

Decision Labs requires this environment variable containing the **PEM private key** (newlines replaced with literal `\n`):

```
TOOL_SSO_PRIVATE_KEY_AHP_STUDIO="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----"
```

To convert the key file to a single-line env var value:

```bash
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' ahp-studio-sso | sed 's/\\n$//'
```

---

## AHP Studio Side (To Implement)

### 1. Environment Variable

Add the **OpenSSH public key** to AHP Studio's environment. The value is the contents of `ahp-studio-sso.pub` (single line, starts with `ssh-rsa`):

```
DECISIONLAB_SSO_PUBLIC_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB... decisionlab-ahp-sso"
```

This format satisfies DigitalOcean App Platform's key validation (must begin with `ssh-rsa`, `ecdsa-sha2-*`, `ssh-ed25519`, etc.).

### 2. SSO Endpoint

Create a `GET /auth/sso` route in the AHP Studio Express backend.

**Route:** `GET /auth/sso?token=<JWT>`

#### Implementation Reference

```javascript
// server/routes/auth.js (or wherever auth routes are defined)
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require('bcryptjs');

// Convert OpenSSH public key (ssh-rsa ...) to a KeyObject for JWT verification
const DECISIONLAB_SSO_PUBLIC_KEY = process.env.DECISIONLAB_SSO_PUBLIC_KEY
  ? crypto.createPublicKey({
      key: Buffer.from(process.env.DECISIONLAB_SSO_PUBLIC_KEY),
      format: 'openssh',
    })
  : null;

router.get('/auth/sso', async (req, res) => {
  const { token } = req.query;

  if (!token || !DECISIONLAB_SSO_PUBLIC_KEY) {
    return res.redirect('/login');
  }

  // 1. Verify the RS256 JWT with the public key
  let payload;
  try {
    payload = jwt.verify(token, DECISIONLAB_SSO_PUBLIC_KEY, {
      algorithms: ['RS256'],
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.warn('SSO token expired');
    } else {
      console.warn('Invalid SSO token:', err.message);
    }
    return res.redirect('/login');
  }

  // 2. Validate required fields
  const { email, role, firstName, lastName } = payload;
  if (!email) {
    return res.redirect('/login');
  }

  // 3. Find or create user
  let user = await findUserByEmail(email);

  if (!user) {
    // Provision a new SSO user
    const userId = uuidv4();
    const username = email.split('@')[0];
    // Map Decision Labs roles → AHP Studio roles
    const ahpRole = (role === 'ADMIN' || role === 'PROFESSOR') ? 'admin' : 'user';

    user = {
      id: userId,
      username: username,
      email: email,
      firstName: firstName || username,
      lastName: lastName || '',
      role: ahpRole,
      passwordHash: await bcryptjs.hash(uuidv4(), 12), // random; SSO users don't log in with password
      ssoProvider: 'decisionlab',
      createdAt: new Date().toISOString(),
    };

    await saveUser(user);
  }

  // 4. Create session (existing JWT/cookie mechanism)
  const sessionToken = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.cookie('token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  // 5. Redirect to dashboard
  const redirectUrl = user.role === 'admin' ? '/admin' : '/dashboard';
  return res.redirect(redirectUrl);
});
```

### 3. Role Mapping

| Decision Labs Role | AHP Studio Role |
|-------------------|-----------------|
| `ADMIN` | `admin` |
| `PROFESSOR` | `admin` |
| `STUDENT` | `user` |

Professors get admin access in AHP Studio so they can manage decision problems, view participant results, and generate reports for their students.

### 4. User Provisioning Rules

- **Match by email** (case-insensitive) — if a user with that email already exists, log them in
- **New users** — create with `ssoProvider: 'decisionlab'` flag to distinguish from locally-created accounts
- **No password needed** — SSO users authenticate via token; generate a random password hash
- **Name fields** — use `firstName` and `lastName` from the JWT payload

### 5. Security Considerations

- **Asymmetric signing:** AHP Studio only has the public key — it can verify tokens but cannot forge them
- **Token expiry:** Tokens expire after 5 minutes — reject expired tokens
- **Algorithm restriction:** Only accept `RS256` — specify `algorithms: ['RS256']` in verification to prevent algorithm confusion attacks
- **One-time use (recommended):** Consider tracking used token `jti` or `iat` values to prevent replay within the 5-minute window
- **HTTPS only:** The SSO endpoint must only be accessed over HTTPS in production
- **Key rotation:** Generate a new key pair and update both sides simultaneously; the private key never leaves Decision Labs

---

## Testing

### Manual Testing

1. Set the environment variables:
   - Decision Labs: `TOOL_SSO_PRIVATE_KEY_AHP_STUDIO` (PEM private key, `\n`-encoded)
   - AHP Studio: `DECISIONLAB_SSO_PUBLIC_KEY` (OpenSSH public key from `ahp-studio-sso.pub`)

2. Log into Decision Labs as a student enrolled in a course with AHP Studio assigned

3. Click "Launch" on the AHP Studio tool card

4. Verify:
   - Redirected to `https://ahpstudio.com/auth/sso?token=...`
   - Automatically logged into AHP Studio dashboard
   - User account created/matched by email
   - Correct role assigned

### Edge Cases to Test

- Expired token (wait >5 minutes) → redirects to AHP Studio login
- Invalid/tampered token → redirects to AHP Studio login
- Missing email in payload → redirects to AHP Studio login
- Existing user with same email → logs in (doesn't create duplicate)
- Professor role → gets admin access in AHP Studio

---

## Deployment Checklist

- [ ] Generate RSA key pair: `ssh-keygen -t rsa -b 2048 -f ahp-studio-sso -N "" -C "decisionlab-ahp-sso"`
- [ ] Convert private key to PEM: `chmod 600 ahp-studio-sso && ssh-keygen -p -m pem -f ahp-studio-sso -N "" -P ""`
- [ ] Set `TOOL_SSO_PRIVATE_KEY_AHP_STUDIO` in Decision Labs environment (PEM private key, `\n`-encoded)
- [ ] Set `DECISIONLAB_SSO_PUBLIC_KEY` in AHP Studio environment (OpenSSH public key from `ahp-studio-sso.pub`)
- [ ] Implement `GET /auth/sso` endpoint in AHP Studio
- [ ] Deploy AHP Studio with SSO endpoint
- [ ] Test SSO flow end-to-end in production
- [ ] Store the OpenSSH public key (`ahp-studio-sso.pub`) securely for key management
- [ ] **Delete the private key file** from disk after setting the env var — do not commit it
