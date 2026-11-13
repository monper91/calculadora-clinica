(()=>{'use strict';
const D=window.VADE_DRUGS||[],$=id=>document.getElementById(id),fmt=x=>Number(x).toLocaleString('es-ES',{maximumFractionDigits:3}),norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');let current='';let lastCopy='';const favKey='vademecum_favoritos_v1';let favorites=new Set();try{favorites=new Set(JSON.parse(localStorage.getItem(favKey)||'[]').filter(x=>typeof x==='string'))}catch(_){favorites=new Set()}let onlyFavorites=false;function saveFaves(){try{localStorage.setItem(favKey,JSON.stringify([...favorites]))}catch(_){}}function toggleFav(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);saveFaves();renderList();if(current===id)refreshDetailStar()}function makeStar(id){const b=element('button','starBtn'+(favorites.has(id)?' isFav':''),favorites.has(id)?'★':'☆');b.type='button';b.title=favorites.has(id)?'Quitar de favoritos':'Añadir a favoritos';b.setAttribute('aria-label',(favorites.has(id)?'Quitar de favoritos: ':'Añadir a favoritos: ')+(D.find(x=>x.id===id)?.name||id));b.setAttribute('aria-pressed',String(favorites.has(id)));b.onclick=(ev)=>{ev.stopPropagation();toggleFav(id)};return b}function refreshDetailStar(){const target=document.getElementById('detailStar');if(target){const fresh=makeStar(current);fresh.id='detailStar';target.replaceWith(fresh)}}
const element=(tag,cl,t)=>{const e=document.createElement(tag);if(cl)e.className=cl;if(t!==undefined)e.textContent=t;return e};
for(const g of [...new Set(D.map(d=>d.group))].sort((a,b)=>a.localeCompare(b,'es'))){let o=document.createElement('option');o.value=g;o.textContent=g;$('drugGroup').append(o)}
function renderList(){const term=norm($('drugSearch').value.trim()),gr=$('drugGroup').value,st=$('drugStatus').value;const matches=D.filter(d=>(!term||norm([d.name,d.brand,d.group,d.indication].join(' ')).includes(term))&&(!gr||d.group===gr)&&(!st||(st==='ready'?d.reviewed:!d.reviewed))&&(!onlyFavorites||favorites.has(d.id)));$('drugCount').textContent=matches.length+' de '+D.length+' medicamentos';matches.sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));const host=$('drugList');host.replaceChildren();for(const d of matches){const row=element('div','drugRow');const btn=element('button','drugBtn'+(d.id===current?' active':''));btn.type='button';const name=element('strong','',d.name);if(d.reviewed)name.append(element('span','dot','●'));btn.append(name,element('small','',d.brand+(d.reviewed?'':' · Pendiente de validación')));btn.onclick=()=>show(d.id,true);row.append(btn,makeStar(d.id));host.append(row)}if(!matches.length)host.append(element('p','blank','Sin coincidencias.'))}
function emptyDetail(){const e=$('drugDetail');e.replaceChildren();const b=element('div','emptyDetail');b.append(element('div','', '💊'),element('h2','','Selecciona un medicamento'),element('p','','Elige una ficha en la lista de la izquierda o utiliza el buscador. No se carga ningún fármaco de inicio.'));e.append(b)}
// v35 · Fichas de perfusión de consulta rápida.
function specialDisclosure(title,content,cls=''){
  const wrap=element('details','specialDisclosure '+cls);
  wrap.append(element('summary','',title));
  const body=element('div','specialDisclosureBody');
  if(typeof content==='string')body.append(element('p','',content));
  else if(content)body.append(content);
  wrap.append(body);return wrap;
}
function specialSources(d){
  const content=element('div','sourceLinks');
  for(const [label,url] of d.sources||[]){
    const a=element('a','',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';content.append(a);
  }
  if(!(d.sources||[]).length)content.append(element('p','','Sin fuentes verificadas.'));
  if(d.sourcesNotes)content.append(element('p','sourceNote',d.sourcesNotes));
  if(d.id==='solinitrina_fuerte')content.append(element('p','sourceNote','La dilución predeterminada de 200 µg/ml corresponde a la preparación local indicada como validada. La ficha técnica propone la alternativa de 100 µg/ml.'));
  if(d.id==='dopamina')content.append(element('p','sourceNote','La preparación seleccionada de 4 mg/ml es más concentrada que las diluciones de referencia descritas en la ficha técnica; requiere comprobación conforme al procedimiento local.'));
  return specialDisclosure('Fuentes',content,'sourcesDisclosure');
}
// Noradrenalina B. Braun · base/bitartrato · volumen final libre según preparación real.
// No hay dilución hospitalaria predeterminada: requiere consignar un volumen final explícito.
// V38 · componentes clínicos específicos y tablas seleccionables.
function createDoseCards(d){
 const host=element('section','specialInfusion doseCards');host.append(element('h3','specialTitle','Pautas de administración'));
 for(const item of d.special.cards||[]){
  const card=element('div','amioStage clinicalStage'),line=element('div','v38DoseLine'),heading=element('div','');heading.append(element('b','',item.title));if(item.subtitle)heading.append(element('strong','v38DoseText',item.subtitle));line.append(heading);
  let order=item.copy||'';const simpleBolus=['adenosina','metoprolol','verapamilo','digoxina','magnesio_iv'];const b=simpleBolus.includes(d.id)?null:copyButton('Copiar',()=>order);if(b)b.disabled=!order;
  if(item.choices){const options=element('div','v38DoseChoices');item.choices.forEach((choice,i)=>{const c=element('button','preparationButton'+(i===0?' active':''),choice.label);c.type='button';c.setAttribute('aria-pressed',i===0?'true':'false');if(i===0)order=choice.copy;c.onclick=()=>{order=choice.copy;for(const child of options.children){const active=child===c;child.classList.toggle('active',active);child.setAttribute('aria-pressed',String(active))}};options.append(c)});line.append(options);if(b)b.disabled=false}
  card.append(line);if(b)card.append(b);host.append(card)
 }
 return host;
}
function makeTable(headings){const wrap=element('div','specialTableScroll'),table=element('table','specialTable');const thead=document.createElement('thead'),tr=document.createElement('tr');for(const h of headings){const th=document.createElement('th');th.scope='col';th.textContent=h;tr.append(th)}thead.append(tr);table.append(thead);const body=document.createElement('tbody');table.append(body);wrap.append(table);return {wrap,table,body}}
function addTableChoice(td,label,onClick,aria){const b=element('button','cellChoice',label);b.type='button';b.setAttribute('aria-label',aria||label);b.onclick=()=>onClick(b);td.append(b);return b}
function selectCell(table,btn){table.querySelectorAll('.cellChoice.chosen').forEach(x=>x.classList.remove('chosen'));btn.classList.add('chosen')}
function v38Info(parent,text,cls='small'){parent.append(element('p',cls,text))}

function createLevosimendan(d){
 const host=element('section','specialInfusion levoProgram');host.append(element('h3','specialTitle','Preparación de la perfusión'),element('div','selectedPreparation'));
 const prep=host.querySelector('.selectedPreparation');prep.append(element('strong','','12,5 mg (5 ml) en 250 ml finales de SG 5 %'),element('span','selectedConcentration','50 µg/ml'),element('p','small','Una única concentración. Si se requieren dos viales, 25 mg (10 ml) en 500 ml finales: también 50 µg/ml.'));
 const controls=element('div','weightControls'),lab=element('label','','Peso del paciente (kg)'),weight=element('input','control');weight.type='number';weight.min='20';weight.max='250';weight.step='0.1';weight.value='70';lab.append(weight);controls.append(lab);host.append(controls);
 const panel=element('div','v38SelectedPlan'),loadChoose=element('div','v38DoseChoices'),maintChoose=element('div','v38DoseChoices');
 let load=0,rate=0.1;panel.append(element('b','','Pauta seleccionada'),element('p','small','Dosis de carga (10 min)'));
 for(const opt of [0,6,12]){const b=element('button','preparationButton',opt===0?'Sin carga':opt+' µg/kg');b.type='button';b.onclick=()=>{load=opt;render()};b.dataset.value=String(opt);loadChoose.append(b)}panel.append(loadChoose,element('p','small','Mantenimiento (24 h)'));
 for(const opt of [0.05,0.1,0.2]){const b=element('button','preparationButton',es(opt)+' µg/kg/min');b.type='button';b.dataset.value=String(opt);b.onclick=()=>{rate=opt;render()};maintChoose.append(b)}panel.append(maintChoose);
 const result=element('div','selectedPreparation'),warning=element('div','v38BagWarning'),copy=copyButton('Copiar',()=>makeOrder());panel.append(result,warning,copy);host.append(panel);
 const area=element('div','infusionTableArea');host.append(area);
 function totalMg(w){return w*load/1000+w*rate*60*24/1000}
 function makeOrder(){const w=Number(weight.value);if(!(w>=20&&w<=250))return '';const t=totalMg(w),mg=t>12.5?25:12.5,vol=t>12.5?500:250;if(t>25)return ''; 
  return `Levosimendán: ${es(mg)} mg en ${es(vol)} ml finales de SG 5 % (50 µg/ml). ${load>0?'Carga '+es(load)+' µg/kg ('+es(load*w/1000)+' mg) durante 10 min a '+es(load*w*6/50)+' ml/h; ':'Sin dosis de carga; '}mantenimiento ${es(rate)} µg/kg/min a ${es(rate*w*60/50)} ml/h durante 24 h para ${es(w)} kg. Requiere ${es(t)} mg en total (${es(t*20)} ml). Reevaluar a los 30–60 min, ajustar según PA/FC. ${t>25?'La cantidad supera 25 mg; preparar una bolsa adicional y verificar estabilidad.':''}`;
 }
 function render(){const w=Number(weight.value),valid=w>=20&&w<=250;copy.disabled=!valid;
  [...loadChoose.children].forEach(b=>{const on=Number(b.dataset.value)===load;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
  [...maintChoose.children].forEach(b=>{const on=Number(b.dataset.value)===rate;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
  if(!valid){result.textContent='Indica un peso entre 20 y 250 kg.';warning.textContent='';return}
  const t=totalMg(w),vol=t*20,bag=t<=12.5?250:500,vials=t<=12.5?1:t<=25?2:Math.ceil(t/12.5);copy.disabled=t>25;result.replaceChildren();result.append(element('strong','',`Carga: ${load?' '+es(load*w/1000)+' mg a '+es(load*w*6/50)+' ml/h durante 10 min':'sin carga'} · Mantenimiento: ${es(rate*w*60/50)} ml/h`),element('p','small',`Total estimado 24 h + carga: ${es(t)} mg (${es(vol)} ml a 50 µg/ml).`));
  warning.replaceChildren();if(t>25)warning.append(element('b','','Necesitas más de dos viales'),element('p','','Planificar '+vials+' viales, con preparaciones adicionales a 50 µg/ml, de acuerdo con estabilidad y protocolo local.'));else if(t>12.5)warning.append(element('b','','Se necesitan dos viales: cambiar a 25 mg en 500 ml finales de SG 5 %.'),element('p','','La concentración se mantiene en 50 µg/ml, por lo que no cambian las velocidades.'));else warning.append(element('p','','Un vial de 12,5 mg en 250 ml es suficiente para la pauta calculada.'));
  area.replaceChildren();area.append(element('h4','','Tabla de carga · 10 minutos'),element('p','specialUnitLabel','Pulsar una celda selecciona la dosis de carga · velocidades en ml/h'));
  const weights=[...new Set([60,70,80,90,100,w])].sort((a,b)=>a-b);
  const ltab=makeTable(['Peso','6 µg/kg','12 µg/kg']);for(const wt of weights){const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=es(wt)+' kg';tr.append(th);for(const n of [6,12]){const td=document.createElement('td');addTableChoice(td,es(n*wt*6/50),()=>{weight.value=String(wt);load=n;render()},`Carga ${n} µg/kg en 10 minutos para ${wt} kg`);tr.append(td)}ltab.body.append(tr)}area.append(ltab.wrap);
  area.append(element('h4','','Tabla de mantenimiento · 24 horas'),element('p','specialUnitLabel','Dosis en µg/kg/min; resultados en ml/h, misma concentración 50 µg/ml'));
  const tab=makeTable(['Peso','0,05','0,1','0,2']);for(const wt of weights){const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=es(wt)+' kg';tr.append(th);for(const n of [0.05,0.1,0.2]){const td=document.createElement('td');addTableChoice(td,es(n*wt*60/50),()=>{weight.value=String(wt);rate=n;render()},`Mantenimiento ${es(n)} µg/kg/min para ${wt} kg`);tr.append(td)}tab.body.append(tr)}area.append(tab.wrap);
 }
 weight.oninput=render;render();
 v38Info(host,'Reevaluar hemodinámica a los 30–60 min y tras ajustes: hipotensión o taquicardia → reducir a 0,05 µg/kg/min o suspender; si bien tolerado y precisa mayor efecto → hasta 0,2. Duración de mantenimiento: 24 h.');
 return host;
}
function createEsmolol(d){
 const host=element('section','specialInfusion esmololProgram');host.append(element('h3','specialTitle','Administración y tablas de velocidades'));
 const prep=element('div','selectedPreparation');prep.append(element('strong','','Brevibloc, solución lista para perfusión · 2.500 mg/250 ml'),element('span','selectedConcentration','10 mg/ml'),element('p','small','No confundir con el concentrado de 2.500 mg que debe diluirse.'));host.append(prep);
 const controls=element('div','weightControls'),lab=element('label','','Peso (kg)'),input=element('input','control');input.type='number';input.min='20';input.max='250';input.value='70';input.step='0.1';lab.append(input);controls.append(lab);host.append(controls);
 let dose=50,selectedLoad=false;const result=element('div','selectedPreparation'),copy=copyButton('Copiar',()=>{const w=Number(input.value);if(!(w>=20&&w<=250))return '';return selectedLoad?`Esmolol carga ${es(w*.5)} mg (500 µg/kg) IV en 1 minuto, volumen ${es(w*.05)} ml de Brevibloc 10 mg/ml, para ${es(w)} kg. Vigilancia ECG y PA.`:`Esmolol 2.500 mg/250 ml listo para perfusión (10 mg/ml). Infundir a ${es(dose*w*.006)} ml/h (${es(dose)} µg/kg/min) para ${es(w)} kg. Titular según FC/PA y tolerancia.`});host.append(result,copy);
 const area=element('div','infusionTableArea');host.append(area);
 function render(){const w=Number(input.value);copy.disabled=!(w>=20&&w<=250);if(copy.disabled){result.textContent='Introduce peso válido (20–250 kg).';return}result.textContent=selectedLoad?`Carga opcional: ${es(w*.5)} mg (${es(w*.05)} ml) IV en 1 min`:`Mantenimiento ${es(dose)} µg/kg/min → ${es(dose*w*.006)} ml/h`;area.replaceChildren();
  const ws=[...new Set([60,70,80,90,100,w])].sort((a,b)=>a-b);
  area.append(element('h4','','Carga opcional de 500 µg/kg en 1 minuto'),element('p','small','Puede omitirse si existe riesgo de hipotensión. Selecciona una fila para copiar la carga.'));
  const t=makeTable(['Peso','Dosis (mg)','Volumen (ml)']);for(const wt of ws){const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=es(wt)+' kg';tr.append(th);const mg=document.createElement('td'),ml=document.createElement('td');addTableChoice(mg,es(wt*.5),()=>{selectedLoad=true;input.value=String(wt);render()},`Carga ${es(wt*.5)} mg para ${wt} kg`);ml.textContent=es(wt*.05);tr.append(mg,ml);t.body.append(tr)}area.append(t.wrap);
  area.append(element('h4','','Perfusión de mantenimiento'),element('p','small','Dosis seleccionables 50–200 µg/kg/min · velocidades en ml/h'));
  const q=makeTable(['Peso','50','100','150','200']);for(const wt of ws){const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=es(wt)+' kg';tr.append(th);for(const n of [50,100,150,200]){const td=document.createElement('td');addTableChoice(td,es(n*wt*.006),()=>{selectedLoad=false;dose=n;input.value=String(wt);render()},`${n} µg/kg/min para ${wt} kg`);tr.append(td)}q.body.append(tr)}area.append(q.wrap);
 }
 input.oninput=render;render();return host;
}
function createFurosemide(d){
 const host=element('section','specialInfusion furosemideProgram');host.append(element('h3','specialTitle','Bolos IV y perfusión continua'));
 const doses=element('div','amioStage');doses.append(element('b','','Inicio IV · si no tomaba diurético'));
 const choices=element('div','v38DoseChoices');for(const mg of [20,40])choices.append(element('span','bolusPill',mg+' mg IV lento'));doses.append(choices);host.append(doses);
 v38Info(host,'Si tomaba diurético de asa en domicilio, individualizar la dosis IV inicial considerando 1–2,5 veces la dosis oral diaria previa y biodisponibilidad. Reevaluar a las 2–6 horas: diuresis, congestión, Na urinario a las 2 h (orientativo ≥50–70 mEq/l) y diuresis de referencia ≥100–150 ml/h.');
 const panel=element('div','selectedPreparation');panel.append(element('strong','','Perfusión continua: 250 mg en 250 ml finales de SF 0,9 %'),element('span','selectedConcentration','1 mg/ml'),element('p','small','Solución para perfusión con bomba; no administrar el vial de 250 mg/25 ml en bolo IV.'));host.append(panel);
 const choice=selectedOrderBox(),tbl=makeTable(['Dosis (mg/h)','Velocidad (ml/h)']);for(const mg of [5,10,15,20,30,40]){const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=mg+' mg/h';tr.append(th);const td=document.createElement('td');addTableChoice(td,mg.toString(),b=>{selectCell(tbl.table,b);choice.setOrder(`Furosemida 250 mg en 250 ml finales de SF 0,9 % (1 mg/ml), perfusión IV a ${mg} ml/h (${mg} mg/h). Reevaluar diuresis, PA, función renal y electrolitos.`)});tr.append(td);tbl.body.append(tr)}host.append(tbl.wrap,choice);
 const h=element('details','specialDisclosure');h.append(element('summary','','Suero salino hipertónico · congestión resistente'));
 const body=element('div','specialDisclosureBody');body.append(element('p','','Propuesta acordada: cada dosis 150 ml finales en 60 minutos (150 ml/h), cada 12 h si está indicado. Composición según sodio plasmático:'));
 const t=makeTable(['Na plasmático','NaCl 20 % (10 ml/amp.)','Añadir SF 0,9 % hasta 150 ml','NaCl resultante']);for(const [range,amps,vol,percent] of [['<125 mEq/l','3 amp. · 30 ml','120 ml','4,72 %'],['126–135 mEq/l','2 amp. · 20 ml','130 ml','3,45 %'],['136–145 mEq/l','1 amp. · 10 ml','140 ml','2,17 %'],['>145 mEq/l','½ amp. · 5 ml','145 ml','1,54 %']]){const tr=document.createElement('tr');for(const v of [range,amps,vol,percent])tr.append(element('td','',v));t.body.append(tr)}body.append(t.wrap);
 body.append(element('div','warn','Preparaciones modificadas respecto a un protocolo clínico de referencia: pendientes de validación farmacotécnica local. Na = 125 mEq/l no tiene banda asignada en el esquema aportado; resolver antes de seleccionar. No copiar automáticamente estas órdenes hasta su validación. La furosemida se administra por separado y no debe mezclarse con la solución hipertónica.'));
 body.append(element('p','small','Monitorización: PA, diuresis y balance, Na/K/Cl/Mg, función renal; añadir gasometría venosa (pH, pCO₂, HCO₃⁻) según evolución. Reposición de K individualizada, no pautar Boi-K de forma automática.'));
 h.append(body);host.append(h);return host;
}
function createNoradrenalineInfusion(d){
 const host=element('section','specialInfusion noradInfusion');host.append(element('h3','specialTitle','Preparación de la perfusión'));
 host.append(element('div','selectedPreparation','5 mg de noradrenalina BASE = 10 mg de noradrenalina bitartrato'));
 const buttons=element('div','preparationOptions');const preps=[{amountMg:10,volumeMl:100,label:'10 mg BASE / 100 ml',conc:100},{amountMg:20,volumeMl:100,label:'20 mg BASE / 100 ml',conc:200}];let i=0,full=false;
 const area=element('div','infusionTableArea'),wrap=element('div','weightControls'),lab=element('label','','Peso (kg)'),weight=element('input','control');weight.type='number';weight.min='20';weight.max='250';weight.value='70';weight.step='0.1';lab.append(weight);wrap.append(lab);host.append(buttons,wrap,area);
 const order=selectedOrderBox();host.append(order);for(const [n,p] of preps.entries()){const b=element('button','preparationButton',p.label);b.type='button';b.onclick=()=>{i=n;order.setOrder('');render()};buttons.append(b)};
 function render(){const w=Number(weight.value),p=preps[i],ok=w>=20&&w<=250;for(const [n,b] of [...buttons.children].entries()){b.classList.toggle('active',n===i);b.setAttribute('aria-pressed',String(n===i))}area.replaceChildren();area.append(element('p','selectedConcentration',p.conc+' µg/ml BASE · SG 5 % preferente según producto'));
 if(!ok){area.append(element('p','weightWarning','Introduce peso entre 20–250 kg.'));order.setOrder('');return}
 const table=makeTable(['Peso','0,02','0,05','0,1','0,2','0,3','0,5','0,75','1']);const doses=[.02,.05,.1,.2,.3,.5,.75,1];const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=es(w)+' kg';tr.append(th);for(const dose of doses){const td=document.createElement('td'),rate=dose*w*60/p.conc;addTableChoice(td,es(rate),b=>{selectCell(table.table,b);order.setOrder(`Noradrenalina BASE ${p.amountMg} mg en 100 ml finales de SG 5 % (${p.conc} µg/ml BASE), perfusión IV a ${es(rate)} ml/h (${es(dose)} µg/kg/min de BASE para ${es(w)} kg). Titular según objetivo hemodinámico.`)});tr.append(td)}table.body.append(tr);area.append(table.wrap)}weight.oninput=()=>{order.setOrder('');render()};render();
 const note=element('p','small','Cambio de etiquetado (2022): la expresión de cantidad pasó de bitartrato a BASE, sin modificar la cantidad real de noradrenalina.');host.append(note);
 return host;
}

function createSpecialInfusion(d){
 if(d.special.kind==='dose_cards')return createDoseCards(d);
 if(d.special.kind==='levosimendan')return createLevosimendan(d);
 if(d.special.kind==='esmolol')return createEsmolol(d);
 if(d.special.kind==='furosemide')return createFurosemide(d);
 if(d.id==='noradrenalina')return createNoradrenalineInfusion(d);
 if(d.special.kind==='amiodarone')return element('div','amioNoDuplicate');
 const conf=d.special,host=element('section','specialInfusion');host.append(element('h3','specialTitle','Preparación de la perfusión'));
 const buttons=element('div','preparationOptions'),chosen=element('div','selectedPreparation'),area=element('div','infusionTableArea'),order=selectedOrderBox();
 let prepIndex=0,full=false,weight=null,selection=null;
 conf.preparations.forEach((p,i)=>{const b=element('button','preparationButton',p.label);b.type='button';b.onclick=()=>{prepIndex=i;selection=null;render()};buttons.append(b)});
 if(conf.preparations.length>1)host.append(buttons);host.append(chosen);
 if(conf.kind==='weight'){
   const controls=element('div','weightControls'),wrap=element('div','weightInputGroup'),label=element('label','','Peso del paciente (kg)');
   weight=element('input','control');weight.type='number';weight.min='20';weight.max='250';weight.step='0.1';weight.value='70';weight.id='doseWeight_'+d.id;
   label.htmlFor=weight.id;wrap.append(label,weight,element('span','small','Cambiar el peso recalcula la tabla.'));
   const view=element('div','viewSelector');for(const [name,value] of [['Una fila',false],['Tabla completa',true]]){const b=element('button','viewButton',name);b.type='button';b.onclick=()=>{full=value;selection=null;render()};view.append(b)}
   controls.append(wrap,view);host.append(controls);weight.oninput=()=>{selection=null;render()};
   if(d.id==='dopamina'){
     const legend=element('div','dopamineLegend');for(const r of conf.colorRanges)legend.append(element('span','doseLegend '+r.css,r.label+' · '+r.note));
     host.append(legend,element('p','small pharmacologyCaution','Rangos aproximados y solapados; los colores representan efectos predominantes, no seguridad ni indicación.'));
   }
 }
 host.append(area,order);
 if(conf.equivalent)host.append(element('p','small equivalentPreparation',conf.equivalent));
 if(d.id==='dopamina')host.append(element('div','dopamineKidneyWarning','La dosis dopaminérgica baja NO debe usarse para prevenir ni tratar la lesión renal aguda.'));
 host.append(element('p','small infusionCaution','Velocidades calculadas matemáticamente para la concentración seleccionada. Verificar prescripción, volumen final, bomba y condiciones del centro.'));
 function effect(n){return n<=2?'dopaminergic':n<=10?'beta':'alpha'}
 function orderText(p,w,dose,rate){const mg=es(p.amountMg),vol=es(p.volumeMl),r=es(rate);
   if(conf.kind==='fixed')return `${d.name}: ${mg} mg en ${vol} ml finales de SG 5 %. Perfusión IV continua a ${r} ml/h (${es(dose)} mg/h).`;
   if(conf.kind==='fixed_micro')return `${d.name}: ${mg} mg en ${vol} ml finales de SF 0,9 %. Perfusión IV continua a ${r} ml/h (${es(dose)} µg/min). Titular según FC y respuesta hemodinámica.`;
   const solvent=d.id==='adrenalina'?'SG 5 % o SF 0,9 %':d.id==='dobutamina'?'SG 5 %':d.id==='dopamina'?'SG 5 %':'diluyente indicado';
   return `${d.name}: ${mg} mg en ${vol} ml finales de ${solvent}. Perfusión IV continua a ${r} ml/h (${es(dose)} µg/kg/min para ${es(w)} kg). Verificar objetivo y ajuste hemodinámico.`
 }
 function render(){const p=conf.preparations[prepIndex],micro=conf.kind==='fixed_micro',fixed=conf.kind==='fixed'||micro;
   for(const [i,btn] of [...buttons.children].entries()){btn.classList.toggle('active',i===prepIndex);btn.setAttribute('aria-pressed',String(i===prepIndex))}
   const views=host.querySelectorAll('.viewButton');views.forEach((b,i)=>{b.classList.toggle('active',Boolean(i)===full);b.setAttribute('aria-pressed',String(Boolean(i)===full))});
   chosen.replaceChildren();chosen.append(element('strong','',p.name),element('span','selectedConcentration',es(1000*p.amountMg/p.volumeMl)+' µg/ml · '+es(p.amountMg/p.volumeMl)+' mg/ml'),element('p','small',p.detail+' Volumen final incluido el medicamento.'));
   area.replaceChildren();area.append(element('h4','',fixed?'Tabla de perfusión':'Calculadora de perfusión por peso'));
   area.append(element('p','specialUnitLabel',fixed?(micro?'Dosis: µg/min · Velocidad: ml/h':'Dosis: mg/h · Velocidad: ml/h'):'Cabeceras: µg/kg/min · Resultados: ml/h'));
   const scroll=element('div','specialTableScroll'),table=element('table','specialTable'),head=document.createElement('thead'),hr=document.createElement('tr');
   const th=document.createElement('th');th.textContent=fixed?'Dosis':'Peso';hr.append(th);
   if(fixed){const h=document.createElement('th');h.textContent='Velocidad (ml/h)';hr.append(h)}
   else for(const dose of conf.doses){const h=document.createElement('th');h.textContent=es(dose);if(d.id==='dopamina')h.className='doseHead '+effect(dose);hr.append(h)}
   head.append(hr);table.append(head);const body=document.createElement('tbody');
   const kg=weight?Number(weight.value):NaN,validKg=Number.isFinite(kg)&&kg>=20&&kg<=250;
   if(!fixed&&!validKg){area.append(element('p','weightWarning','Introduce peso válido entre 20 y 250 kg.'));order.setOrder('');return}
   const all=[40,50,60,70,80,90,100,110,120];const rows=fixed?conf.doses:(full?[...new Set([...all,kg])].sort((a,b)=>a-b):[kg]);
   for(const row of rows){const tr=document.createElement('tr');if(!fixed&&row===kg)tr.className='selectedWeightRow';
     const title=document.createElement('th');title.scope='row';title.textContent=fixed?es(row)+(micro?' µg/min':' mg/h'):es(row)+' kg';tr.append(title);
     const ds=fixed?[row]:conf.doses;
     for(const dose of ds){const rate=fixed?(micro?dose*60*p.volumeMl/(1000*p.amountMg):dose*p.volumeMl/p.amountMg):dose*row*60*p.volumeMl/(1000*p.amountMg);
       const td=document.createElement('td'),b=element('button','cellChoice',es(Number(rate.toFixed(conf.decimals??2))));b.type='button';
       const key=String(row)+'|'+String(dose);if(selection===key)b.classList.add('chosen');
       b.setAttribute('aria-label',`Seleccionar ${es(rate)} ml/h para ${fixed?es(dose)+(micro?' µg/min':' mg/h'):es(row)+' kg y '+es(dose)+' µg/kg/min'}`);
       b.onclick=()=>{selection=key;order.setOrder(orderText(p,fixed?null:row,dose,rate));render();};td.append(b);tr.append(td)
     }body.append(tr)
   }
   table.append(body);scroll.append(table);area.append(scroll);
   if(!selection)order.setOrder('');
 }
 render();return host;
}
function createSpecialInfo(d){
  const host=element('div','specialDetails');
  for(const item of d.special.sections||[]){if(/precauciones y contraindicaciones/i.test(item.title))continue;host.append(specialDisclosure(item.title,item.text));}
  host.append(specialSources(d));return host;
}

// v37 · órdenes copiables y equivalencias de presentación; nunca se copian solo ampollas.
const es=n=>Number(n).toLocaleString('es-ES',{maximumFractionDigits:2});
async function copyClinical(text,button){
  if(!text)return;
  let copied=false;try{await navigator.clipboard.writeText(text);copied=true}catch(_){
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';document.body.append(ta);ta.select();copied=document.execCommand('copy');ta.remove();
  }
  if(button){const old=button.textContent;button.textContent=copied?'✓ Copiado':'No se pudo copiar';setTimeout(()=>{if(button.isConnected)button.textContent=old},1800)}
}
function copyButton(label,getText){const b=element('button','action v37CopyButton','⧉ '+label);b.type='button';b.addEventListener('click',()=>copyClinical(getText(),b));return b}
function selectedOrderBox(){const panel=element('div','selectedOrder');panel.append(element('b','','Pauta seleccionada'));const preview=element('p','selectedOrderText','Selecciona una celda de dosis y velocidad para copiar la pauta.');panel.append(preview);const b=copyButton('Copiar',()=>panel.dataset.copy||'');b.disabled=true;panel.append(b);panel.setOrder=(txt)=>{panel.dataset.copy=txt||'';preview.textContent=txt||'Selecciona una celda de dosis y velocidad para copiar la pauta.';b.disabled=!txt};return panel}
function createPautaCopies(d){
 if(!d.reviewed||!d.copyPautas?.length)return null;
 const host=element('div','copyPautas v38IntegratedCopies');
 for(const item of d.copyPautas){const row=element('div','copyPautaRow');row.append(element('span','',item.title),copyButton('Copiar',()=>item.text));host.append(row)}
 return host;
}
function clinicalField(title,value,extra=''){
 const e=element('section','field'+(extra?' '+extra:''));
 e.append(element('b','',title),element('p','',value||'Pendiente de comprobar en ficha técnica.'));
 return e;
}
function renderIndications(d){
 const e=element('div','clinicalEssentials');
 e.append(clinicalField('Indicaciones',d.indication));
 e.append(clinicalField('Precauciones',d.precautions));
 e.append(clinicalField('Contraindicaciones',d.contraindication));
 return e;
}
function showDoseRows(d,panel){
 if(!d.doseRows?.length)return;
 const summary=panel.querySelector('p');if(summary)summary.remove();
 const rows=element('div','doseRows');
 for(const it of d.doseRows){
   const line=element('div','doseRow');const text=element('div','doseRowText');
   text.append(element('b','',it.title),element('span','',it.text));line.append(text);
   if(it.copy)line.append(copyButton('Copiar',()=>it.copy));
   rows.append(line);
 }
 panel.append(rows);
}
function showDiluent(d,e){
 if(d.diluent){const z=element('div','diluentTop');z.append(element('b','','Diluyente / administración'),element('span','',d.diluent));e.append(z)}
}
function relatedPhosphateLink(id){
 const target=id==='fosfato_iv'?'fosfatos_orales':'fosfato_iv';
 const b=element('button','action phosphateLink',id==='fosfato_iv'?'Ver fosfatos orales':'Ver fosfatos IV');
 b.type='button';b.onclick=()=>{show(target,true);document.getElementById('drugSearch').value='';document.getElementById('drugGroup').value='';document.getElementById('drugStatus').value='';renderList()};
 return b;
}
function createPhosphateCalculator(){
 const host=element('section','specialInfusion phosphateCalc');host.append(element('h3','specialTitle','Calculadora de reposición de fosfato IV'));
 const controls=element('div','phosphateControls');
 const chooser=(title,opts,value)=>{let wrap=element('label','phosLabel'),s=element('select','control');wrap.append(element('span','',title));for(const [v,t] of opts){const o=element('option','',t);o.value=v;s.append(o)}s.value=value;wrap.append(s);controls.append(wrap);return s};
 const salt=chooser('Sal',[['na','Fosfato monosódico 1 M'],['k','Fosfato dipotásico 1 M']],'k');
 const weightWrap=element('label','phosLabel');weightWrap.append(element('span','','Peso (kg)'));const weight=element('input','control');weight.type='number';weight.min='20';weight.max='250';weight.step='0.1';weight.value='70';weightWrap.append(weight);controls.append(weightWrap);
 const dose=chooser('Dosis',[['0.08','Inicio: 0,08 mmol/kg'],['0.16','0,16 mmol/kg · prolongada'],['0.25','0,25 mmol/kg · pauta alternativa'],['0.5','0,50 mmol/kg · pauta alternativa'],['fixed15','15 mmol · pauta fija'],['fixed30','30 mmol · pauta fija']],'0.08');
 const route=chooser('Vía',[['per','Periférica'],['cen','Central monitorizada']],'per');
 const diluent=chooser('Diluyente',[['sf','SF 0,9 %'],['sg','SG 5 %']],'sf');
 const volume=chooser('Volumen FINAL',[['100','100 ml'],['250','250 ml'],['500','500 ml'],['750','750 ml'],['1000','1.000 ml'],['1500','1.500 ml']],'500');
 const hours=chooser('Tiempo de perfusión',[['2','2 h'],['4','4 h'],['6','6 h'],['8','8 h'],['12','12 h'],['16','16 h'],['24','24 h']],'6');
 const dkaLabel=element('label','phosCheck');const dka=element('input');dka.type='checkbox';dkaLabel.append(dka,element('span','','Cetoacidosis diabética (límite específico para dipotásico: 5 mEq K/h)'));
 host.append(controls,dkaLabel);
 const result=element('div','phosResult'),alerts=element('div','phosAlerts'),note=element('p','small','Los volúmenes son opciones para calcular, NO preparaciones verificadas para cualquier vía. Validar dilución y estabilidad con Farmacia. La alerta de concentración usa referencias generales de potasio IV, no máximos universales de fosfato potásico.');
 host.append(result,alerts,note);
 const f=x=>Number(x).toLocaleString('es-ES',{maximumFractionDigits:2});
 const cell=(title,value,bad=false)=>{const e=element('div','phosMetric'+(bad?' isOver':''));e.append(element('span','',title),element('strong','',value));return e};
 function calc(){const kg=Number(weight.value),valid=Number.isFinite(kg)&&kg>=20&&kg<=250;result.replaceChildren();alerts.replaceChildren();if(!valid){result.append(element('p','weightWarning','Introduce un peso entre 20 y 250 kg.'));return}
 const mmol=dose.value==='fixed15'?15:dose.value==='fixed30'?30:Number(dose.value)*kg,v=Number(volume.value),h=Number(hours.value),potassium=salt.value==='k';
 const total=mmol*(potassium?2:1),pRate=mmol/h,kRate=potassium?total/h:0,kConc=potassium?total*1000/v:0;
 const pBad=pRate>7.5+1e-9,kLimit=dka.checked?5:(route.value==='per'?10:20),kBad=potassium&&kRate>kLimit+1e-9,concLimit=route.value==='per'?40:100,concBad=potassium&&kConc>concLimit+1e-9;
 const grid=element('div','phosMetrics');grid.append(cell('Fósforo total',f(mmol)+' mmol'),cell('Concentrado 1 M',f(mmol)+' ml'),cell(potassium?'Potasio total':'Sodio total',f(total)+' mEq'),cell('Ritmo de bomba',f(v/h)+' ml/h'),cell('Ritmo de fósforo',f(pRate)+' mmol/h',pBad));
 if(potassium){grid.append(cell('Ritmo de potasio',f(kRate)+' mEq/h',kBad),cell('Concentración de potasio',f(kConc)+' mEq/l',concBad))}result.append(grid);
 const showError=(title,desc)=>{const w=element('div','phosAlert');w.append(element('strong','',title),element('p','',desc));alerts.append(w)};
 if(pBad)showError('Exceso de velocidad de fósforo',`${f(pRate)} mmol/h supera la referencia conservadora de 7,5 mmol/h. Revisar duración o dosis.`);
 if(kBad)showError('Exceso de velocidad de potasio',`${f(kRate)} mEq/h supera ${f(kLimit)} mEq/h para la vía o situación elegida. Prolongar perfusión o replantear pauta.`);
 if(concBad)showError('Concentración de potasio elevada',`${f(kConc)} mEq/l supera la referencia general de ${f(concLimit)} mEq/l para esta vía; comprobar la dilución con Farmacia.`);
 if(dose.value!=='0.08')alerts.append(element('p','phosInfo','La pauta inicial de 0,08 mmol/kg durante 6 h NO fija el tiempo de las pautas superiores: individualizar según ficha técnica, función renal y aporte de K.'));
 if(!alerts.childElementCount)alerts.append(element('p','phosOk','Sin excesos respecto a los umbrales orientativos seleccionados; esto NO valida la preparación o la vía.'));
 }
 for(const node of [salt,weight,dose,route,diluent,volume,hours,dka])node.addEventListener('change',calc);
 weight.addEventListener('input',calc);salt.onchange=()=>{volume.value=salt.value==='k'?'500':'250';calc()};dka.onchange=calc;
 calc();return host;
}
function createPresentations(d, mainDose){
 return null; // v38: presentación visible en cabecera; sin conversor de ampollas/ml.
}
function createAmiodarone(d){
 const host=element('section','specialInfusion amiodaroneProgram');host.append(element('h3','specialTitle','Taquiarritmias con pulso · pauta IV seleccionada'));
 const stages=[{name:'Carga IV',mg:300,vol:250,minutes:60},{name:'Mantenimiento · primeras 12 h',mg:600,vol:250,minutes:720},{name:'Mantenimiento · siguientes 24 h',mg:600,vol:250,minutes:1440}];
 for(const it of stages){const card=element('div','amioStage');const detail=element('div','v38DoseLine');detail.append(element('b','',it.name),element('strong','v38DoseText',`${it.mg} mg en ${it.vol} ml finales de SG 5 %`),element('span','small',`${it.minutes===60?'60 minutos':it.minutes/60+' horas'} · ${es(it.vol*60/it.minutes)} ml/h`));
  card.append(detail,copyButton('Copiar',()=>`Amiodarona ${it.mg} mg IV en SG 5 % hasta ${it.vol} ml finales, durante ${it.minutes===60?'60 minutos':it.minutes/60+' horas'}, a ${es(it.vol*60/it.minutes)} ml/h.`));host.append(card)}
 host.append(element('p','small','No confundir pauta de perfusión con 300 mg IV/IO tras tercera descarga (y 150 mg tras quinta) en FV/TV sin pulso. La continuación oral no es obligatoria.'));return host;
}
function show(id,scroll){const d=D.find(x=>x.id===id);if(!d)return;if(current!==id)$('genericAccordion').open=false;current=id;if(location.hash!=='#'+id)history.replaceState(null,'','#'+id);const e=$('drugDetail');const stored=$('lyticBox');if(stored&&stored.parentNode!==$('lyticHome'))$('lyticHome').append(stored);e.replaceChildren();
const status=element('span','status'+(d.reviewed?' ready':''),d.reviewed?'Ficha clínica':'Pendiente de validación');const hd=element('div','drugHead');const hwrap=element('div','');hwrap.append(status,element('h2','',d.name),element('div','subdrug',d.brand+' · '+d.routes));if(d.mechanism)hwrap.append(element('div','mechanismBrief',d.mechanism));const star=makeStar(id);star.id='detailStar';hd.append(hwrap,star);e.append(hd);
if(d.presentation&&!d.presentation.startsWith('Pendiente')){const present=element('div','v38PresentationHeader');present.append(element('b','','Presentación'),element('p','',d.presentation));e.append(present)}showDiluent(d,e);
const doseCard=element('section','dosePanel'+(d.reviewed?'':' pending'));doseCard.append(element('h3','','Dosis y pautas de referencia'),element('p','',d.dosingBrief||d.dosing));showDoseRows(d,doseCard);e.append(doseCard);
const copyPautas=(d.id==='atropina'||d.id==='furosemida'||d.doseRows?.length)?null:createPautaCopies(d);if(copyPautas)doseCard.append(copyPautas);
e.append(renderIndications(d));
if(d.dosingBrief&&d.dosingBrief!==d.dosing){const det=element('details','detailDose');const sum=element('summary','','Detalle posológico y consideraciones');det.append(sum,element('div','doseBody',d.dosing));e.append(det)}
if(d.id==='fosfato_iv'){e.append(createPhosphateCalculator(),relatedPhosphateLink(id))}else if(d.id==='fosfatos_orales'){e.append(relatedPhosphateLink(id))}
if(d.special){if(d.special.kind!=='none')e.append(createSpecialInfusion(d));e.append(createSpecialInfo(d));if(d.notes)e.append(element('div','notes',d.notes))}
else{if(d.clinicalKinetics)e.append(specialDisclosure('Farmacocinética clínica',d.clinicalKinetics));const fields=element('div','fields');for(const [title,key] of [['Complicaciones y reacciones adversas','adverse'],['Vía, dilución y administración','administration']]){fields.append(clinicalField(title,d[key],key==='administration'?'full':''))}e.append(fields);if(d.notes)e.append(element('div','notes'+(/ALERTA|NO |Vía periférica/.test(d.notes)?' emph':''),d.notes));if(id==='ferinject'||id==='venofer')e.append(createIronCalc(id));e.append(specialSources(d));}
const lyticBox=$('lyticBox'),lyticHome=$('lyticHome');
if(id==='alteplasa'||id==='tenecteplasa'){
const opt=($('lyticType')); opt.replaceChildren();
const types=id==='alteplasa'?[['alteplase_stroke','Alteplasa · ictus isquémico']]:[['tenecteplase_stroke','Tenecteplasa · ictus isquémico (vial 25 mg)'],['tenecteplase_mi','Tenecteplasa · IAM (presentación IAM)']];
for(const [value,label] of types){const o=document.createElement('option');o.value=value;o.textContent=label;opt.append(o)}
$('lyticWeight').value='';$('lyticAccordion').open=false;e.append(lyticBox);calcLytic();
}else{lyticHome.append(lyticBox);$('lyticAccordion').open=false}
renderList();if(scroll&&window.innerWidth<801)e.scrollIntoView({behavior:'smooth',block:'start'})}
function val(id){const s=$(id).value.trim().replace(',','.');return s===''?NaN:Number(s)}
function createIronCalc(drug){const host=element('section','ironCalc');const details=element('details','calcAccordion');const summary=document.createElement('summary');const text=element('span','');text.append(element('span','accordionName',drug==='ferinject'?'Calculadora de necesidad de hierro · Ferinject':'Calculadora de hierro · Ganzoni / Venofer'),element('span','accordionSub','Peso + Hb → necesidad acumulada y límites de administración'));summary.append(text,element('span','accordionSide'));details.append(summary);const body=element('div','calcAccordionBody');const grid=element('div','calcgrid');const weightBox=element('div','inputgroup'),hbBox=element('div','inputgroup');weightBox.innerHTML='<label for="ironWeight">Peso (kg)</label><input id="ironWeight" class="control" type="number" min="15" max="350" step="0.1" inputmode="decimal" placeholder="Peso">';hbBox.innerHTML='<label for="ironHb">Hemoglobina (g/dL)</label><input id="ironHb" class="control" type="number" min="1" max="25" step="0.1" inputmode="decimal" placeholder="Hb">';grid.append(weightBox,hbBox);if(drug==='ferinject'){const route=element('div','inputgroup');route.innerHTML='<label for="ironRoute">Administración</label><select class="control" id="ironRoute"><option value="infusion">Perfusión IV</option><option value="injection">Inyección IV</option></select>';grid.append(route)}body.append(grid);if(drug==='ferinject'){const label=element('label','checkline');label.innerHTML='<input id="ironDialysis" type="checkbox"> Paciente en hemodiálisis (máximo 200 mg/día)';body.append(label)}const result=element('div','calcresult','Introduce peso y Hb para calcular.');result.id='ironResult';result.setAttribute('aria-live','polite');body.append(result,element('div','warn',drug==='ferinject'?'Solo ≥14 años; aplicar tabla y límites de ficha técnica. No elegir automáticamente indicación ni pauta.':'Cálculo de Ganzoni según FT. No es una orden de administración ni determina de forma automática número o frecuencia de perfusiones.'));details.append(body);host.append(details);
function update(){const w=Number(weightBox.querySelector('input').value),hb=Number(hbBox.querySelector('input').value);result.replaceChildren();result.className='calcresult';if(!(w>=15&&w<=350&&hb>=1&&hb<=25)){result.textContent='Introduce peso de 15–350 kg y Hb de 1–25 g/dL.';return}if(drug==='ferinject'){let total;if(w<35)total=w*(hb<10?30:15);else if(w<70)total=hb<10?1500:hb<14?1000:500;else total=hb<10?2000:hb<14?1500:500;const route=body.querySelector('#ironRoute').value,hd=body.querySelector('#ironDialysis').checked;const maxByKg=w*(route==='infusion'?20:15);const maxAdmin=Math.min(total,1000,maxByKg,hd?200:Infinity);const n=Math.ceil(total/Math.max(maxAdmin,1));result.append(element('strong','',fmt(total)+' mg de hierro necesarios'));result.append(element('div','small','Máximo orientativo de esta administración: '+fmt(maxAdmin)+' mg ('+fmt(maxAdmin/50)+' ml de Ferinject). '+(hd?'Hemodiálisis: no superar 200 mg/día. ':'')+'Límite semanal 1.000 mg; si se requieren dosis adicionales, respetar al menos 7 días. Tabla oficial para ≥14 años.'));if(n>1)result.append(element('div','small','La necesidad total supera una administración: individualizar fraccionamiento y tiempos según FT.'));if(maxAdmin<100)result.append(element('div','small','Dosis inferior a 100 mg: verificar viabilidad y presentación antes de prescribir.'));}
else{const target=w<35?13:15;if(hb>=target){result.classList.add('error');result.textContent='Hb igual o superior al objetivo de la fórmula ('+fmt(target)+' g/dL). Revalorar indicación y depósitos; no generar dosis automática.';return}const stores=w<35?15*w:500,total=w*(target-hb)*2.4+stores;result.append(element('strong','',fmt(total)+' mg de déficit de hierro'));result.append(element('div','small','Equivalente teórico a '+fmt(total/20)+' ml de Venofer 20 mg/ml. En adultos, dosis habituales 100–200 mg IV por administración, 1–3 veces por semana. Individualizar total y fraccionamiento.'));result.append(element('div','small','Ganzoni: objetivo Hb '+fmt(target)+' g/dL; depósitos '+fmt(stores)+' mg.'))}}
body.querySelectorAll('input,select').forEach(x=>x.addEventListener('input',update));return host}

function calculate(){const dose=val('orderedDose'),amount=val('drugAmount'),vol=val('finalVolume'),kg=val('patientWeight'),kind=$('doseKind').value,unit=$('drugAmountUnit').value,out=$('genericResult');out.className='calcresult';lastCopy='';if(![dose,amount,vol].every(x=>Number.isFinite(x)&&x>0)){out.textContent='Introduce dosis prescrita, cantidad del medicamento y volumen final positivos.';return}if(kind.includes('kg')&&!(kg>=1&&kg<=350)){out.textContent='Introduce el peso en kg para esta pauta.';return}
const mg=kind.startsWith('mg')||kind.startsWith('mcg');if((mg&&unit!=='mg')||(kind.startsWith('UI')&&unit!=='UI')||(kind.startsWith('mmol')&&unit!=='mmol')||(kind.startsWith('mEq')&&unit!=='mEq')){out.classList.add('error');out.textContent='Dosis y preparado usan unidades incompatibles.';return}
let rate=0,text='',bolus=kind==='mgkgdose';switch(kind){case'mcgkgmin':rate=dose*kg*60/1000;text=fmt(dose*kg)+' µg/min';break;case'mgkgh':rate=dose*kg;text=fmt(rate)+' mg/h';break;case'mgkgdose':rate=dose*kg;text=fmt(rate)+' mg/dosis';break;case'mgh':rate=dose;text=fmt(rate)+' mg/h';break;case'mcgmin':rate=dose*60/1000;text=fmt(dose)+' µg/min';break;case'mgmin':rate=dose*60;text=fmt(dose)+' mg/min';break;case'UIh':rate=dose;text=fmt(rate)+' UI/h';break;case'UIkgh':rate=dose*kg;text=fmt(rate)+' UI/h';break;case'mmolh':rate=dose;text=fmt(rate)+' mmol/h';break;case'mEqh':rate=dose;text=fmt(rate)+' mEq/h';break;default:out.textContent='Unidad no válida';return}
const conc=amount/vol,ml=rate/conc;if(!Number.isFinite(ml)||ml<=0||ml>1e6){out.classList.add('error');out.textContent='Resultado matemático no válido.';return}const label=bolus?'ml por dosis':'ml/h',final=fmt(ml)+' '+label;out.replaceChildren();out.append(element('strong','',final),element('div','small','Equivalente a '+text+' · concentración '+fmt(conc)+' '+unit+'/ml.'));lastCopy=`Cálculo aritmético: ${text}; preparado ${fmt(amount)} ${unit} en ${fmt(vol)} ml finales; resultado ${final}. Verificar concentración y orden.`}
function calcLytic(){const kg=val('lyticWeight'),type=$('lyticType').value,out=$('lyticResult');out.replaceChildren();if(!(kg>=20&&kg<=250)){out.textContent='Introduce peso entre 20 y 250 kg.';return}let text='';if(type==='alteplase_stroke'){const tot=Math.min(90,kg*.9),bolus=tot*.1;text=`Alteplasa ICTUS · total ${fmt(tot)} mg; bolo 10% ${fmt(bolus)} mg; perfusión 60 min ${fmt(tot-bolus)} mg (máx. 90 mg).`}else{let i=kg<60?0:kg<70?1:kg<80?2:kg<90?3:4;const stroke=type==='tenecteplase_stroke',mg=(stroke?[15,17.5,20,22.5,25]:[30,35,40,45,50])[i];text=`Tenecteplasa ${stroke?'ICTUS (vial 25 mg)':'IAM (presentación IAM)'} · ${fmt(mg)} mg = ${fmt(mg*200)} unidades; bolo IV único. Banda ${['<60','60–<70','70–<80','80–<90','≥90'][i]} kg.`;if(stroke&&kg<=50)text+=' Precaución: datos limitados con peso ≤50 kg.'}out.append(element('strong','',text),element('div','small','No verifica elegibilidad, tiempo, anticoagulación ni contraindicaciones.'))}
for(const id of ['patientWeight','doseKind','orderedDose','drugAmount','drugAmountUnit','finalVolume'])$(id).addEventListener('input',calculate);for(const id of ['lyticWeight','lyticType'])$(id).addEventListener('input',calcLytic);for(const id of ['drugSearch','drugGroup','drugStatus'])$(id).addEventListener(id==='drugSearch'?'input':'change',renderList);
$('resetCalc').onclick=()=>{for(const id of ['patientWeight','orderedDose','drugAmount','finalVolume'])$(id).value='';$('doseKind').value='mcgkgmin';$('drugAmountUnit').value='mg';calculate()};$('copyCalc').onclick=async()=>{if(!lastCopy)return;try{await navigator.clipboard.writeText(lastCopy);$('copyCalc').textContent='Copiado'}catch(e){const t=document.createElement('textarea');t.value=lastCopy;document.body.append(t);t.select();document.execCommand('copy');t.remove();$('copyCalc').textContent='Copiado'}};
$('onlyFaves').onclick=()=>{onlyFavorites=!onlyFavorites;$('onlyFaves').setAttribute('aria-pressed',String(onlyFavorites));$('onlyFaves').textContent=(onlyFavorites?'★':'☆')+' Solo favoritos';renderList()};window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(id&&id!==current)show(id,false);else if(!id){current='';emptyDetail();renderList()}});const firstId=decodeURIComponent(location.hash.slice(1));if(firstId==='bicarbonato')show('bicarbonato_1m',false);else if(firstId&&D.some(d=>d.id===firstId))show(firstId,false);else{emptyDetail();renderList()}calculate();
})();
