# Aurexa Vue Coding Architecture Guide

This document explains why the codebase is strong from an engineering perspective, and how to keep it highly maintainable and scalable as the team grows.

It focuses only on code quality and structure, not product/domain explanation.

## 1) Architecture Quality: Why This Codebase Is Strong

### Clear vertical layering

The project structure creates clean boundaries:

- `src/views/`: page-level composition only (route targets)
- `src/components/layout/`: cross-page shell and layout primitives
- `src/components/features/*`: feature-specific UI and interactions
- `src/components/ui/*`: reusable design-system style building blocks
- `src/stores/*`: shared state and session concerns
- `src/api/*`: HTTP client setup and transport-level behavior
- `src/lib/*`: pure helpers and domain-agnostic utilities
- `src/composables/*`: reusable stateful logic hooks
- `src/types/*`: centralized TypeScript contracts
- `src/router/*`: route definitions and navigation policy

This separation keeps responsibilities narrow and prevents "everything files".

### Predictable dependency direction

A healthy dependency flow is already present:

- Views compose feature/layout/ui components
- Feature components can use composables, api, and types
- Shared types are consumed broadly but do not depend on features
- Router and API avoid hard circular dependencies via lazy imports where needed

This keeps coupling low and refactoring safe.

### Type-safe by default

The codebase uses TypeScript end-to-end with centralized interfaces and generics (for example `ApiResponse<T>` and typed models). This reduces runtime surprises and makes API integration explicit.

### Strong auth and routing guard design

Authentication and authorization concerns are centralized in store/router/lib instead of being duplicated in each page.

## 2) Views: Keep Pages Thin (Important Rule)

`src/views/*` should remain orchestration layers, not heavy logic containers.

A good page should:

- assemble feature components
- call a small number of page-level fetch/load handlers
- pass data down via typed props
- receive user actions via emits/callbacks

A page should not:

- own complex form/business logic that belongs to feature components/composables
- duplicate auth/permission checks already enforced by router guards
- become a utility dump for formatting/parsing/helpers

Rule of thumb:
If a block can be reused or unit-tested in isolation, move it out of the page.

## 3) Component Separation Strategy

### UI components (`src/components/ui/*`)

- Generic, reusable, style-focused
- No business assumptions
- Highly composable and prop-driven

### Feature components (`src/components/features/*`)

- Encapsulate feature behavior and local interactions
- Can call APIs or composables for feature scope
- Expose a clean external API (props + emits)

### Layout components (`src/components/layout/*`)

- Global shell structure (header/sidebar/topbar/dialog portals)
- Should not become feature-specific

This 3-level split is excellent for scalability because each new feature can grow mostly inside its own folder.

## 4) Type System Conventions

The current `src/types/*` organization is a major maintainability advantage.

Guidelines to preserve it:

- Keep API payload contracts in `src/types/*`, not inline in components
- Prefer explicit interfaces over `any`
- Keep `ApiResponse<T>` generic usage consistent for all API calls
- Re-export from `src/types/index.ts` to simplify imports
- Add new type files by concern (`invoice.ts`, `team.ts`, etc.), then export centrally

When adding fields, update types first, then implementation.

## 5) Router and Access Control

The router design is clean and extensible:

- route-level lazy loading reduces initial bundle pressure
- nested layout routing keeps shell concerns centralized
- route metadata (`title`, `allowedUserTypes`) keeps policy close to route declarations
- global guard handles session restore and access checks once

Maintainability rules:

- Keep authorization in route metadata + centralized guard
- Avoid inline role checks scattered across components
- For new secured pages, define `allowedUserTypes` in route meta
- Keep public route list (`PUBLIC_ROUTES`) explicit and minimal

## 6) Authentication Architecture

Auth handling is a strong point in this project:

- session state is centralized in `auth.store.ts`
- token refresh logic is centralized in `api/axios.ts`
- logout flow is coordinated and explicit
- refresh/session restoration avoids guard duplication

Important pattern already used correctly:

- lazy imports are used to prevent circular dependency chains

Keep this pattern for new cross-cutting modules.

## 7) Composables: Reusable Logic Without UI Coupling

`src/composables/*` contains pure reusable hooks (formatters and reusable utility logic).

Best-practice rules:

- composables should be framework-aware but UI-agnostic
- composables should not manipulate DOM directly
- keep output API small and intentional
- default options should be sensible and overridable

When logic appears in more than one feature/page, extract to a composable.

## 8) API Layer Rules for Scalability

`src/api/axios.ts` already centralizes cross-cutting transport behavior (auth headers, refresh retry, toast handling).

Keep this scalable by:

- using the shared `api` client for authenticated requests
- avoiding ad-hoc axios instances in random files
- keeping endpoint-specific transformations near the feature/composable that owns them
- preserving request/response typing for all endpoints

## 9) Clean Code Standards for This Repo

### Naming

- `*Page.vue` for route-level pages
- `*Card.vue`, `*Table.vue`, `*Dialog.vue` for intent-revealing feature components
- `use*.ts` for composables

### Function size and intent

- one function, one purpose
- avoid deeply nested conditionals; use early returns
- isolate parsing/hydration/normalization helpers

### Error handling

- handle expected failures close to the request boundary
- use consistent user feedback patterns
- avoid silent swallowing unless intentionally safe (example: optional session restore)

### Side effects

- keep side effects explicit (`onMounted`, `watch`, store actions)
- avoid hidden side effects in pure-looking utility code

## 10) Rules for New Contributors

When adding a new feature:

1. Add/update type contracts in `src/types/*` first.
2. Add API calls through the shared API layer and typed responses.
3. Build feature components under `src/components/features/<feature>/`.
4. Keep route targets in `src/views/*` focused on composition.
5. Register route + metadata in router with access policy.
6. Move reusable logic into `src/composables/*`.
7. Keep layout concerns in `src/components/layout/*` only.

## 11) Maintainability and Scalability Checklist

A change is ready when:

- responsibilities are not mixed across layers
- no duplicated auth/permission logic was introduced
- API request/response is fully typed
- page files remain thin and readable
- component APIs are clear (typed props/emits)
- no unnecessary coupling to unrelated features

If these are true, the codebase stays easy to maintain, easy to extend, and safe for new contributors.

## 12) Non-Negotiable Principle

Maintainability is mandatory, and delivery speed is mandatory too.

The target is not slow perfection and not messy velocity. The target is beautiful code shipped fast:

- clear structure
- fast iteration
- safe refactoring
- low bug risk

The best code in this repository is code that the next developer can understand quickly, modify safely, and extend without fear, while still allowing the team to ship features quickly.

## 13) High Maintainability + High Speed (Quick AF, Not Rubbish)

Use this execution pattern for every feature:

1. Define or update types first.
2. Implement API call with typed response.
3. Build smallest working feature component.
4. Compose it in page-level view.
5. Refactor repeated logic into composables.
6. Keep naming and file placement clean.
7. Final pass: remove noise, tighten intent, keep code beautiful.

Fast coding rules:

- Never trade structure for temporary speed.
- Avoid over-engineering; build only what the current feature needs.
- Reuse existing UI/layout/composables before creating new abstractions.
- Keep PRs small enough to review quickly and safely.

Beautiful code rules:

- intent-revealing names
- short functions
- typed boundaries
- consistent patterns across similar features
- no copy-paste architecture drift

If code is fast to write but painful to read, it is not done.
If code is beautiful but blocks shipping, it is not done.
Done means: clean, scalable, and delivered quickly.
