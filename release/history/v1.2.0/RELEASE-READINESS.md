# Disclosure v1.2.0 release gate

Compatible product release: Receiz128. The exact product-history source is recorded in [release/source.json](release/source.json). The prior signed v1.0.1 inventory passed verification before preparation of this successor.

Required gates:

```sh
npm ci --ignore-scripts
npm test
npm run conformance:sdk
npm run verify:release
```

The candidate is committed cleanly before signing. The designated bjklock Identity Seal remains in private custody outside this repository. The existing governance verifier checks the carried owner proof and exact inventory. Only the attestation is added in the following release commit. A candidate without a passing final attestation is not publication-qualified.

Ten historical hosted conformance reports are captured with byte digests in `release/evidence/index.json`. They are captured reports, not independently rerun private application tests. SDK conformance output is retained separately. The historical preparation tree and prior release remain intact.

Candidate qualification: all 13 public audit and disclosure tests pass; all ten captured reports return pass; installed SDK128 conformance passes; the locked dependency audit reports zero vulnerabilities. These are the recorded results in `release/evidence/`. Final release admission still requires the generated owner-sealed inventory to pass `npm run verify:release`.

Current qualification uses SDK128. Captured endpoint reports, v127 registry/census and catalog retain their original historical binding. Prior v1.1.0 complete signed inventory is preserved under `release/history/v1.1.0/`.
