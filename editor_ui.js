
'use strict';
const $=x=>document.getElementById(x), L=window.LabEditor, KEYS={normal:'optNormal',units:'optUnits',rnl:'optRnl',nonhdl:'optNonhdl',retic:'optRetic',inferUnits:'optInferUnits',cmi:'optCmi',microDetail:'optMicroDetail',differentialPct:'optDifferentialPct',fena:'optFena',feurea:'optFeurea',ureaRatio:'optUreaRatio',crRatio:'optCrRatio',rfi:'optRfi',anionGap:'optAnionGap',deltaRatio:'optDeltaRatio',tibc:'optTibc'};
let parsed=null,selected={},generated='',manual=false,confirmRegen=false;
function readOpts(){const o={profile:$('profile').value,gasType:$('gasType').value,gasFormat:$('gasFormat').value};for(const [k,id] of Object.entries(KEYS))o[k]=$(id).checked;return o;}
function writeOpts(o){if(o.profile==='resumen'){o={...o,profile:'completo',normal:true};}$('profile').value=['completo','alterados'].includes(o.profile)?o.profile:'completo';$('gasFormat').value=['completo','etiquetado','barras'].includes(o.gasFormat)?o.gasFormat:'completo';for(const [k,id] of Object.entries(KEYS))$(id).checked=o[k]??L.defaults[k];if(o.gasType)$('gasType').value=o.gasType;}
function settingStatus(msg){$('prefsStatus').textContent=msg;}
function outputStatus(msg){$('outputStatus').textContent=msg;}
function savePrefs(){const c=readOpts();delete c.gasType;try{localStorage.setItem('editor_analiticas_prefs_v27',JSON.stringify(c));settingStatus('Preferencias guardadas en este navegador.')}catch(e){settingStatus('No se ha podido guardar en el navegador; puedes exportar el archivo.')}}
function loadPrefs(){try{const data=JSON.parse(localStorage.getItem('editor_analiticas_prefs_v27')||localStorage.getItem('editor_analiticas_prefs_v26')||localStorage.getItem('editor_analiticas_prefs_v25')||localStorage.getItem('editor_analiticas_prefs_v24')||'null');if(data&&typeof data==='object')writeOpts({...L.defaults,...data})}catch(e){}}
function downloadFile(name,body){const blob=new Blob([body],{type:'application/json;charset=utf-8'});const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function visibleSections(){
 if(!parsed)return[];
 const found=new Set(parsed.items.map(e=>['orina','orina_bioq','orina_sistema','indices_renales'].includes(e.section)?'orina':e.section));
 if(parsed.cultures.length)found.add('cultivos');
 if(parsed.texts.frotis)found.add('frotis');
 if(parsed.texts.proteinograma)found.add('proteinograma');
 return L.ORDER.filter(k=>found.has(k));
}
function buildSections(){const el=$('sectionChecks');el.replaceChildren();const keys=visibleSections();if(!keys.length){el.innerHTML='<span class="empty">No se han reconocido apartados.</span>';return;}
 for(const k of keys){selected[k]=selected[k]!==false;const label=document.createElement('label');label.className='secCheck';const inp=document.createElement('input');inp.type='checkbox';inp.checked=selected[k];inp.dataset.section=k;inp.addEventListener('change',()=>{selected[k]=inp.checked;markStale()});label.append(inp,document.createTextNode(L.TITLES[k]));el.append(label)}
 $('allSections').checked=keys.every(k=>selected[k]);}
function reviewList(id,rows,msg){const ul=$(id);ul.replaceChildren();if(!rows.length){const li=document.createElement('li');li.textContent=msg;ul.append(li);return;}
 for(const x of rows){const li=document.createElement('li');li.textContent=(x.line||'')+(x.reason?' — '+x.reason:'');ul.append(li);}}
function updateReview(res){$('countRecognized').textContent=(parsed.items.length+parsed.cultures.length)+' reconocidos';$('countOmitted').textContent=res.ignored.length+' omitidos';$('countPending').textContent=res.pending.length+' pendientes';const tbody=$('recognizedList');tbody.replaceChildren();for(const e of (res.processedItems||parsed.items)){const row=document.createElement('tr');const name=document.createElement('td');name.textContent=e.name;const val=document.createElement('td');val.textContent=e.raw+(e.unit?' '+e.unit:'')+(e.unitInferred?' [unidad inferida]':'')+(e.rangeInferred?' [rango orientativo]':'');if(e.abnormal&&e.abnormal!=='normal')val.className='flag';const sec=document.createElement('td');sec.textContent=L.TITLES[e.section];row.append(name,val,sec);tbody.append(row);}for(const c of parsed.cultures){const row=document.createElement('tr');for(const s of [c.name,c.status||c.organism||'—','Cultivos']){const cell=document.createElement('td');cell.textContent=s;row.append(cell)}tbody.append(row)}reviewList('omittedList',res.ignored,'No hay valores omitidos por reglas fijas.');reviewList('inferredList',res.inferred||[],'Sin valores completados automáticamente.');reviewList('pendingList',res.pending,'Sin datos pendientes de revisión.');}
function markStale(){if(parsed)outputStatus(manual?'Has editado el texto. Las opciones han cambiado; pulsa Regenerar si deseas sustituirlo.':'Opciones modificadas. Pulsa Regenerar para aplicarlas.');}
function regenerate(force=false){if(!parsed){outputStatus('Procesa una analítica primero.');return;}
 if(manual&&!force&&!confirmRegen){confirmRegen=true;outputStatus('Tienes cambios manuales. Vuelve a pulsar Regenerar para sustituirlos, o usa «Restaurar generado».');return;}
 confirmRegen=false;const opts=readOpts();const res=L.format(parsed,opts,selected);updateReview(res);$('parseAlert').hidden=!res.blocked;$('parseAlert').textContent=res.blocked||'';
 if(res.blocked){outputStatus('Generación detenida: revisa el aviso.');return;}
 $('outputText').value=res.output;generated=res.output;manual=false;outputStatus(res.pending.length?'Resultado generado. Revisa los '+res.pending.length+' elementos pendientes.':'Resultado generado. Puedes editarlo y copiarlo.');}
function process(){const raw=$('rawInput').value;if(!raw.trim()){$('inputStatus').textContent='Pega una analítica anonimizada o selecciona un archivo de prueba.';return;}
 parsed=L.parse(raw);selected={};$('gasField').classList.toggle('hidden',!parsed.seenGas);$('gasType').value=parsed.gas.sourceType||'';buildSections();manual=false;confirmRegen=false;generated='';$('outputText').value='';$('inputStatus').textContent='Análisis completado localmente: '+(parsed.items.length+parsed.cultures.length)+' valores o cultivos identificados.';regenerate(true);}
$('processBtn').addEventListener('click',process);
$('clearBtn').addEventListener('click',()=>{$('rawInput').value='';$('outputText').value='';$('documentFile').value='';$('retirePdfBtn').hidden=true;$('fileStatus').textContent='PDF.js local · texto seleccionable · sin OCR.';$('inputStatus').textContent='';$('outputStatus').textContent='';$('parseAlert').hidden=true;$('gasField').classList.add('hidden');parsed=null;selected={};generated='';manual=false;confirmRegen=false;$('sectionChecks').innerHTML='<span class="empty">Primero procesa una analítica para ver sus apartados.</span>';$('recognizedList').replaceChildren();reviewList('omittedList',[],'Sin resultados procesados.');reviewList('inferredList',[],'Sin resultados procesados.');reviewList('pendingList',[],'Sin resultados procesados.');$('countRecognized').textContent='0 reconocidos';$('countOmitted').textContent='0 omitidos';$('countPending').textContent='0 pendientes';});
$('outputText').addEventListener('input',()=>{manual=$('outputText').value!==generated;confirmRegen=false;outputStatus(manual?'Texto modificado manualmente; tus cambios se conservarán hasta regenerar.':'Texto generado sin modificaciones.');});
$('regenBtn').addEventListener('click',()=>regenerate());
$('restoreBtn').addEventListener('click',()=>{$('outputText').value=generated;manual=false;confirmRegen=false;outputStatus('Restaurado el último resultado generado, sin modificar la analítica original.');});
$('copyBtn').addEventListener('click',async()=>{const txt=$('outputText').value;if(!txt){outputStatus('No hay texto que copiar.');return;}try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(txt);else{$('outputText').focus();$('outputText').select();if(!document.execCommand('copy'))throw Error('No disponible')}outputStatus('Texto copiado.')}catch(e){outputStatus('No se ha podido copiar automáticamente. Selecciona el texto y utiliza Ctrl+C.');}});
$('profile').addEventListener('change',()=>{if($('profile').value==='alterados'&&$('optNormal').checked){$('prefsStatus').textContent='El perfil de resultados alterados muestra las determinaciones fuera de rango y resume las restantes como «resto normal» cuando procede.';}markStale();});$('gasFormat').addEventListener('change',markStale);$('gasType').addEventListener('change',markStale);for(const id of Object.values(KEYS))$(id).addEventListener('change',()=>{if(parsed)buildSections();markStale()});
$('allSections').addEventListener('change',e=>{for(const k of visibleSections())selected[k]=e.target.checked;buildSections();markStale();});
$('savePrefs').addEventListener('click',savePrefs);
$('resetPrefs').addEventListener('click',()=>{writeOpts(L.defaults);settingStatus('Opciones restablecidas. Guarda si quieres mantenerlas.');markStale();});
$('exportPrefs').addEventListener('click',()=>{const obj=readOpts();delete obj.gasType;downloadFile('preferencias_editor_analiticas.json',JSON.stringify({version:1,editor:'Editor de analíticas',preferences:obj},null,2));settingStatus('Archivo de configuración preparado.');});
$('importPrefs').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>25000)throw Error('Archivo demasiado grande');const j=JSON.parse(await f.text());if(j.editor!=='Editor de analíticas'||!j.preferences||j.version!==1)throw Error('Configuración no reconocida');writeOpts({...L.defaults,...j.preferences});settingStatus('Preferencias importadas. Pulsa Guardar preferencias para conservarlas.');markStale();}catch(err){settingStatus('No se pudo importar: '+err.message)}finally{e.target.value='';}});
async function importLocalFile(file){if(!file)return;const el=$('fileStatus');el.textContent='Extrayendo el texto en el dispositivo…';
 try{const result=await window.LabFileReader.read(file);$('rawInput').value=result.text;$('retirePdfBtn').hidden=result.type!=='pdf';
  el.textContent=result.type==='pdf'?'PDF.js: '+result.pages+' páginas leídas localmente. Comprueba el texto extraído y el informe.':'Texto cargado localmente.';
  process();if(result.type==='pdf')$('inputStatus').textContent+=' PDF.js local: coteja los valores con el informe original.';
 }catch(err){el.textContent='No se pudo extraer: '+err.message;}
 finally{$('documentFile').value='';}
}
$('retirePdfBtn').addEventListener('click',()=>{$('rawInput').value='';$('retirePdfBtn').hidden=true;$('fileStatus').textContent='Texto fuente retirado de la pantalla. El informe generado permanece disponible; usa Borrar todo para eliminarlo.';$('inputStatus').textContent='Se ha retirado el texto original. El resultado puede editarse y copiarse.';});
$('documentFile').addEventListener('change',e=>importLocalFile(e.target.files?.[0]));
const zone=$('dropZone');
for(const type of ['dragenter','dragover'])zone.addEventListener(type,e=>{e.preventDefault();e.stopPropagation();zone.classList.add('dragOver');});
for(const type of ['dragleave','drop'])zone.addEventListener(type,e=>{e.preventDefault();e.stopPropagation();zone.classList.remove('dragOver');});
zone.addEventListener('drop',e=>importLocalFile(e.dataTransfer?.files?.[0]));
// Avoid accidentally opening a dropped document over this editor.
window.addEventListener('dragover',e=>e.preventDefault());
window.addEventListener('drop',e=>e.preventDefault());
loadPrefs();
