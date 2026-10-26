# Great Expectations customer readiness

This draft is not a production release. It retains the corrected live-domain metadata, dependency updates, and access repairs.

## Contact, intake and inquiries

The general contact, new-patient inquiry, feedback, and grievance workflows are structured around truthful disclosures and secure routing:

- **Truthful intake routing**: Forms no longer claim end-to-end encryption or present public website fields as a HIPAA portal. Clinical paperwork and prospective patient intake are routed directly to the practice's secure portal on Valant EHR (`https://valant.io/prospectivepatient/GreatExpectationsTherapeutic`).
- **Data boundaries & sensitive health disclosures**: Contact, feedback, and grievance forms explicitly advise users to share only general questions, contact information, or administrative concerns, and to leave out protected health information (PHI), diagnoses, and insurance details.
- **Form accessibility & failure recovery**: All inputs feature accessible label associations (`htmlFor` / `id`), character length bounds (`maxLength`), and standard autocomplete hints. If a network or database failure occurs, customer entries are preserved in the form, and accessible error banners (`role="alert"`) provide recovery guidance.
- **Direct communication links**: Practice telephone (`832.399.6141`) and clinical desk email (`hello@greatexpectations.com`) are actionable links (`tel:` / `mailto:`). Generic social media links are removed.
- **CMS safety**: Public CMS reads return validated defaults for absent or partial settings and never attempt administrative database writes.
- **Patient form uploads deprecated**: The legacy unstructured `patientFormService` file upload path is deprecated and annotated; clinical records are handled exclusively through the Valant EHR workflow.

## Account access & staff authorization

- **Role enforcement**: In the prior configuration, a customer could write `role: admin` to their own profile and access administrative data. The proposed policy permits signup only as an authenticated `user` with matching identity and request-time creation. Updates are restricted to contact/profile fields; role, permissions, identity, and creation time remain administrator-controlled. Profile deletion is denied to prevent recreation attacks.
- **Dynamic staff verification**:
  - `AdminLogin.tsx` verifies the authenticated user's Firestore record for `role === 'admin'`. If an account without administrator privileges signs in, it immediately terminates the session (`signOut`) and displays an explicit access denial rather than granting dashboard access.
  - `Portal.tsx` removes the legacy hardcoded email allowlist (`korieydixon@yahoo.com`) in favor of dynamic `isAdmin` role evaluation from `AuthContext`.
  - `Navbar.tsx` provides accessible navigation: a `Portal` link for signed-in patients, an `Admin` link for verified staff, and accessible mobile controls (`aria-label`, `aria-expanded`, `aria-controls="mobile-navigation"`).
- **Legitimate staff identities**: Practice administration recognizes three primary staff identities for role verification:
  1. `korieydixon@yahoo.com` (Owner / Practice Administrator)
  2. `denean24@hotmail.com` (Clinical Director)
  3. `southernlpc@yahoo.com` (Lead Clinician / Supervisor)
  These accounts must have `role: 'admin'` in their Firestore profile documents before rule deployment to ensure continuous access.
- **Pending live rule approval**: The reviewed rules file (`firestore.rules` / `greatexp-reviewed.rules`) remains unapplied to the live Firebase project `greatexp-a3b99` pending owner approval.

## Appointment & document ownership

- **Scoped storage uploads**: In `BookAppointment.tsx`, document uploads (insurance cards, IDs, referral notes) are scoped strictly to `appointments/${currentUser.uid}/${timestamp}_${sanitizedFilename}`.
- **File validation**: File size is strictly enforced up to 10 MB, and file types are restricted to safe document formats (PDF, PNG, JPEG, WebP).
- **Failure recovery**: In case of submission errors, user form fields are retained so clients do not lose scheduling details.
- **Access rules**: Storage rules permit appointment document read/write access solely to the authenticated owner (`request.auth.uid == userId`) and verified administrators.

## Verification

- **Database emulator suite**: Eight automated test groups in `tests/database/customer-access.test.mjs` exercise:
  1. Legitimate user signup with matching identity and rejection of forged initial roles or permissions.
  2. Customer profile updates restricted to contact fields, denying role, identity, or creation time tampering.
  3. Strict isolation between customer profiles (cross-account read, update, and delete rejection).
  4. Prevention of self-promotion attacks unlocking inquiries, appointments, or CMS content (including batch commits).
  5. Administrator management of user roles, practitioner listings, inquiries, and site content.
  6. Public submission of inquiries without public retrieval or modification.
  7. Appointment ownership: customers can create and view only their own appointments; forged IDs and cross-account access are blocked; administrators can view, confirm, and update all appointments.
  8. Inquiry lifecycle: public submissions across inquiry, feedback, and grievance types are recorded as `new`; administrators can view all categories, update status (`read`, `archived`), and perform authorized cleanup.
- **Dependency audit**: Production audit (`npm audit --omit=dev --audit-level=high`) reports 0 vulnerabilities. The scoped `@grpc/grpc-js` override (1.14.6) eliminates high advisory entries while maintaining Firebase 12.9.0 and Firestore 4.11.0 compatibility.
- **Production build**: TypeScript type-checking and Vite bundling build cleanly with zero errors.

## Prepared fictional inquiry test

A fictional inquiry test protocol has been prepared for execution once live rules and staff access are approved. See `outputs/greatexp-fictional-inquiry-test-review.html`.
- **Payload**: Marked with `parentName: 'Portfolio QA — Fictional Inquiry Test'`, `email: 'fictional-inquiry@example.com'`, `serviceOfInterest: 'Pediatric Development'`, and clear non-clinical inquiry message.
- **Verification steps**: Staff signs in at `/admin/login`, locates the fictional inquiry in `/admin/inquiries`, advances status from `new` to `read` to `archived`, and performs verified record removal.
- **Zero clinical impact**: No actual patient data, real email delivery, or modification of existing practice records.

## Remaining owner decisions & launch gates

1. **Live rule approval**: Authorize application of reviewed Firestore rules to Firebase project `greatexp-a3b99`.
2. **Staff role verification**: Verify that `korieydixon@yahoo.com`, `denean24@hotmail.com`, and `southernlpc@yahoo.com` have `role: 'admin'` in their Firestore user documents.
3. **Contact details confirmation**: Confirm accuracy of published contact details (`832.399.6141`, `hello@greatexpectations.com`, `1500 S. Dairy Ashford Rd. Suite 295, Houston TX 77077`).
4. **Valant workflow confirmation**: Confirm practice operation of the prospective patient intake workflow via Valant without transmitting PHI through website contact channels.
5. **Legal & compliance policies**:
   - Legal review of practice privacy policy and Notice of Privacy Practices (NPP).
   - Execution of Business Associate Agreements (BAAs) with technology vendors (Firebase, Google Cloud, Valant, hosting provider).
   - Formal data retention, archive, and deletion schedules for general website inquiries, feedback, and grievance logs.
