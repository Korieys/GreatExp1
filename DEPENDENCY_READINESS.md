# Firestore transport update

Firebase remains at 12.9.0 and its Firestore SDK remains at 4.11.0. A scoped npm
override replaces Firestore's Node-only `@grpc/grpc-js` 1.9.16 dependency with
1.14.6, including its required proto loader and ordered-map dependency. No other
package versions are changed. No application endpoint, credential or live rule
is changed.

The package audit previously reported four high entries propagated from this
dependency. They are not four independently demonstrated application exploits.
The current production-only and full dependency audits are clean. CI now rejects
high production advisories. Existing six Firestore emulator groups exercise
actual SDK reads, writes, queries and batches, including rejected role escalation
and cross-account access. The build and those groups must pass for the current
commit. Public contact/intake navigation must still be verified in the preview.

Upstream references:
- https://github.com/advisories/GHSA-m9gg-hp2v-232j
- https://github.com/grpc/grpc-node/releases/tag/@grpc%2Fgrpc-js@1.14.6

The proposed role rules remain unapplied to the live database pending the
existing separate approval. This dependency update does not authorize that
change, inquiry submission, patient-data access or a production release.
