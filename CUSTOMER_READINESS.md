# Great Expectations customer readiness

This draft is not a production release. It retains the corrected live-domain metadata and adds the following repairs.

## Contact and intake

The general contact and new-patient inquiry pages no longer claim end-to-end encryption or present the inquiry form as a HIPAA portal. They ask for contact details and a brief general question, direct clinical paperwork to the existing Valant intake link, and link the existing privacy policy. A successful database write is described as a saved request rather than a booked appointment. Failed submissions preserve the customer's entries.

Fields have associated labels, autocomplete and length limits. Phone and email details are actionable links. Generic Facebook and Instagram destinations are removed. The home and intake pages replace blanket security claims with descriptions of the actual portal destination. The existing privacy notice still needs practice review; this patch does not establish legal compliance or a provider agreement.

Public CMS reads now return validated defaults for absent/partial settings and never attempt to seed the database. Administrative writes remain in the existing editor.

## Account access

The repository's prior Firestore policy allowed a customer to write `role: admin` to their own profile, then use that role to access inquiries, other profiles and site administration. The proposed policy permits signup only as the authenticated `user`, with matching identity and request-time creation. Customer updates are restricted to contact/profile fields; role, permissions, identity and creation time remain administrator-controlled. Customer profile deletion is denied so deletion/recreation cannot bypass the policy.

The frontend reads the stored role without an email allowlist fallback. It clears administrative state during account changes and ignores an older account lookup that completes after a new session arrives. Existing staff need their legitimate `role: admin` profile in the database; an email match alone is no longer sufficient to display administration.

The rules file is a proposed source change only. Live policy must be inspected and the reviewed repair explicitly approved before applying it. Existing profiles were not inspected or altered. Existing administrators retain their current management permissions; this does not implement finer per-staff authorization.

## Verification

Six disposable Firestore emulator groups cover normal signup; role/permission and identity forgery; protected updates; cross-account profile denial; self-promotion followed by private reads or a batch write; legitimate administrator operations; and public inquiry creation without public retrieval. Tests refuse any emulator host other than `127.0.0.1:8188` and use project `demo-greatexp-readiness`. CI provisions Java 21 and Firebase CLI 15.34.0. No live records are used.

Run `firebase emulators:exec --config firebase.emulators.json --project demo-greatexp-readiness --only firestore "npm run test:database"`. See [Firebase's testing documentation](https://firebase.google.com/docs/firestore/security/test-rules-emulator).

The production build includes TypeScript. The existing React 19/react-helmet-async peer mismatch uses `npm ci --legacy-peer-deps`, matching dependency installation. The existing AuthContext hook export triggers the fast-refresh lint rule; the other edited UI files pass targeted lint. Large application bundles remain a performance follow-up.

Compatible dependency updates remove both critical advisory entries. Four high entries remain in the Firebase/Firestore gRPC chain; the audit's suggested Firebase downgrade was not applied. Advisory counts are dependency findings, not a claim of demonstrated exploitability in this browser app.

## Before customer release

- Inspect and apply approved live rules, verify existing staff roles, and test signed-in owner/staff isolation.
- Confirm contact details and real inquiry receipt in the staff workflow. No test inquiry has been sent.
- Verify the Valant destination and operational intake process without submitting patient information.
- Review the practice's actual privacy notice, provider agreements, retention and deletion process. Feedback, grievance and appointment document workflows need a separate sensitive-data review.
- Verify mobile navigation, appointment workflow/ownership, file access and remaining dependency advisories.

No application merge, production deployment, live policy change, patient-data access, inquiry submission or customer-record deletion is included.
