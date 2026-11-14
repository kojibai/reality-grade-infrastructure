import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {openGovernanceIdentitySource,GOVERNANCE_OWNER} from '../tools/governance-audit.mjs';
import {inventory} from '../tools/verify-release.mjs';
const original=JSON.parse(await readFile(new URL('./governance-source.json',import.meta.url),'utf8'));
test('published SDK verifies held governance with network forbidden',async()=>{
 const previous=globalThis.fetch;globalThis.fetch=()=>{throw Error('network_forbidden')};
 try {assert.equal((await openGovernanceIdentitySource(original,GOVERNANCE_OWNER,'governance-artifacts')).action,'governance-artifacts');}finally{globalThis.fetch=previous;}
});
for(const [name,change] of [
 ['substituted identity',source=>source.identity.keyId='0'.repeat(64)],
 ['changed source digest',source=>source.state.proof.digestSha256Hex='0'.repeat(64)],
 ['changed signed date',source=>source.state.exportedAt='2000-01-01T00:00:00Z'],
 ['extra source field',source=>source.untrusted=true],
])test(`rejects ${name}`,async()=>{const source=structuredClone(original);change(source);await assert.rejects(()=>openGovernanceIdentitySource(source,GOVERNANCE_OWNER,'governance-artifacts'));});
test('rejects wrong purpose',async()=>{await assert.rejects(()=>openGovernanceIdentitySource(original,GOVERNANCE_OWNER,'release-attestation'));});
test('inventory changes on altered or added bytes',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'receiz-inventory-'));
 try {await writeFile(path.join(dir,'file.txt'),'original');const held=await inventory(dir);await writeFile(path.join(dir,'file.txt'),'altered');assert.notDeepEqual(await inventory(dir),held);await writeFile(path.join(dir,'extra.txt'),'extra');assert.equal((await inventory(dir)).length,2);}finally{await rm(dir,{recursive:true,force:true});}
});

test('foundation declaration equals its 55 numbered entries',async()=>{
 const foundation=JSON.parse(await readFile(new URL('../release/ontology/foundation-register.json',import.meta.url),'utf8'));
 assert.equal(foundation.invariants.length,55);
 assert.equal(foundation.declaredInvariantCount,foundation.invariants.length);
});
