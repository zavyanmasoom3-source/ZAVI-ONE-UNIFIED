# Approved UI implementation and release acceptance — 2026-11-06

Status: IN PROGRESS, NOT RELEASE APPROVED.

## Mandatory preservation
- Existing customer, invoice, stock, ledger, staff, licensing, and offline flows must not regress.
- No destructive Supabase migration, no deletion of financial records.
- The owner-only ADMIN app must never expose private customer data beyond authorized management.
- Every release APK must be traceable to a commit SHA and distinct from the previous release by code changes and tested behavior.

## Approved page acceptance matrix
| Page | Acceptance |
|---|---|
| Login and PIN recovery | compact, private, secure, biometric fallback |
| Dashboard and cash | welcome, date, sale action, two charts, manual FX, currency cash balances |
| Sales and invoices | barcode, returns, split payments, WhatsApp receipt, print |
| Products and warehouses | separate warehouses, barcode labels, transfers and movements |
| Membership and offline | 7/180/365-day license, device transfer, safe offline sync |
| Daily journal | compact filterable ledger with date and notes |
| Our debts | creditors, initial debt, repayments, multi-currency |
| Customer contact book | WhatsApp topic templates including greetings |
| Waste | explicit manual loss records; no implicit stock mutation |
| Staff | permission enforcement, not merely hidden buttons |
| General trade | three tabs; trade metadata separate from posted invoices |
| Hawala | sender/receiver, fee, unique id, atomic double-entry |
| Settings | light/dark/glass, three size controls, Dari/Pashto/English |
| ADMIN | owner-only, device/license/renewal/WhatsApp workflows |

## Release gate (must pass before claiming delivery)
1. Record exact source SHA and diff from prior release.
2. Compare UI screenshots of every approved page in all themes on phone and tablet.
3. Run functional tests on actual or emulator Android for BOTH apps.
4. Verify offline/online sync idempotency and RLS multi-tenant isolation.
5. Test invoices, stock movements, transfers, loan repayment and hawala ledger invariants.
6. Validate signed APK package IDs, version codes, signatures and sha256 checksums.
7. Publish two separately named APKs only if each is verified from the new source SHA.

## Current evidence
- A non-destructive compact stylesheet has been added to each app on the feature branch.
- This is NOT evidence that all page-level acceptance tests have passed.
- Do not promote the branch to main or label any APK final without the gates above.
