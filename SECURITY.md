# Security Policy

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Use GitHub's built-in private reporting feature instead:

1. Go to the [Security tab](../../security) of this repository.
2. Click **"Report a vulnerability"**.
3. Fill in the details. A maintainer will respond within 7 days.

This applies to any security issue affecting the indexer API, the documentation
site, or this repository's CI/CD configuration.

The documentation site also publishes a machine-readable contact at
`/.well-known/security.txt` (RFC 9116). It points to the same private reporting
page above.

## Reporting a docs-site vulnerability

The points above cover the indexer API and this repository generally; this
section calls out what is specific to the documentation site (`docs/`, the
Next.js app deployed from this repo). Use the same private-reporting process
(the [Security tab](../../security) -> "Report a vulnerability") for issues
such as:

- **Cross-site scripting (XSS) via MDX content.** The docs are authored as
  MDX and rendered server-side; a vulnerability that lets untrusted input
  reach the rendered page as executable script or markup (rather than
  escaped text) is in scope, even though all current MDX content is
  first-party and maintainer-authored.
- **Vulnerable dependencies in `docs/package.json`.** A known-exploitable
  vulnerability in the docs site's Next.js/React/MDX toolchain or its other
  npm dependencies, where the affected code path is actually reachable from
  the deployed site.
- **Build or deployment misconfiguration** that exposes source maps,
  environment values, or other data not meant to be public from the deployed
  docs site.

This is distinct from vulnerabilities in the indexer API (`api/`) or the
Soroban smart contracts, which are covered under "Scope" above -- please
still report docs-site issues through the same private channel rather than a
public issue, so a fix can ship before details are public.

## Non-security bugs

Bugs in API behaviour that do not have a security impact (wrong data, missing
fields, incorrect calculations) should be reported via the normal
[issue templates](../../issues/new/choose).

## Scope

This repository hosts:

- `api/` — the Rust/Axum indexer (maintainer-only, see [CONTRIBUTING.md](CONTRIBUTING.md))
- `docs/` — the Next.js documentation site

If the vulnerability relates to the Soroban smart contracts, please report it
in the [`stellar-stream-hive-contract`](https://github.com/Stellar-Hive/stellar-stream-hive-contract)
repository using the same private-reporting process.
