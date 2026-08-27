# BodyFit Dynasty

Aplicación móvil de fitness, nutrición y comunidad para ayudar a las personas a entrenar, registrar su alimentación y seguir su progreso.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `pnpm --filter @workspace/bodyfit-dynasty run typecheck` — check the mobile app

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bodyfit-dynasty/` — Expo mobile app and router screens
- `artifacts/bodyfit-dynasty/constants/colors.ts` — BodyFit Dynasty dark palette
- `artifacts/bodyfit-dynasty/context/BodyFitContext.tsx` — local daily stats and workout state
- `artifacts/bodyfit-dynasty/components/bodyfit.tsx` — shared mobile UI primitives
- `artifacts/bodyfit-dynasty/assets/images/` — brand icon and generated fitness imagery

## Architecture decisions

- The first mobile build is Expo/React Native so it can run in Expo Go and be published for iOS through the workspace.
- Daily dashboard state uses AsyncStorage while the backend and external integrations remain opt-in for a later phase.
- RevenueCat is connected to the workspace, but store products and entitlements still need the owner's final membership configuration before real purchases are enabled.
- Native device access is used for the food workflow through the camera and photo library permissions.
- Food photo values are estimates and must be reviewed and corrected by the user before saving.
- Creator-only administration, customer accounts, and membership permissions require the pending authentication/backend phase; local owner mode is only a preview.

## Product

The app includes Inicio, Rutinas, Comunidad, Progreso and Perfil in Spanish, plus food analysis, membership plans and local daily tracking. The visual identity follows the supplied BodyFit Dynasty logo and black, purple, gold and white palette.

## User preferences

- The product owner is the user; BodyFit Dynasty is their project and brand.
- User prefers communication in Spanish.

## Gotchas

- The mobile workflow is `artifacts/bodyfit-dynasty: expo`; use the workflow rather than starting Expo manually.
- Firebase, full Apple Health/HealthKit, production AI inference/video generation, AdMob IDs, and the trainer admin panel still require a later integration phase.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
