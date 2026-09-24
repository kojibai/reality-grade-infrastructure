# Offline sealing

`@receiz/sdk/offline` packages the existing canonical Receiz file sealer, Signature V4 and document Groth16 proof generation. `@receiz/sdk/offline/node` supplies private local file custody and loads the proof resources shipped in the package. No server is consulted during sealing or verification.

Install `@receiz/sdk@127.0.0`. In Node 24:

```js
import { readFile, writeFile } from "node:fs/promises";
import { createReceizNodeOfflineSealer } from "@receiz/sdk/offline/node";

const sealer = await createReceizNodeOfflineSealer({ directory: "./private-device" });
await sealer.enroll(); // Run once while online. Subsequent calls reuse local custody.
```

Now disconnect, restart the process, and run:

```js
import { readFile, writeFile } from "node:fs/promises";
import { createReceizNodeOfflineSealer } from "@receiz/sdk/offline/node";
const sealer = await createReceizNodeOfflineSealer({ directory: "./private-device" });
const result = await sealer.seal({
  bytes: new Uint8Array(await readFile("report.pdf")),
  filename: "report.pdf", mimeType: "application/pdf",
});
await writeFile(result.filename, result.artifactBytes, { flag: "wx" });
const { verifyReceizOfflineSealedFile } = await import("@receiz/sdk/offline");
const verification = await verifyReceizOfflineSealedFile({
  bytes: new Uint8Array(await readFile(result.filename)), filename: result.filename,
});
console.log(verification.ok);
```

`seal` never calls `enroll`. Missing enrollment fails with `offline_seal_enrollment_required`. A successful result has already passed the existing canonical verifier under the production pinned roots. Preserve the returned bytes and MIME type; trailer artifacts use an opaque download MIME to prevent content rewriting.

## Identity-bound artifacts

For a subject snapshot or another owner-bound source, supply `identityArtifactPath` and `identityPassphrase` to `createReceizNodeOfflineSealer`. The SDK verifies the complete Identity Record under the pinned canonical roots, admits its identity proof, and binds the native record seal to that admitted owner. In the browser, supply a genuine `ownerIdentityAdmission` to `createReceizOfflineSealer`. An owner string, signing certificate, or caller-shaped admission cannot substitute for identity proof.

```js
const sealer = await createReceizNodeOfflineSealer({
  directory: "./private-device",
  identityArtifactPath: "./identity.receizbundle",
  identityPassphrase: process.env.RECEIZ_SUBJECT_IDENTITY_PASSPHRASE ?? "",
});
const snapshot = await client.localSubjects.exportSnapshot();
const sealed = await sealer.seal({
  bytes: new TextEncoder().encode(JSON.stringify(snapshot)),
  filename: "subject-snapshot.json", mimeType: "application/json",
});
await writeFile(sealed.filename, sealed.artifactBytes, { flag: "wx" });
```

Import the exact saved file through `readReceizV127SubjectRuntimeSourceFile` and `client.localSubjects.importSnapshot` on an empty host. Exported JSON alone is not a sealed source. MCP composes the same identity when `RECEIZ_SUBJECT_IDENTITY_PATH` is configured; the model never supplies an owner ID as authority.

Creation coordinates come from the canonical live proof path. `seal` accepts only bytes, filename and MIME type; caller pulse, micro-pulse and timestamp overrides are rejected. Artifact verification checks the carried canonical proof and signature. Full KaiSigil coordinate admission for temporal state uses the existing KKS verifier, including its public signals, exact coordinate binding and causal head rules.

## Browser

Import `createReceizOfflineSealer`, `createReceizIndexedDbSealStore`, and `verifyReceizOfflineSealedFile` from `@receiz/sdk/offline`. Supply `resources: { wasm, zkey }` as Uint8Arrays copied from the package's `offline-resources/sigil_proof.wasm` and `offline-resources/document_seal_proof_final.zkey`. Retain those files and the bundled JavaScript in the application's offline installation. The runtime checks the canonical resource hashes before sealing.

Use IndexedDB custody; it retains a non-exportable CryptoKey on that browser origin. Specify `enrollmentUrl` on the application's own origin. The existing enrollment endpoint enforces same-origin browser requests: a separate application must forward only the public key and signed enrollment challenge to the canonical Receiz endpoint through its host. Do not forward private keys, user sessions, or invented certificates. A Receiz enrollment on another origin is not automatically available in your application. Node enrollment calls the canonical endpoint directly without a session.

## MCP

Run the installed `receiz-mcp` command with `RECEIZ_OFFLINE_SEAL_DIRECTORY` pointing to private durable custody and `RECEIZ_OFFLINE_WORKSPACE` pointing to the source/output directory. No custom sealer resolver module is required for these tools.

1. `receiz_offline_seal_enroll({ "confirmEnrollment": true })` once online.
2. Restart disconnected; `receiz_offline_seal_status({})` reports readiness.
3. `receiz_offline_seal_file({ "inputPath": "report.pdf", "outputPath": "report.receized.pdf", "mimeType": "application/pdf" })`.
4. `receiz_offline_verify_file({ "inputPath": "report.receized.pdf" })`.

Paths must remain inside the configured workspace. Existing output files are never overwritten. Custody files cannot be used as source/output. MCP returns verification and output coordinates, never private keys. AI instructions invoke these tools; they do not confer proof authority.

## Authority and qualification

The device certificate authorizes canonical artifact signing. It does not create a Receiz ID, confer another person's ownership, admit a transfer, or execute settlement. Those operations retain their existing proof boundaries. No root signing key or server credential is shipped. Node custody contains a device private key in a mode-0600 file and must remain private; browser custody uses IndexedDB.

Qualify with networking disabled after restarting: seal supported PNG, PDF, SVG, JSON, JPEG, HEIC, WebP/GIF and ordinary text; save and reopen the exact output; verify it; reject tampered bytes. HEIC container tests do not establish physical Photos byte preservation. There is no new claim about Camera Roll transformations.

## Full KaiSigil temporal coordinates

```js
import { createReceizNodeOfflineKaiProofFactory } from "@receiz/sdk/offline/kai/node";
import { admitReceizKksV1ProofCoordinate } from "@receiz/sdk";
const createCoordinate = await createReceizNodeOfflineKaiProofFactory();
const coordinate = await createCoordinate();
await admitReceizKksV1ProofCoordinate(coordinate);
```

The package supplies the canonical KaiSigil circuit and proving key separately from the document-seal key. Browser hosts use `createReceizOfflineKaiProofFactory` from `@receiz/sdk/offline/kai` with the packaged `kai_sigil_proof.wasm` and `kai_sigil_proof_final.zkey` bytes. Resource hashes are pinned and the complete generated proof is verified before return. Neither factory accepts a pulse or clock override.

MCP exposes `receiz_offline_kai_proof({})`. For a successor, supply the full `previousCoordinate`; MCP verifies it and returns a successor with the preceding proof head and strictly greater micro-pulse. A consuming primitive must still match its own admitted causal head. Successful generation is not permission to replace that head. `receiz_sealed_kai_moment` projects a verified complete coordinate; a bare integer is insufficient.
