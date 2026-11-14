# Audit scope and evidence boundaries

This disclosure supports examination of the stated authority model, the selected file inventory, and linked public interface and conformance evidence. It does not constitute a full audit of the private Receiz implementation.

## What is included

- A human-readable authority contract: source proof outranks its representations.
- Documentation, capability, integration, and conformance entry points.
- A standalone checker for the exact disclosed file inventory and byte integrity.
- An unsigned manifest identifying the included files by path, byte length, and digest.

## What remains private

The proprietary application and runtime implementation, issuance and identity authority internals, deployment configuration, secrets, and user records are not included. No private source tree or repository history is copied into this package. Already published interfaces and packages have their own distribution and license boundaries; this document does not change them.

## Match each claim to its evidence

| Evidence | What it establishes | What it does not establish |
| --- | --- | --- |
| Authority contract | The disclosed normative boundary | Private implementation compliance by itself |
| Capability inventory | Named public integration surfaces | Successful execution or permission to access an object |
| Hosted conformance report | The checks and outcomes recorded in that report | Independent certification or qualification of unrelated bytes |
| Operational status | Observed service responses within the probe scope | Proof validity or complete system correctness |
| Disclosure checker | Inventory consistency against the supplied manifest | Authenticity when both files and manifest can be replaced |

## Before publication

Bind the exact reviewed disclosure bytes to an authenticated release identity. Review the license and the complete public repository envelope, including history and generated files. Any additional code, fixture, proof sample, verifier, adapter, or dependency needs its own disclosure review; no directory-wide source export is authorized by this document.

A future public verifier must have a reviewed dependency closure and explicit proof-domain boundaries. Until then, this package must not claim to reproduce canonical artifact verification. A full private-code audit requires separately controlled access; the public material must describe the narrower audit it actually enables.
