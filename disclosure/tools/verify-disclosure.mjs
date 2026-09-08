// Inventory integrity only. This is not Receiz proof or release authentication.
import { createHash } from 'node:crypto';
import { lstat, readdir, open, constants } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
export const manifestPath = 'provenance/disclosure-manifest.json';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const fail = message => { throw new Error(message); };
export function safePath(value) {
 if(typeof value!=='string'||!value||!/^[A-Za-z0-9_./-]+$/.test(value)||value.split('/').some(p=>!p||p==='.'||p==='..'||p.startsWith('.'))||/\.(?:map|pem|key|sql)$/i.test(value)) fail('unsafe disclosure path');
 return value;
}
export async function guardAncestors(value) {
 const absolute=path.resolve(value); let current=path.parse(absolute).root;
 for(const part of absolute.slice(current.length).split('/').filter(Boolean)){
  current=path.join(current,part); const info=await lstat(current);
  if(info.isSymbolicLink()||!info.isDirectory()) fail('unsafe directory ancestor');
 }
}
export async function readRegular(root, relative) {
 safePath(relative); const file=path.join(root,relative); await guardAncestors(path.dirname(file));
 const before=await lstat(file); if(!before.isFile()||before.nlink!==1) fail('unsafe disclosure file');
 const handle=await open(file,constants.O_RDONLY|constants.O_NOFOLLOW);
 try{const info=await handle.stat(); if(!info.isFile()||info.nlink!==1||info.ino!==before.ino||info.dev!==before.dev)fail('changed disclosure file'); return await handle.readFile();}finally{await handle.close();}
}
function exactKeys(value, keys) { if(!value||Array.isArray(value)||typeof value!=='object'||Object.keys(value).sort().join(',')!==keys.sort().join(','))fail('unexpected manifest fields'); }
export async function verifyDisclosure(root,{requireRelease=false}={}) {
 if(requireRelease)fail('release bindings unavailable: preparation cannot authorize publication');
 await guardAncestors(root);
 const manifest=JSON.parse((await readRegular(root,manifestPath)).toString('utf8'));
 exactKeys(manifest,['schema','status','releaseIdentity','privateProjectionAttestationSha256','treeSha256','files']);
 if(manifest.schema!=='receiz.disclosure-preparation.v1'||manifest.status!=='preparation'||manifest.releaseIdentity!==null||manifest.privateProjectionAttestationSha256!==null)fail('unsupported or invented release binding');
 if(!Array.isArray(manifest.files)||!manifest.files.length)fail('empty disclosure inventory');
 const expected=new Set([manifestPath]); const ids=new Set();let last='';
 for(const file of manifest.files){
  exactKeys(file,['componentId','destination','bytes','sha256']);safePath(file.destination);
  if(!/^[a-z][a-z0-9.-]+$/.test(file.componentId)||ids.has(file.componentId)||expected.has(file.destination)||file.destination<=last||!Number.isSafeInteger(file.bytes)||file.bytes<0||!/^[a-f0-9]{64}$/.test(file.sha256))fail('invalid disclosure entry');
  ids.add(file.componentId);expected.add(file.destination);last=file.destination;
  const bytes=await readRegular(root,file.destination);if(bytes.length!==file.bytes||sha256(bytes)!==file.sha256)fail('disclosure bytes differ');
 }
 if(sha256(JSON.stringify(manifest.files))!==manifest.treeSha256)fail('disclosure tree digest differs');
 const allowedDirs=new Set();for(const entry of expected){let dir=path.posix.dirname(entry);while(dir!=='.'){allowedDirs.add(dir);dir=path.posix.dirname(dir);}}
 async function walk(relative=''){
  for(const entry of await readdir(path.join(root,relative),{withFileTypes:true})){
   const name=relative?`${relative}/${entry.name}`:entry.name;safePath(name);
   if(entry.isDirectory()){if(!allowedDirs.has(name))fail('extra disclosure directory');await walk(name);}
   else{if(!expected.has(name))fail('extra disclosure file');await readRegular(root,name);}
  }
 }
 await walk();return {status:'preparation',integrity:true,publicationReady:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{const args=process.argv.slice(2);if(args.length>2||(args[1]&&args[1]!=='--require-release'))fail('unsupported argument');console.log(JSON.stringify(await verifyDisclosure(args[0]||'.',{requireRelease:args[1]==='--require-release'})));}
 catch(error){console.error(error.message);process.exitCode=1;}
}
