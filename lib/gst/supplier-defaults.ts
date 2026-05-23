import type { GstParty } from "@/lib/gst/invoice"

/** Default invoice header logo (matches site branding). Override in Settings → Supplier. */
export const DEFAULT_SUPPLIER_LOGO_URL = "/ofinit-invoice-logo.svg"

export function getDefaultGstSupplier(): GstParty {
  return {
    legalName: "OfinIT Solutions Pvt. Ltd.",
    logoUrl: DEFAULT_SUPPLIER_LOGO_URL,
    addressLine1: "",
    city: "",
    country: "India",
    state: "",
    stateCode: "27",
    pinCode: "",
    gstin: "",
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
