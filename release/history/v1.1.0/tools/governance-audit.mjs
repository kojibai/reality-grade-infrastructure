// Read-only audit composition of the existing Receiz governance verifier. No signing or private identity custody.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { deriveReceizIdentityKeyIdFromPublicKeyRawB64u, verifyReceizIdentityPublicKeyProjectionSignature, receizBase64UrlEncode, materializeReceizPortableStateRef, receizPortableSegmentSignatureBytes, canonicalizeReceizV122 } from '@receiz/sdk';
export const GOVERNANCE_SIGNED_ARTIFACT_PATHS = [
    "public/governance/document-register.v1.json",
    "public/governance/evidence-register.v1.json",
    "public/governance/control-boundaries.v1.json",
    "public/governance/exception-log.v1.json",
    "public/governance/release-attestation.schema.v1.json",
    "public/governance/charter-attestation.v1.json",
    "public/governance/governance-keyring.v1.json",
];
export const GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA = "receiz-governance-artifact-manifest-v1";
export const GOVERNANCE_ARTIFACT_SIGNATURE_STANDARD_ID = "receiz-governance-artifact-signature-standard-v2";
export const GOVERNANCE_OWNER = Object.freeze({
    "keyId": "fa88b59e8aff5213f06712e81583578adfd10c807db8544bd2f44a558e802060",
    "alg": "Ed25519",
    "publicKeyRawB64u": "7R9qBh12X61eebtQGblEB-jCMQdae__1rj2JfDb56-g"
});
export const LEGACY_GOVERNANCE_MANIFEST_SHA256 = "defeb9426855b8552b930bf1b1c790b15bb6479d2ac820ea2945b51fc347fb96";
export function sha256(input) {
    return createHash("sha256").update(input).digest("hex");
}
export function sourceDigest(source) { return sha256(canonicalizeReceizV122(source)); }
function exactKeys(value, keys) {
    assert.ok(value && typeof value === "object" && !Array.isArray(value), "governance_source_record_required");
    const descriptors = Object.getOwnPropertyDescriptors(value);
    assert.deepEqual(Reflect.ownKeys(descriptors).sort(), [...keys].sort(), "governance_source_fields_invalid");
    for (const key of keys)
        assert.ok(descriptors[key]?.enumerable && "value" in descriptors[key], "governance_source_data_required");
}
export async function openGovernanceIdentitySource(input, owner, purpose) {
    exactKeys(input, ["schema", "identity", "state"]);
    assert.equal(input.schema, "receiz.governance.identity-source.v1");
    exactKeys(input.identity, ["keyId", "alg", "publicKeyRawB64u"]);
    assert.deepEqual(input.identity, owner, "governance_identity_not_authorized");
    assert.equal(owner.alg, "Ed25519");
    assert.equal(await deriveReceizIdentityKeyIdFromPublicKeyRawB64u(owner.publicKeyRawB64u, owner.alg), owner.keyId);
    exactKeys(input.state, ["schema", "exportedAt", "snapshot", "proof"]);
    const source = input;
    const state = source.state;
    assert.equal(state.schema, `receiz.governance.${purpose}.v1`);
    assert.ok(typeof state.exportedAt === "string" && Number.isFinite(Date.parse(state.exportedAt)));
    exactKeys(state.proof, ["method", "digestSha256Hex", "signatureB64u", "signedAt"]);
    assert.equal(state.proof.method, "ed25519.jcs.v1");
    assert.equal(state.proof.signedAt, state.exportedAt);
    const canonical = canonicalizeReceizV122({ schema: state.schema, exportedAt: state.exportedAt, snapshot: state.snapshot });
    assert.equal(sha256(canonical), state.proof.digestSha256Hex, "governance_source_digest_invalid");
    const verify = async (bytes, signatureB64Url) => {
        assert.equal(await verifyReceizIdentityPublicKeyProjectionSignature({
            ...owner, challengeB64Url: receizBase64UrlEncode(bytes), signatureB64Url,
        }), true, "governance_source_signature_invalid");
    };
    await verify(new TextEncoder().encode(canonical), state.proof.signatureB64u);
    exactKeys(state.snapshot, ["schema", "composite"]);
    assert.equal(state.snapshot.schema, "receiz.account.state.segmented-ref.v1");
    assert.equal(state.snapshot.composite.stableArtifactId, `account-state:${owner.keyId}`);
    for (const segment of state.snapshot.composite.segments) {
        await verify(receizPortableSegmentSignatureBytes(segment), segment.signatureB64u);
    }
    // No inner payload is admitted or projected until the parent and every segment verify.
    const opened = materializeReceizPortableStateRef(state.snapshot);
    exactKeys(opened, ["domain", "action", "signerKeyId", "predecessor", "sequence", "accountStateHead", "payload"]);
    assert.equal(opened.domain, "receiz.governance");
    assert.equal(opened.action, purpose);
    assert.equal(opened.signerKeyId, owner.keyId);
    assert.ok(typeof opened.predecessor === "string" && /^[0-9a-f]{64}$/.test(opened.predecessor));
    assert.ok(Number.isSafeInteger(opened.sequence) && Number(opened.sequence) >= 1);
    exactKeys(opened.accountStateHead, ["kaiPulse", "kaiUpulse"]);
    const head = opened.accountStateHead;
    assert.ok(typeof head.kaiPulse === "string" && /^(0|[1-9][0-9]*)$/.test(head.kaiPulse));
    assert.ok(typeof head.kaiUpulse === "string" && /^(0|[1-9][0-9]*)$/.test(head.kaiUpulse));
    assert.equal(BigInt(head.kaiUpulse) / 1000000n, BigInt(head.kaiPulse));
    assert.equal(state.snapshot.composite.kaiPulse, head.kaiPulse);
    assert.equal(state.snapshot.composite.kaiUpulse, head.kaiUpulse);
    return opened;
}
export const GOVERNANCE_REGISTER_PATHS = ["docs/governance/document-register.v1.json", "docs/governance/evidence-register.v1.json"];
export const GOVERNANCE_SOURCE_FILE_PATHS = [...GOVERNANCE_SIGNED_ARTIFACT_PATHS, ...GOVERNANCE_REGISTER_PATHS];
export function buildGovernancePayload(files, generatedAt) {
    assert.deepEqual([...files.keys()].sort(), [...GOVERNANCE_SOURCE_FILE_PATHS].sort(), "governance_file_membership_invalid");
    const artifacts = GOVERNANCE_SIGNED_ARTIFACT_PATHS.map(path => {
        const bytes = files.get(path);
        return { path: String(path), sha256: sha256(bytes), sizeBytes: bytes.byteLength };
    });
    return {
        manifest: {
            schema: GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA, standardId: GOVERNANCE_ARTIFACT_SIGNATURE_STANDARD_ID,
            generatedAt, artifactCount: artifacts.length, artifacts,
            references: {
                documentRegisterPath: String(GOVERNANCE_REGISTER_PATHS[0]), documentRegisterHash: sha256(files.get(GOVERNANCE_REGISTER_PATHS[0])),
                evidenceRegisterPath: String(GOVERNANCE_REGISTER_PATHS[1]), evidenceRegisterHash: sha256(files.get(GOVERNANCE_REGISTER_PATHS[1])),
            },
        },
        files: GOVERNANCE_SOURCE_FILE_PATHS.map(path => ({ path: String(path), bytesB64u: Buffer.from(files.get(path)).toString("base64url") })),
    };
}
export function verifyGovernancePayload(input) {
    assert.ok(input && typeof input === "object");
    const payload = input;
    assert.ok(Array.isArray(payload.files));
    assert.deepEqual(payload.files.map(f => f.path), [...GOVERNANCE_SOURCE_FILE_PATHS], "governance_file_membership_invalid");
    const files = new Map(payload.files.map(file => {
        assert.equal(typeof file.bytesB64u, "string");
        const bytes = Buffer.from(file.bytesB64u, "base64url");
        assert.equal(bytes.toString("base64url"), file.bytesB64u, "governance_file_encoding_invalid");
        return [file.path, bytes];
    }));
    assert.ok(typeof payload.manifest?.generatedAt === "string" && Number.isFinite(Date.parse(payload.manifest.generatedAt)));
    assert.deepEqual(payload, buildGovernancePayload(files, payload.manifest.generatedAt), "governance_source_payload_mismatch");
    return payload;
}
export async function verifyGovernanceChain(source, owner, legacyAnchor, loadPredecessor, acceptedHead) {
    const current = await openGovernanceIdentitySource(source, owner, "governance-artifacts");
    let held = current;
    const seen = new Set([sourceDigest(source)]);
    for (;;) {
        verifyGovernancePayload(held.payload);
        if (held.sequence === 1) {
            assert.equal(held.predecessor, legacyAnchor, "governance_genesis_anchor_invalid");
            break;
        }
        assert.ok(!seen.has(held.predecessor), "governance_history_cycle");
        seen.add(held.predecessor);
        const priorSource = await loadPredecessor(held.predecessor);
        assert.equal(sourceDigest(priorSource), held.predecessor, "governance_predecessor_digest_invalid");
        const prior = await openGovernanceIdentitySource(priorSource, owner, "governance-artifacts");
        assert.equal(held.sequence, prior.sequence + 1, "governance_sequence_invalid");
        assert.ok(BigInt(held.accountStateHead.kaiUpulse) > BigInt(prior.accountStateHead.kaiUpulse), "governance_kai_not_descendant");
        held = prior;
    }
    if (acceptedHead !== undefined)
        assert.ok(seen.has(acceptedHead), "governance_held_head_would_be_replaced");
    return current;
}
async function verifyCarriedGovernance(current, history, owner, anchor) {
    assert.ok(Array.isArray(history));
    const byDigest = new Map(history.map(source => [sourceDigest(source), source]));
    assert.equal(byDigest.size, history.length, "release_governance_history_duplicates");
    const used = new Set();
    const state = await verifyGovernanceChain(current, owner, anchor, async (digest) => {
        assert.ok(byDigest.has(digest), "release_governance_predecessor_missing");
        used.add(digest);
        return byDigest.get(digest);
    });
    assert.equal(used.size, byDigest.size, "release_governance_history_extras");
    return state;
}
export async function verifyProofNativeReleaseAttestation(input, owner, anchor) {
    const { integrity, ...projection } = input;
    assert.ok(integrity && typeof integrity === "object");
    assert.deepEqual(Object.keys(integrity).sort(), ["payloadSha256", "source"]);
    const control = integrity;
    const opened = await openGovernanceIdentitySource(control.source, owner, "release-attestation");
    const payload = opened.payload;
    assert.deepEqual(Object.keys(payload).sort(), ["attestation", "governance", "history"]);
    assert.equal(typeof payload.governance, "string");
    assert.ok(Array.isArray(payload.history) && payload.history.every(source => typeof source === "string"));
    const heldSource = JSON.parse(payload.governance);
    const governance = await verifyCarriedGovernance(heldSource, payload.history.map(source => JSON.parse(source)), owner, anchor);
    assert.equal(opened.predecessor, sourceDigest(heldSource));
    assert.equal(opened.sequence, 1);
    assert.ok(BigInt(opened.accountStateHead.kaiUpulse) > BigInt(governance.accountStateHead.kaiUpulse));
    assert.equal(control.payloadSha256, sourceDigest(payload.attestation));
    assert.deepEqual(projection, payload.attestation, "release_attestation_not_source_projection");
    return payload.attestation;
}
