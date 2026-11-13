/* Editor de analíticas · v32 · Orden fijo de apartados · Procesamiento local. */
'use strict';
(function(global){
// Orden fijo de presentación acordado. Los apartados vacíos no se imprimen.
const ORDER=['hemograma','vsg','frotis','coagulacion','bioquimica','pcr','cardiacos','gasometria','orina','diabetico','lipidico','ferrico','vitaminas','hormonas','proteinograma','autoinmunidad','cultivos','microbiologia','serologias','otros'];
const TITLES={hemograma:'Hemograma',vsg:'VSG',frotis:'Frotis de sangre periférica',coagulacion:'Coagulación',bioquimica:'Bioquímica',pcr:'PCR',cardiacos:'Marcadores cardíacos',gasometria:'Gasometría',orina:'Orina',orina_bioq:'Orina',orina_sistema:'Orina',indices_renales:'Orina',diabetico:'Perfil diabético',lipidico:'Perfil lipídico',ferrico:'Perfil férrico',vitaminas:'Vitaminas',hormonas:'Hormonas',proteinograma:'Proteinograma',autoinmunidad:'Autoinmunidad',cultivos:'Cultivos',microbiologia:'Microbiología',serologias:'Serologías',otros:'Otros resultados'};
const DEF=[
['hb','Hemoglobina','Hb','hemograma','hemoglobina|hgb|hb'],
['hematocrito','Hematocrito','Hto','hemograma','hematocrito|hct|hto'],
['vcm','VCM','VCM','hemograma','volumen corpuscular medio|vcm|mcv'],
['hcm','HCM','HCM','hemograma','hemoglobina corpuscular media|hcm|mch'],
['chcm','CHCM','CHCM','hemograma','concentracion de hemoglobina corpuscular media|chcm|mchc'],
['ade','ADE','ADE','hemograma','amplitud de distribucion eritrocitaria|ancho de distribucion eritrocitaria|rdw-cv|rdw|ade'],
['hematíes','Hematíes','Hematíes','hemograma','hematies|eritrocitos|rbc'],
['leucocitos','Leucocitos','Leucocitos','hemograma','recuento de leucocitos|globulos blancos|leucocitos|wbc'],
['neutro','Neutrófilos','Neutrófilos','hemograma','neutrofilos absolutos|neutrofilos|neutros'],
['linfo','Linfocitos','Linfocitos','hemograma','linfocitos absolutos|linfocitos|linfos'],
['mono','Monocitos','Monocitos','hemograma','monocitos'],
['eos','Eosinófilos','Eosinófilos','hemograma','eosinofilos'],
['baso','Basófilos','Basófilos','hemograma','basofilos'],
['plaquetas','Plaquetas','Plaquetas','hemograma','plaquetas|platelets|plt'],
['vpm','VPM','VPM','hemograma','volumen plaquetario medio|volumen plaquetar medio|vpm|mpv'],
['retic_abs','Reticulocitos absolutos','Reticulocitos absolutos','hemograma','reticulocitos absolutos|recuento absoluto de reticulocitos'],
['retic','Reticulocitos','Reticulocitos','hemograma','reticulocitos|retic'],
['vsg','VSG','VSG','vsg','velocidad de sedimentacion globular|velocidad de sedimentacion|vsg'],
['tp','TP','TP','coagulacion','tiempo de protrombina|tp'],
['inr','INR','INR','coagulacion','indice internacional normalizado|inr'],
['tpta','TTPA','TTPA','coagulacion','tiempo parcial de tromboplastina activado|tiempo de tromboplastina parcial activada|tpta|tt pa|ttpa|aptt'],
['tpta_ratio','Ratio TTPA','ratio TTPA','coagulacion','ratio del aptt|ttpa ratio|ratio ttp a|ratio tpta|ratio ttp a'],
['tp_act','Actividad de protrombina','actividad de protrombina','coagulacion','actividad de protrombina'],
['fibrinogeno','Fibrinógeno','fibrinógeno','coagulacion','fibrinogeno'],
['dimero_d','Dímero D','dímero D','coagulacion','dimero d|d-dimero'],
['glucosa','Glucosa','glucosa','bioquimica','glucosa|glucemia'],
['urea','Urea','urea','bioquimica','urea'],
['creatinina','Creatinina','creatinina','bioquimica','creatinina|creat'],
['fg','Filtrado glomerular','FGe','bioquimica','filtrado glomerular estimado|tasa de filtracion glomerular|fg estimado|fg-e|egfr|ckd-epi|fge'],
['sodio','Sodio','Na','bioquimica','sodio|na+|na'],
['potasio','Potasio','K','bioquimica','potasio|k+|k'],
['cloro','Cloro','Cl','bioquimica','cloruro|cloro|cl-'],
['calcio','Calcio','calcio','bioquimica','calcio total|calcio'],
['calcio_corr','Calcio corregido','calcio corregido','bioquimica','calcio corregido'],
['magnesio','Magnesio','magnesio','bioquimica','magnesio'],
['fosforo','Fosfato','fosfato','bioquimica','fosforo|fosfato'],
['proteinas','Proteínas totales','proteínas','bioquimica','proteinas totales|proteinas sericas totales|proteinas'],
['albumina','Albúmina','albúmina','bioquimica','albumina serica|albumina'],
['urato','Urato','urato','bioquimica','acido urico|urato|uricemia'],
['bili_total','Bilirrubina total','bilirrubina total','bioquimica','bilirrubina total|bilirrubina'],
['bili_directa','Bilirrubina directa','bilirrubina directa','bioquimica','bilirrubina directa|bilirrubina conjugada'],
['bili_indirecta','Bilirrubina indirecta','bilirrubina indirecta','bioquimica','bilirrubina indirecta|bilirrubina no conjugada'],
['cpk','CPK','CPK','bioquimica','creatinfosfoquinasa|creatinquinasa|creatin quinasa|creatina quinasa|ck total|cpk|ck'],
['ldh','LDH','LDH','bioquimica','lactato deshidrogenasa|ldh|ld'],
['ast','GOT/AST','GOT','bioquimica','aspartato aminotransferasa|transaminasa got|got|ast|asat'],
['alt','GPT/ALT','GPT','bioquimica','alanina aminotransferasa|transaminasa gpt|gpt|alt|alat'],
['ggt','GGT','GGT','bioquimica','gamma glutamil transferasa|gamma gt|gamma-gt|ggt'],
['alp','Fosfatasa alcalina','FA','bioquimica','fosfatasa alcalina|alp|fa'],
['ferritina','Ferritina','ferritina','ferrico','ferritina'],
['transferrina','Transferrina','transferrina','ferrico','transferrina'],
['sat_trans','Índice de saturación de transferrina','IST','ferrico','indice de saturacion de la transferrina|saturacion de transferrina|saturacion transferrina|ist'],
['hierro','Hierro','hierro','ferrico','hierro serico|sideremia|hierro'],
['col_total','Colesterol total','colesterol total','lipidico','colesterol total|colesterol'],
['col_hdl','Colesterol HDL','HDL','lipidico','colesterol hdl|hdl-colesterol|hdl colesterol|hdl'],
['col_ldl','Colesterol LDL','LDL','lipidico','colesterol ldl|ldl-colesterol|ldl colesterol|ldl'],
['col_non_hdl','Colesterol no-HDL','no-HDL','lipidico','colesterol no-hdl|colesterol no hdl|non-hdl|no-hdl'],
['tg','Triglicéridos','triglicéridos','lipidico','trigliceridos|triglicéridos|tg'],
['lpa','Lipoproteína (a)','Lp(a)','lipidico','lipoproteina (a)|lipoproteina a|lp(a)'],
['apoa','Apolipoproteína A','Apo-A','lipidico','apolipoproteina a1|apolipoproteina a|apo-a1|apo-a'],
['apob','Apolipoproteína B','Apo-B','lipidico','apolipoproteina b|apo-b'],
['hba1c','HbA1c','HbA1c','diabetico','hemoglobina glicosilada|hemoglobina glicada|hba1c'],
['cpeptido','Péptido C','péptido C','diabetico','peptido c'],
['uacr','Cociente albúmina/creatinina en orina','cociente albúmina/creatinina','orina_bioq','cociente albumina/creatinina|relacion albumina creatinina|albumina/creatinina|uacr|rac'],
['tsh','TSH','TSH','hormonas','tirotropina|tsh'],
['ft4','T4 libre','T4L','hormonas','tiroxina libre|t4 libre|t4l|ft4'],
['ft3','T3 libre','T3L','hormonas','triyodotironina libre|t3 libre|t3l|ft3'],
['cortisol','Cortisol','cortisol','hormonas','cortisol'],
['vitd','25-OH vitamina D','25-OH vitamina D','vitaminas','25-oh vitamina d|25 hidroxi vitamina d|vitamina d'],
['b12','Vitamina B12','vitamina B12','vitaminas','vitamina b12|cobalamina|b12'],
['folato','Folato','folato','vitaminas','acido folico|folato|folico'],
['troponina','Troponina','troponina','cardiacos','troponina t ultrasensible|troponina i ultrasensible|troponina t|troponina i|troponina'],
['ntprobnp','NT-proBNP','NT-proBNP','cardiacos','nt-probnp|nt probnp'],
['bnp','BNP','BNP','cardiacos','bnp'],
['ana','ANA','ANA','autoinmunidad','anticuerpos antinucleares|ana'],
['anca','ANCA','ANCA','autoinmunidad','anticuerpos anca|anca'],
['c3','C3','C3','autoinmunidad','complemento c3|c3'],
['c4','C4','C4','autoinmunidad','complemento c4|c4'],
['sodio_creat_orina','Sodio/creatinina urinarios','Na/creatinina','orina_bioq','sodio/creatinina'],
['potasio_creat_orina','Potasio/creatinina urinarios','K/creatinina','orina_bioq','potasio/creatinina'],
['bun_creat_orina','Nitrógeno ureico/creatinina urinarios','nitrógeno ureico/creatinina','orina_bioq','nitrogeno ureico/creatinina'],
['leuc_orina','Leucocitos en orina','leucocitos orina','orina','leucocitos en orina|leucocituria'],
['hem_orina','Hematíes en orina','hematíes orina','orina','hematies en orina|hematuria'],
['proteinuria','Proteinuria','proteinuria','orina','proteinuria|proteinas en orina'],
['nitrito_orina','Nitrito','nitritos','orina_sistema','nitrito|nitritos'],
['cetonas_orina','Cetonas','cetonas','orina_sistema','cetonas|cuerpos cetonicos'],
['urobilinogeno_orina','Urobilinógeno','urobilinógeno','orina_sistema','urobilinogeno'],
['densidad','Densidad urinaria','densidad','orina','densidad urinaria|densidad orina|densidad'],
['ph','pH','pH','gasometria','ph sangre arterial|ph sangre venosa|ph'],
['pco2','pCO₂','pCO₂','gasometria','pco2|p co2'],
['po2','pO₂','pO₂','gasometria','po2|p o2'],
['hco3_std','Bicarbonato estándar','bicarbonato estándar','gasometria','bicarbonato estandar|hco3 estandar|hco3 std'],
['hco3','Bicarbonato','HCO₃','gasometria','bicarbonato actual|bicarbonato|hco3- actual|hco3-|hco3'],
['so2','Saturación de oxígeno','SatO₂','gasometria','saturacion de oxigeno|saturacion o2|sato2|so2'],
['fio2','FiO₂','FiO₂','gasometria','fio2'],
['lactato','Lactato','lactato','gasometria','acido lactico|lactato'],
['co2_total','CO₂ total','CO₂ total','gasometria','dioxido de carbono total|dioxido carbono total|co2 total'],
['be_std','Exceso de bases estándar','EB estándar','gasometria','exceso de bases estandar'],
['be','Exceso de bases','EB','gasometria','exceso de bases'],
['pcr','Proteína C reactiva','PCR','pcr','proteina c reactiva|pcr|crp'],
];
const ALIASES=[];
for(const [key,name,short,section,aliasString] of DEF){for(const alias of aliasString.split('|')) ALIASES.push({key,name,short,section,alias:clean(alias)});}
ALIASES.sort((a,b)=>b.alias.length-a.alias.length);
// Extra nombres conocidos en el catálogo histórico. No se usan sus códigos como
// equivalentes de determinaciones (riesgo de colisiones). No se importan rangos.
if(global.LabCatalog?.entries){
 const known=new Set(DEF.flatMap(x=>x[4].split('|').map(clean)));
 const added=new Set();
 for(const r of global.LabCatalog.entries){
  const name=clean(r.name);
  if(name.length<6||known.has(name)||added.has(name)||/(?:\(|\)|\/|\dª|\d+º)/.test(r.name))continue;
  if(/^(?:coagulacion basica|hemograma \(perfil\)|gasometria \(perfil\)|cultivo bacteriologico|glucosa curva)/.test(name))continue;
  const section=({Hemograma:'hemograma',Coagulación:'coagulacion',Bioquímica:'bioquimica',Lípidos:'lipidico',Hierro:'ferrico',Hormonas:'hormonas',Vitaminas:'vitaminas',Cardíacos:'cardiacos',Orina:'orina_bioq',Gasometría:'gasometria',Autoinmunidad:'autoinmunidad',Proteinograma:'proteinograma',Microbiología:'microbiologia'})[r.area]||'otros';
  if(section==='otros'||r.specimen==='ORINA 24 HORAS')continue;
  const key='catalogo_'+r.id;
  ALIASES.push({key,name:r.name,short:r.name,section,alias:name});added.add(name);
 }
 ALIASES.sort((a,b)=>b.alias.length-a.alias.length);
}

const NEVER=new Set(['hematíes']);
const HEMO=new Set(['hb','vcm','hcm','ade','leucocitos','neutro','linfo','plaquetas','retic','retic_abs']);
const ENZYMES=new Set(['cpk','ldh','ast','alt','ggt','alp']);
const FIELD_ORDER={bioquimica:['glucosa','urea','creatinina','fg','sodio','potasio','cloro','calcio','calcio_corr','magnesio','fosforo','proteinas','albumina','urato','bili_total','bili_directa','bili_indirecta','cpk','ldh','ast','alt','ggt','alp'],ferrico:['ferritina','transferrina','sat_trans'],lipidico:['col_total','col_hdl','col_ldl','col_non_hdl','tg','lpa','apoa','apob'],diabetico:['hba1c','cpeptido'],orina:['densidad','ph_orina','leucocitos_orina','hematíes_orina','nitrito_orina','glucosa','proteinas','cetonas_orina','urobilinogeno_orina','bili_orina','creatinina_orina','urea_orina','albumina_orina','uacr','sodio_orina','sodio_creat_orina','potasio_orina','potasio_creat_orina','cloro_orina','bun_creat_orina'],coagulacion:['tp','tp_act','inr','tpta','tpta_ratio','fibrinogeno','dimero_d'],hormonas:['tsh','ft4','ft3','cortisol'],vitaminas:['b12','folato','vitd'],cardiacos:['troponina','ntprobnp','bnp']};
function sorted(items,section){const order=FIELD_ORDER[section];if(!order)return items;return [...items].sort((a,b)=>{const ai=order.indexOf(a.key),bi=order.indexOf(b.key);return (ai<0?999:ai)-(bi<0?999:bi)});}
const CULTURE_RE=/\b(hemocultivos?|urocultivos?|exudados?|esputos?|cultivos? de (?:sangre|orina|herida|liquido|líquido|cateter|catéter)|liquido cefalorraquideo|líquido cefalorraquídeo|liquido pleural|líquido pleural|liquido ascitico|líquido ascítico|lcr)\b/i;
const DATE_RE=/\b(?:\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4}|\d{4}-\d{2}-\d{2})\b/g;
function clean(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).replace(/\u00b5|\u03bc/g,'u').replace(/\s+/g,' ').trim();}
function numberOf(input,unit=''){
 if(input===undefined||input===null||input==='')return NaN;
 let s=String(input).replace(/[<>\s]/g,'').replace(/\u2212/g,'-');
 const commas=(s.match(/,/g)||[]).length,dots=(s.match(/\./g)||[]).length;
 if(commas&&dots){const sep=s.lastIndexOf(',')>s.lastIndexOf('.')?',':'.';s=s.replace(sep===','?/\./g:/,/g,'').replace(sep,'.');}
 else if(commas>1||dots>1){const sep=commas?',':'.';const parts=s.split(sep);const last=parts.pop();s=parts.join('')+(last.length===3?'':'.')+last;}
 else if(commas)s=s.replace(',','.');
 else if(dots&&/^-?\d{1,3}\.\d{3}$/.test(s)&&/(?:\/mm3|\/mm3|\/ul|\/uL|celulas)/i.test(unit))s=s.replace('.','');
 return Number(s);
}
function displayNum(n,dec=2){if(!Number.isFinite(n))return '';const value=Number(n.toFixed(dec));const pair=String(value).split('.');const integer=pair[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');return integer+(pair.length>1?','+pair[1]:'');}
function isCellUnit(u){const s=clean(u).replace(/\s/g,'');return /(?:10\s*\^?\s*3|10³|x10\^3|x10³|10e3|10\^9|10⁹)/.test(s)||/mm3|mm³|\/ul|\/uL/i.test(u);}
function asCells(v){if(!v||!Number.isFinite(v.num))return null;const unit=clean(v.unit).replace(/\s/g,'');
 if(/(?:10\^?3|10³|x10\^?3|10e3|10\^?9|10⁹)/.test(unit))return v.num*1000;
 if(/\/(?:ul|mm3|mm³)|celulas\/ul/.test(unit))return v.num;
 return null;
}
function detectRange(rest){const reg=/(?:\(|\[|\bref(?:erencia)?\s*[:=]?\s*|\brango\s*[:=]?\s*)(-?\d+(?:[.,]\d+)?)\s*(?:-|–|—|\ba\b)\s*(-?\d+(?:[.,]\d+)?)(?:\)|\])?/i;const match=rest.match(reg);if(!match)return null;const low=numberOf(match[1]),high=numberOf(match[2]);return Number.isFinite(low)&&Number.isFinite(high)&&low<=high?{low,high,text:match[0]}:null;}
function extractValue(line){const m=line.match(/(?:^|\s|[:=\[])([<>]?\s*-?\d+(?:[.,]\d+)*)(?=\s|$|[%µuUI/\(\[])/);
 if(!m)return null;let n=numberOf(m[1]);if(!Number.isFinite(n))return null;
 const prefix=line.slice(0,m.index);const after=line.slice(m.index+m[0].length).trim();const ref=detectRange(after);
 let unit=after.replace(ref?ref.text:'','').replace(/(?:\b(?:alto|bajo|elevado|disminuido|normal|anormal|critico|crítico)\b|[↑↓*!])/gi,'').trim();
 // If the laboratory writes the unit before the value, e.g. "Glucosa (mg/dL): 90".
 if(!unit){const pu=prefix.match(/\(([^()]{1,25})\)/);if(pu&&!/\d+\s*[-–]/.test(pu[1]))unit=pu[1];}
 unit=unit.replace(/\s*\(?[<>]\s*[\d.,]+\)?/g,'').replace(/^\s*\(CKD-EPI\)\s*/i,'').replace(/^\s*en funci[oó]n de la alb[uú]mina\s*/i,'').replace(/^\s*\((?:CK|ALP)\)\s*/i,'').replace(/\s+Densidad\b.*$/i,'').replace(/^[\s:=;]+|[;,\.\s]+$/g,'').replace(/^\[|\]$/g,'').replace(/\s+/g,' ').slice(0,44);
 const status=/\b(alto|elevado|high)\b|↑/.test(after)?'high':/\b(bajo|disminuido|low)\b|↓/.test(after)?'low':null;
 let abnormal=status;
 if(!abnormal&&ref) abnormal=n<ref.low?'low':n>ref.high?'high':'normal';
 const critical=/\b(?:critico|valor de alarma|panic value)\b|!!/.test(clean(line));
 return{num:n,raw:m[1].trim(),unit,range:ref?{low:ref.low,high:ref.high}:null,abnormal,critical};
}
function matchEntry(line){const norm=clean(line).replace(/^[\-•\s]+/,'');for(const a of ALIASES){if(norm.startsWith(a.alias)){const next=norm[a.alias.length]||'';if(next&&!/[^\p{L}\p{N}]/u.test(next))continue;return a;}}return null;}
function emptyCulture(name,line){const date=(line.match(DATE_RE)||[])[0]||'';return{name:name.replace(/\s+/g,' ').trim(),date,status:'',organism:'',ambiguous:false,sens:{S:[],I:[],R:[]},comments:[],raw:[line]};}
function splitDrugList(str){let depth=0,start=0,out=[];for(let i=0;i<str.length;i++){const c=str[i];if(c==='(')depth++;if(c===')')depth=Math.max(0,depth-1);if((c===','||c===';')&&depth===0){out.push(str.slice(start,i).trim());start=i+1;}}out.push(str.slice(start).trim());return out.filter(Boolean);}
function addSusceptibility(culture,line){let keyMatch=line.match(/^\s*([SIR])\s*[:：]\s*(.+)$/i);if(keyMatch){const key=keyMatch[1].toUpperCase();for(const part of splitDrugList(keyMatch[2])){const p=part.trim();if(p&&!culture.sens[key].includes(p))culture.sens[key].push(p);}return true;}
 keyMatch=line.match(/^(.{3,50}?)\s*(?:\||\t|\s{2,}|\s+\()\s*([SIR])\)?\s*(?:\||\t|\s+|$)(.*)$/i);
 if(keyMatch){const name=keyMatch[1].trim().replace(/\s+$/,'');const key=keyMatch[2].toUpperCase();const rest=keyMatch[3].trim();if(/^(?:escherichia|klebsiella|staphylo|enterococcus|proteus|pseudomonas)/i.test(name))return false;
 let data=name;const mic=rest.match(/(?:CMI|MIC)\s*[:=]?\s*([<>≤≥]?\s*[\d.,]+\s*(?:mg\/L|mg\/l)?)/i);if(mic)data+=' (CMI '+mic[1].trim()+')';if(!culture.sens[key].includes(data))culture.sens[key].push(data);return true;
 }
 return false;
}
function stripReferencePrefix(line){
 const m=line.match(/^\s*(\(\s*[<>]?\s*[-\d.,]+\s*[-–]\s*[-\d.,]+\s*\)|\(?\s*<\s*[\d.,]+\s*\)?)\s+(.*)$/);
 return m?{reference:m[1].replace(/^\(|\)$/g,'').trim(),rest:m[2]}:{reference:'',rest:line};
}
function normalizeSESLine(line){
 let src=line.trim();const leading=stripReferencePrefix(src),ref=leading.reference;
 let body=leading.rest;
 // Reports from the laboratory often prefix the value before the analyte name.
 const m=body.match(/^(?<value>(?:[<>]=?\s*)?[-+]?\d+(?:[.,]\d+)*|Negativo|Positivo|Normal|Trazas)\s+(?<name>[A-ZÁÉÍÓÚa-záéíóú][^:]*)$/i);
 if(m){const named=m.groups.name.trim();const match=findEntryAnywhere(named);
  if(match&&match.pos===0){const raw=m.groups.value;return{line:named.slice(0,match.length)+': '+raw+' '+named.slice(match.length)+(ref?' ('+ref+')':''),prefixed:true};}
 }
 // Keep ranges attached to a conventional line if they were printed before the analyte.
 if(ref){const match=findEntryAnywhere(body);if(match&&match.pos===0)return{line:body+' ('+ref+')',prefixed:false};}
 return{line:src,prefixed:false};
}
function findEntryAnywhere(line){const n=clean(line);for(const a of ALIASES){const idx=n.indexOf(a.alias);if(idx!==0)continue;const next=n[a.alias.length]||'';if(next&&/[\p{L}\p{N}]/u.test(next))continue;return {...a,pos:idx,length:a.alias.length};}return null;}
function numericOrQualitative(tail){
 const qual=tail.match(/^\s*(Negativo|Positivo|Normal|Trazas|No detectado|Detectado)\b/i);
 if(qual)return {num:NaN,raw:qual[1],unit:'',range:null,abnormal:null,qualitative:true};
 return extractValue(tail);
}
function isHeader(gn){
 if(/^(?:hemograma)(?:\s+hemograma)?$/.test(gn))return 'hemograma';
 if(/^(?:sistematico orina|sistematico de orina|sedimento urinario)$/.test(gn))return 'orina';
 if(/^coacgoualgaucliaocnion$/.test(gn))return 'coagulacion';
 if(/^bioqbuioimquicimai cean esna snagrere$/.test(gn))return 'bioquimica';
 if(/^(?:bioquimica en sangre|oquimica en sangre|bioquimica)(?:\s+bioquimica en sangre)?$/.test(gn))return 'bioquimica';
 if(/^(?:metabolismo lipidico|perfil lipidico)(?:\s+metabolismo lipidico)?$/.test(gn))return 'lipidico';
 if(/^(?:bioquimica en orina aislada|orina|sedimento urinario)(?:\s+bioquimica en orina aislada)?$/.test(gn))return 'orina';
 if(/^(?:hormonas|hormona)(?:\s+hormonas)?$/.test(gn))return 'hormonas';
 if(/^(?:proteinas especiales)(?:\s+proteinas especiales)?$/.test(gn))return 'pcr';
 if(/^(?:hemoglobina hplc)(?:\s+hemoglobina hplc)?$/.test(gn))return 'diabetico';
 if(/^(?:serologias?|serologia viral)(?:\s+.*)?$/.test(gn))return 'serologias';
 if(/^(?:microbiologia|estudios microbiologicos)(?:\s+.*)?$/.test(gn))return 'microbiologia';
 if(/^(?:coagulacion|vitaminas|perfil ferrico|autoinmunidad|gasometria)(?:\s+.*)?$/.test(gn))return gn.split(' ')[0];
 return '';
}
function normalizeSource(source){
 let t=String(source||'').replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))
 .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n))
 .replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&')
 .replace(/\\\*/g,'*').replace(/\*\*/g,'').replace(/\\\|/g,'|')
 .replace(/\r/g,'').replace(/[\u00a0\u200b\u200c\u200d]/g,' ');
 t=t.split('\n').map(l=>{
  if(/^\s*\|.*\|\s*$/.test(l)){
   if(/^\s*\|\s*(?:-+|:-+:?)\s*(?:\|\s*(?:-+|:-+:?)\s*)+\|?\s*$/.test(l))return '';
   return l.replace(/^\s*\||\|\s*$/g,'').split('|').map(x=>x.trim()).filter(Boolean).join('  ');
  }return l;
 }).join('\n');
 t=t.replace(/(concentraci[oó]n de hemoglobina corpuscular)\s*\n\s*(media eritrocitaria)/gi,'$1 $2')
 .replace(/(tiempo parcial de tromboplastina activado)\s*\n\s*(\(aPTT\))/gi,'$1 $2')
 .replace(/(tiempo de tromboplastina parcial activada)\s*\n\s*(\(aPTT\))/gi,'$1 $2');
 return t;
}

const DRUGS_MICRO=new Set(('ceftarolina imipenem oxacilina tobramicina gentamicina cotrimoxazol vancomicina teicoplanina linezolid daptomicina clindamicina eritromicina fosfomicina tetraciclina ciprofloxacina levofloxacina ampicilina penicilina mupirocina rifampicina delafloxacino meropenem ceftriaxona amoxicilina cefuroxima cefepima piperacilina/tazobactam azitromicina tigeciclina cefoxitina').split(' '));
function microDrugName(raw){let d=clean(raw).replace(/^a\.?\s*fusidico$/,'acido fusidico').replace(/[^a-z/ ]/g,'').trim();return DRUGS_MICRO.has(d)||d==='acido fusidico'?d:'';}
function microAdd(c,drug,status){if(!drug)return;for(const k of ['S','I','R'])if(c.sens[k].some(v=>clean(v)===clean(drug))){if(k!==status)c.ambiguous=true;return;}
 c.sens[status].push(drug);}
function microOrganism(line){const m=line.match(/^\s*((?:Staphylococcus|Escherichia|Klebsiella|Enterococcus|Pseudomonas|Proteus|Enterobacter|Streptococcus|Serratia|Citrobacter|Candida)\s+[a-z][\w.-]+)/i);return m?m[1].trim():'';}

function parse(source){
 const text=normalizeSource(source)
 // A copied PDF/table may join the chemistry heading to the end of a previous range.
 .replace(/(\d)\s+OQU[IÍ]MICA EN SANGRE(?:\s+BIOQU[IÍ]MICA EN SANGRE)?/gi,'$1)\nBIOQUÍMICA EN SANGRE')
 .replace(/\b(BIOQU[IÍ]MICA EN SANGRE)\s+\1/gi,'$1');
 const lines=text.split(/\n|;(?=\s*[A-Za-zÁÉÍÓÚáéíóú])/).map(l=>l.trim()).filter(Boolean);
 const items=[],unrecognized=[],skipped=[],dates=new Set(),cultures=[],texts={};
 const gas={sourceType:'',suppliedType:false};let currentCulture=null,seenGas=false,sectionHint='',pendingAdministrative=false,microGroup='',microTable=false,microPending='';
 const personal=/\b(?:n[úu]mero de historia|n\.?\s*historia|nhc|dni|cip|paciente\s*:|nombre\s*y\s*apellidos)\b/i.test(text);
 for(const originalLine of lines){
  const line=originalLine;if(/^[-|:\s]+$/.test(line))continue;
  if(/^\s*cultivo bacteriol[oó]gico\b/i.test(line)){
   currentCulture=emptyCulture('Cultivo bacteriológico',line);cultures.push(currentCulture);microGroup='';microTable=false;microPending='';continue;
  }
  if(currentCulture&&currentCulture.name==='Cultivo bacteriológico'){
   const norm=clean(line).replace(/^[\s*•-]+/,'').trim();
   if(isHeader(norm)||/^(?:bioquimica|hemograma|coagulacion|gasometria|hematologia)\b/.test(norm)){currentCulture=null;microGroup='';microTable=false;microPending='';}
   else{
    const org=microOrganism(line);
    if(org){if(currentCulture.organism&&clean(currentCulture.organism)!==clean(org))currentCulture.ambiguous=true;
     currentCulture.organism=org;currentCulture.status='positivo';if(currentCulture.raw.some(x=>microOrganism(x))) {microTable=true;microGroup='';}currentCulture.raw.push(line);continue;}
    if(/^(?:estado|cmi|comentario|antibiograma|microorganismo)$/.test(norm)){microTable=true;continue;}
    const group={sensible:'S',intermedio:'I',resistente:'R',susceptible:'S'}[norm];
    if(group){if(microPending){microAdd(currentCulture,microPending,group);microPending='';}else microGroup=group;continue;}
    const d=microDrugName(line);
    if(d){if(microTable){microPending=d;}else if(microGroup){microAdd(currentCulture,d,microGroup);}else{microPending=d;}continue;}
    if(!norm||/^(?:-+|\|+)$/.test(norm))continue;
    currentCulture.raw.push(line);
    if(/(?:interpretacion|blee|carbapenemasa)/.test(norm))currentCulture.comments.push(line);
    continue;
   }
  }
  if(/^\s*(?:hemocultivos?|urocultivos?|exudados?|esputos?|cultivo de |liquido (?:pleural|ascitico|cefalorraquideo)|líquido (?:pleural|ascítico|cefalorraquídeo)|lcr)\b/i.test(line)){
   const m=line.match(CULTURE_RE);const name=m?m[0]:'Cultivo';currentCulture=emptyCulture(name,line);cultures.push(currentCulture);
   const rem=line.slice(m?m.index+m[0].length:0);const remClean=clean(rem);
   if(/pendiente|en estudio|preliminar/.test(remClean))currentCulture.status='pendiente';
   else if(/negativ|sin crecimiento|no se aisla|esteril/.test(remClean))currentCulture.status='negativo';
   else if(/positiv|aislamient|se aisla/.test(remClean))currentCulture.status='positivo';
   const org=rem.match(/(?:positivo(?:s)?\s*(?::|para)?|aislamiento de|se aisla)\s*:?\s*(?:[\d.]+\s*ufc\/ml\s*)?([A-ZÁÉÍÓÚa-záéíóú]+\s+[a-z][\w.-]+(?:\s+subsp\.\s+\w+)?)/i);
   if(org)currentCulture.organism=org[1].trim();continue;
  }
  if(currentCulture){
   const cn=clean(line);
   if(addSusceptibility(currentCulture,line)){currentCulture.raw.push(line);continue;}
   if(/^(?:microorganismo|germen|aislamiento|identificacion|resultado|antibiograma|comentarios?|blee|carbapenemasa)/.test(cn)||/\b(?:escherichia coli|klebsiella|staphylococcus|enterococcus|pseudomonas|proteus)\b/.test(cn)){
    currentCulture.raw.push(line);
    if(/negativ|sin crecimiento|esteril/.test(cn))currentCulture.status='negativo';
    if(/positiv|aislamient|se aisla|identificacion/.test(cn))currentCulture.status='positivo';
    const org=line.match(/(?:microorganismo|germen|aislamiento(?: de)?|identificaci[oó]n|positivo(?:s)?\s*(?::|para)?)(?:\s*:\s*|\s+)([A-ZÁÉÍÓÚa-záéíóú]+\s+[a-z][\w.-]+)/i)||line.match(/^\s*((?:Escherichia|Klebsiella|Staphylococcus|Enterococcus|Pseudomonas|Proteus|Enterobacter|Streptococcus|Serratia|Citrobacter|Candida)\s+[a-z][\w.-]+)/i);
    if(org&&!/^(?:cultivo|positivo|negativo)/i.test(org[1])){const organism=org[1].trim();if(currentCulture.organism&&clean(currentCulture.organism)!==clean(organism))currentCulture.ambiguous=true;else currentCulture.organism=organism;currentCulture.status='positivo';}
    if(/\bblee\b|carbapenemasa|resistencia inducible|contaminad/.test(cn))currentCulture.comments.push(line.trim());
    continue;
   }
   currentCulture=null;
  }
  const gn=clean(line),hdr=isHeader(gn);
  // Reconocer el tipo de muestra antes de consumir la línea como encabezado.
  // Nunca deducir arterial/venosa por los valores analíticos.
  if(/\bgasometria\s+(?:arterial|venosa)\b|\b(?:sangre|muestra)\s+(?:arterial|venosa)\b/.test(gn)){gas.sourceType=/\barterial\b/.test(gn)?'arterial':'venosa';gas.suppliedType=true;seenGas=true;}
  if(hdr){sectionHint=hdr;if(hdr==='gasometria')seenGas=true;pendingAdministrative=false;continue;}
  const dated=line.match(DATE_RE);if(dated)for(const d of dated)dates.add(d);
  if(/gasometria\s+(arterial|venosa)|(?:sangre|muestra)\s+(arterial|venosa)/.test(gn)){
   gas.sourceType=/arterial/.test(gn)?'arterial':'venosa';gas.suppliedType=true;seenGas=true;sectionHint='gasometria';if(/^gasometria\b/.test(gn)||!/[\d]/.test(line))continue;
  }
  if(/^gasometria\b/.test(gn)){seenGas=true;sectionHint='gasometria';continue;}
  if(/^\s*pcr\s+(?:sars|influenza|vrs|cmv|ebv|vih|virus|respiratoria|bacteriana|mycoplasma|legionella|chlamydia)/i.test(gn)){
   const matches=line.match(/^(.*?)(?:[:=]\s*)(.*?)$/);items.push({key:'other_'+items.length,name:matches?matches[1]:line,short:matches?matches[1]:line,section:'microbiologia',num:NaN,raw:matches?matches[2]:'',unit:'',range:null,abnormal:null,line,qualitative:true});continue;
  }
  if(/^(?:interpretacion(?: del| de)? proteinograma|interpretaci[oó]n electroforesis)\s*[:\-]/i.test(gn)){texts.proteinograma=line.split(/[:\-]/).slice(1).join(':').trim();continue;}
  if(/^(?:frotis(?:\s+de\s+sangre)?|morfologia\s+eritrocitaria|comentario\s+de\s+frotis)\s*[:\-]?/i.test(gn)){
   const desc=line.replace(/^(?:frotis(?:\s+de\s+sangre)?|morfolog[ií]a\s+eritrocitaria|comentario\s+de\s+frotis)\s*[:\-]?\s*/i,'').trim();if(desc)texts.frotis=desc;continue;
  }
  if(/^(?:proteinograma|electroforesis\s+de\s+proteinas)(?:\s*[:\-])?/i.test(gn)){
   const desc=line.replace(/^(?:proteinograma|electroforesis\s+de\s+prote[ií]nas)\s*[:\-]?\s*/i,'').trim();if(desc&&!/^\d/.test(desc)&&/(?:normal|patron|patr[oó]n|componente|pico|gammapat|hiper|hipo|sin alteraciones|monoclonal)/i.test(clean(desc)))texts.proteinograma=desc;
   else if(desc)unrecognized.push({line,reason:'Proteinograma sin interpretación claramente identificada'});continue;
  }
  // Administrative lines, rejected tests and narrative notes are excluded from the formatted report.
  if(/(?:prueba rechazada|no procede|no se realiza la determinaci[oó]n|no se ha realizado|periodicidad de realizaci[oó]n|objetivo terap[eé]utico|indicador erc|resultado no disponible|muestra insuficiente)/i.test(gn)||/^\s*(?:al existir|la periodicidad|en un periodo|moderado rcv|muy alto rcv)/.test(gn)){
   skipped.push({line,reason:/prueba rechazada|no procede|no se ha realizado|no se realiza|muestra insuficiente/.test(gn)?'Prueba no realizada o sin resultado':'Texto administrativo / comentario del laboratorio'});continue;
  }
  if(/^\s*(?:fecha|paciente|solicitante|peticion|petici[oó]n|numero|n[uú]mero|laboratorio|hospital|muestra|sexo|edad|unidad|identificador|secci[oó]n|observaciones|comentarios generales)\b/i.test(gn)||/^[\-=_\s]+$/.test(line)||/^\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4}$/.test(line)){skipped.push({line,reason:'Cabecera o metadato'});continue;}
  if(/^(?:serologia|serolog[ií]a|antigeno|ant[ií]geno|pcr viral|pcr de|anticuerpos|anti-|vih|hbsag|vhc|anti-hbc|anti-hbs|anti-hcv)/i.test(gn)||sectionHint==='serologias'){
   const isSerology=sectionHint==='serologias'||/^(?:serologia|serolog[ií]a|ant[ií]geno|antigeno|vih|hbsag|vhc|anti-hbc|anti-hbs|anti-hcv)/i.test(gn);
   const section=/^pcr (?:viral|de)/i.test(gn)?'microbiologia':isSerology?'serologias':'autoinmunidad';
   const marker=line.match(/^(.*?)\s*(?:[:=]\s*|\s+)(Negativo|Positivo|Reactivo|No reactivo|No detectado|Detectado|Indeterminado)(?:\s|$)/i);
   const labelled=line.match(/^(.*?)\s*[:=]\s*(.+)$/);
   const name=(marker?.[1]||labelled?.[1]||'').trim(),result=(marker?.[2]||labelled?.[2]||'').trim();
   if(name&&result){items.push({key:'other_'+items.length,name,short:name,section,num:NaN,raw:result,unit:'',range:null,abnormal:null,line,qualitative:true});}
   else unrecognized.push({line,reason:'Prueba serológica/inmunológica sin resultado inequívoco'});
   continue;
  }
  let normalized=normalizeSESLine(line);
  const mapped=matchEntry(normalized.line);
  if(mapped){
   const tail=normalized.line.slice(mapped.alias.length).replace(/^[\s:=–—\-]+/,'');
   let val=numericOrQualitative(tail);
   if(!val){unrecognized.push({line,reason:'Determinación reconocida, valor no identificado'});continue;}
   let key=mapped.key,section=mapped.section;
   if(key==='neutro'||key==='linfo'||key==='retic'){
    if(key==='retic'&&/\b(?:abs|absolutos?)\b/i.test(line))key='retic_abs';
    if((key==='neutro'||key==='linfo')&&!val.unit&&line.includes('%'))val.unit='%';
   }
   if(sectionHint==='orina'||/\b(?:en orina|urinari[ao]s?)\b/i.test(line)){
     if(key==='uacr'){section='orina_bioq';}
     else if(['sodio_creat_orina','potasio_creat_orina','bun_creat_orina'].includes(key)){section='orina_bioq';}
     else if(['creatinina','urea','albumina','sodio','potasio','cloro'].includes(key)){
       section='orina_bioq';key=key+'_orina';
     }else if(['ph','hematíes','leucocitos','glucosa','proteinas','bili_total','nitrito_orina','cetonas_orina','urobilinogeno_orina'].includes(key)||['leuc_orina','hem_orina','proteinuria','densidad'].includes(key)){
       section='orina_sistema';if(key==='ph')key='ph_orina';if(key==='hematíes')key='hematíes_orina';if(key==='leucocitos')key='leucocitos_orina';if(key==='bili_total')key='bili_orina';
     }
   }
   if(key==='uacr')section='orina_bioq';
   if((key==='ph'||key==='hco3'||key==='pco2'||key==='po2')&&sectionHint==='gasometria'){section='gasometria';seenGas=true;}
   if(key==='calcio'&&/calcio corregido/i.test(line)){key='calcio_corr';}
   if(section==='gasometria')seenGas=true;
   if(key==='apob'&&/\bg\/L\b/i.test(val.unit)&&val.num>10){unrecognized.push({line,reason:'Unidad de Apo-B potencialmente discordante con el valor: comprobar en el informe original, no se ha convertido'});}
   items.push({key,name:mapped.name,short:mapped.short,section,...val,line});continue;
  }
  if(/(?:sin valor|sin resultado|no detectado)/i.test(gn)){skipped.push({line,reason:'Sin valor numérico informado'});continue;}
  // Determinaciones no incluidas en el diccionario: reconocer solo filas con
  // nombre, valor Y unidad explícitos. No adivinar cifras de texto administrativo.
  const generic=line.match(/^([A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9()\/+.\- ]{3,85}?)\s+([<>]?\s*-?\d+(?:[.,]\d+)?)\s+([A-Za-zµμ%°][A-Za-zµμ%°0-9^\/\-]*)(?:\s+\([^()]{3,40}\))?$/);
  if(generic&&!/\b(?:fecha|firma|peticion|diagnostico|referencia|pagina|página)\b/i.test(generic[1])){
   const result=extractValue(line.slice(generic[1].length).trim());
   if(result&&result.unit){items.push({key:'other_'+items.length,name:generic[1].trim(),short:generic[1].trim(),section:'otros',...result,line});continue;}
  }
  unrecognized.push({line,reason:'Parámetro o formato no reconocido'});
 }
 return{items,cultures,unrecognized,skipped,dates:[...dates],multipleDates:dates.size>1,gas,seenGas,texts,personal};
}
function first(items,key){return items.find(x=>x.key===key)}
function textValue(e,showUnits){return e.raw+(showUnits&&e.unit?' '+e.unit:'')}
function fullValue(e,opts){if(e.qualitative)return e.raw?e.short+': '+e.raw:e.short;if(opts.normal&&opts.profile!=='alterados'&&e.abnormal==='normal')return e.short+' normal';return e.short+' '+textValue(e,opts.units);}
function formattedCell(n,units=true){return displayNum(Math.round(n),0)+(units?'/mm3':'');}
function makeHemogram(items,opts,profile){
 const arr=[];const skip=new Set(['hematíes']);
 // All white cells and platelets are always /mm3, regardless of the units toggle.
 const choose=k=>{if(['leucocitos','neutro','linfo','mono','eos','baso','plaquetas','retic_abs'].includes(k))return items.find(x=>x.key===k&&asCells(x)!==null)||items.find(x=>x.key===k&&x.unit!=='%');return items.find(x=>x.key===k);};
 const used=new Set();const add=(e,label)=>{if(!e)return;used.add(e);if(skip.has(e.key))return;
  if(['leucocitos','neutro','linfo','mono','eos','baso','plaquetas','retic_abs'].includes(e.key)){
   const n=asCells(e);if(n!==null)arr.push((label||e.short)+(opts.normal&&opts.profile!=='alterados'&&e.abnormal==='normal'?' normal':' '+formattedCell(n,true)));
   else if(e.unit!=='%')arr.push((label||e.short)+' '+textValue(e,true));
  }else arr.push(fullValue(e,opts));
 };
 for(const k of ['hb','hematocrito','vcm','hcm','chcm','ade'])add(choose(k));
 const white=choose('leucocitos');add(white);
 for(const k of ['neutro','linfo','mono','eos','baso']){
  const e=choose(k);if(e){add(e);if(opts.differentialPct){const pct=items.find(x=>x.key===k&&x.unit.includes('%'));if(pct&&arr.length)arr[arr.length-1]+=' ('+pct.raw+' %)';}}
 }
 const ne=choose('neutro'),li=choose('linfo');const n=ne?asCells(ne):null,l=li?asCells(li):null;
 if(opts.rnl&&n!==null&&l>0)arr.push('RNL '+displayNum(n/l,2));
 add(choose('plaquetas'));add(choose('vpm'));add(choose('retic_abs'));add(choose('retic'));
 const retic=choose('retic'),ht=choose('hematocrito');if(opts.retic&&retic&&ht&&retic.unit.includes('%'))arr.push('Reticulocitos corregidos '+displayNum(retic.num*ht.num/40,2)+' %');
 // Additional supported hematology parameters not covered above.
 for(const e of items)if(!used.has(e)&&!skip.has(e.key)&&e.unit!=='%'&&!['neutro','linfo','mono','eos','baso'].includes(e.key))add(e);
 return arr;
}
function makeBio(items,opts,profile,needsReview){const arr=[];const normal=[];const list=[...items];for(const e of list){if(ENZYMES.has(e.key)){
   if(profile==='completo'){arr.push(fullValue(e,opts));continue;}
   if(e.abnormal==='normal'){normal.push(e.short);continue;}
   if(e.abnormal==='high'||e.abnormal==='low'){arr.push(fullValue(e,opts));continue;}
   // Without an explicit range/flag we do not conclude normality.
   needsReview.push({line:e.line,reason:'Enzima sin rango o indicador de alteración; no se puede clasificar'});continue;
  }else arr.push(fullValue(e,opts));}
 if(normal.length&&profile!=='completo')arr.push(normal.join(', ')+' '+(normal.length===1?'normal':'normales'));
 return arr;
}
function makeLipid(items,opts){const arr=[];for(const e of items)arr.push(fullValue(e,opts));if(opts.nonhdl&&!first(items,'col_non_hdl')){const t=first(items,'col_total'),h=first(items,'col_hdl');if(t&&h&&clean(t.unit)===clean(h.unit)&&t.num>=h.num&&Number.isFinite(t.num)&&Number.isFinite(h.num)){const val=Math.round((t.num-h.num)*100)/100;const needle=arr.findIndex(s=>s.startsWith('LDL '));arr.splice(needle<0?arr.length:needle+1,0,'no-HDL '+displayNum(val,2)+(opts.units&&t.unit?' '+t.unit:''));}}
 return arr;
}
function makeGas(items,opts,gasType){if(!items.length)return '';if(!gasType)return null;
 const find=k=>first(items,k);const fio=find('fio2'),lact=find('lactato');
 let detail='';const fmt=opts.gasFormat||'completo';
 if(fmt==='completo'){
  const gasOrder=['ph','pco2','po2','hco3','hco3_std','co2_total','be','be_std','so2'];
  const ordered=gasOrder.map(find).filter(Boolean);
  for(const e of items)if(!ordered.includes(e)&&e.key!=='fio2'&&e.key!=='lactato')ordered.push(e);
  detail=ordered.map(e=>fullValue(e,opts)).join(', ');
 }else if(fmt==='etiquetado'){
  detail=['ph','pco2','po2','hco3','so2'].map(find).filter(Boolean).map(e=>fullValue(e,opts)).join(', ');
 }else{
  const d=['ph','pco2','po2','hco3','so2'].map(find);
  const precision=x=>x&&Number.isFinite(x.num)?(x.key==='ph'?displayNum(x.num,2):displayNum(Math.round(x.num),0)):'';
  detail=d.every(Boolean)?d.map(precision).join('/')+(opts.units?' (pCO₂/pO₂ mmHg, HCO₃ mmol/L, SatO₂ %)':''):
   d.map(e=>e?e.short+' '+precision(e):'').filter(Boolean).join(', ');
 }
 if(gasType==='arterial'&&fio)detail+=(detail?', ':'')+'FiO₂ '+textValue(fio,opts.units);
 if(lact)detail+=(detail?', ':'')+'lactato '+textValue(lact,opts.units);
 return detail;
}
function makeMicro(cultures,others,opts){const arr=[];for(const c of cultures){let line=c.name+(c.date?' ('+c.date+')':'')+': ';let status=c.status;
 if(!status&&c.organism)status='positivo';
 if(status==='negativo')line+=/s$/i.test(c.name)?'negativos':'negativo';else if(status==='positivo')line+=c.organism?c.organism:'positivo';else if(status==='pendiente')line+='pendiente';else if(c.organism)line+=c.organism;else continue;
 const antibiogram=[];for(const k of ['S','I','R']){
  const vals=c.sens[k].map(x=>opts.cmi?x:x.replace(/\s*\((?:CMI|MIC)\s*[^)]*\)/gi,''));if(vals.length)antibiogram.push(opts.microDetail?vals.map(x=>x+' ('+k+')').join(', '):k+': '+vals.join(', '));
 }
 if(antibiogram.length)line+='; '+antibiogram.join('; ');
 if(c.comments.length)line+='; '+c.comments.join('; ');
 arr.push(line);
 }
 for(const e of others)arr.push(fullValue(e,opts));return arr;
}

// Conservatively infer units and broad orientation ranges only for unambiguous values.
// These are NOT laboratory-specific reference ranges. Preserve any range/unit supplied by the lab.
const UNIT_FALLBACK={
 sodio:{unit:'mmol/L',min:70,max:200},potasio:{unit:'mmol/L',min:1,max:12},cloro:{unit:'mmol/L',min:60,max:160},
 hb:{unit:'g/dL',min:2,max:28},hematocrito:{unit:'%',min:5,max:80},vcm:{unit:'fL',min:30,max:160},hcm:{unit:'pg',min:10,max:60},
 creatinina:{unit:'mg/dL',min:0.05,max:15},urea:{unit:'mg/dL',min:2,max:300},
 glucosa:{unit:'mg/dL',min:20,max:900},pcr:{unit:'mg/L',min:0,max:500},
 inr:{unit:'',min:0.2,max:20},
};
function enrichItem(e,opts){
 const v={...e};
 if(!Number.isFinite(v.num))return v;
 if(opts.inferUnits&&!v.unit&&UNIT_FALLBACK[v.key]){
  const def=UNIT_FALLBACK[v.key];
  if(v.num>=def.min&&v.num<=def.max&&def.unit){v.unit=def.unit;v.unitInferred=true;}
 }
 return v;
}

// Cálculos derivados explícitos. Si falta un valor o las unidades son ambiguas, se omite el cálculo.
// Sangre y orina deben corresponder a muestras compatibles: el usuario debe comprobar simultaneidad.
function inUnit(e,kind){if(!e||!Number.isFinite(e.num)||!e.unit)return null;
 const u=clean(e.unit).replace(/\s/g,'').replace(/µ/g,'u');const n=e.num;
 if(kind==='creat'){
  if(u==='mg/dl')return n;
  if(u==='mg/l')return n/10;
  if(u==='umol/l')return n/88.4;
  if(u==='mmol/l')return n*11.312;
 }
 if(kind==='urea'){
  if(u==='mg/dl')return n;
  if(u==='mg/l')return n/10;
  if(u==='mmol/l')return n*6.006;
 }
 if(kind==='sodio'||kind==='cloro'||kind==='hco3'){
  if(u==='mmol/l'||u==='meq/l')return n;
 }
 if(kind==='albumina'){
  if(u==='g/dl')return n;
  if(u==='g/l')return n/10;
 }
 if(kind==='transferrina'){
  if(u==='mg/dl')return n;
  if(u==='g/l')return n*100;
 }
 return null;
}
function derivedUrine(items,opts){const blood=items.filter(x=>x.section==='bioquimica');
 const urine=items.filter(x=>x.section==='orina_bioq');
 const by=(arr,k)=>first(arr,k);
 const pNa=inUnit(by(blood,'sodio'),'sodio'),pCr=inUnit(by(blood,'creatinina'),'creat'),pUrea=inUnit(by(blood,'urea'),'urea');
 const uNa=inUnit(by(urine,'sodio_orina'),'sodio'),uCr=inUnit(by(urine,'creatinina_orina'),'creat'),uUrea=inUnit(by(urine,'urea_orina'),'urea');
 const good=(...xs)=>xs.every(x=>x!==null&&Number.isFinite(x)&&x>0);
 const o=[];
 if(opts.fena&&good(uNa,pCr,pNa,uCr))o.push('FeNa '+displayNum(100*uNa*pCr/(pNa*uCr),2)+' %');
 if(opts.feurea&&good(uUrea,pCr,pUrea,uCr))o.push('FeUrea '+displayNum(100*uUrea*pCr/(pUrea*uCr),2)+' %');
 if(opts.ureaRatio&&good(uUrea,pUrea))o.push('urea orina/suero '+displayNum(uUrea/pUrea,2));
 if(opts.crRatio&&good(uCr,pCr))o.push('creatinina orina/suero '+displayNum(uCr/pCr,2));
 if(opts.rfi&&good(uNa,pCr,uCr))o.push('IFR '+displayNum(uNa*pCr/uCr,2));
 return o;
}
function derivedGas(allItems,opts){if(!opts.anionGap&&!opts.deltaRatio)return[];
 const blood=allItems.filter(x=>x.section==='bioquimica');const gas=allItems.filter(x=>x.section==='gasometria');
 const na=inUnit(first(blood,'sodio'),'sodio'),cl=inUnit(first(blood,'cloro'),'cloro'),bicarb=inUnit(first(gas,'hco3'),'hco3');
 if(na===null||cl===null||bicarb===null)return[];
 const ag=na-cl-bicarb;let agCorr=ag;
 const alb=inUnit(first(blood,'albumina'),'albumina');
 if(alb!==null&&alb<4&&alb>=0)agCorr=ag+2.5*(4-alb);
 const out=[];
 if(opts.anionGap){out.push('anion gap '+displayNum(ag,1)+' mmol/L');if(agCorr!==ag)out.push('anion gap corregido por albúmina '+displayNum(agCorr,1)+' mmol/L');}
 // Delta ratio is an elevated-anion-gap acidosis index. Do not compute in non-applicable contexts.
 if(opts.deltaRatio&&bicarb<24&&agCorr>12){out.push('razón delta-delta '+displayNum((agCorr-12)/(24-bicarb),2));}
 return out;
}
function derivedTibc(items,opts){if(!opts.tibc)return'';
 const t=first(items.filter(x=>x.section==='ferrico'),'transferrina');const tf=inUnit(t,'transferrina');
 if(tf===null||tf<=0)return'';
 // The multiplier depends on laboratory assay. Explicit label as an estimate, not a measured value.
 return 'TIBC estimada '+displayNum(tf*1.4,1)+' µg/dL (factor 1,4)';
}

// Unificamos resultados y cálculos de orina bajo un solo encabezado de informe.
const URINE_SECTIONS=new Set(['orina','orina_bioq','orina_sistema','indices_renales']);
function reportSection(section){return URINE_SECTIONS.has(section)?'orina':section;}
function format(parsed,opts,selected){
 const sections={},ignored=[],pending=[...parsed.unrecognized],out=[];
 if(parsed.personal)return{output:'',sections:{},pending,ignored,blocked:'Se han detectado posibles datos identificativos. Elimina la información personal antes de procesar.'};
 if(parsed.multipleDates)return{output:'',sections:{},pending,ignored,blocked:'Se han encontrado varias fechas fuera de microbiología. Separa las analíticas para impedir que se mezclen resultados.'};
 if(parsed.cultures.some(c=>c.ambiguous))return{output:'',sections:{},pending,ignored,blocked:'Se han detectado varios microorganismos en un cultivo sin poder asociar cada antibiograma a su aislamiento. Separa los aislamientos antes de generar el informe.'};
 for(const c of parsed.cultures){if(!c.status&&!c.organism)pending.push({line:c.raw.join(' | '),reason:'Cultivo sin resultado identificable; requiere revisión'});}
 const processedItems=parsed.items.map(e=>enrichItem(e,opts));
 const inferred=[];
 for(const e of processedItems){if(e.unitInferred||e.rangeInferred){
  inferred.push({line:e.name+' '+e.raw+(e.unit?' '+e.unit:''),reason:(e.unitInferred?'Unidad inferida':'')+(e.unitInferred&&e.rangeInferred?' · ':'')+(e.rangeInferred?'Intervalo orientativo (no aportado por laboratorio)':'')});
 }}
 const bySec={};for(const e of processedItems){(bySec[reportSection(e.section)]??=[]).push(e);}
 const urinaryDerived=derivedUrine(processedItems,opts),gasDerived=derivedGas(processedItems,opts),tibcDerived=derivedTibc(processedItems,opts);
 for(const sec of ORDER){
  const elems=sorted(bySec[sec]||[],sec);let parts=[];
  if(sec==='hemograma')parts=makeHemogram(elems,opts,opts.profile);
  else if(sec==='bioquimica')parts=makeBio(elems,opts,opts.profile,pending);
  else if(sec==='ferrico')parts=elems.map(e=>fullValue(e,opts));
  else if(sec==='lipidico')parts=makeLipid(elems,opts);
  else if(sec==='gasometria'){
   if(elems.length&&!opts.gasType){pending.push({line:'Gasometría',reason:'Selecciona arterial o venosa; no se deduce por los valores'});}
   else if(elems.length){const detail=makeGas(elems,opts,opts.gasType);parts=[detail+(gasDerived.length?(detail?', ':'')+gasDerived.join(', '):'')];}
  }
  else if(sec==='cultivos')parts=makeMicro(parsed.cultures,[],opts);
  else if(sec==='microbiologia')parts=elems.map(e=>fullValue(e,opts));
  else if(sec==='frotis')parts=parsed.texts.frotis?[parsed.texts.frotis]:[];
  else if(sec==='proteinograma')parts=parsed.texts.proteinograma?[parsed.texts.proteinograma]:[];
  else parts=elems.filter(e=>!NEVER.has(e.key)).map(e=>fullValue(e,opts));
  // Modo alterados: resumir exclusivamente los resultados con intervalo de referencia.
  // No se recortan gasometrías, cultivos, microbiología, serologías ni textos descriptivos.
  if(opts.profile==='alterados'&&!['cultivos','microbiologia','serologias','gasometria','frotis','proteinograma'].includes(sec)){
   const eligible=elems.filter(e=>!NEVER.has(e.key)&&!(sec==='hemograma'&&['neutro','linfo','mono','eos','baso'].includes(e.key)&&e.unit.includes('%')));
   const altered=eligible.filter(e=>e.abnormal==='high'||e.abnormal==='low');
   const normalCount=eligible.filter(e=>e.abnormal==='normal').length;
   const unknown=eligible.filter(e=>!e.abnormal);
   if(sec==='hemograma'){
    const keep=[...altered,...unknown];
    if(opts.differentialPct){for(const e of elems){if(['neutro','linfo','mono','eos','baso'].includes(e.key)&&e.unit.includes('%')&&keep.some(a=>a.key===e.key&&!a.unit.includes('%')))keep.push(e);}}
    parts=makeHemogram(keep,{...opts,normal:false,rnl:false,retic:false},'alterados');
   }else parts=[...altered,...unknown].map(e=>fullValue(e,{...opts,normal:false}));
   for(const e of unknown)pending.push({line:e.line,reason:'Sin rango de referencia: se conserva el valor numérico; no se presume normalidad'});
   if(normalCount>0&&!unknown.length)parts.push('resto normal');
  }
  // Cada cálculo se añade a su perfil, también cuando se muestran solo alteraciones.
  if(sec==='orina'&&urinaryDerived.length)parts.push(...urinaryDerived);
  if(sec==='ferrico'&&tibcDerived)parts.push(tibcDerived);
  if(sec==='hemograma'&&opts.profile==='alterados'){
   const calculations=makeHemogram(elems,{...opts,normal:false,differentialPct:false},'completo')
    .filter(x=>x.startsWith('RNL ')||x.startsWith('Reticulocitos corregidos '));
   parts.push(...calculations);
  }
  if(sec==='lipidico'&&opts.profile==='alterados'&&opts.nonhdl){
   const computed=makeLipid(elems,{...opts,normal:false}).find(x=>x.startsWith('no-HDL '));
   if(computed)parts.push(computed);
  }
  if(!parts.length)continue;
  const title=sec==='gasometria'?'Gasometría '+opts.gasType:TITLES[sec];
  sections[sec]='- '+title+': '+((sec==='pcr'||sec==='vsg')?parts.join(', ').replace(/^(?:PCR|VSG) /,''):parts.join(sec==='cultivos'?'; ':', '))+'.';
 }
 for(const s of (parsed.skipped||[])){if(s&&typeof s==='object'&&/Prueba no realizada/.test(s.reason))ignored.push(s);}
 for(const e of parsed.items){if(NEVER.has(e.key))ignored.push({line:e.line,reason:'Omitido por regla fija'});}
 for(const sec of ORDER){if(sections[sec]&&selected?.[sec]!==false)out.push(sections[sec]);}
 return{output:out.join('\n'),sections,pending,ignored,inferred,processedItems,blocked:''};
}
const defaults={profile:'completo',normal:false,inferUnits:true,units:true,rnl:false,nonhdl:false,retic:false,fena:false,feurea:false,ureaRatio:false,crRatio:false,rfi:false,anionGap:false,deltaRatio:false,tibc:false,cmi:false,microDetail:false,vpm:true,differentialPct:false,gasFormat:'completo',gasType:''};
global.LabEditor={parse,format,clean,numberOf,defaults,ORDER,TITLES};
})(window);
