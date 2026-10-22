/**
 * Admin pages must never be indexed or previewed. `robots.txt` also disallows
 * /admin and /_serverFn/, but a meta tag covers pages reached by direct link.
 */
export function adminSeo(title: string) {
  return {
    meta: [
      { title: `${title} | Fumati Engineers Dashboard` },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  };
}
