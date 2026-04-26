## Plan: Event-Only Social Network PRD + Zero-Cost MVP

Create a product-first PRD and implementation blueprint for an event-only social network on Next.js + TypeScript, using a Supabase-first approach while enforcing hard product guardrails to satisfy a strict $0 forever target for up to 10k users. Use a high-signal template only where it accelerates delivery, then scaffold the app with event-only posting, markdown authoring, optional image uploads with strict quotas, and modern non-cookie-cutter UI.

**Steps**
1. Phase 1 - Finalize product constraints and architecture baseline in the PRD draft brief (includes hard rules: event-only posts, no random posts, strict media quotas, image-only uploads, no video, and free-tier operational ceilings). This step blocks all later implementation work.
2. Phase 1 - Draft PRD document with complete sections: problem statement, target users, jobs-to-be-done, feature scope, non-goals, user stories, acceptance criteria, functional requirements (title/content markdown/image/time), system constraints, free-tier guardrails, risks, rollout plan, and success metrics. Depends on step 1.
3. Phase 1 - Add an architecture appendix inside PRD comparing Supabase-first versus fallback stack and documenting why Supabase is primary despite quota risks (with mitigation by design constraints). Depends on step 2.
4. Phase 1 - Author AGENTS SOP that defines mandatory workflows: subagent-first research, subagent-first small-fix handling, mandatory web research context sharing, required skill loading when relevant, and UI quality expectations (minimal, responsive, distinctive, not generic). Depends on step 2.
5. Phase 2 - Evaluate and select starter approach from 10k+ starred options with a practical fit filter: prefer Supabase + Next.js official patterns or Vercel examples over heavier framework pivots; document template decision and adaptation scope. Depends on step 3 and step 4.
6. Phase 2 - Scaffold Next.js TypeScript project in this repo using selected approach, wire Supabase client/auth baseline, and create initial app shell/routes. Depends on step 5.
7. Phase 2 - Implement event-only domain model and APIs: event create/read/update/delete policy, post validation rules, markdown content pipeline, optional image upload path, and event timing semantics (timezone-safe). Depends on step 6.
8. Phase 2 - Implement frontend event composer and feed UI with markdown editor + live preview toggle, image upload constraints, datetime input, and polished responsive design language using a custom component strategy (shadcn/radix + design tokens + motion). Depends on step 6 and step 7.
9. Phase 2 - Add zero-cost protection mechanisms: upload size limits, per-user/month post and media quotas, lightweight rate limits, and graceful UX messaging when free-tier guardrails are hit. Depends on step 7 and step 8.
10. Phase 2 - Install and document project-relevant skills globally (-g) in a curated set (minimal core first, extended optional) and record usage SOP references for when each skill must be invoked. Parallel with step 6 onward after docs exist.
11. Phase 3 - Verification and launch-readiness checks: enforce acceptance criteria from PRD, run lint/typecheck/tests, run responsive QA across mobile/desktop, validate markdown safety, validate auth/access control, and run free-tier load approximation tests against 10k-user assumptions. Depends on step 9 and step 10.

**Relevant files**
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/LICENSE - keep as-is; ensure new docs/app scaffold remain license-consistent.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/PRD.md - create full product requirements document and architecture appendix.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/AGENTS.md - create project SOP and agent workflow requirements.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/package.json - create/update for Next.js TypeScript scripts and dependencies.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/next.config.ts - configure framework behavior and asset constraints.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/tsconfig.json - strict TypeScript baseline for long-term maintainability.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/app/page.tsx - initial landing/feed shell and route-level UI composition.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/app/events/new/page.tsx - event composer UX with markdown preview and scheduling controls.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/components/* - custom UI primitives/composites with distinctive design tokens.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/lib/supabase/* - client/server Supabase helpers and auth session utilities.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/lib/validation/* - schema validation for post content, image limits, and event timing.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/lib/quotas/* - free-tier quota enforcement logic and counters.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/supabase/migrations/* - schema and policy definitions for event-only posting + access controls.
- c:/Users/arnav/Desktop/webdev-stuff/ioit-social-network/.env.example - required environment variables and safe defaults documentation.

**Verification**
1. Validate PRD completeness by checklist: every required post component, free-tier rule, and explicit non-goal is documented and testable.
2. Validate AGENTS SOP compliance by scenario walkthrough: research task, small bugfix, and frontend task each map to subagent/skill rules.
3. Run project quality gates: install, typecheck, lint, build, and test scripts all pass in CI-equivalent local run.
4. Execute functional tests for event-only constraints: cannot publish non-event content, cannot bypass required timing, markdown preview works, optional image path works, and unauthorized edits are blocked.
5. Execute quota and guardrail tests: image size enforcement, per-user posting limits, and storage/bandwidth-safe behavior under sustained use.
6. Run responsive/accessibility checks on key pages and verify unique design language (custom tokens, non-generic component theming, meaningful motion).

**Decisions**
- Hard constraint confirmed: absolutely $0 forever is required for up to 10k users.
- Product constraint confirmed: strict media guardrails are in scope (image-only, compression/limits, no video).
- Stack direction confirmed: Supabase-first for speed and integrated auth/storage/realtime.
- Template policy confirmed: use best judgment and start from a 10k+ star template only if it clearly accelerates this exact product.
- Deliverables confirmed: PRD document, AGENTS SOP, and initial Next.js scaffold.
- Skill installation confirmed: global user-level installation (-g).
- Included scope: event planning social feed, markdown authoring/preview, optional images with strict limits, scheduling, and modern responsive UI.
- Excluded scope (initial): video uploads, paid-only infrastructure dependencies, broad non-event social posting modes.