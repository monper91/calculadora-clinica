/* DEMOSTRACIÓN: perfiles y expedientes ficticios. NO apto para información clínica real.
   Los perfiles son organizativos, NO autenticación ni separación segura entre usuarios. */
(function(global){
'use strict';
const DB_NAME='mi_clinica_demo_v1', VERSION=2;
const PROFILE_KEY='mi_demo_active_profile_v2';
const PATIENT_KEY='mi_demo_active_patient_v2';
const LEGACY_ID='perfil-v13-recuperado';
let opening=null;
const reqPromise=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('Error de almacenamiento'));});
const txPromise=t=>new Promise((resolve,reject)=>{t.oncomplete=resolve;t.onerror=()=>reject(t.error||new Error('Error de almacenamiento'));t.onabort=()=>reject(t.error||new Error('Operación cancelada'));});
function database(){
 if(!('indexedDB' in global))return Promise.reject(new Error('IndexedDB no disponible'));
 if(opening)return opening;
 opening=new Promise((resolve,reject)=>{
  const r=indexedDB.open(DB_NAME,VERSION);
  r.onupgradeneeded=event=>{
   const db=r.result,tx=r.transaction;
   if(!db.objectStoreNames.contains('patients'))db.createObjectStore('patients',{keyPath:'id'});
   if(!db.objectStoreNames.contains('evaluations')){const store=db.createObjectStore('evaluations',{keyPath:'id',autoIncrement:true});store.createIndex('patientId','patientId',{unique:false});}
   if(!db.objectStoreNames.contains('profiles'))db.createObjectStore('profiles',{keyPath:'id'});
   if(event.oldVersion<2){
    // Recupera los expedientes ficticios de la v13 en un perfil explícito.
    const patients=tx.objectStore('patients'),profiles=tx.objectStore('profiles');
    let created=false;
    patients.openCursor().onsuccess=e=>{const cursor=e.target.result;if(!cursor)return;
     const patient=cursor.value;
     if(!patient.profileId){if(!created){profiles.put({id:LEGACY_ID,name:'Perfil recuperado (v13)',createdAt:new Date().toISOString(),demo:true});created=true;}
      patient.profileId=LEGACY_ID;cursor.update(patient);}
     cursor.continue();};
   }
  };
  r.onsuccess=()=>{const db=r.result;db.onversionchange=()=>{db.close();opening=null};resolve(db)};
  r.onerror=()=>{opening=null;reject(r.error||new Error('No se pudo abrir la base de datos'))};
  r.onblocked=()=>{opening=null;reject(new Error('Cierra las otras pestañas antiguas del portal y vuelve a intentarlo'))};
 });return opening;
}
const fmt=iso=>new Intl.DateTimeFormat('es-ES',{dateStyle:'short',timeStyle:'short'}).format(new Date(iso));
function getActiveProfile(){try{return localStorage.getItem(PROFILE_KEY)}catch{return null}}
function setActiveProfile(id){try{if(id)localStorage.setItem(PROFILE_KEY,id);else localStorage.removeItem(PROFILE_KEY)}catch{} setActive(null)}
function getActive(){try{return sessionStorage.getItem(PATIENT_KEY)}catch{return null}}
function setActive(id){try{if(id)sessionStorage.setItem(PATIENT_KEY,id);else sessionStorage.removeItem(PATIENT_KEY)}catch{}}
async function listProfiles(){const db=await database();return (await reqPromise(db.transaction('profiles','readonly').objectStore('profiles').getAll())).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));}
async function getProfile(id){if(!id)return null;const db=await database();return (await reqPromise(db.transaction('profiles','readonly').objectStore('profiles').get(id)))||null}
async function getCurrentProfile(){return getProfile(getActiveProfile())}
async function createProfile(label){const name=String(label||'').trim();if(name.length<2||name.length>32)throw new Error('El alias debe tener entre 2 y 32 caracteres.');if(/[<>\u0000-\u001f]/.test(name))throw new Error('Utiliza un alias sencillo sin símbolos especiales.');const db=await database();const p={id:'perfil-'+(global.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)),name,createdAt:new Date().toISOString(),demo:true};const tx=db.transaction('profiles','readwrite');tx.objectStore('profiles').add(p);await txPromise(tx);setActiveProfile(p.id);return p}
async function listPatients(profileId=getActiveProfile()){if(!profileId)return [];const db=await database();const patients=await reqPromise(db.transaction('patients','readonly').objectStore('patients').getAll());return patients.filter(p=>p.profileId===profileId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
async function getPatient(id){if(!id||!getActiveProfile())return null;const db=await database();const p=await reqPromise(db.transaction('patients','readonly').objectStore('patients').get(id));return p?.profileId===getActiveProfile()?p:null}
async function createPatient(){const profile=await getCurrentProfile();if(!profile)throw new Error('Selecciona antes un perfil local de prueba.');const db=await database();let id;do{id='DEMO-'+Math.random().toString(36).slice(2,8).toUpperCase()}while((await reqPromise(db.transaction('patients','readonly').objectStore('patients').get(id))));const p={id,profileId:profile.id,createdAt:new Date().toISOString(),demo:true};const tx=db.transaction('patients','readwrite');tx.objectStore('patients').add(p);await txPromise(tx);setActive(id);return p}
async function listEvaluations(id){if(!await getPatient(id))return [];const db=await database();const evals=await reqPromise(db.transaction('evaluations','readonly').objectStore('evaluations').index('patientId').getAll(IDBKeyRange.only(id)));return evals.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||b.id-a.id)}
async function addEvaluation(data){if(!data?.patientId||!await getPatient(data.patientId))throw new Error('El expediente no pertenece al perfil activo.');if(typeof data.report!=='string'||!data.scaleId)throw new Error('Evaluación incompleta.');const db=await database();const record={...data,createdAt:new Date().toISOString(),demo:true,profileId:getActiveProfile()};const tx=db.transaction('evaluations','readwrite');const r=tx.objectStore('evaluations').add(record);const key=await reqPromise(r);await txPromise(tx);return key}
async function deleteEvaluation(id){const db=await database();const row=await reqPromise(db.transaction('evaluations','readonly').objectStore('evaluations').get(Number(id)));if(!row||!await getPatient(row.patientId))throw new Error('Esta evaluación no pertenece al perfil activo.');const tx=db.transaction('evaluations','readwrite');tx.objectStore('evaluations').delete(Number(id));await txPromise(tx)}
async function deletePatient(id){if(!await getPatient(id))throw new Error('Expediente no disponible en el perfil activo.');const db=await database(),ids=(await listEvaluations(id)).map(x=>x.id);const tx=db.transaction(['patients','evaluations'],'readwrite');ids.forEach(k=>tx.objectStore('evaluations').delete(k));tx.objectStore('patients').delete(id);await txPromise(tx);if(getActive()===id)setActive(null)}
async function deleteProfile(id){const p=await getProfile(id);if(!p)throw new Error('Perfil no encontrado');const db=await database();const patients=await reqPromise(db.transaction('patients','readonly').objectStore('patients').getAll());const owned=patients.filter(x=>x.profileId===id),ids=new Set(owned.map(x=>x.id));const all=await reqPromise(db.transaction('evaluations','readonly').objectStore('evaluations').getAll());const tx=db.transaction(['profiles','patients','evaluations'],'readwrite');all.filter(e=>ids.has(e.patientId)).forEach(e=>tx.objectStore('evaluations').delete(e.id));owned.forEach(x=>tx.objectStore('patients').delete(x.id));tx.objectStore('profiles').delete(id);await txPromise(tx);if(getActiveProfile()===id)setActiveProfile(null)}
global.DemoExpedientes={database,fmt,listProfiles,getProfile,getCurrentProfile,createProfile,deleteProfile,getActiveProfile,setActiveProfile,listPatients,getPatient,createPatient,listEvaluations,addEvaluation,deleteEvaluation,deletePatient,getActive,setActive};
})(window);
