import {mkdir,rm,copyFile,cp} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','guide.html','privacy.html','robots.txt','sitemap.xml','manifest.webmanifest','sw.js','.nojekyll'])await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log('Static site built into dist/');
