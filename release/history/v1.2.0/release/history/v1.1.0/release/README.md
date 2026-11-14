# Disclosure release boundary

Disclosure version: **1.1.0**. Compatible product release: **127.0.0**. Exact source coordinates are recorded in [source.json](source.json).

The owner-sealed payload binds the candidate commit and tree, complete file inventory, public report snapshots, law registry, ontology, public guides and unchanged read-only audit composition. The subsequent release commit adds only the carried attestation. The signature does not hash its own containing file. Corrections require a successor release; prior evidence and tags remain immutable.

The audit tool reuses the existing Receiz governance verifier and published `@receiz/sdk@127.0.0`. It introduces no signing service, new root or new proof scheme. The designated bjklock identity remains pinned independently of the supplied attestation. Private custody stays outside this public repo.

The previous v1.0.1 release bytes and signature are preserved under [history/v1.0.1](history/v1.0.1/README.md); the original v1.0.0 signature remains preserved as well. The historical preparation tree is unchanged. Current release entry points are this directory and the root README.

The SDK dependency remains exactly pinned; the existing transitive Underscore override remains 1.13.8. Qualification records describe the actual installed bytes. Hosted report capture, SDK conformance, local audit tests and sealed inventory verification are separate evidence boundaries. No complete private application audit or institutional certification is claimed.
