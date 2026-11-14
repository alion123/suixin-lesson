import {readFile,access,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const html=await readFile(path.join(dist,'index.html'),'utf8');
if(!html.includes('学习通（超星）网页版'))throw Error('Missing supported platform in homepage');
for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const ref=match[1];if(ref.startsWith('#')||/^[a-z]+:/i.test(ref))continue;
 await access(path.join(dist,ref.split(/[?#]/)[0]));
}
for(const name of ['manifest.json','content.js','popup.html','popup.js'])await access(path.join(root,'extension',name));
JSON.parse(await readFile(path.join(root,'extension','manifest.json'),'utf8'));
async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){
 const p=path.join(dir,e.name);if(e.isDirectory()){if(['.git','node_modules'].includes(e.name))continue;await scan(p);}else if(/\.(html|js|css|json|md|toml|jsonc)$/.test(e.name)){
 const s=await readFile(p,'utf8');if(/(?:C:\\Users\\|appgprj_|appgdep_|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/.test(s))throw Error('Unexpected private local/provider data in '+p);
}}}await scan(root);
console.log('PASS: platform copy, local links, extension manifest, and portable source checks');
