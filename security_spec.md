# T & F SOC+Offensive Security Specification

## Data Invariants
1. **Threat Alerts**: Must have a valid severity, status, and timestamp.
2. **Assets**: Must have a valid hostname, IP, and exposure score.
3. **AI Drift**: Must relate to a valid model and metric.
4. **Access Control**: Users can only see and modify intelligence data if they are authenticated and authorized (SOC Analyst/Admin).

## The Dirty Dozen Payloads (Target: threats)

1. **Identity Spoofing**: Attempt to set `authorId` to another user.
2. **Resource Poisoning**: Document with 1MB string in `title`.
3. **State Shortcutting**: Updating a `resolved` threat back to `active` without permission.
4. **Invalid Severity**: Creating a threat with severity `ultra-dangerous`.
5. **Timestamp Fraud**: Setting `timestamp` to a future date instead of `request.time`.
6. **Shadow Field**: Adding `isFixed: true` to a threat document.
7. **Unauthenticated Write**: Writing to `assets` collection without being signed in.
8. **Malicious ID**: Using a 1.5KB string as a document ID.
9. **Role Escalation**: Attempting to write to the `admins` collection.
10. **Orphaned Write**: Creating a drift analysis for a non-existent model (optional validation).
11. **Blanket Read**: Authenticated user trying to read all `threats` without proper query filtering.
12. **Update Revocation**: A non-admin user trying to change the `criticality` of an asset.

## Test Matrix

| Payload | Collection | Expected |
|---------|------------|----------|
| 1 | threats | DENIED |
| 2 | threats | DENIED |
| 4 | threats | DENIED |
| 5 | threats | DENIED |
| 7 | assets | DENIED |
| 9 | admins | DENIED |
