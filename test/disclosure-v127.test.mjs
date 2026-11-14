import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {canonicalizeReceizConstitution,RECEIZ_CURRENT_REGISTRY_DIGEST} from '@receiz/sdk';
import {verifyProofNativeReleaseAttestation,GOVERNANCE_OWNER,LEGACY_GOVERNANCE_MANIFEST_SHA256} from '../tools/governance-audit.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url));
const json=async path=>JSON.parse(await read(path));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
test('current registry, predecessor, census and catalog bind the installed SDK129.5 with inherited historical v127 registry',async()=>{
 const registry=await json('release/laws/v127.0.0-constitution-registry.json');
 const digest=(await read('release/laws/v127.0.0-constitution-registry.digest')).toString().trim();
 assert.equal(registry.version,'127.0.0');assert.equal(sha(canonicalizeReceizConstitution(registry)),digest);assert.equal(digest,RECEIZ_CURRENT_REGISTRY_DIGEST);
 assert.equal(registry.previousRegistryDigest,(await read('release/laws/v126.0.0-constitution-registry.digest')).toString().trim());
 const census=await json('release/ontology/registry-census.json');assert.equal(census.releaseVersion,registry.version);assert.equal(census.lawEntries,133);assert.equal(census.distinctPredicates,132);assert.equal(census.denialWitnessesPassed,133);assert.equal(census.networkAttempts,0);
 const catalog=await json('release/ontology/public-capability-catalog.json');assert.equal(catalog.releaseVersion,registry.version);assert.equal(catalog.entries.length,1476);
});
test('ten captured reports bind exact returned bytes and retain successful status',async()=>{
 const index=await json('release/evidence/index.json');assert.equal(index.reports.length,10);assert.equal(new Set(index.reports.map(r=>r.suite)).size,10);
 for(const item of index.reports){assert.match(item.suite,/^[a-z-]+$/);const bytes=await read('release/evidence/'+item.suite+'.json');assert.equal(sha(bytes),item.sha256);const report=JSON.parse(bytes);assert.equal(report.overallStatus,'pass');assert.deepEqual(report.revision??null,item.revision);assert.deepEqual(report.summary,item.summary);}
});
test('prior owner-sealed release and all archived release bytes verify offline',async()=>{
 const previous=globalThis.fetch;globalThis.fetch=()=>{throw Error('network_forbidden')};
 try{const prior=await json('release/history/v1.0.1/attestation.json');const payload=await verifyProofNativeReleaseAttestation(prior,GOVERNANCE_OWNER,LEGACY_GOVERNANCE_MANIFEST_SHA256);assert.equal(payload.release,'v1.0.1');
 for(const entry of payload.files.filter(f=>f.path.startsWith('release/'))){const bytes=await read('release/history/v1.0.1/'+entry.path.slice('release/'.length));assert.equal(sha(bytes),entry.sha256);assert.equal(bytes.length,entry.bytes);}
 }finally{globalThis.fetch=previous;}
});
test('public source and coordinated package evidence preserve independent versions',async()=>{
 const source=await json('release/source.json');assert.equal(source.disclosureVersion,'1.3.0');assert.equal(source.compatibleProductVersion,'129.5.0');assert.equal(source.productHistory.tag,'v129.5.0');assert.match(source.productHistory.commit,/^[a-f0-9]{40}$/);assert.equal(source.receizSource.commit,'3267b36b88060987b509b27fec6763683ee10e98');assert.equal(source.receizSource.tree,'8f2ae0269ca75c68512a495884f0652c2530892b');const book=await json(source.receizSource.inventory);assert.equal(book.files.length,16);for(const entry of book.files){const held=await read(entry.path);assert.equal(held.length,entry.bytes);assert.equal(sha(held),entry.sha256);}
 const packages=await json('release/evidence/package-publication-v129.5.0.json');assert.equal(packages.packages.length,3);for(const p of packages.packages){assert.equal(p.version,'129.5.0');assert.match(p.integrity,/^sha512-/);}
});

test('v1.1.0 complete signed inventory remains byte-exact',async()=>{
 const prior=await json('release/history/v1.1.0/release/attestation.json');
 const payload=await verifyProofNativeReleaseAttestation(prior,GOVERNANCE_OWNER,LEGACY_GOVERNANCE_MANIFEST_SHA256);
 assert.equal(payload.release,'v1.1.0');
 for(const item of payload.files){const bytes=await read('release/history/v1.1.0/'+item.path);assert.equal(sha(bytes),item.sha256);assert.equal(bytes.length,item.bytes);}
});


test('v1.2.0 complete signed inventory remains byte-exact',async()=>{
 const prior=await json('release/history/v1.2.0/release/attestation.json');
 const payload=await verifyProofNativeReleaseAttestation(prior,GOVERNANCE_OWNER,LEGACY_GOVERNANCE_MANIFEST_SHA256);
 assert.equal(payload.release,'v1.2.0');
 for(const item of payload.files){const bytes=await read('release/history/v1.2.0/'+item.path);assert.equal(sha(bytes),item.sha256);assert.equal(bytes.length,item.bytes);}
});

test('release readiness and source distinguish product label from standalone Git ref',async()=>{
 const source=await json('release/source.json');
 assert.equal(source.productHistory.standaloneGitTag,null);
 assert.equal((await json('release/qualification.json')).standaloneSourceCommit,source.productHistory.commit);
 assert.equal(source.productHistory.tagMeaning,'product release identifier required by release.v1; no standalone Git ref is asserted');
 assert.equal(source.productHistory.canonicalProductRepository,source.receizSource.repository);
 const readiness=(await read('RELEASE-READINESS.md')).toString();
 assert(!readiness.includes('alignment-pending.json'));
 assert(!readiness.includes('signer is not executed'));
 assert(readiness.includes('npm run verify:release'));
 assert(readiness.includes('release/attestation.json'));
 assert(readiness.includes('16 tagged release-family files'));
});
