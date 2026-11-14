# Disclosure release boundary

Disclosure **1.3.0** accompanies product **129.5.0**. [source.json](source.json) binds the published Receiz tag and the separately committed standalone verifier. [evidence/receiz-v129.5.0-source.json](evidence/receiz-v129.5.0-source.json) enumerates all 16 tagged release-family files and their exact imported bytes. [qualification.json](qualification.json) separates source, package/consumer evidence, the release-proof locator and deployment status.

The complete old1.2.0 repository tree and owner proof are preserved under history/v1.2.0. Earlier releases, captured reports and the v127 registry/census/catalog retain their original Source, signatures and scope.

The existing owner-sealed payload binds the clean candidate commit/tree, tagged canonical Source, exact product-history coordinate, scope and every disclosure file. The following release commit adds only the current attestation. inventory() excludes that containing file to avoid self-hashing; all historical attestations remain included. Any changed disclosed byte requires a successor proof.

The verifier reuses the published @receiz/sdk@129.5.0 and the pinned governance owner/source chain. No signing service, root override, replacement owner or arbitrary issuer is admitted. Private signing custody stays outside this public repository.
