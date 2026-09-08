# Build on Receiz

Build the experience. Carry the proof, identity, ownership, and history into it through the supported public interfaces.

## Choose an integration

| You are building | Start here |
| --- | --- |
| An application or service | [SDK and integration documentation](https://docs.receiz.com/) · [@receiz/sdk](https://www.npmjs.com/package/@receiz/sdk) |
| An agent workflow | [MCP integration](https://receiz.com/developers/mcp) · [@receiz/mcp-server](https://www.npmjs.com/package/@receiz/mcp-server) |
| AI-assisted development | [@receiz/ai-skills](https://www.npmjs.com/package/@receiz/ai-skills) · [Developer entry point](https://receiz.com/developers) |
| A new use for carried state | [Capability directory](https://receiz.com/capabilities) · [Machine-readable inventory](https://receiz.com/capabilities.json) |

The SDK, MCP server, and AI skills have their own published versions, contents, and licenses. Use their documented installation and configuration instructions. This disclosure package is not a substitute distribution of those tools.

## Keep the authority boundary intact

The complete sealed proof object carries the source. Verify it through the documented canonical verification path before projecting embedded payloads. A display, extracted digest, hosted response, or generated explanation must not replace the enclosing proof.

Known verified local truth remains usable. New verified activity extends the history; it does not rewrite the accepted predecessor. Your application owns its experience and its rules for eligibility, consent, and access. Public capability discovery does not grant access to another person’s private state.

This lets you build a new experience around what people already carry: a project’s decisions, an object’s ownership history, or a community’s recorded activity. A new interface can reveal new relationships while retaining the evidence behind them.

## Qualify your integration

1. Pin the published package versions you test. Read the relevant interface contracts and release information in the documentation.
2. Inspect the conformance report for the domain you use, including check details, report identity, and recorded failures or limitations. Do not treat a badge alone as qualification.
3. Exercise your actual workflow with valid and invalid proof, the permissions it requires, and the deployment and browser environments you support. Test offline behavior when your workflow promises it.
4. Confirm that an append preserves prior evidence and that reopening known state does not require a weaker service to authorize its truth again.
5. Record your tested versions, results, and remaining boundaries. Repeat affected checks when changing your integration.

The [conformance directory](https://receiz.com/conformance) exposes reports and historical results. [Operational status](https://receiz.com/status) reports service observations. Neither replaces testing your application’s contract.

## What you can inspect here

Read the [authority model](standard/authority-model.md), [evidence directory](README.md), and [audit scope](AUDIT-SCOPE.md). Run the disclosure inventory checker locally. Its unsigned manifest checks consistency, not provenance or proof authentication.

The proprietary implementation remains private. This repository is an integration and evidence entry point, not a source distribution from which to recreate Receiz. It does not claim a full audit of that private implementation. Additional independent review and authenticated release evidence must be identified explicitly when available.
