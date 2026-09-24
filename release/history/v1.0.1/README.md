# Disclosure release boundary

Compatible product release: v126.0.0. Public product-history commit: `31e8f065d49c1ec60ddbdcf4f4b60f3de4b6403e` (verified on remote main and v126.0.0).

The release payload binds the candidate commit and tree, the complete file inventory, public report snapshots, law registry, ontology and audit-tool source selection. The subsequent release commit adds the carried attestation only. This avoids a self-referential signature while preserving exact candidate identity. Future corrections require a successor release; never silently alter an existing evidence file or move its release tag.

The audit tool reuses selected read-only functions from the existing Receiz governance verifier and the published @receiz/sdk 126.0.0. It does not introduce a signing service, authority keyring or new proof scheme. The designated identity is pinned independently of the supplied attestation.

Captured report scope, incomplete census scope and dependency qualification remain explicit. Neither an unsigned digest nor passing hosted reports prove a complete private application audit. No claim of institutional certification or independent priority adjudication is made.

Dependency qualification pins @receiz/sdk 126.0.0 and overrides its transitive Underscore dependency to 1.13.8 in the lockfile. SDK conformance passes with that patch; the dependency audit reports zero vulnerabilities at qualification time.

## v1.0.1 correction successor

This repository uses its own version: v1.0.1, compatible with Receiz v126.0.0. The previous public release v1.0.0 at commit `702af2c003d99e0c4611cef055fab58ed0a8e3a2` is preserved. Its attestation carried the earlier internal disclosure label; the original signed bytes remain in `history/v1.0.0-attestation.json`. This successor corrects the declared invariant count to the 55 actual entries and aligns package and attestation versions. No primitive or invariant was added or removed.
