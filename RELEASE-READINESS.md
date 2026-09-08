# Release gate

The offline-verifier public main and v126.0.0 tag were verified at `31e8f065d49c1ec60ddbdcf4f4b60f3de4b6403e`.

Ten captured public conformance reports pass. Published SDK conformance passes. Eight existing governance tests pass. The final disclosure gate requires the release attestation and exact inventory to pass `npm run verify:release`; without that artifact, this checkout is not publication-qualified.

The signer is the designated owner-held Receiz identity, not Git signing configuration. Private custody remains outside this repository. The original preparation verifier intentionally cannot authorize a release.

Local disclosure qualification: seven public audit tests pass, including altered identity/source/purpose and inventory rejection. Public verification uses the published SDK with the lockfile above.
