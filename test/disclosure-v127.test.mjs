import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {canonicalizeReceizConstitution,RECEIZ_CURRENT_REGISTRY_DIGEST} from '@receiz/sdk';
import {verifyProofNativeReleaseAttestation,GOVERNANCE_OWNER,LEGACY_GOVERNANCE_MANIFEST_SHA256} from '../tools/governance-audit.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url));
const json=async path=>JSON.parse(await read(path));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
test('current registry, predecessor, census and catalog bind the installed SDK127',async()=>{
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
 const source=await json('release/source.json');assert.equal(source.disclosureVersion,'1.1.0');assert.equal(source.compatibleProductVersion,'127.0.0');assert.equal(source.productHistory.tag,'v127.0.0');
 const packages=await json('release/evidence/package-publication-v127.json');assert.equal(packages.packages.length,3);for(const p of packages.packages){assert.equal(p.version,'127.0.0');assert.match(p.integrity,/^sha512-/);}
});
