/* Guarda solo respuestas clínicas estructuradas: no almacena textos de identificación libre. */
(function(){
'use strict';
const type=window.DEMO_SCALE;
const definitions={
 '4at':{name:'4AT-ES',max:12,get(){const s=state();if(!s.done)return null;const items=s.entries.map((x,i)=>({item:names[i],value:Number(x.value),label:x.dataset.label||''}));return {score:s.subtotal,interpretation:interpretation(s.subtotal).report,answers:items,report:'4AT-ES: '+s.subtotal+'/12 puntos. '+interpretation(s.subtotal).report+' Desglose: '+items.map(x=>x.item+' '+x.value+' puntos').join('; ')+'.'};}},
 'sarcf':{name:'SARC-F',max:10,get(){const a=getAnswers();if(a.filter(Boolean).length!==5)return null;const score=a.reduce((sum,x)=>sum+Number(x.value),0);return {score,interpretation:score>=4?'Cribado positivo':'Cribado negativo',answers:a.map((x,i)=>({item:['Fuerza','Ayuda para caminar','Levantarse','Escaleras','Caídas'][i],value:Number(x.value)})),report:document.getElementById('report').value};}},
 'villalta':{name:'Villalta',max:33,get(){const s=getState();if(!s.complete)return null;return {score:s.points,interpretation:grade(s).name,answers:[...s.symptoms,...s.signs].map(x=>({item:x.title,value:Number(x.value)})).concat([{item:'Úlcera venosa',value:s.ulcer==='yes'?'Sí':'No'}]),report:reportText(s)};}}
};
const def=definitions[type];if(!def)return;
function el(t,c,text){const e=document.createElement(t);if(c)e.className=c;if(text!==undefined)e.textContent=text;return e}
function onReady(){
 const store=window.DemoExpedientes;const slot=document.querySelector(type==='4at'?'.aside':'.summary');if(!store||!slot)return;
 const css=el('style');css.textContent=`.demo-save-box{margin:16px 0 0;background:#fff;border:1px solid #d9e1e9;border-radius:14px;padding:18px;font:13px/1.5 system-ui, sans-serif;color:#253a50;box-shadow:0 2px 12px #00000008}.demo-save-box h3{font-size:16px;margin:0 0 7px}.demo-save-box p{margin:7px 0;color:#586e7e}.demo-controls{display:grid;gap:9px;margin:12px 0}.demo-controls select,.demo-controls button{font:inherit;padding:10px;border-radius:8px;min-height:42px}.demo-controls select{background:#fff;border:1px solid #b4c7d5;width:100%}.demo-controls button{background:#1e5c89;color:#fff;font-weight:700;border:0;cursor:pointer}.demo-controls button:disabled{opacity:.46;cursor:not-allowed}.demo-secondary{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center}.demo-secondary a{color:#24628d}.demo-secondary button{font-size:12px;background:white;border:1px solid #c1cfda;border-radius:8px;padding:8px;cursor:pointer}.demo-message{min-height:20px;margin-top:8px!important}.demo-warning{color:#8a4e23!important;font-size:12px}.demo-save-box *{box-sizing:border-box}@media print{.demo-save-box{display:none!important}}`;
 document.head.append(css);
 const box=el('section','demo-save-box');box.setAttribute('aria-label','Guardar en expediente ficticio');
 box.append(el('h3','', 'Guardar en expediente de prueba'));const profileLine=el('p','','');box.append(profileLine);
 box.append(el('p','','Opcional: puedes utilizar la calculadora sin guardar nada. Solo se almacenarán los resultados que guardes expresamente.'));
 const controls=el('div','demo-controls'),sel=el('select');sel.setAttribute('aria-label','Seleccionar expediente ficticio');
 const save=el('button','','Guardar esta evaluación');save.type='button';save.disabled=true;
 const row=el('div','demo-secondary');const create=el('button','','+ Crear expediente DEMO');create.type='button';const link=el('a','','Ver expedientes');link.href='expedientes.html';const profilesLink=el('a','','Perfiles locales');profilesLink.href='perfiles.html';row.append(create,link,profilesLink);controls.append(sel,save,row);box.append(controls);
 const msg=el('p','demo-message');msg.setAttribute('role','status');box.append(msg);
 box.append(el('p','demo-warning','Solo pruebas con datos ficticios. No usar nombres, números de historia ni información identificable. Si abres archivos HTML directamente, el almacenamiento puede no compartirse entre páginas: utiliza localhost o HTTPS.'));
 slot.append(box);
 async function refresh(){const profile=await store.getCurrentProfile();profileLine.textContent=profile?'Perfil local activo: '+profile.name:'Acceso libre: sin perfil activo. Para guardar, crea o selecciona un perfil local ficticio.';create.disabled=!profile;const prev=sel.value;const people=profile?await store.listPatients():[];sel.replaceChildren();const none=el('option','','— Seleccionar expediente —');none.value='';sel.append(none);people.forEach(p=>{const o=el('option','',p.id);o.value=p.id;sel.append(o)});
 const urlId=new URLSearchParams(location.search).get('expediente');const desired=people.find(p=>p.id===urlId)?.id||people.find(p=>p.id===prev)?.id||people.find(p=>p.id===store.getActive())?.id||'';sel.value=desired;store.setActive(desired||null);update();}
 function update(){let valid=false;try{valid=!!def.get()}catch(err){valid=false}save.disabled=!(valid&&sel.value&&store.getActiveProfile());}
 sel.addEventListener('change',()=>{store.setActive(sel.value||null);msg.textContent='';update()});
 create.addEventListener('click',async()=>{try{create.disabled=true;const p=await store.createPatient();await refresh();sel.value=p.id;msg.textContent='Expediente '+p.id+' creado. Todavía no contiene evaluaciones.';update()}catch(err){msg.textContent='No se pudo crear el expediente: '+err.message}finally{create.disabled=false}});
 save.addEventListener('click',async()=>{const record=def.get();if(!record||!sel.value)return;try{save.disabled=true;await store.addEvaluation({patientId:sel.value,scaleId:type,scaleName:def.name,scaleVersion:type==='4at'?'4AT-ES 1.2':type==='sarcf'?'SARC-F': 'Villalta',maxScore:def.max,...record});msg.textContent='Evaluación guardada en '+sel.value+' ('+store.fmt(new Date().toISOString())+').';}catch(err){msg.textContent='No se pudo guardar: '+err.message}finally{update()}});
 document.addEventListener('change',()=>{msg.textContent='';update()});
 document.getElementById('reset')?.addEventListener('click',()=>setTimeout(update,0));
 window.addEventListener('storage',e=>{if(e.key==='mi_demo_active_profile_v2')refresh().catch(()=>{});});refresh().catch(err=>{sel.disabled=true;create.disabled=true;msg.textContent='Almacenamiento local no disponible: '+err.message+'; puedes seguir calculando sin guardar.'});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onReady);else onReady();
})();
