import {before,after,test} from 'node:test';
import fs from 'node:fs';
import {randomUUID} from 'node:crypto';
import {initializeTestEnvironment,assertFails,assertSucceeds} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,updateDoc,deleteDoc,collection,getDocs,serverTimestamp,writeBatch} from 'firebase/firestore';

if(process.env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8188')throw Error('Requires the disposable local demo emulator on port 8188.');
const projectId='demo-greatexp-readiness';
let env;
const client=uid=>env.authenticatedContext(uid,{email:uid+'@example.com'}).firestore();
const profile=uid=>({uid,email:uid+'@example.com',firstName:'Synthetic',lastName:'QA',role:'user',createdAt:serverTimestamp()});
const seed=async(path,data)=>env.withSecurityRulesDisabled(async context=>setDoc(doc(context.firestore(),path),data));
before(async()=>{env=await initializeTestEnvironment({projectId,firestore:{host:'127.0.0.1',port:8188,rules:fs.readFileSync('firestore.rules','utf8')}});});
after(async()=>{await env?.cleanup();});

test('signup creates only the signed-in customer profile; initial admin roles and permissions are rejected',async()=>{
 const uid=randomUUID(),db=client(uid);
 await assertSucceeds(setDoc(doc(db,'users',uid),profile(uid)));
 await assertSucceeds(getDoc(doc(db,'users',uid)));
 for(const extra of [{role:'admin'},{role:'practitioner'},{permissions:['inquiries']},{uid:'other'},{email:'other@example.com'},{createdAt:'yesterday'}]){
  const fresh=randomUUID();await assertFails(setDoc(doc(client(fresh),'users',fresh),{...profile(fresh),...extra}));
 }
 await assertFails(setDoc(doc(db,'users','someone-else'),profile('someone-else')));
 await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(),'users','guest'),profile('guest')));
});

test('customers can edit contact fields but cannot change role, permissions, identity or creation time',async()=>{
 const uid=randomUUID(),db=client(uid),ref=doc(db,'users',uid);
 await assertSucceeds(setDoc(ref,profile(uid)));
 await assertSucceeds(updateDoc(ref,{firstName:'Updated',lastName:'Example',phoneNumber:'fictional',address:'Fictional test only',dateOfBirth:'2000-01-01'}));
 for(const patch of [{role:'admin'},{permissions:['users']},{uid:'someone-else'},{email:'other@example.com'},{createdAt:serverTimestamp()}])await assertFails(updateDoc(ref,patch));
 await assertFails(deleteDoc(ref));
 await assertFails(getDocs(collection(db,'users')));
});

test('another customer cannot read, edit or delete a profile',async()=>{
 const uid=randomUUID();await seed('users/'+uid,profile(uid));
 for(const db of [client('other'),env.unauthenticatedContext().firestore()]){
  const ref=doc(db,'users',uid);
  await assertFails(getDoc(ref));await assertFails(updateDoc(ref,{firstName:'forged'}));await assertFails(deleteDoc(ref));
 }
});

test('self-promotion cannot unlock inquiries, appointments or published site content, including batched writes',async()=>{
 const uid=randomUUID(),db=client(uid);await seed('users/'+uid,profile(uid));
 await seed('inquiries/'+uid,{parentName:'Fictional QA',message:'Synthetic general inquiry'});
 await seed('appointments/'+uid,{userId:'other',status:'pending'});
 await assertFails(updateDoc(doc(db,'users',uid),{role:'admin'}));
 await assertFails(getDoc(doc(db,'inquiries',uid)));
 await assertFails(getDocs(collection(db,'inquiries')));
 await assertFails(getDoc(doc(db,'appointments',uid)));
 await assertFails(setDoc(doc(db,'siteContent','main'),{contactPhone:'forged'}));
 const batch=writeBatch(db);batch.update(doc(db,'users',uid),{role:'admin'});batch.set(doc(db,'siteContent','main'),{contactPhone:'forged'});
 await assertFails(batch.commit());
});

test('an existing administrator retains profile and inquiry management',async()=>{
 const admin=randomUUID(),uid=randomUUID(),db=client(admin);
 await seed('users/'+admin,{...profile(admin),role:'admin'});
 await assertSucceeds(setDoc(doc(db,'users',uid),profile(uid)));
 await assertSucceeds(updateDoc(doc(db,'users',uid),{role:'practitioner'}));
 await assertSucceeds(getDocs(collection(db,'users')));
 await seed('inquiries/'+uid,{message:'Synthetic test only',status:'new'});
 await assertSucceeds(getDoc(doc(db,'inquiries',uid)));
 await assertSucceeds(updateDoc(doc(db,'inquiries',uid),{status:'read'}));
 await assertSucceeds(setDoc(doc(db,'siteContent','test-'+uid),{contactPhone:'Fictional test'}));
});

test('public inquiry submission stays available without public retrieval or modification',async()=>{
 const guest=env.unauthenticatedContext().firestore(),id=randomUUID(),ref=doc(guest,'inquiries',id);
 await assertSucceeds(setDoc(ref,{parentName:'Synthetic QA',email:'fictional@example.com',serviceOfInterest:'General',message:'Fictional test only',status:'new',createdAt:serverTimestamp()}));
 await assertFails(getDoc(ref));await assertFails(updateDoc(ref,{status:'read'}));await assertFails(deleteDoc(ref));
});
