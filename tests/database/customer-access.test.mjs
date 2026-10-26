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
 await assertFails(setDoc(doc(db,'users',uid),profile(uid)));
 await seed('users/'+uid,profile(uid));
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

test('appointment ownership: customers manage only their own appointments; cross-account access and forgery are denied',async()=>{
 const clientA=randomUUID(),clientB=randomUUID(),admin=randomUUID(),appId=randomUUID();
 const dbA=client(clientA),dbB=client(clientB),dbAdmin=client(admin),guest=env.unauthenticatedContext().firestore();
 await seed('users/'+clientA,profile(clientA));
 await seed('users/'+clientB,profile(clientB));
 await seed('users/'+admin,{...profile(admin),role:'admin'});

 // Client A creates appointment for self -> succeeds
 await assertSucceeds(setDoc(doc(dbA,'appointments',appId),{
  userId:clientA,
  userEmail:clientA+'@example.com',
  serviceType:'Consultation',
  date:'2026-11-01',
  time:'10:00',
  status:'pending',
  createdAt:serverTimestamp()
 }));

 // Client A cannot create appointment under Client B's userId
 const forgedAppId=randomUUID();
 await assertFails(setDoc(doc(dbA,'appointments',forgedAppId),{
  userId:clientB,
  userEmail:clientB+'@example.com',
  serviceType:'Consultation',
  status:'pending',
  createdAt:serverTimestamp()
 }));

 // Guest cannot create appointment
 await assertFails(setDoc(doc(guest,'appointments',randomUUID()),{
  userId:clientA,
  status:'pending'
 }));

 // Client A can read their own appointment
 await assertSucceeds(getDoc(doc(dbA,'appointments',appId)));

 // Client B cannot read Client A's appointment
 await assertFails(getDoc(doc(dbB,'appointments',appId)));

 // Client B cannot update or delete Client A's appointment
 await assertFails(updateDoc(doc(dbB,'appointments',appId),{notes:'Unauthorized change'}));
 await assertFails(deleteDoc(doc(dbB,'appointments',appId)));

 // Admin can read, update, and manage the appointment
 await assertSucceeds(getDoc(doc(dbAdmin,'appointments',appId)));
 await assertSucceeds(updateDoc(doc(dbAdmin,'appointments',appId),{status:'confirmed',assignedMember:'Tonya Haynes'}));
 await assertSucceeds(deleteDoc(doc(dbAdmin,'appointments',appId)));
});

test('inquiry receipt and status lifecycle: staff can view, update, and archive submissions across categories',async()=>{
 const admin=randomUUID(),guest=env.unauthenticatedContext().firestore(),dbAdmin=client(admin);
 await seed('users/'+admin,{...profile(admin),role:'admin'});

 // 1. General inquiry submission
 const inqId=randomUUID();
 await assertSucceeds(setDoc(doc(guest,'inquiries',inqId),{
  parentName:'Portfolio QA — Fictional Inquiry Test',
  email:'fictional-inquiry@example.com',
  serviceOfInterest:'Pediatric Development',
  message:'Synthetic general inquiry receipt test',
  type:'inquiry',
  status:'new',
  createdAt:serverTimestamp()
 }));

 // 2. Feedback submission
 const fbId=randomUUID();
 await assertSucceeds(setDoc(doc(guest,'inquiries',fbId),{
  parentName:'Portfolio QA — Fictional Feedback',
  email:'fictional-fb@example.com',
  serviceOfInterest:'Feedback',
  message:'Synthetic feedback test',
  type:'feedback',
  status:'new',
  createdAt:serverTimestamp()
 }));

 // 3. Grievance submission
 const grId=randomUUID();
 await assertSucceeds(setDoc(doc(guest,'inquiries',grId),{
  parentName:'Portfolio QA — Fictional Grievance',
  email:'N/A',
  phoneNumber:'832-555-0199',
  dateOfIncident:'2026-10-20',
  serviceOfInterest:'Grievance',
  message:'Synthetic grievance procedure test',
  type:'grievance',
  status:'new',
  createdAt:serverTimestamp()
 }));

 // Admin can read all three
 await assertSucceeds(getDoc(doc(dbAdmin,'inquiries',inqId)));
 await assertSucceeds(getDoc(doc(dbAdmin,'inquiries',fbId)));
 await assertSucceeds(getDoc(doc(dbAdmin,'inquiries',grId)));

 // Admin can update status (new -> read -> archived)
 await assertSucceeds(updateDoc(doc(dbAdmin,'inquiries',inqId),{status:'read'}));
 await assertSucceeds(updateDoc(doc(dbAdmin,'inquiries',inqId),{status:'archived'}));

 // Admin can clean up fictional test records
 await assertSucceeds(deleteDoc(doc(dbAdmin,'inquiries',inqId)));
 await assertSucceeds(deleteDoc(doc(dbAdmin,'inquiries',fbId)));
 await assertSucceeds(deleteDoc(doc(dbAdmin,'inquiries',grId)));
});
