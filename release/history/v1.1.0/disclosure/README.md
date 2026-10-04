# Reality Grade Infrastructure

### Proof you can check. Continuity you can carry.

Receiz preserves the source, the rules, and the sequence that brought an object to its present state. Files, identity, ownership, and history remain verifiable as people move between experiences. New tools can work from that continuity without replacing its evidence.

**[Documentation](https://docs.receiz.com/) · [Capability directory](https://receiz.com/capabilities) · [Conformance](https://receiz.com/conformance) · [Operational status](https://receiz.com/status)**

> **Disclosure preparation — not a released audit package.** This reviewed inventory contains an authority contract and a disclosure integrity checker. It does not contain the proprietary Receiz runtime or a canonical artifact verifier. No signed release binding is claimed for these bytes.

## Examine the evidence

The badges below report the hosted conformance services, not the qualification of this preparation tree. Open a report to inspect its checks and evidence. A hosted result is not independent certification; badge images may be cached by the reader’s platform.

| Domain | Report |
| --- | --- |
| Temporal | [![Temporal conformance](https://receiz.com/api/temporal/conformance/badge)](https://receiz.com/temporal/conformance) |
| Identity | [![Identity conformance](https://receiz.com/api/identity/conformance/badge)](https://receiz.com/identity/conformance) |
| Issuance | [![Issuance conformance](https://receiz.com/api/issuance/conformance/badge)](https://receiz.com/issuance/conformance) |
| Verification | [![Verification conformance](https://receiz.com/api/verification/conformance/badge)](https://receiz.com/verify/conformance) |
| Market | [![Market conformance](https://receiz.com/api/market/conformance/badge)](https://receiz.com/market/conformance) |
| Economy | [![Economy conformance](https://receiz.com/api/economy/conformance/badge)](https://receiz.com/economy/conformance) |
| Interoperability | [![Interoperability conformance](https://receiz.com/api/interoperability/conformance/badge)](https://receiz.com/interoperability/conformance) |
| World | [![World conformance](https://receiz.com/api/world/conformance/badge)](https://receiz.com/world/conformance) |
| Sports | [![Sports conformance](https://receiz.com/api/game/sports/conformance/badge)](https://receiz.com/game/sports/conformance) |
| Signal Circuit | [![Signal Circuit conformance](https://receiz.com/api/signal-circuit/conformance/badge)](https://receiz.com/signal-circuit/conformance) |

The [conformance directory](https://receiz.com/conformance) links raw reports, historical runs, and rollups. Check the report’s identity, scope, and recorded result before drawing a conclusion about a particular release.

## Build on the primitives

Follow the [integration guide](BUILDING.md) to choose supported SDK, MCP, and AI skill interfaces and qualify your own workflow against the evidence. Build new experiences around carried proof and continuity.

## Understand the system

| Start with your question | Inspect |
| --- | --- |
| What can I build or use? | [Full capability directory](https://receiz.com/capabilities) and [machine-readable inventory](https://receiz.com/capabilities.json) |
| How do I integrate? | [Documentation and reference](https://docs.receiz.com/) and [developer entry point](https://receiz.com/developers) |
| How can an agent use it? | [MCP integration](https://receiz.com/developers/mcp) |
| What carries authority? | [Authority contract](standard/authority-model.md) |
| What does this disclosure establish? | [Audit scope](AUDIT-SCOPE.md) |
| Which services are responding? | [Operational status](https://receiz.com/status) |

A proof object keeps its source and recorded transitions. A final result can show where a person or organization arrived; carried continuity lets a reader follow how it evolved. Interpretations remain traceable to evidence. Neither a reader nor a hosted service becomes authority over that source.

## Check this inventory locally

```sh
node tools/verify-disclosure.mjs .
```

This zero-dependency checker compares the disclosed files with their inventory and SHA-256 values. It does **not** authenticate proof objects or releases. The local manifest is unsigned: changing both the inventory and files defeats that integrity comparison. Obtain an independently authenticated manifest before relying on a released package.

```sh
node tools/verify-disclosure.mjs . --require-release
```

This command deliberately fails for preparation material. A product release tag or a passing hosted badge cannot qualify these different bytes.

## Disclosure boundary

Interface descriptions and selected evidence are public-facing material. Proprietary application code, issuance and authority runtimes, operational configuration, credentials, and private records are excluded. This tree is not a Receiz application distribution.

Publication, licensing, authenticated release evidence, and any additional verifier or test-vector extraction require review of their exact contents. This preparation remains private and UNLICENSED. See [Audit scope](AUDIT-SCOPE.md) for what an independent reviewer can and cannot conclude.

## Review and reproduce

[Reproduce the checks](REPRODUCIBILITY.md) · [Contribute](CONTRIBUTING.md) · [Security and disclosure](SECURITY.md)
