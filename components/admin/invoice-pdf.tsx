import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { GstInvoice } from "@/lib/gst/invoice"
import { computeInvoice, formatDateToDDMMYYYY } from "@/lib/gst/invoice"
import { DEFAULT_SUPPLIER_LOGO_URL } from "@/lib/gst/supplier-defaults"

// Register Noto Sans from Google Fonts — supports the ₹ (U+20B9) Rupee glyph
Font.register({
  family: "Noto Sans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAaBN9d.ttf",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/notosans/v42/o-0kIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevHtVtX57DGjDU1QDce6Vc.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
  ],
})

function resolvePdfLogoSrc(url: string | undefined): string | undefined {
  const u = url?.trim() || DEFAULT_SUPPLIER_LOGO_URL
  if (!u) return undefined
  if (u.startsWith("http") || u.startsWith("data:")) return u
  if (typeof window !== "undefined") {
    try {
      return new URL(u, window.location.origin).href
    } catch {
      return u
    }
  }
  return u
}

const FONT = "Noto Sans"

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: FONT },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  section: { marginTop: 14 },
  h1: { fontSize: 14, fontWeight: 700 },
  label: { fontSize: 8.5, color: "#666", marginBottom: 2 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
    marginTop: 10,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 6,
  },
  cell: { paddingRight: 6 },
  right: { textAlign: "right" },
})

function inr(value: number) {
  return `\u20B9${value.toFixed(2)}`
}

function usd(value: number) {
  return `$${value.toFixed(2)}`
}

export function InvoicePdfDocument({ invoice }: { invoice: GstInvoice }) {
  const computed = computeInvoice(invoice)
  const rawLogo = invoice.supplier.logoUrl?.trim()
  const isDefaultLogo = !rawLogo || rawLogo.includes("ofinit-invoice-logo.svg")
  const isSvg = rawLogo?.toLowerCase().endsWith(".svg")
  const logoSrc = isDefaultLogo || isSvg ? undefined : resolvePdfLogoSrc(rawLogo)
  const isInternational = (invoice.buyer.country || "India") !== "India" || invoice.pricingCurrency === "USD"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Header Row ─────────────────────────────────────────── */}
        <View style={styles.row}>
          {/* Supplier block */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, flex: 1 }}>
            {/* Logo */}
            {logoSrc ? (
              <Image src={logoSrc} style={{ width: 72, height: 40, objectFit: "contain" }} />
            ) : isDefaultLogo ? (
              <View
                style={{
                  height: 36,
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 700, color: "#2563eb", fontFamily: FONT }}>
                  {"<"}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", fontFamily: FONT }}>
                  OfinIT
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 700, color: "#2563eb", fontFamily: FONT }}>
                  {"/>"}
                </Text>
              </View>
            ) : null}

            {/* Supplier details */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Tax Invoice</Text>
              <Text style={styles.h1}>{invoice.supplier.legalName}</Text>
              <Text style={{ marginTop: 2 }}>{invoice.supplier.addressLine1}</Text>
              {invoice.supplier.addressLine2 ? <Text>{invoice.supplier.addressLine2}</Text> : null}
              <Text>
                {invoice.supplier.city ? `${invoice.supplier.city}, ` : ""}
                {invoice.supplier.state} {invoice.supplier.pinCode}
              </Text>
              {invoice.supplier.tel ? <Text>Tel.: {invoice.supplier.tel}</Text> : null}
              {invoice.supplier.email ? <Text>Email: {invoice.supplier.email}</Text> : null}
              {invoice.supplier.gstin ? (
                <Text style={{ fontWeight: 700, marginTop: 2 }}>GSTIN: {invoice.supplier.gstin}</Text>
              ) : null}
              {invoice.supplier.website ? <Text>{invoice.supplier.website}</Text> : null}
            </View>
          </View>

          {/* Invoice meta */}
          <View style={{ width: 210 }}>
            <Text style={{ fontSize: 13, fontWeight: 700, textAlign: "right", marginBottom: 4 }}>
              Invoice
            </Text>
            <Text style={{ textAlign: "right" }}>Invoice No: {invoice.invoiceNo}</Text>
            <Text style={{ textAlign: "right" }}>Date: {formatDateToDDMMYYYY(invoice.invoiceDate)}</Text>
            <Text style={{ textAlign: "right", marginTop: 6 }}>
              Supply type: {computed.supplyType === "INTRA_STATE" ? "Intra-state (CGST+SGST)" : "Inter-state (IGST)"}
            </Text>
            <Text style={{ textAlign: "right" }}>
              Place of supply: {invoice.placeOfSupplyState} ({invoice.placeOfSupplyStateCode})
            </Text>
          </View>
        </View>

        {/* ── Bill To / Invoice Details ──────────────────────────── */}
        <View style={[styles.section, styles.row]}>
          <View style={{ flex: 1, borderWidth: 1, borderColor: "#e2e8f0", padding: 10, borderRadius: 2 }}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
              {invoice.buyer.legalName}
            </Text>
            <Text>{invoice.buyer.addressLine1}</Text>
            {invoice.buyer.addressLine2 ? <Text>{invoice.buyer.addressLine2}</Text> : null}
            <Text>
              {invoice.buyer.city ? `${invoice.buyer.city}, ` : ""}
              {invoice.buyer.state}
              {(invoice.buyer.country || "India") === "India" && invoice.buyer.stateCode
                ? ` (${invoice.buyer.stateCode})`
                : ""}{" "}
              {invoice.buyer.pinCode}
            </Text>
            <Text>Country: {invoice.buyer.country || "India"}</Text>
            {invoice.buyer.gstin ? <Text>GSTIN: {invoice.buyer.gstin}</Text> : null}
          </View>
          <View
            style={{
              width: 210,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              padding: 10,
              borderRadius: 2,
            }}
          >
            <Text style={styles.label}>Invoice Details</Text>
            <View style={{ gap: 3, marginTop: 2 }}>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={{ color: "#666" }}>Currency:</Text>
                <Text style={{ fontWeight: 700 }}>
                  {isInternational ? "INR + USD (display)" : invoice.currency}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={{ color: "#666" }}>Supplier state code:</Text>
                <Text style={{ fontWeight: 700 }}>{invoice.supplier.stateCode}</Text>
              </View>
              {isInternational ? (
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <Text style={{ color: "#666" }}>USD→INR rate:</Text>
                  <Text style={{ fontWeight: 700 }}>{invoice.fxUsdInr}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* ── Line Items Table ─────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { width: 18 }]}>#</Text>
            <Text style={[styles.cell, { flex: 1 }]}>Description</Text>
            <Text style={[styles.cell, { width: 50 }]}>HSN/SAC</Text>
            <Text style={[styles.cell, styles.right, { width: 30 }]}>Qty</Text>
            <Text style={[styles.cell, styles.right, { width: 65 }]}>Rate</Text>
            <Text style={[styles.cell, styles.right, { width: 65 }]}>Taxable</Text>
            <Text style={[styles.cell, styles.right, { width: 35 }]}>GST%</Text>
            <Text style={[styles.cell, styles.right, { width: 55 }]}>Tax</Text>
            <Text style={[styles.cell, styles.right, { width: 70 }]}>Line total</Text>
          </View>

          {computed.items.map((it, idx) => (
            <View key={it.id} style={styles.tableRow}>
              <Text style={[styles.cell, { width: 18 }]}>{idx + 1}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{it.description || "—"}</Text>
              <Text style={[styles.cell, { width: 50 }]}>{it.hsnSac || "—"}</Text>
              <Text style={[styles.cell, styles.right, { width: 30 }]}>{String(it.qty)}</Text>
              
              {/* Rate cell */}
              <View style={[styles.cell, styles.right, { width: 65, flexDirection: "column", alignItems: "flex-end" }]}>
                {isInternational && it.unitPriceUsd != null ? (
                  <>
                    <Text>{usd(it.unitPriceUsd)}</Text>
                    <Text style={{ fontSize: 7, color: "#666" }}>{inr(it.unitPriceInr)}</Text>
                  </>
                ) : (
                  <Text>{inr(it.unitPriceInr)}</Text>
                )}
              </View>

              <Text style={[styles.cell, styles.right, { width: 65 }]}>{inr(it.taxableValue)}</Text>
              <Text style={[styles.cell, styles.right, { width: 35 }]}>{String(it.gstRate)}%</Text>
              
              {/* Tax cell */}
              <Text style={[styles.cell, styles.right, { width: 55 }]}>
                {computed.supplyType === "INTRA_STATE"
                  ? inr(it.tax.cgstAmount + it.tax.sgstAmount)
                  : inr(it.tax.igstAmount)}
              </Text>

              <Text style={[styles.cell, styles.right, { width: 70 }]}>{inr(it.tax.lineTotal)}</Text>
            </View>
          ))}
        </View>

        {/* ── Totals ───────────────────────────────────────────── */}
        <View
          style={[
            styles.section,
            {
              alignSelf: "flex-end",
              width: 240,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              padding: 10,
              borderRadius: 2,
              gap: 4,
            },
          ]}
        >
          <View style={styles.row}>
            <Text>Taxable value</Text>
            <Text style={styles.right}>{inr(computed.totals.taxableValue)}</Text>
          </View>

          {computed.supplyType === "INTRA_STATE" ? (
            <>
              <View style={styles.row}>
                <Text>CGST</Text>
                <Text style={styles.right}>{inr(computed.totals.cgstAmount)}</Text>
              </View>
              <View style={styles.row}>
                <Text>SGST</Text>
                <Text style={styles.right}>{inr(computed.totals.sgstAmount)}</Text>
              </View>
            </>
          ) : (
            <View style={styles.row}>
              <Text>IGST</Text>
              <Text style={styles.right}>{inr(computed.totals.igstAmount)}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text>Total tax</Text>
            <Text style={styles.right}>{inr(computed.totals.totalTax)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Invoice total</Text>
            <Text style={styles.right}>{inr(computed.totals.invoiceTotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Rounded off</Text>
            <Text style={styles.right}>{inr(computed.totals.roundedOff)}</Text>
          </View>

          <View
            style={[
              styles.row,
              {
                marginTop: 4,
                paddingTop: 6,
                borderTopWidth: 1,
                borderTopColor: "#ddd",
              },
            ]}
          >
            <Text style={{ fontWeight: 700 }}>Grand total</Text>
            <Text style={[styles.right, { fontWeight: 700 }]}>
              {inr(computed.totals.grandTotal)}
            </Text>
          </View>

          {isInternational ? (
            <View style={styles.row}>
              <Text style={{ color: "#444" }}>Grand total (USD)</Text>
              <Text style={[styles.right, { color: "#444" }]}>
                {usd(computed.totals.grandTotal / (invoice.fxUsdInr || 1))}
              </Text>
            </View>
          ) : null}
        </View>

        {/* ── Bank Details + PAN ───────────────────────────────── */}
        {(invoice.supplier.bankDetails || invoice.supplier.pan) ? (
          <View
            style={[
              styles.section,
              {
                borderWidth: 1,
                borderColor: "#e2e8f0",
                padding: 10,
                borderRadius: 2,
              },
            ]}
          >
            <Text style={[styles.label, { marginBottom: 6 }]}>Payment Details</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              {/* Left Column: PAN */}
              <View style={{ flex: 1 }}>
                {invoice.supplier.pan ? (
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <Text style={{ color: "#666" }}>Company PAN:</Text>
                    <Text style={{ fontWeight: 700 }}>{invoice.supplier.pan}</Text>
                  </View>
                ) : null}
              </View>

              {/* Right Column: Bank Details */}
              <View style={{ flex: 1 }}>
                {invoice.supplier.bankDetails ? (
                  <View style={{ gap: 3 }}>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <Text style={{ color: "#666", width: 60 }}>A/c Name:</Text>
                      <Text style={{ fontWeight: 700 }}>{invoice.supplier.bankDetails.accountName}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <Text style={{ color: "#666", width: 60 }}>Bank:</Text>
                      <Text>{invoice.supplier.bankDetails.bankName}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <Text style={{ color: "#666", width: 60 }}>A/c No.:</Text>
                      <Text style={{ fontWeight: 700 }}>{invoice.supplier.bankDetails.accountNo}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <Text style={{ color: "#666", width: 60 }}>Branch:</Text>
                      <Text>{invoice.supplier.bankDetails.branch}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <Text style={{ color: "#666", width: 60 }}>IFSC:</Text>
                      <Text style={{ fontWeight: 700 }}>{invoice.supplier.bankDetails.ifsc}</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}

        {/* ── Footer ───────────────────────────────────────────── */}
        <Text
          style={{
            marginTop: 32,
            fontSize: 8,
            color: "#888",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          *This is a computer generated invoice and does not require signature*
        </Text>
      </Page>
    </Document>
  )
}
