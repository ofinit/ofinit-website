"use client"

import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { GstInvoice } from "@/lib/gst/invoice"
import { computeInvoice } from "@/lib/gst/invoice"
import { DEFAULT_SUPPLIER_LOGO_URL } from "@/lib/gst/supplier-defaults"

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

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, fontFamily: "Helvetica" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  section: { marginTop: 12 },
  h1: { fontSize: 14, fontWeight: 700 },
  label: { fontSize: 9, color: "#555" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", paddingBottom: 6, marginTop: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 6 },
  cell: { paddingRight: 6 },
  right: { textAlign: "right" },
})

function inr(value: number) {
  return `₹${value.toFixed(2)}`
}

export function InvoicePdfDocument({ invoice }: { invoice: GstInvoice }) {
  const computed = computeInvoice(invoice)
  const logoSrc = resolvePdfLogoSrc(invoice.supplier.logoUrl)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, flex: 1 }}>
            {logoSrc ? (
              <Image src={logoSrc} style={{ width: 72, height: 40, objectFit: "contain" }} />
            ) : null}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Tax Invoice</Text>
              <Text style={styles.h1}>{invoice.supplier.legalName}</Text>
              <Text>{invoice.supplier.addressLine1}</Text>
              <Text>
                {invoice.supplier.city ? `${invoice.supplier.city}, ` : ""}
                {invoice.supplier.state} {invoice.supplier.pinCode}
              </Text>
              {invoice.supplier.gstin ? <Text>GSTIN: {invoice.supplier.gstin}</Text> : null}
            </View>
          </View>
          <View style={{ width: 220 }}>
            <Text style={{ fontSize: 12, fontWeight: 700, textAlign: "right" }}>Invoice</Text>
            <Text style={{ textAlign: "right" }}>Invoice No: {invoice.invoiceNo}</Text>
            <Text style={{ textAlign: "right" }}>Date: {invoice.invoiceDate}</Text>
            <Text style={{ textAlign: "right", marginTop: 6 }}>
              Supply type: {computed.supplyType === "INTRA_STATE" ? "CGST+SGST" : "IGST"}
            </Text>
            <Text style={{ textAlign: "right" }}>
              Place of supply: {invoice.placeOfSupplyState} ({invoice.placeOfSupplyStateCode})
            </Text>
          </View>
        </View>

        <View style={[styles.section, styles.row]}>
          <View style={{ flex: 1, borderWidth: 1, borderColor: "#eee", padding: 10 }}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={{ fontSize: 11, fontWeight: 700 }}>{invoice.buyer.legalName}</Text>
            <Text>{invoice.buyer.addressLine1}</Text>
            <Text>
              {invoice.buyer.city ? `${invoice.buyer.city}, ` : ""}
              {invoice.buyer.state}
              {(invoice.buyer.country || "India") === "India" && invoice.buyer.stateCode ? ` (${invoice.buyer.stateCode})` : ""}{" "}
              {invoice.buyer.pinCode}
            </Text>
            <Text>Country: {invoice.buyer.country || "India"}</Text>
            {invoice.buyer.gstin ? <Text>GSTIN: {invoice.buyer.gstin}</Text> : null}
          </View>
          <View style={{ width: 220, borderWidth: 1, borderColor: "#eee", padding: 10 }}>
            <Text style={styles.label}>Currency</Text>
            <Text>{invoice.pricingCurrency === "USD" ? `USD (converted @ ${invoice.fxUsdInr})` : "INR"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { width: 18 }]}>#</Text>
            <Text style={[styles.cell, { flex: 1 }]}>Description</Text>
            <Text style={[styles.cell, { width: 60 }]}>HSN/SAC</Text>
            <Text style={[styles.cell, styles.right, { width: 40 }]}>Qty</Text>
            <Text style={[styles.cell, styles.right, { width: 70 }]}>Rate</Text>
            <Text style={[styles.cell, styles.right, { width: 70 }]}>Taxable</Text>
            <Text style={[styles.cell, styles.right, { width: 40 }]}>GST%</Text>
            <Text style={[styles.cell, styles.right, { width: 70 }]}>Line total</Text>
          </View>
          {computed.items.map((it, idx) => (
            <View key={it.id} style={styles.tableRow}>
              <Text style={[styles.cell, { width: 18 }]}>{idx + 1}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{it.description || "—"}</Text>
              <Text style={[styles.cell, { width: 60 }]}>{it.hsnSac || "—"}</Text>
              <Text style={[styles.cell, styles.right, { width: 40 }]}>{String(it.qty)}</Text>
              <Text style={[styles.cell, styles.right, { width: 70 }]}>{inr(it.unitPriceInr)}</Text>
              <Text style={[styles.cell, styles.right, { width: 70 }]}>{inr(it.taxableValue)}</Text>
              <Text style={[styles.cell, styles.right, { width: 40 }]}>{String(it.gstRate)}</Text>
              <Text style={[styles.cell, styles.right, { width: 70 }]}>{inr(it.tax.lineTotal)}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { alignSelf: "flex-end", width: 240, borderWidth: 1, borderColor: "#eee", padding: 10 }]}>
          <View style={styles.row}>
            <Text>Taxable value</Text>
            <Text style={styles.right}>{inr(computed.totals.taxableValue)}</Text>
          </View>
          {computed.supplyType === "INTRA_STATE" ? (
            <>
              <View style={[styles.row, { marginTop: 6 }]}>
                <Text>CGST</Text>
                <Text style={styles.right}>{inr(computed.totals.cgstAmount)}</Text>
              </View>
              <View style={[styles.row, { marginTop: 6 }]}>
                <Text>SGST</Text>
                <Text style={styles.right}>{inr(computed.totals.sgstAmount)}</Text>
              </View>
            </>
          ) : (
            <View style={[styles.row, { marginTop: 6 }]}>
              <Text>IGST</Text>
              <Text style={styles.right}>{inr(computed.totals.igstAmount)}</Text>
            </View>
          )}
          <View style={[styles.row, { marginTop: 6 }]}>
            <Text>Total</Text>
            <Text style={[styles.right, { fontWeight: 700 }]}>{inr(computed.totals.grandTotal)}</Text>
          </View>
        </View>

        <Text
          style={{
            marginTop: 28,
            fontSize: 8,
            color: "#555",
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

