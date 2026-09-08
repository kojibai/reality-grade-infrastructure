import assert from 'node:assert/strict';
import {readdir,readFile,lstat} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {verifyProofNativeReleaseAttestation,GOVERNANCE_OWNER,LEGACY_GOVERNANCE_MANIFEST_SHA256,sha256} from './governance-audit.mjs';
export async function inventory(root,relative='') {
 const files=[];
 for(const entry of (await readdir(path.join(root,relative))).sort()) {
  if(!relative && ['.git','node_modules'].includes(entry))continue;
  const name=relative?`${relative}/${entry}`:entry;
  if(name==='release/attestation.json')continue;
  assert.ok(/^[A-Za-z0-9_./-]+$/.test(name)&&!name.split('/').includes('..'),'unsafe_release_path');
  const info=await lstat(path.join(root,name));
  assert.ok(!info.isSymbolicLink(),'release_symlink_forbidden');
  if(info.isDirectory())files.push(...await inventory(root,name));
  else {
   assert.ok(info.isFile()&&info.nlink===1,'release_regular_file_required');
   const bytes=await readFile(path.join(root,name));
   files.push({path:name,bytes:bytes.length,sha256:sha256(bytes)});
  }
 }
 return files.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
}
export async function verifyRelease(root) {
 const artifact=JSON.parse(await readFile(path.join(root,'release/attestation.json'),'utf8'));
 const payload=await verifyProofNativeReleaseAttestation(artifact,GOVERNANCE_OWNER,LEGACY_GOVERNANCE_MANIFEST_SHA256);
 assert.deepEqual(Object.keys(payload).sort(),['schema','release','repository','candidateCommit','candidateTree','sourceCommit','productHistory','scope','files'].sort());
 assert.equal(payload.schema,'receiz.disclosure.release.v1');
 assert.equal(payload.release,'v126.0.0-disclosure.1');
 assert.equal(payload.repository,'https://github.com/kojibai/reality-grade-infrastructure');
 for(const key of ['candidateCommit','candidateTree','sourceCommit'])assert.match(payload[key],/^[a-f0-9]{40}$/);
 assert.deepEqual(payload.files,await inventory(root),'release_inventory_mismatch');
 return {verified:true,release:payload.release,candidateCommit:payload.candidateCommit,files:payload.files.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
 try {console.log(JSON.stringify(await verifyRelease(process.cwd())));}catch(error){console.error(error.message);process.exitCode=1;}
}
