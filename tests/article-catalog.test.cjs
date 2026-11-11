const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const readHtml=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8').match(/const ARTICLE_LIBRARY=(.*?);\nconst ARTICLES=/s)[1]);
const library=readHtml('student.html');
assert.equal(library.length,13);
assert.equal(new Set(library.map(a=>a.id)).size,13);
for(const page of ['parent.html','family-test.html'])assert.deepEqual(readHtml(page),library,page+' must offer same content');
for(const name of ['home-data.js','home-demo-data.js']){
 const lessons=JSON.parse(fs.readFileSync(path.join(root,name),'utf8').match(/window.(?:AEAS_LESSONS|DEMO_LESSONS)=(.*);/s)[1]);
 assert.deepEqual(lessons.map(a=>a.id).sort(),library.map(a=>a.id).sort(),name+' catalog matches reading pages');
 for(const lesson of lessons)for(const key of Object.keys(lesson))assert.deepEqual(lesson[key],library.find(a=>a.id===lesson.id)[key],lesson.id+' '+key);
}
for(const slug of ['missing-voices','paper-bridge','bag-repair','club-roles','visible-sign']){
 const a=JSON.parse(fs.readFileSync(path.join(root,'content',slug+'.json'),'utf8'));
 assert.deepEqual(library.find(x=>x.id===a.id),a,'source and published article match');
 assert.equal(a.paragraphs.length,4);
 assert.equal(a.translations.length,a.paragraphs.flat().length);
 assert.ok(a.vocabularyGroups.length>=4);
 assert.ok(a.paragraphPrompt.paragraph>=0&&a.paragraphPrompt.paragraph<a.paragraphs.length);
 assert.ok(a.sentenceHelp.length>=3);
 const text=a.paragraphs.flat().join(' ').toLowerCase();
 for(const word of a.focus)assert.ok(text.includes(word),a.id+' contextual focus word '+word);
 for(const sample of a.audios)assert.ok(sample.duration>45&&sample.duration<120,a.id+' full audio duration');
}
console.log('Passed catalog consistency: 13 articles across student, parent and lesson lists; five source files, focus words, translations, paragraph prompts and full audio metadata.');
