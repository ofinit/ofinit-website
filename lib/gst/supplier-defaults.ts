import type { GstParty } from "@/lib/gst/invoice"

/** Default invoice header logo (matches site branding). Override in Settings → Supplier. */
export const DEFAULT_SUPPLIER_LOGO_URL = "/ofinit-invoice-logo.svg"

export function getDefaultGstSupplier(): GstParty {
  return {
    legalName: "OfinIT Solutions Pvt. Ltd.",
    logoUrl: DEFAULT_SUPPLIER_LOGO_URL,
    addressLine1: "498-2, Gudem, Siolim, Bardez",
    city: "North Goa",
    country: "India",
    state: "Goa",
    stateCode: "30",
    pinCode: "403517",
    gstin: "30AAECO0806H1Z1",
    pan: "AAECO0806H",
    tel: "08322272276",
    email: "billing@ofinit.com",
    website: "https://ofinit.com",
    bankDetails: {
      accountName: "OfinIT Solutions Pvt. Ltd.",
      bankName: "Yes Bank Ltd.",
      accountNo: "002785800008003",
      branch: "Panaji",
      ifsc: "YESB0000027",
    },
  }
}

export function resolveSupplierLogoUrl(supplier?: GstParty | null, profile?: GstParty | null): string {
  return supplier?.logoUrl?.trim() || profile?.logoUrl?.trim() || DEFAULT_SUPPLIER_LOGO_URL
}

/** Ensures supplier (and saved invoices) always carry the default logo unless a custom URL is set. */
export function withDefaultSupplierLogo(party: GstParty): GstParty {
  const url = party.logoUrl?.trim()
  if (url) return party
  return { ...party, logoUrl: DEFAULT_SUPPLIER_LOGO_URL }
}

export function mergeGstSupplierWithDefaults(party: GstParty | null | undefined): GstParty {
  const base = getDefaultGstSupplier()
  if (!party) return base
  return withDefaultSupplierLogo({
    ...base,
    ...party,
    logoUrl: party.logoUrl?.trim() || base.logoUrl,
  })
}
