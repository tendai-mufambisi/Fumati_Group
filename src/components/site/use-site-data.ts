import { useLoaderData } from "@tanstack/react-router";

import type { CollectionKey, ItemOf } from "@/data/collections";
import { FALLBACK_SITE_DATA, phoneHref, whatsappUrl, type SiteData } from "@/data/site-data";

/** Owner-editable data, read once by the root loader and shared by every component. */
export function useSiteData(): SiteData {
  const data = useLoaderData({ from: "__root__" }) as SiteData | undefined;
  return data ?? FALLBACK_SITE_DATA;
}

export function useCollection<K extends CollectionKey>(key: K): ItemOf<K>[] {
  return useSiteData().collections[key];
}

/** Live contact details plus ready-made links. */
export function useContact() {
  const { settings: s, hours } = useSiteData();
  const phones = [s.phone1, s.phone2, s.phone3]
    .filter(Boolean)
    .map((display) => ({ display, href: phoneHref(display) }));
  return {
    phones,
    primaryPhone: phones[phones.length - 1] ?? phones[0],
    email: s.email,
    address: s.address,
    shop: s.shop_address,
    hours,
    mapQuery: s.map_query,
    socials: [
      { name: "Facebook", url: s.facebook },
      { name: "Instagram", url: s.instagram },
      { name: "LinkedIn", url: s.linkedin },
      { name: "YouTube", url: s.youtube },
      { name: "TikTok", url: s.tiktok },
    ].filter((x) => x.url),
    whatsappLink: (text?: string) => whatsappUrl(s.whatsapp, text),
  };
}
