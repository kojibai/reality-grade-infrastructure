# Reality Grade Infrastructure

### Proof you can check. Continuity you can carry.

Receiz is a proof-native artifact system. Source, identity, ownership, and recorded history stay with the object as it moves between experiences. New tools can follow how it evolved without replacing the evidence that makes it verifiable.

**[Read the documentation](https://docs.receiz.com/) · [Explore the capabilities](https://receiz.com/capabilities) · [Inspect conformance](https://receiz.com/conformance)**

## Build on Receiz

Use the supported SDK, MCP, and AI skill interfaces to build new experiences around proof, identity, ownership, and carried history. Start with the [builder guide](disclosure/BUILDING.md): choose an interface, inspect its contract, and qualify your integration.

## Inspect the system

Start with the [evidence directory](disclosure/README.md): ten conformance badges linked to their reports, integration entry points, and the authority contract. The [audit scope](disclosure/AUDIT-SCOPE.md) explains precisely what is disclosed and what each kind of evidence establishes.

This repository contains a selected disclosure, not the proprietary Receiz application or authority runtime. The included checker verifies disclosure inventory integrity; it is not a canonical artifact verifier.

## Review status

**Preparation.** These disclosure bytes have not been bound to an authenticated public release. Hosted conformance results qualify their stated checks, not this repository. No full private-code audit or independent certification is claimed.

Run the inventory check from this repository:

```sh
node disclosure/tools/verify-disclosure.mjs disclosure
```

The exact checked artifact is `disclosure/`. The repository README and Git envelope are outside that manifest. The manifest is unsigned; see the [evidence boundaries](disclosure/AUDIT-SCOPE.md) before relying on it.

Publication and licensing remain pending. This preparation grants no license to proprietary implementation.
