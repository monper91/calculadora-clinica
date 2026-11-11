/* Editor de analíticas · v23 (piloto adaptado al formato SES) · Procesamiento local y sin red. */
'use strict';
(function(global){
const ORDER=['hemograma','vsg','frotis','coagulacion','bioquimica','ferrico','lipidico','diabetico','hormonas','vitaminas','cardiacos','autoinmunidad','orina_bioq','orina_sistema','orina','gasometria','pcr','proteinograma','microbiologia','otros'];
const TITLES={hemograma:'Hemograma',vsg:'VSG',frotis:'Frotis',coagulacion:'Coagulación',bioquimica:'Bioquímica',ferrico:'Perfil férrico',lipidico:'Perfil lipídico',diabetico:'Perfil diabético',hormonas:'Hormonas',vitaminas:'Vitaminas',cardiacos:'Marcadores cardíacos',autoinmunidad:'Autoinmunidad',orina:'Orina',orina_bioq:'Bioquímica en orina',orina_sistema:'Sistemático de orina',gasometria:'Gasometría',pcr:'PCR',proteinograma:'Proteinograma',microbiologia:'Microbiología',otros:'Otros'};
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
['vpm','VPM','VPM','hemograma','volumen plaquetario medio|vpm|mpv'],
['retic_abs','Reticulocitos absolutos','Reticulocitos absolutos','hemograma','reticulocitos absolutos|recuento absoluto de reticulocitos'],
['retic','Reticulocitos','Reticulocitos','hemograma','reticulocitos|retic'],
['vsg','VSG','VSG','vsg','velocidad de sedimentacion globular|velocidad de sedimentacion|vsg'],
['tp','TP','TP','coagulacion','tiempo de protrombina|tp'],
['inr','INR','INR','coagulacion','indice internacional normalizado|inr'],
['tpta','TTPA','TTPA','coagulacion','tiempo de tromboplastina parcial activada|tpta|aptt'],
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
['uacr','Cociente albúmina/creatinina en orina','cociente albúmina/creatinina','diabetico','cociente albumina/creatinina|relacion albumina creatinina|albumina/creatinina|uacr|rac'],
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
['densidad','Densidad urinaria','densidad','orina','densidad urinaria|densidad orina'],
['ph','pH','pH','gasometria','ph'],
['pco2','pCO₂','pCO₂','gasometria','pco2|p co2'],
['po2','pO₂','pO₂','gasometria','po2|p o2'],
['hco3_std','Bicarbonato estándar','bicarbonato estándar','gasometria','bicarbonato estandar|hco3 estandar|hco3 std'],
['hco3','Bicarbonato','HCO₃','gasometria','bicarbonato actual|bicarbonato|hco3- actual|hco3-|hco3'],
['so2','Saturación de oxígeno','SatO₂','gasometria','saturacion de oxigeno|saturacion o2|sato2|so2'],
['fio2','FiO₂','FiO₂','gasometria','fio2'],
['lactato','Lactato','lactato','gasometria','acido lactico|lactato'],
['pcr','Proteína C reactiva','PCR','pcr','proteina c reactiva|pcr|crp'],
];
const ALIASES=[];
for(const [key,name,short,section,aliasString] of DEF){for(const alias of aliasString.split('|')) ALIASES.push({key,name,short,section,alias:clean(alias)});}
ALIASES.sort((a,b)=>b.alias.length-a.alias.length);
const NEVER=new Set(['hierro','hematíes','mono','eos','baso','chcm']);
const HEMO=new Set(['hb','vcm','hcm','ade','leucocitos','neutro','linfo','plaquetas','retic','retic_abs']);
const ENZYMES=new Set(['cpk','ldh','ast','alt','ggt','alp']);
const FIELD_ORDER={bioquimica:['glucosa','urea','creatinina','fg','sodio','potasio','cloro','calcio','calcio_corr','magnesio','fosforo','proteinas','albumina','urato','bili_total','bili_directa','bili_indirecta','cpk','ldh','ast','alt','ggt','alp'],ferrico:['ferritina','transferrina','sat_trans'],lipidico:['col_total','col_hdl','col_ldl','col_non_hdl','tg','lpa','apoa','apob'],diabetico:['hba1c','cpeptido','uacr'],coagulacion:['tp','inr','tpta','fibrinogeno','dimero_d'],hormonas:['tsh','ft4','ft3','cortisol'],vitaminas:['b12','folato','vitd'],cardiacos:['troponina','ntprobnp','bnp']};
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
 else if(dots&&/^-?\d{1,3}\.\d{3}$/.test(s)&&/(?:\/mm3|\/mm³|\/ul|\/uL|celulas)/i.test(unit))s=s.replace('.','');
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
 if(qual)return {num:NaN,raw:qual[1],unit:'',range:null,abnormal:null,critical:false,qualitative:true};
 return extractValue(tail);
}
function isHeader(gn){
 if(/^(?:hemograma)(?:\s+hemograma)?$/.test(gn))return 'hemograma';
 if(/^(?:bioquimica en sangre|oquimica en sangre|bioquimica)(?:\s+bioquimica en sangre)?$/.test(gn))return 'bioquimica';
 if(/^(?:metabolismo lipidico|perfil lipidico)(?:\s+metabolismo lipidico)?$/.test(gn))return 'lipidico';
 if(/^(?:bioquimica en orina aislada|orina|sedimento urinario)(?:\s+bioquimica en orina aislada)?$/.test(gn))return 'orina';
 if(/^(?:hormonas|hormona)(?:\s+hormonas)?$/.test(gn))return 'hormonas';
 if(/^(?:proteinas especiales)(?:\s+proteinas especiales)?$/.test(gn))return 'pcr';
 if(/^(?:hemoglobina hplc)(?:\s+hemoglobina hplc)?$/.test(gn))return 'diabetico';
 if(/^(?:coagulacion|vitaminas|perfil ferrico|autoinmunidad|gasometria)(?:\s+.*)?$/.test(gn))return gn.split(' ')[0];
 return '';
}
function parse(source){
 const text=String(source||'').replace(/\r/g,'').replace(/\u00a0/g,' ')
 // A copied PDF/table may join the chemistry heading to the end of a previous range.
 .replace(/(\d)\s+OQU[IÍ]MICA EN SANGRE(?:\s+BIOQU[IÍ]MICA EN SANGRE)?/gi,'$1)\nBIOQUÍMICA EN SANGRE')
 .replace(/\b(BIOQU[IÍ]MICA EN SANGRE)\s+\1/gi,'$1');
 const lines=text.split(/\n|;(?=\s*[A-Za-zÁÉÍÓÚáéíóú])/).map(l=>l.trim()).filter(Boolean);
 const items=[],unrecognized=[],skipped=[],dates=new Set(),cultures=[],texts={};
 const gas={sourceType:'',suppliedType:false};let currentCulture=null,seenGas=false,sectionHint='',pendingAdministrative=false;
 const personal=/\b(?:n[úu]mero de historia|n\.?\s*historia|nhc|dni|cip|paciente\s*:|nombre\s*y\s*apellidos)\b/i.test(text);
 for(const originalLine of lines){
  const line=originalLine;
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
  if(hdr){sectionHint=hdr;if(hdr==='gasometria')seenGas=true;pendingAdministrative=false;continue;}
  const dated=line.match(DATE_RE);if(dated)for(const d of dated)dates.add(d);
  if(/gasometria\s+(arterial|venosa)|(?:sangre|muestra)\s+(arterial|venosa)/.test(gn)){
   gas.sourceType=/arterial/.test(gn)?'arterial':'venosa';gas.suppliedType=true;seenGas=true;sectionHint='gasometria';continue;
  }
  if(/^gasometria\b/.test(gn)){seenGas=true;sectionHint='gasometria';continue;}
  if(/^\s*pcr\s+(?:sars|influenza|vrs|cmv|ebv|vih|virus|respiratoria|bacteriana|mycoplasma|legionella|chlamydia)/i.test(gn)){
   const matches=line.match(/^(.*?)(?:[:=]\s*)(.*?)$/);items.push({key:'other_'+items.length,name:matches?matches[1]:line,short:matches?matches[1]:line,section:'microbiologia',num:NaN,raw:matches?matches[2]:'',unit:'',range:null,abnormal:null,critical:false,line,qualitative:true});continue;
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
  if(/^(?:serologia|serolog[ií]a|antigeno|ant[ií]geno|pcr viral|pcr de|anticuerpos|anti-|vih|hbsag|vhc)/i.test(gn)){
   items.push({key:'other_'+items.length,name:line.split(/[:=]/)[0].trim(),short:line.split(/[:=]/)[0].trim(),section:/vih|hbsag|vhc|viral|antigeno/.test(gn)?'microbiologia':'autoinmunidad',num:NaN,raw:line.split(/[:=]/).slice(1).join(':').trim(),unit:'',range:null,abnormal:null,critical:false,line,qualitative:true});continue;
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
     if(key==='uacr'){section='diabetico';}
     else if(['sodio_creat_orina','potasio_creat_orina','bun_creat_orina'].includes(key)){section='orina_bioq';}
     else if(['creatinina','urea','albumina','sodio','potasio','cloro'].includes(key)){
       section='orina_bioq';key=key+'_orina';
     }else if(['ph','hematíes','leucocitos','glucosa','proteinas','bili_total','nitrito_orina','cetonas_orina','urobilinogeno_orina'].includes(key)||['leuc_orina','hem_orina','proteinuria','densidad'].includes(key)){
       section='orina_sistema';if(key==='ph')key='ph_orina';if(key==='hematíes')key='hematíes_orina';if(key==='leucocitos')key='leucocitos_orina';if(key==='bili_total')key='bili_orina';
     }
   }
   if((key==='ph'||key==='hco3'||key==='pco2'||key==='po2')&&sectionHint==='gasometria'){section='gasometria';seenGas=true;}
   if(key==='calcio'&&/calcio corregido/i.test(line)){key='calcio_corr';}
   if(section==='gasometria')seenGas=true;
   if(key==='apob'&&/\bg\/L\b/i.test(val.unit)&&val.num>10){unrecognized.push({line,reason:'Unidad de Apo-B potencialmente discordante con el valor: comprobar en el informe original, no se ha convertido'});}
   items.push({key,name:mapped.name,short:mapped.short,section,...val,line});continue;
  }
  if(/(?:sin valor|sin resultado|no detectado)/i.test(gn)){skipped.push({line,reason:'Sin valor numérico informado'});continue;}
  unrecognized.push({line,reason:'Parámetro o formato no reconocido'});
 }
 return{items,cultures,unrecognized,skipped,dates:[...dates],multipleDates:dates.size>1,gas,seenGas,texts,personal};
}
function first(items,key){return items.find(x=>x.key===key)}
function textValue(e,showUnits){return e.raw+(showUnits&&e.unit?' '+e.unit:'')}
function fullValue(e,opts){if(e.qualitative)return e.raw?e.short+': '+e.raw:e.short;return e.short+' '+textValue(e,opts.units);}
function formattedCell(n,units=true){return displayNum(Math.round(n),0)+(units?'/mm³':'');}
function makeHemogram(items,opts,profile){const arr=[];const used=new Set();const take=(key)=>{const e=first(items,key);if(e){used.add(e);return e;}return null;};
 for(const k of ['hb','vcm','hcm','ade']){const e=take(k);if(e)arr.push(fullValue(e,opts));}
 const leuc=take('leucocitos');const chooseAbsolute=key=>{const xs=items.filter(x=>x.key===key);const e=xs.find(x=>asCells(x)!==null)||xs[0];if(e)used.add(e);return e||null;};const neutro=chooseAbsolute('neutro'),linfo=chooseAbsolute('linfo');
 const cell=(e)=>e?asCells(e):null;
 const white=cell(leuc);const diffCount=e=>{if(!e)return null;let n=asCells(e);if(n!==null)return n;if(e.unit.includes('%')&&white!==null)return white*e.num/100;return null;};
 const neutroN=diffCount(neutro),linfoN=diffCount(linfo);
 if(leuc){const base=white!==null?'Leucocitos '+formattedCell(white,opts.units):fullValue(leuc,opts);const diff=[];if(neutro)diff.push('neutrófilos '+(neutroN!==null?formattedCell(neutroN,opts.units):textValue(neutro,opts.units)));if(linfo)diff.push('linfocitos '+(linfoN!==null?formattedCell(linfoN,opts.units):textValue(linfo,opts.units)));arr.push(base+(diff.length?' ('+diff.join(', ')+')':''));}
 else{if(neutro)arr.push('Neutrófilos '+(neutroN!==null?formattedCell(neutroN,opts.units):textValue(neutro,opts.units)));if(linfo)arr.push('Linfocitos '+(linfoN!==null?formattedCell(linfoN,opts.units):textValue(linfo,opts.units)));}
 if(opts.rnl&&neutro&&linfo){let a=neutroN,b=linfoN;if(a===null&&neutro.unit.includes('%'))a=neutro.num;if(b===null&&linfo.unit.includes('%'))b=linfo.num;if(a!==null&&b>0)arr.push('RNL '+displayNum(a/b,2));}
 const plt=take('plaquetas');if(plt)arr.push('Plaquetas '+(cell(plt)!==null?formattedCell(cell(plt),opts.units):textValue(plt,opts.units)));
 const reticA=take('retic_abs'),retic=take('retic');
 if(reticA)arr.push('Reticulocitos absolutos '+(cell(reticA)!==null?formattedCell(cell(reticA),opts.units):textValue(reticA,opts.units)));
 if(retic)arr.push('Reticulocitos '+textValue(retic,opts.units));
 const ht=first(items,'hematocrito');if(opts.retic&&retic&&ht&&retic.unit.includes('%')&&ht.num>0){arr.push('Reticulocitos corregidos '+displayNum(retic.num*ht.num/40,2)+'%');}
 if(opts.vpm){const vpm=take('vpm');if(vpm)arr.push(fullValue(vpm,opts));}
 if(profile==='completo'){for(const e of items){if(!used.has(e)&&!NEVER.has(e.key)&&e.key!=='hematocrito'&&e.key!=='vpm')arr.push(fullValue(e,opts));}}
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
function makeGas(items,opts,gasType){if(!items.length)return'';if(!gasType)return null;
 const firstN=k=>first(items,k);const round=x=>x?Number.isFinite(x.num)?Math.round(x.num).toString():'':'';
 const entries=[firstN('ph'),firstN('pco2'),firstN('po2'),firstN('hco3')];
 const complete=entries.every(Boolean);const names=['pH','pCO₂','pO₂','HCO₃'];
 const ph=x=>displayNum(Math.round((x.num+Number.EPSILON)*100)/100,2);
 const str=complete?entries.map((x,i)=>i===0?ph(x):round(x)).join('/'):entries.map((x,i)=>x?names[i]+' '+(i===0?ph(x):round(x)):'').filter(Boolean).join(', ');
 const std=firstN('hco3_std');const so2=firstN('so2');let detail=str;if(std)detail+=(firstN('hco3')?' (estándar '+round(std)+')':(detail?', ':'')+'HCO₃ estándar '+round(std));if(so2)detail+=(complete?'/':', SatO₂ ')+round(so2)+(opts.units?'%':'');
 const fio=firstN('fio2');if(gasType==='arterial'&&fio)detail+=', FiO₂ '+textValue(fio,opts.units);
 const lact=firstN('lactato');if(lact)detail+=', lactato '+textValue(lact,opts.units);
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
function format(parsed,opts,selected){const sections={};const ignored=[];const pending=[...parsed.unrecognized];const out=[];
 if(parsed.personal)return{output:'',sections:{},pending,ignored,blocked:'Se han detectado posibles datos identificativos. Elimina la información personal antes de procesar.'};
 if(parsed.multipleDates)return{output:'',sections:{},pending,ignored,blocked:'Se han encontrado varias fechas fuera de microbiología. Separa las analíticas para impedir que se mezclen resultados.'};
 if(parsed.cultures.some(c=>c.ambiguous))return{output:'',sections:{},pending,ignored,blocked:'Se han detectado varios microorganismos en un cultivo sin poder asociar cada antibiograma a su aislamiento. Separa los aislamientos antes de generar el informe.'};
 for(const c of parsed.cultures){if(!c.status&&!c.organism)pending.push({line:c.raw.join(' | '),reason:'Cultivo sin resultado identificable; requiere revisión'});}
 const bySec={};for(const e of parsed.items){(bySec[e.section]??=[]).push(e);}
 for(const sec of ORDER){let elems=sorted(bySec[sec]||[],sec);let parts=[];const profile=opts.profile;
  if(sec==='hemograma')parts=makeHemogram(elems,opts,profile);
  else if(sec==='bioquimica')parts=makeBio(elems,opts,profile,pending);
  else if(sec==='ferrico')parts=elems.filter(e=>e.key!=='hierro').map(e=>fullValue(e,opts));
  else if(sec==='lipidico')parts=makeLipid(elems,opts);
  else if(sec==='gasometria'){
   if(elems.length&&!opts.gasType){pending.push({line:'Gasometría',reason:'Selecciona arterial o venosa; no se deduce por los valores'});parts=[];}
   else if(elems.length)parts=[makeGas(elems,opts,opts.gasType)];
  }
  else if(sec==='microbiologia')parts=makeMicro(parsed.cultures,elems,opts);
  else if(sec==='frotis')parts=parsed.texts.frotis?[parsed.texts.frotis]:[];
  else if(sec==='proteinograma')parts=parsed.texts.proteinograma?[parsed.texts.proteinograma]:[];
  else parts=elems.filter(e=>!NEVER.has(e.key)).map(e=>fullValue(e,opts));
  if(sec==='frotis'&&!parts.length&&parsed.texts.frotis)parts=[parsed.texts.frotis];
  if(sec==='proteinograma'&&!parts.length&&parsed.texts.proteinograma)parts=[parsed.texts.proteinograma];
  if(sec==='microbiologia'&&parsed.cultures.length&&!parts.length)parts=makeMicro(parsed.cultures,[],opts);
  if(opts.profile==='alterados'&&sec!=='microbiologia'&&sec!=='gasometria'&&sec!=='frotis'&&sec!=='proteinograma'){
    const ok=elems.filter(e=>e.abnormal==='high'||e.abnormal==='low');parts=ok.filter(e=>!NEVER.has(e.key)).map(e=>fullValue(e,opts));
    for(const e of elems){if(!e.abnormal&&!NEVER.has(e.key))pending.push({line:e.line,reason:'No consta rango de referencia para el filtro «Solo alteraciones»'});}
  }
  if(sec==='hemograma'&&opts.profile==='alterados'){
   // In abnormal-only view, derived ratios are not assumed abnormal by default.
   parts=elems.filter(e=>e.abnormal==='high'||e.abnormal==='low').filter(e=>!NEVER.has(e.key)).map(e=>fullValue(e,opts));
  }
  if(opts.critical&&parts.length&&elems.some(e=>e.critical))parts[0]='⚠ '+parts[0];
  if(parts.length){const title=sec==='gasometria'?'Gasometría '+opts.gasType:TITLES[sec];sections[sec]='- '+title+': '+((sec==='pcr'||sec==='vsg')?parts.join(', ').replace(/^(?:PCR|VSG) /,''):parts.join(sec==='microbiologia'?'; ':', '))+'.';}
 }
 for(const s of (parsed.skipped||[])){if(s&&typeof s==='object'&&/Prueba no realizada/.test(s.reason))ignored.push(s);}
 for(const e of parsed.items){if(NEVER.has(e.key))ignored.push({line:e.line,reason:'Omitido por las reglas del formato habitual'});if(e.key==='hematocrito')ignored.push({line:e.line,reason:'Usado para cálculo reticulocitario cuando procede; omitido en informe'});}
 for(const [sec,line] of Object.entries(sections)){if(selected?.[sec]===false)continue;out.push(line);}
 return{output:out.join('\n'),sections,pending,ignored,blocked:''};
}
const defaults={profile:'habitual',units:true,rnl:true,nonhdl:true,retic:true,critical:false,cmi:false,microDetail:false,vpm:false,gasType:''};
global.LabEditor={parse,format,clean,numberOf,defaults,ORDER,TITLES};
})(window);
