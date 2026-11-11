const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const elements=new Map();
const node=()=>({textContent:'',innerHTML:'',value:0,checked:true,disabled:false,classList:{toggle(){},add(){},remove(){}},style:{setProperty(){}},querySelectorAll:()=>[],showModal(){},close(){}});
const doc={getElementById:id=>{if(!elements.has(id))elements.set(id,node());return elements.get(id)},querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},createElement:()=>({click(){}}),hidden:false};
const context={document:doc,console,crypto:require('node:crypto').webcrypto,Blob,URL,performance:{now:()=>5000},setTimeout:()=>1,clearTimeout(){},setInterval(){},cancelAnimationFrame(){},requestAnimationFrame:()=>1,navigator:{},prompt:()=>null};
context.window=context;context.addEventListener=()=>{};context.getSelection=()=>({toString:()=>''});context.scrollTo=()=>{};
context.SpeechSynthesisUtterance=function(text){this.text=text};
const spoken=[];
context.speechSynthesis={getVoices:()=>[{lang:'en-GB',localService:true}],cancel(){},pause(){},resume(){},speak(u){spoken.push(u.text);u.onstart();u.onend()}};
vm.createContext(context);
const path=require('node:path');const htmlPath=path.join(__dirname,'../student.html');const scriptText=fs.readFileSync(htmlPath,'utf8').split('<script>')[1].split('</script>')[0];let source=scriptText;
source=source.slice(0,source.lastIndexOf('\n(async()=>'));
vm.runInContext(source,context);
const run=s=>vm.runInContext(s,context);
(async()=>{
run('selectArticle("school-club-v1");session=makeSession();records=[session]');
assert.equal(run('articleWords()'),128);
for(const id of ['school-club-v1','garden-v1','camp-gorra-classroom-v1']){
 run('selectArticle('+JSON.stringify(id)+');session=makeSession();');
 assert.equal(run('SENTENCES.length'),run('TRANSLATIONS.length'));
 assert.equal(run('Array.from(new Set(SENTENCES.join(" ").split(/\\s+/).map(cleanWord))).filter(w=>w&&!DICT[w]).length'),0,'complete dictionary '+id);
 assert.equal(run('ARTICLE.questions.length'),2);
 assert.equal(run('ARTICLE.questions.every(q=>q.correct>=0&&q.correct<q.options.length&&q.evidence.every(i=>i>=0&&i<SENTENCES.length))'),true);
 run('stage="read";render()');
 assert.doesNotMatch(elements.get('main').innerHTML,/sampleFlow|loadSampleMarks|G 的模拟反馈/);
 assert.match(elements.get('main').innerHTML,/需要时，听全文朗读示范/);
 assert.doesNotMatch(elements.get('main').innerHTML,/本篇重点词回顾|data-question=/);
 assert.doesNotMatch(run('selectedMarkup()'),/translation-text/);
 run('stage="review";render()');
 assert.match(elements.get('main').innerHTML,/data-question="0"/);
 assert.match(elements.get('main').innerHTML,/data-question="1"/);
 assert.match(elements.get('main').innerHTML,/本篇重点词回顾/);
}
run('selectArticle("school-club-v1");session=makeSession();records=[session];session.marks.similar={kind:"不懂词义",source:"学生手动确认"};const clubSession=session');
run('openReading("garden-v1");session.translations.push({type:"单词"});const gardenSession=session');
assert.equal(run('ARTICLE.id'),'garden-v1');
assert.equal(run('readingState("school-club-v1").label'),'进行中');
assert.equal(run('readingState("garden-v1").label'),'进行中');
run('openReading("school-club-v1")');assert.equal(run('session.id===clubSession.id'),true);
assert.equal(run('Object.keys(session.marks).join()'),'similar');
assert.equal(run('AUDIO_SAMPLES.length'),4);
const speechBefore=spoken.length;elements.get('playAll').onclick();assert.equal(spoken.length-speechBefore,14);
assert.equal(run('session.listens.every(l=>l.completed)'),true);
run('stage="review";render()');await elements.get('toFinish').onclick();assert.equal(run('session.status'),'draft');
run('session.recordings.push({id:"clip1",seconds:45,blob:new Blob(["test"],{type:"audio/webm"})});session.answers=[1,0]');
assert.match(run('questionSummary(session)'),/2 题选择正确/);
await elements.get('toFinish').onclick();assert.equal(run('session.status'),'finished');
assert.equal(run('progressData().week'),1);
run('stage="training";render()');assert.match(elements.get('main').innerHTML,/A Different Kind of School Club/);assert.match(elements.get('main').innerHTML,/A Garden for Everyone/);
run('parentRecordId=gardenSession.id;stage="parent";render()');assert.match(elements.get('main').innerHTML,/<h2>A Garden for Everyone<\/h2>/);assert.doesNotMatch(elements.get('main').innerHTML,/G 的模拟反馈/);
assert.equal(run('session.id===clubSession.id'),true,'parent view must not replace student session');
run('navigate("read")');assert.equal(run('ARTICLE.id'),'school-club-v1');
run('openReading("garden-v1");session.answer=0;delete session.answers');assert.match(run('questionSummary(session)'),/1 \/ 2/);
assert.equal(run('AUDIO_SAMPLES.length'),4);
run('selected={word:"comfortable",text:"comfortable",sentence:4};showMeaning=true;showTranslation=true');assert.match(run('selectedMarkup()'),/树荫让这个地方更加舒适/);
run('stage="finish";render()');assert.match(elements.get('main').innerHTML,/练习回顾/);assert.doesNotMatch(elements.get('main').innerHTML,/模拟反馈/);
console.log('Passed trial/article checks: original articles, 128-word text, complete per-article dictionaries/translations, two evidence-based questions, collapsed help, no simulated student actions, audio fallback, recording completion gate, independent resume/progress, parent mapping and legacy answer compatibility.');
})().catch(e=>{console.error(e);process.exitCode=1});
setTimeout(async()=>{
try{
 run('selectArticle("camp-gorra-classroom-v1");session=makeSession();records=[session];stage="read";render()');
 assert.equal(run('articleWords()'),163);
 assert.equal(run('SENTENCES.length'),7);
 assert.equal(run('AUDIO_SAMPLES.length'),4);
 assert.equal(run('AUDIO_SAMPLES.every(a=>a.duration>45&&a.data.startsWith("audio/"))'),true);
 const campAudio=run('AUDIO_SAMPLES.find(a=>a.voice==="Natasha").data');
 run('selectArticle("school-club-v1")');assert.notEqual(campAudio,run('AUDIO_SAMPLES.find(a=>a.voice==="Natasha").data'));
 run('selectArticle("camp-gorra-classroom-v1");stage="read";render()');
 assert.match(elements.get('main').innerHTML,/camp|Camp/);
 assert.doesNotMatch(elements.get('main').innerHTML,/原创预习短文/);
 let playCount=0;const nativeAudio={paused:true,currentTime:0,playbackRate:1,play(){playCount++;return Promise.resolve()}};
 context.document.querySelector=s=>s.includes('Natasha')?nativeAudio:null;
 run('fullVoice="Natasha"');elements.get('playAll').onclick();assert.equal(playCount,1);assert.equal(nativeAudio.playbackRate,1);
 context.document.querySelector=()=>null;
 run('stage="training";render()');const list=elements.get('main').innerHTML;
 for(const name of ['Great fun at Camp Gorra!','A Garden for Everyone','A Different Kind of School Club'])assert.ok(list.includes(name),name);
 assert.match(list,/课堂复习阅读/);
 run('selectArticle("school-club-v1");session=makeSession();records=[session];const priorSession=session');
 context.URLSearchParams=URLSearchParams;context.location={search:'?article=camp-gorra-classroom-v1&v=audio'};
 run('openDb=async()=>({});transact=async()=>records;persist=async(target=session)=>{if(!records.some(r=>r.id===target.id))records.push(target);return true}');
 const boot=scriptText;await run(boot.slice(boot.lastIndexOf('\n(async()=>')));
 assert.equal(run('ARTICLE.id'),'camp-gorra-classroom-v1');assert.equal(run('stage'),'read');assert.equal(run('records.some(r=>r.id===priorSession.id)'),true);
 console.log('Passed added checks: three article cards, camp word/dictionary/translation coverage, full MP3 references, correct native audio selection, source labels, and deep links retaining prior sessions.');
}catch(e){console.error(e);process.exitCode=1}
},0);
setTimeout(async()=>{
try{
 assert.equal(run('Object.keys(ARTICLES).length'),13);
 const ids=Array.from(run('Object.keys(ARTICLES)'));
 for(const id of ids){
  run('selectArticle('+JSON.stringify(id)+');session=makeSession();records=[session];stage="read";render()');
  assert.equal(run('SENTENCES.length'),run('TRANSLATIONS.length'),id+' translations');
  assert.equal(run('Array.from(new Set(SENTENCES.join(" ").split(/\\s+/).map(cleanWord))).filter(w=>w&&!DICT[w]).length'),0,id+' dictionary');
  assert.equal(run('ARTICLE.focus.every(w=>DICT[w])'),true,id+' focus definitions');
  assert.equal(run('ARTICLE.questions.length'),2,id+' question count');
  assert.equal(run('ARTICLE.questions.every(q=>q.correct>=0&&q.correct<q.options.length&&q.evidence.length&&q.evidence.every(i=>i>=0&&i<SENTENCES.length))'),true,id+' question references');
  assert.deepEqual(Array.from(run('AUDIO_SAMPLES.map(a=>a.voice).sort()')),['Natasha','Ryan','Sonia','William'],id+' voices');
  for(const sample of run('AUDIO_SAMPLES')){
   assert.ok(/^audio\/[A-Za-z0-9_.-]+\.mp3$/.test(sample.data),id+' relative audio path');
   assert.ok(fs.statSync(path.join(__dirname,'..',sample.data)).size>100000,id+' full audio file');
  }
  assert.doesNotMatch(elements.get('main').innerHTML,/sampleFlow|loadSampleMarks|data-question=/,id+' read first');
 }
 run('stage="training";render()');
 assert.equal((elements.get('main').innerHTML.match(/class="panel article-card"/g)||[]).length,13);
 run('records=[];selectArticle("school-club-v1");session=makeSession();session.status="finished";session.recordings=[{id:"saved",blob:new Blob(["voice"]),seconds:20}];records.push(session);selectArticle("garden-v1");session=makeSession();session.marks.empty={kind:"不会读",source:"学生手动确认"};records.push(session);const draftId=session.id;openReading("small-steps-v1");session.marks.progress={kind:"不懂词义",source:"学生手动确认"};openReading("garden-v1")');
 assert.equal(run('session.id===draftId'),true,'old recording sessions and marks survive article changes');
 assert.equal(run('readingState("school-club-v1").label'),'已完成');
 assert.equal(run('readingState("small-steps-v1").label'),'进行中');
 const button={dataset:{downloadSample:'Natasha'},disabled:false};
 context.document.querySelectorAll=selector=>selector==='[data-download-sample]'?[button]:[];
 let fetched='',downloaded='';context.fetch=async url=>{fetched=url;return{ok:true,blob:async()=>new Blob(['mp3'],{type:'audio/mpeg'})}};
 run('downloadBlob=(blob,name)=>{window.downloadedName=name}');run('selectArticle("small-steps-v1");bindCommon()');await button.onclick();
 assert.match(fetched,/small-steps-v1_classroom_Natasha\.mp3$/);assert.equal(context.downloadedName,'TUWEI_small-steps-v1_classroom_Natasha.mp3');assert.equal(button.disabled,false);
 context.fetch=async()=>{throw new Error('offline')};await button.onclick();assert.match(elements.get('toast').textContent,/下载未完成/);assert.equal(button.disabled,false);
 assert.ok(Buffer.byteLength(fs.readFileSync(htmlPath,'utf8'))<250000,'page does not download all audio eagerly');
 console.log('Passed thirteen-article regression: full dictionaries/translations, 26 evidence-based questions, 52 valid audio files, old session preservation, read-first UI, and audio download success/failure.');
}catch(e){console.error(e);process.exitCode=1}
},30);
setTimeout(async()=>{
try{
 context.document.querySelectorAll=()=>[];context.document.querySelector=()=>null;
 run('selectArticle("small-steps-v1");session=makeSession();records=[session];stage="review";render();session.answers=[0];session.evidenceAnswers={}');
 let markup=run('comprehensionMarkup()');assert.match(markup,/回到原文，选一句依据/);assert.doesNotMatch(markup,/选项正确/,'feedback waits for an evidence choice');
 run('session.evidenceAnswers[0]=8');assert.match(run('comprehensionMarkup()'),/你找到了一句相关依据/);
 run('session.evidenceAnswers[0]=0');assert.match(run('comprehensionMarkup()'),/联系不够直接/);
 run('session.paragraphNotes={2:"<script>bad</script> 我认为他有进步。"}');
 assert.match(run('paragraphCoachMarkup()'),/&lt;script&gt;/);assert.doesNotMatch(run('paragraphCoachMarkup()'),/<script>/);
 run('stage="parent";parentRecordId=session.id;render()');assert.match(elements.get('main').innerHTML,/一句话理解/);assert.match(elements.get('main').innerHTML,/&lt;script&gt;/);
 for(const id of ['small-steps-v1','right-book-v1','changing-map-v1','quiet-experiment-v1','more-than-name-v1']){
  run('selectArticle('+JSON.stringify(id)+');session=makeSession();stage="review";render()');
  assert.match(elements.get('main').innerHTML,/选一段，用自己的话说一句/);assert.match(elements.get('main').innerHTML,/读后长句提示/);
 }
 const teacherTerms=['owl','camouflage','dolphin','tail','jaw','flippers','communication','type','alike','similar','teamwork','whistle','body language','pods','join','chase','carry','back and forth','for example','such as','assist','advantage','intelligent'];
 const corpus=run('Object.values(ARTICLES).filter(a=>a.paragraphPrompt).flatMap(a=>a.paragraphs.flat()).join(" ").toLowerCase()');
 for(const term of teacherTerms)assert.ok(corpus.includes(term),'classroom vocabulary appears in meaningful context: '+term);
 assert.equal(run('ARTICLES["quiet-experiment-v1"].dictionary.camouflage.meaning.includes("名词")'),true);
 assert.equal(run('ARTICLES["right-book-v1"].dictionary.flippers.meaning.includes("鳍状肢")'),true);
 console.log('Passed classroom review checks: evidence before feedback, literal vs inferred meaning, paragraph notes and safe parent display, all 23 vocabulary entries, word formation and connective help.');
}catch(e){console.error(e);process.exitCode=1}
},70);
