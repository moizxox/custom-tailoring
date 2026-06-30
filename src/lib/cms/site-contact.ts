import { getSiteSetting } from "@/lib/cms/content";
import { getFooterContent } from "@/lib/cms/navigation";
import { SITE_CONTACT } from "@/lib/site-content";

export interface SiteContactInfo {
  phone: string;
  phoneHref: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  hours: string;
}

/** Unified contact + social — merges Admin Settings, Navigation footer, and defaults. */
export async function getSiteContactInfo(): Promise<SiteContactInfo> {
  const [settingsContact, settingsSocial, footer] = await Promise.all([
    getSiteSetting<Partial<{ phone: string; email: string; whatsapp: string }>>("contact", {}),
    getSiteSetting<Partial<{ instagram: string; facebook: string }>>("social", {}),
    getFooterContent(),
  ]);

  const phone = settingsContact.phone || footer.phone || SITE_CONTACT.phone;
  const phoneHref = footer.phoneHref || SITE_CONTACT.phoneHref;
  const email = settingsContact.email || footer.email || SITE_CONTACT.email;

  return {
    phone,
    phoneHref,
    email,
    whatsapp: settingsContact.whatsapp || SITE_CONTACT.whatsapp,
    instagram: settingsSocial.instagram || footer.instagramUrl || SITE_CONTACT.instagram,
    facebook: settingsSocial.facebook || footer.facebookUrl || SITE_CONTACT.facebook,
    hours: footer.hours || SITE_CONTACT.hoursDefault,
  };
}
