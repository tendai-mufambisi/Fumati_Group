# Fumati Engineers dashboard

Sign in at https://fumatigroup.digitsdigital.co.zw/admin/login (or tap the small dot after the
copyright line in the footer). Password only. After 8 wrong passwords from one connection,
sign-in is blocked for 15 minutes. Change the first-login password under
**Contacts, SEO & password** straight away.

Everything saved in the dashboard is live on the website immediately — no redeploy.

| Dashboard page | What it controls |
| --- | --- |
| Quote requests | Every request from the Contact page form. Reply on WhatsApp/call/email, set the status, delete. |
| Projects | Project pages: details, publish/draft, feature on home page, order. Gallery takes many photos at once, videos (MP4/WebM/MOV up to 90 MB) and YouTube/Facebook/Vimeo links. Star a photo to make it the cover. |
| Hero slideshow | The photos that cross-fade behind the home page heading. Use sharp landscape photos. |
| Services, Core values, Why choose us, Our journey, Industries, Our process, FAQs | Add, edit, reorder, hide or delete items. |
| Team | Name, title, department, bio, photo, email, LinkedIn. |
| Testimonials | Quote plus a picture: a photo of the person, their company logo, or a scan of a recommendation letter (visitors can open letters full screen). The section stays hidden until the first one is added. |
| Brands & clients | Company name, logo and website for the brands strip and the Awards & Clients page. |
| Awards | Award, awarded by, year, recipient, photo. |
| Company & CEO | Hero heading, company profile text, mission, vision, brand promise, the numbers band, CEO name/photo/bio/message. |
| Show / hide sections | Switch any section (or the Team / Awards pages, WhatsApp button, loader) off and on. |
| Contacts, SEO & password | Phones, WhatsApp, email, addresses, hours, social links, Google title/description/keywords, Search Console code, company profile PDF, password. |

Uploaded photos are resized in the browser (max 1,800 px, WebP) and stored in Cloudflare R2
under `/media/…`. Deleting an item also deletes its files.

## Cloudflare resources (account: Mufambisitendaiblessed@gmail.com)

| Binding | Resource |
| --- | --- |
| Worker | `fumati-group` on `fumatigroup.digitsdigital.co.zw` |
| DB | D1 `fumati-group` |
| MEDIA | R2 `fumati-group-media` |
| ADMIN_SECRET | Worker secret that signs session cookies (rotating it signs everyone out) |
| FORCE_HTTPS | Worker var, `"1"` in production, `"0"` in `.dev.vars` |

Reset a forgotten password: `node scripts/set-password.mjs "new password"`.
