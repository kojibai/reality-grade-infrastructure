# Disclosure v1.3.0 release qualification

Disclosure 1.3.0 accompanies product 129.5.0. `release/source.json` identifies the canonical Receiz tag and its exact commit/tree, the standalone verifier commit, and the complete 16 tagged release-family files captured in `release/evidence/receiz-v129.5.0-source.json`. The product-history tag field is the product release label required by the existing disclosure schema; it does not assert a Git tag in the standalone repository.

The complete previous owner-sealed 1.2.0 repository tree is retained under `release/history/v1.2.0`, including every file in its signed inventory. Earlier disclosure proofs and their exact bytes remain available. The inherited v127 law registry, census, catalog and captured endpoint evidence keep their original scope.

## Qualification and signing sequence

1. Install the locked published SDK with `npm ci --ignore-scripts`.
2. Run `npm test` and `npm run conformance:sdk`. The tests verify historical owner proofs, source inventories, current release coordinates and refusal controls. The captured current SDK result is `release/evidence/sdk-conformance-v129.5.0.json`.
3. Commit the disclosure candidate cleanly. The existing designated-owner signer binds that candidate commit/tree and every inventory file; it uses the already-held local governance Identity Seal. No signing service, new root or replacement owner is introduced.
4. Add the resulting `release/attestation.json` in an attestation-only successor commit. Run `npm run verify:release` to verify the current owner proof, source chain and exact disclosure inventory offline. A missing, changed or invalid proof is a refusal, not a qualified release.

The attestation is the release evidence. This document describes the sequence and cannot substitute for proof verification. Private identity bytes and passphrases are excluded from the public inventory. Existing `GOVERNANCE_IDENTITY_FILE` and optional `GOVERNANCE_IDENTITY_PASSPHRASE_FILE` select local signing custody; no credential value belongs in this repository.

## Evidence boundary

The imported canonical release book retains both successful scoped checks and the original failed umbrella invocation. This disclosure does not claim a new complete application release-freeze pass, browser sign-in qualification, production deployment, full Crystal cutover, exhaustive private-code audit or current capability census. See `release/qualification.json` and the imported conformance record for exact scopes.
