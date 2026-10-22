# Fumati Engineers — fumatigroup.digitsdigital.co.zw

Website and owner dashboard for Fumati Engineers (Fumati Group t/a Fumati Engineering),
Harare. Started in Lovable, finished by hand: TanStack Start on a Cloudflare Worker with
D1 (content) and R2 (photo/video uploads), and a dashboard at `/admin`
(see `docs/admin-access.md`).

Website by [Digits Digital](https://www.digitsdigital.co.zw).

## Where to edit things

| What | Where |
| --- | --- |
| Projects, team, testimonials, brands, awards, hero photos, services, values, FAQs, contacts, SEO, section switches | Dashboard, `/admin` (no redeploy) |
| List fields and the section switches | `src/data/collections.ts` |
| Content the site shipped with (seeds D1, and is the fallback if D1 is unreachable) | `src/data/seed.ts` |
| Brand colours and animations | `src/styles.css` |
| Shipped photos | `public/images/` (WebP; large ones have a `-sm` twin) |

## Deployment

Code lives at https://github.com/tendai-mufambisi/Fumati_Group. Every push to `main` runs
`.github/workflows/deploy.yml`: build, apply any new D1 migrations, deploy the Worker. It needs
the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; without them the
workflow skips the deploy with a warning.

## Commands

```sh
bun install
bun run dev        # UI only (no D1: the shipped content is shown)
bun run local      # full stack locally with local D1/R2 (needs .dev.vars: ADMIN_SECRET=… and FORCE_HTTPS=0)
bun run deploy     # build + deploy to fumatigroup.digitsdigital.co.zw
bun run db:migrate # apply new migrations to the live database (after a build)
node scripts/set-password.mjs "new password"
```

`scripts/build-seed.ts` generated `migrations/0001_init.sql` and `0002_seed.sql`. Both are
applied to the live database, so later schema changes go in new numbered migrations.
