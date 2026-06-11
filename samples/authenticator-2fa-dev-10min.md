---
title: Microsoft Authenticator for 2FA — stronger than SMS, zero cost per login
theme: purple
brand: zastrpay · platform security
audience: Development Team
duration: 10
---

## Microsoft Authenticator & 2FA {title}
Eyebrow: Platform security · proposal
Our second factor today is an SMS code. ==Authenticator== gives us a second factor that is **harder to attack**, **faster to use**, and **free per verification** — this is the case for switching.
Notes: Throughline: every SMS OTP we send is a paid message travelling over a network we don't control; Authenticator moves code generation onto the customer's device — stronger security and zero marginal cost. Ten minutes: where we are, why SMS is weak, the comparison, what the new login looks like, what it costs.

## Today: SCA rides on SMS OTP
Eyebrow: Status quo · 01
Customer SCA today is a 6-digit **SMS OTP** plus a 4-digit **PIN** — CustomerAuthenticationService issues the challenge, NotificationService sends the message.
- Every login and approval triggers a paid SMS — cost scales linearly with usage
- Delivery depends on the carrier: latency, failed sends, roaming gaps
- The code leaves our platform and travels a network we don't control
Notes: Keep this factual, not alarmist — SMS OTP has served us fine and it satisfies the PSD2 possession element. The point is structural: the moment the code is in transit on a carrier network, its security and its delivery time are out of our hands, and each send shows up on an invoice. Retries for undelivered codes multiply both problems. Transition: so what exactly can go wrong in that transit?

## SMS is the weakest accepted second factor
Eyebrow: Security · 02
- **SIM swapping** — an attacker ports the victim's number and receives our OTPs directly
- **Carrier/SS7 interception** — SMS is readable in transit on signalling networks
- **Phishing relay** — a code the user types can be proxied to the real login in real time
::: callout
**NIST SP 800-63B** classifies SMS/PSTN OTP as a *restricted* authenticator — usable only with extra risk controls and a documented migration path away from it.
:::
Notes: SIM swap is not theoretical — it is the standard account-takeover play against SMS 2FA, and it needs no access to our systems, only social engineering against a telco. Authenticator counters each row: codes are generated on the enrolled device so there is nothing to intercept in transit, and push approval with number matching means there is no code for a phishing page to relay. Be honest with this audience: TOTP can still be phished by a live proxy — the fully phishing-resistant tier is FIDO2/passkeys — but Authenticator removes the carrier attack surface entirely, which is where the real-world losses are. Transition: side by side, the picture is one-directional.

## SMS, WhatsApp, Authenticator — side by side
Eyebrow: Comparison · 03
::: compare
| Method | Resists SIM swap | Works offline | Free per use | Verdict | Chosen |
| SMS OTP | n | n | n | NIST-restricted; carrier-dependent | n |
| WhatsApp code | n | n | n | Same number-based surface, plus a third-party dependency | n |
| *Authenticator | y | y | y | Code generated on the device — nothing in transit to steal | y |
:::
Notes: WhatsApp codes inherit the SIM-swap problem because the WhatsApp account itself is registered and recovered via SMS to the phone number — it is the same trust anchor with an extra company in the middle, and business messaging is also billed per conversation. Offline matters for our customers: TOTP codes are computed on the phone every 30 seconds with no signal needed; SMS needs network coverage at exactly the moment of login. Transition: here is what the login actually looks like after the switch.

## What a login looks like with Authenticator
Eyebrow: Flow · 04
::: flow
- ① | Password | first factor, unchanged
-* ② | Push challenge | number match in the app
- ③ | Approve | one tap on the enrolled device
- ④ | Session | token issued, login completes
:::
::: chips
- [green:✓] Push approval — faster than typing a code
- [purple:◆] TOTP fallback — generated on-device, works without signal
- [blue:●] One enrolment (QR scan) covers both paths
:::
Notes: The password step is untouched — this only replaces the second factor. Number matching means the app shows a two-digit number the user must confirm from the login screen, which kills blind-approve fatigue attacks. If push can't be delivered, the same enrolment yields a rotating 6-digit TOTP code the user types — no network needed on the phone. Integration path to evaluate: we already operate AadBridgeService for Azure AD B2C federation, and Authenticator is natively supported on that stack — worth a spike before we commit to a design. Transition: and the part finance will like.

## The cost curve: linear vs flat
Eyebrow: Cost · 05
Every SMS OTP is a paid application-to-person message, and retries for failed deliveries are paid again. An Authenticator verification is computed on the customer's device — its marginal cost is zero.
::: formula
sms spend = verifications × **fee per message** · authenticator spend = **0**
:::
Notes: The exact per-message fee depends on our A2P contract and destination country, so pull the real number from the NotificationService invoices before presenting upward — the shape of the argument doesn't change: one curve grows with every login, retry, and transaction approval, the other is flat at zero. There is also a hidden line item: support tickets for codes that never arrived. Transition: close with the recommendation.

## Recommendation {closing}
Eyebrow: Next step
Adopt Microsoft Authenticator as the **primary second factor**; keep SMS OTP as a fallback during migration, then phase it out.
- Pilot with internal accounts first
- Enrol customers at next login — a QR scan, under a minute
- Track adoption and watch SMS spend fall with it
Notes: Concrete ask: agree to a spike on the integration path (the AadBridgeService/Azure AD B2C route first), then an internal pilot. Migration is gradual by design — SMS stays as fallback so no customer is locked out, and the NIST guidance explicitly expects exactly this kind of documented move away from SMS. Questions.
