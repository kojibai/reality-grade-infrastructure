# Local V120 subject runtime

The SDK ships a durable local host for the V120 subject protocol. Its source is an enclosing Receized artifact, admitted with the host's verified Identity Record. V120 subject identity, proof-object identity, genesis, namespace bytes, and history retain their exact protocol. Modern V122 subject admission and state remain separate APIs.

```ts
import { createReceizClient } from "@receiz/sdk";
import {
  openReceizV127SubjectRuntimeFromFiles,
  readReceizV127SubjectRuntimeSourceFile,
} from "@receiz/sdk/subjects/node";

const subjectRuntime = await openReceizV127SubjectRuntimeFromFiles({
  directory: "/private/receiz/subjects",
  identityArtifactPath: "/private/receiz/identity.receizbundle",
  identityPassphrase: process.env.RECEIZ_SUBJECT_IDENTITY_PASSPHRASE ?? "",
  // Exact registry/reducer commitments used by the historical V120 source.
  registryDigest: process.env.RECEIZ_SUBJECT_REGISTRY_DIGEST!,
  reducerDigest: process.env.RECEIZ_SUBJECT_REDUCER_DIGEST!,
  // Optional for a new host. On restart, the existing durable state wins.
  snapshotArtifactPath: "/private/receiz/snapshot.receizbundle",
});
const client = createReceizClient({ subjectRuntime });
const subject = await client.subjects.resolve("subject:my-subject");
const state = await client.localSubjects.state(subject.subject.subjectId);
const history = await client.subjects.history(subject.subject.subjectId);
```

An empty host can admit a sealed V120 genesis artifact using `client.localSubjects.admit(await readReceizV127SubjectRuntimeSourceFile(path))`. The adapter reconstructs the genesis and requires exact equality with the admitted artifact. A successor cannot be reminted as genesis. Import its sealed full snapshot into an empty host using `client.localSubjects.importSnapshot(source)`, or import its sealed portable mind with `client.subjects.twin.importMind(subjectId, source)`. Bare self-hashed mind JSON is insufficient for admission.

`client.localSubjects.exportSnapshot()` returns the V127 portable envelope: the exact V120 snapshot, its digest, complete KaiSigil temporal evidence, and original sealed source artifacts. Exported JSON is an unsealed projection; seal this entire envelope with the existing canonical artifact sealer before transport. Import verifies the enclosing artifact first, re-verifies each carried source under the admitted identity's existing pinned context, and checks the complete coordinate chain and snapshot/source bindings. The received envelope remains separately custodied; exporting it again retains each original source once without recursively nesting earlier envelopes. Historical V120 snapshots remain accepted byte-for-byte and explicitly retain `historicalKaiAuthority: "not-retroactively-proved"`. Proof-brain appends similarly require an enclosing source through the host adapter's `subjects.brain.append`.

Temporal execution requires the full existing KaiSigil BLAKE3 → Poseidon → Groth16 coordinate. The Node host loads the shipped offline prover automatically; browser/custom hosts supply `resolveTemporalCoordinate` using the existing proof factory. Raw `initialKai`, fabricated execution handles, and bare pulse values cannot establish authority. Every causal transition consumes a distinct admitted coordinate linked to the prior proof head with a strictly greater micro-pulse. Unchanged V120 `*AtKai` fields project `coordinate.kaiPulse` explicitly; multiple transitions may share that whole pulse while retaining distinct verified micro-pulses and proof heads. No synthetic increment creates temporal proof.

Sealed historical `createdAtKai` values remain exact and cannot advance the current execution clock. Scheduling durations, expiry policies, and queued `runAfter` values are constraints evaluated against the admitted coordinate, not alternative clocks. MCP catch-up accepts no caller `throughKai`; the SDK compatibility field must equal the proof's exact whole-pulse projection. Authority-dependent validation and mandate explanations carry the full admitted coordinate beside their scalar projection. Full proof evidence persists beside each exact snapshot transition and its original source digests; it is included in portable export and survives sealed import and restart.

The local host executes subject reads, proof-brain retrieval, Twin speech and performance streams, mandates, ticks, memory projections, relationships, inventory, trades, and world commands/transactions. All subjects in this host belong to its admitted identity. Its private history must belong to that identity or carry the existing `inherited` policy; excluded prior-owner private history is rejected before admission. A transferred portable mind carrying private material needs a full snapshot that carries its private-history policy. Multi-owner bearer-transfer hosting is a separate boundary. The model proposes speech and intents; it does not supply owner authority. A Twin reply creates no world event. An explicit command still passes the existing exact-head, mandate, reducer, and atomic-append predicates.

Mandate activation projects the already admitted owner's identity into the existing V120 owner-capability predicate: exact subject, current owner, `mandate.activate`, and stored mandate expiry. The identity artifact digest records the proof used for this local authorization. It does not establish a new issuer or accept caller capability JSON.

Mutations stage an isolated runtime and publish only after private durable compare-and-set succeeds. The Node store requires a private directory, writes private files, syncs file contents, and atomically renames under an exclusive lock. A crash while holding the lock fails closed; the host must establish that no writer remains before removing that lock. Exact enclosing source bytes remain in custody alongside appended state. Restart uses verified durable truth without a network round trip.

All V120 streams are finite traversals of the selected runtime snapshot. Subject additions are capped at 1,000 events; proof-brain search is capped at 96 references. World subscriptions traverse the finite stored event array. No local iterator waits for future network events.

The default client does not send historical V120 requests to absent production routes. An existing historical HTTP implementation can be selected explicitly using `legacySubjectTransport: "http"`; an explicitly supplied `fetchImpl` remains an explicit transport for historical adapters and tests. Configuring a local host does not change modern V122/V124 server enforcement.

## Bearer ownership protocol boundaries

`client.bearer.previewTransfer`, `issueTransferInstrument`, `inspectInstrument`, `claimInstrument`, `cancelTransfer`, and `transferStatus` are the historical V120 instrument transport. The reference runtime implements their deterministic custody transition inside one runtime domain. The historical HTTP host must supply cross-owner authority admission and shared single-use custody coordination. Copying a pending snapshot between independent hosts does not establish one atomic claim domain.

Current canonical sealed-artifact claims use the existing `client.ownership.claimBearerAsset({ artifact: opened.sealedArtifact })`, after `client.artifacts.verifyAndOpen(file)`. The retired MCP `receiz_bearer_asset_claim_plan` and `receiz_bearer_asset_claim_execute` aliases remain excluded from the current default inventory; they must not be presented as callable current tools. The production route verifies the enclosing artifact and its carried bearer ownership continuity, resolves the authenticated Receiz owner, preserves artifact identity and carried history, coordinates one ownership append, and returns a reverified sealed successor. It accepts the qualifying portable-asset ownership primitive. A V120 instrument or subject head cannot be reinterpreted as that ownership state.

The six historical MCP `receiz_bearer_transfer_*` / `receiz_bearer_instrument_*` tools explicitly identify this compatibility requirement. They are not aliases for the current canonical claim operation, and caller-shaped capability JSON is not authority for the current native ownership route.
