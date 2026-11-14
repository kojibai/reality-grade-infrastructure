# Reproduce the disclosed checks

## Inventory integrity

From the repository root:

```sh
node disclosure/tools/verify-disclosure.mjs disclosure
```

This requires no third-party packages. It checks only the exact disclosure inventory against its unsigned manifest.

## Published SDK fixture checks

Install the explicitly pinned public SDK in the repository root, outside the inventoried disclosure directory:

```sh
npm install --no-save --package-lock=false --ignore-scripts @receiz/sdk@126.0.0
node disclosure/tools/check-sdk.mjs
```

Installation requires network access. The runner refuses another SDK version and delegates to the SDK’s existing `conformance` command. The v126 report contains 15 qualification checks and three packaged fixtures. These cover runtime boundaries, sandbox continuity and recovery, package surfaces, and fixture inspection. The fixtures exercise asset manifest inspection, Sports manifest inspection, and webhook shape validation. These are not sealed-artifact acceptance vectors. Shape validation does not grant ownership, prove issuance, or admit a proof object.

Record the package integrity, installed dependency versions, Node version, command output, and date alongside your results. The repository does not yet carry a separately qualified dependency lock or a signed attestation over this disclosure.

## Artifact verification

Use the public SDK’s documented `verification.verifyArtifact` interface for complete artifact bytes; follow the [artifact and verification reference](https://docs.receiz.com/). Keep the original bytes. Do not substitute the inventory checker or fixture checks for canonical proof verification.

No positive production artifact is included here: private user artifacts are not public test fixtures. No testing issuer or alternate trusted root is supplied. A future acceptance corpus must disclose its exact proof domain, expected outcomes, provenance, and redistribution permission before inclusion.

## Hosted reports

The evidence directory links ten conformance domains, including raw reports and history through the conformance page. Preserve the report you relied on and its tested identity. Hosted results, package fixture results, and disclosure integrity are separate evidence categories.
