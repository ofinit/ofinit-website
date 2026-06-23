"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Trash2, Plus, Printer, Save, Mail, Users, Download, X, Calendar as CalendarIcon } from "lucide-react"

import type { GstInvoice, GstInvoiceItem, GstInvoiceType, GstParty } from "@/lib/gst/invoice"
import { computeInvoice, normalizeStateCode, formatDateToDDMMYYYY, parseDDMMYYYYToYYYYMMDD } from "@/lib/gst/invoice"
import { getIndiaStateNameByCode, INDIA_GST_STATES } from "@/lib/gst/india-states"
import { createBlankInvoice } from "@/lib/gst/invoice-store"
import { withDefaultSupplierLogo } from "@/lib/gst/supplier-defaults"
import {
  addGstHsn,
  deleteGstInvoice,
  loadGstWorkspace,
  saveAndSendGstInvoice,
  saveGstInvoice,
  upsertGstBuyer,
} from "@/app/actions/gst-actions"
import { GstInvoicePreview } from "@/components/admin/gst-invoice-preview"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const GST_RATES = [0, 5, 12, 18, 28] as const
const COUNTRIES = ["India", "United States", "United Arab Emirates", "United Kingdom", "Singapore", "Australia", "Other"] as const

type FormErrors = Partial<Record<string, string>>

function safeNumber(value: string, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function updateParty(party: GstParty, patch: Partial<GstParty>): GstParty {
  return { ...party, ...patch }
}

function fmtINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value)
}

export default function AdminInvoicesPage() {
  const [activeTab, setActiveTab] = useState<"create" | "history">("create")
  const [invoice, setInvoice] = useState<GstInvoice | null>(null)
  const [history, setHistory] = useState<GstInvoice[]>([])
  const [buyers, setBuyers] = useState<GstParty[]>([])
  const [hsnList, setHsnList] = useState<string[]>([])
  const [buyerPickerOpen, setBuyerPickerOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const computed = useMemo(() => (invoice ? computeInvoice(invoice) : null), [invoice])
  const [historyQuery, setHistoryQuery] = useState("")
  const [historyFrom, setHistoryFrom] = useState("")
  const [historyTo, setHistoryTo] = useState("")
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({})
  const [supplierProfile, setSupplierProfile] = useState<GstParty | null>(null)
  const [gstReady, setGstReady] = useState(false)
  const [gstError, setGstError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const filteredHistory = useMemo(() => {
    const q = historyQuery.trim().toLowerCase()
    const from = historyFrom ? new Date(`${historyFrom}T00:00:00.000Z`).getTime() : null
    const to = historyTo ? new Date(`${historyTo}T23:59:59.999Z`).getTime() : null

    return history.filter((inv) => {
      if (q) {
        const hay =
          `${inv.invoiceNo} ${inv.invoiceDate} ${formatDateToDDMMYYYY(inv.invoiceDate)} ${inv.buyer.legalName} ${inv.buyer.gstin || ""}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (from || to) {
        const t = new Date(`${inv.invoiceDate}T00:00:00.000Z`).getTime()
        if (from != null && t < from) return false
        if (to != null && t > to) return false
      }
      return true
    })
  }, [history, historyQuery, historyFrom, historyTo])

  const selectedInvoices = useMemo(() => {
    const set = selectedIds
    return filteredHistory.filter((inv) => Boolean(set[inv.id]))
  }, [filteredHistory, selectedIds])

  const allFilteredSelected = useMemo(() => {
    if (!filteredHistory.length) return false
    return filteredHistory.every((inv) => Boolean(selectedIds[inv.id]))
  }, [filteredHistory, selectedIds])

  function toggleSelectAllFiltered(next: boolean) {
    if (!filteredHistory.length) return
    setSelectedIds((prev) => {
      const copy = { ...prev }
      for (const inv of filteredHistory) copy[inv.id] = next
      return copy
    })
  }

  function toggleSelected(id: string, next: boolean) {
    setSelectedIds((prev) => ({ ...prev, [id]: next }))
  }

  function downloadFile(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function escapeCsvCell(value: string | number | undefined | null) {
    const s = value == null ? "" : String(value)
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  function exportInvoicesCsv(scope: "selected" | "filtered") {
    const rows = scope === "selected" ? selectedInvoices : filteredHistory
    if (!rows.length) return

    const header = [
      "Invoice No",
      "Date",
      "Type",
      "Buyer",
      "Buyer GSTIN",
      "Place of supply",
      "Taxable value (INR)",
      "CGST (INR)",
      "SGST (INR)",
      "IGST (INR)",
      "Total tax (INR)",
      "Grand total (INR)",
      "Pricing currency",
      "FX USD/INR",
    ]

    const lines = [header.map(escapeCsvCell).join(",")]
    for (const inv of rows) {
      const c = computeInvoice(inv)
      lines.push(
        [
          inv.invoiceNo,
          formatDateToDDMMYYYY(inv.invoiceDate),
          inv.invoiceType,
          inv.buyer.legalName,
          inv.buyer.gstin ?? "",
          inv.placeOfSupplyState,
          c.totals.taxableValue.toFixed(2),
          c.totals.cgstAmount.toFixed(2),
          c.totals.sgstAmount.toFixed(2),
          c.totals.igstAmount.toFixed(2),
          c.totals.totalTax.toFixed(2),
          c.totals.grandTotal.toFixed(2),
          inv.pricingCurrency,
          inv.pricingCurrency === "USD" ? String(inv.fxUsdInr) : "",
        ]
          .map(escapeCsvCell)
          .join(",")
      )
    }

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")
    downloadFile(`invoices-${scope}-${stamp}.csv`, lines.join("\n"), "text/csv;charset=utf-8")
  }

  useEffect(() => {
    let cancelled = false
    setGstReady(false)
    loadGstWorkspace()
      .then((res) => {
        if (cancelled) return
        if (!res.ok) {
          setGstError(res.error)
          setGstReady(true)
          return
        }
        const d = res.data
        setHistory(d.invoices)
        setBuyers(d.buyers)
        setHsnList(d.hsnList)
        setSupplierProfile(d.supplier)
        const blank = createBlankInvoice({ invoiceType: "B2B", existingInvoices: d.invoices, supplier: d.supplier })
        setInvoice({ ...blank, invoiceDate: formatDateToDDMMYYYY(blank.invoiceDate) })
        setGstError(null)
        setGstReady(true)
      })
      .catch(() => {
        if (!cancelled) {
          setGstError("Unexpected error loading GST data. Check the browser network tab and server terminal logs.")
          setGstReady(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Auto-identify invoice type based on buyer GSTIN (B2B if present+valid, else B2C)
  useEffect(() => {
    if (!invoice) return
    const gstin = (invoice.buyer.gstin || "").trim()
    const nextType: GstInvoiceType = gstin ? "B2B" : "B2C"
    if (invoice.invoiceType !== nextType) {
      setInvoice({ ...invoice, invoiceType: nextType })
    }
  }, [invoice?.buyer.gstin])

  // Place of supply always follows buyer state (both on buyer state change and when a new invoice loads)
  useEffect(() => {
    if (!invoice) return
    const code = normalizeStateCode(invoice.buyer.stateCode || "")
    const name = getIndiaStateNameByCode(code)
    if (!code || !name) return
    if (normalizeStateCode(invoice.placeOfSupplyStateCode || "") !== code || invoice.placeOfSupplyState !== name) {
      setInvoice((prev) => prev ? { ...prev, placeOfSupplyStateCode: code, placeOfSupplyState: name } : prev)
    }
  }, [invoice?.buyer.stateCode, invoice?.id])

  // Auto pricing currency from buyer country
  useEffect(() => {
    if (!invoice) return
    const isInternational = (invoice.buyer.country || "India") !== "India"
    const nextPricing = isInternational ? "USD" : "INR"
    if (invoice.pricingCurrency !== nextPricing) {
      setInvoice({ ...invoice, pricingCurrency: nextPricing })
    }
  }, [invoice?.buyer.country])

  // Fetch FX rate once (for USD pricing)
  useEffect(() => {
    if (!invoice) return
    if (invoice.fxUsdInr && invoice.fxUsdInr > 0) return
    fetch("/api/fx/usd-inr")
      .then((r) => r.json())
      .then((d) => {
        const rate = Number(d?.usdInr)
        if (Number.isFinite(rate) && rate > 0) setInvoice((prev) => (prev ? { ...prev, fxUsdInr: rate } : prev))
      })
      .catch(() => {})
  }, [invoice?.id])

  async function refreshWorkspace() {
    const res = await loadGstWorkspace()
    if (!res.ok) {
      setGstError(res.error)
      return
    }
    const d = res.data
    setHistory(d.invoices)
    setBuyers(d.buyers)
    setHsnList(d.hsnList)
    setSupplierProfile(d.supplier)
    setGstError(null)
  }

  function validate(current: GstInvoice): FormErrors {
    const next: FormErrors = {}
    if (!current.invoiceNo.trim()) next.invoiceNo = "Invoice number is required."
    if (!current.invoiceDate.trim()) {
      next.invoiceDate = "Invoice date is required."
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(current.invoiceDate)) {
      next.invoiceDate = "Enter a valid date in DD/MM/YYYY format."
    }

    if (!current.supplier.legalName.trim()) next.supplierName = "Supplier legal name is required."
    if (!current.supplier.stateCode.trim()) next.supplierStateCode = "Supplier state code is required."

    if (!current.buyer.legalName.trim()) next.buyerName = "Buyer name is required."
    if (!current.placeOfSupplyStateCode.trim()) next.placeOfSupply = "Place of supply state code is required."

    if (!current.items.length) next.items = "Add at least one line item."
    current.items.forEach((it, idx) => {
      if (!it.description.trim()) next[`item_${idx}_desc`] = "Description is required."
      if (it.qty <= 0) next[`item_${idx}_qty`] = "Qty must be > 0."
      if (it.unitPrice < 0) next[`item_${idx}_price`] = "Rate must be >= 0."
      if (it.discount < 0) next[`item_${idx}_discount`] = "Discount must be >= 0."
    })
    return next
  }

  function onPrint() {
    if (!invoice) return
    const printable = document.getElementById("gst-invoice-preview")
    if (!printable) return

    const html = printable.outerHTML
    const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
      .map((x) => x.outerHTML)
      .join("\n")

    const w = window.open("", "_blank", "width=900,height=700")
    if (!w) return
    w.document.open()
    w.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${invoice.invoiceNo}</title>
    ${styles}
    <style>
      @page { size: A4; margin: 12mm; }
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; background: #fff; padding: 20px; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>
    <div class="print:p-0">
      ${html}
    </div>
    <script>
      window.focus();
      window.addEventListener('load', () => {
        setTimeout(() => {
          window.print();
        }, 250);
      });
    </script>
  </body>
</html>`)
    w.document.close()
  }

  async function onDownloadInvoicePdf(inv: GstInvoice) {
    setDownloading(true)
    try {
      const normalized = normalizeInvoice(inv)
      const res = await fetch("/api/admin/invoices/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      })
      if (!res.ok) throw new Error("PDF generation failed")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Invoice-${inv.invoiceNo}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert("Could not download PDF. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  async function onDownloadPdf() {
    if (!invoice) return
    const normalized = normalizeInvoice(invoice)
    const nextErrors = validate(normalized)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    await onDownloadInvoicePdf(normalized)
  }

  function normalizeInvoice(current: GstInvoice): GstInvoice {
    return {
      ...current,
      invoiceDate: parseDDMMYYYYToYYYYMMDD(current.invoiceDate),
      supplier: withDefaultSupplierLogo({
        ...current.supplier,
        stateCode: normalizeStateCode(current.supplier.stateCode),
      }),
      buyer: { ...current.buyer, stateCode: normalizeStateCode(current.buyer.stateCode) },
      placeOfSupplyStateCode: normalizeStateCode(current.placeOfSupplyStateCode),
      invoiceType: (current.buyer.gstin || "").trim() ? "B2B" : "B2C",
      updatedAt: new Date().toISOString(),
    }
  }

  async function onSave() {
    if (!invoice) return
    const normalized = normalizeInvoice(invoice)
    const nextErrors = validate(normalized)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    try {
      await upsertGstBuyer(normalized.buyer)
      await saveGstInvoice(normalized)
      setInvoice({
        ...normalized,
        invoiceDate: formatDateToDDMMYYYY(normalized.invoiceDate),
      })
      await refreshWorkspace()
      setActiveTab("history")
    } catch {
      alert("Could not save invoice. Check that you are logged in and the database is configured.")
    } finally {
      setSaving(false)
    }
  }

  async function onSaveAndSend() {
    if (!invoice) return
    const normalized = normalizeInvoice(invoice)
    const nextErrors = validate(normalized)
    if (!normalized.buyer.email?.trim()) {
      nextErrors.buyerEmail = "Buyer email is required to send the invoice."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSending(true)
    try {
      const result = await saveAndSendGstInvoice(normalized)
      if (!result.ok) {
        alert(result.error)
        return
      }
      setInvoice({
        ...normalized,
        invoiceDate: formatDateToDDMMYYYY(normalized.invoiceDate),
      })
      await refreshWorkspace()
      alert(`Invoice saved and emailed to ${normalized.buyer.email}.`)
      setActiveTab("history")
    } catch {
      alert("Could not save or send invoice.")
    } finally {
      setSending(false)
    }
  }

  function onNew(type: GstInvoiceType) {
    setErrors({})
    const blank = createBlankInvoice({ invoiceType: type, existingInvoices: history, supplier: supplierProfile })
    setInvoice({ ...blank, invoiceDate: formatDateToDDMMYYYY(blank.invoiceDate) })
    setActiveTab("create")
  }

  function updateItem(itemId: string, patch: Partial<GstInvoiceItem>) {
    if (!invoice) return
    setInvoice({
      ...invoice,
      items: invoice.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
      updatedAt: new Date().toISOString(),
    })
  }

  function addItem() {
    if (!invoice) return
    const id = `item_${Date.now()}_${Math.random().toString(16).slice(2)}`
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        { id, description: "", hsnSac: "", qty: 1, unit: "Nos", unitPrice: 0, discount: 0, gstRate: 18 },
      ],
    })
  }

  function removeItem(itemId: string) {
    if (!invoice) return
    setInvoice({ ...invoice, items: invoice.items.filter((it) => it.id !== itemId) })
  }

  function openFromHistory(inv: GstInvoice) {
    setErrors({})
    setInvoice({
      ...inv,
      invoiceDate: formatDateToDDMMYYYY(inv.invoiceDate),
    })
    setActiveTab("create")
  }

  async function removeFromHistory(id: string) {
    try {
      await deleteGstInvoice(id)
      await refreshWorkspace()
      setSelectedIds((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    } catch {
      alert("Could not delete invoice.")
    }
  }

  function selectBuyer(buyer: GstParty) {
    if (!invoice) return
    setInvoice((prev) => {
      if (!prev) return prev
      const next: GstInvoice = {
        ...prev,
        buyer: buyer,
        // Common default: set place of supply to buyer state if present
        placeOfSupplyStateCode: buyer.stateCode || prev.placeOfSupplyStateCode,
        placeOfSupplyState: buyer.state || prev.placeOfSupplyState,
      }
      return next
    })
    setBuyerPickerOpen(false)
  }

  if (!gstReady) {
    return <div className="p-8 text-gray-600">Connecting to database…</div>
  }
  if (gstError) {
    return (
      <div className="p-8 max-w-2xl space-y-4">
        <p className="text-red-700 font-medium">{gstError}</p>
        <p className="text-sm text-gray-600">
          Quick fix: ensure <code className="bg-gray-100 px-1 rounded">.env</code> has{" "}
          <code className="bg-gray-100 px-1 rounded">DATABASE_URL=&quot;file:./dev.db&quot;</code>, then run{" "}
          <code className="bg-gray-100 px-1 rounded">npx prisma db push</code>. Reload this page.
        </p>
      </div>
    )
  }
  if (!invoice) {
    return <div className="p-8 text-gray-600">Loading invoice workspace…</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GST Invoices</h1>
          <p className="text-gray-600 mt-2">Generate B2B and B2C GST invoices (CGST/SGST vs IGST)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent" onClick={() => onNew("B2B")}>
            New Invoice
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Invoice details</h2>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" className="bg-transparent gap-2" onClick={onPrint}>
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button variant="outline" className="bg-transparent gap-2" onClick={onDownloadPdf} disabled={downloading}>
                    <Download className="w-4 h-4" />
                    {downloading ? "Downloading…" : "Download PDF"}
                  </Button>
                  <Button className="gap-2" onClick={onSave} disabled={saving || sending || downloading}>
                    <Save className="w-4 h-4" />
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={onSaveAndSend}
                    disabled={saving || sending || downloading}
                  >
                    <Mail className="w-4 h-4" />
                    {sending ? "Sending…" : "Save & send email"}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Save & send attaches a PDF to the buyer email (configure SMTP in Settings → SMTP or server env).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label>Invoice No *</Label>
                  <Input value={invoice.invoiceNo} readOnly />
                  {errors.invoiceNo ? <p className="text-sm text-red-600 mt-1">{errors.invoiceNo}</p> : null}
                </div>
                <div>
                  <Label>Date *</Label>
                  <div className="relative flex items-center">
                    <Input
                      placeholder="DD/MM/YYYY"
                      value={invoice.invoiceDate}
                      onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-muted"
                          type="button"
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={(() => {
                            const yyyymmdd = parseDDMMYYYYToYYYYMMDD(invoice.invoiceDate)
                            const d = new Date(yyyymmdd)
                            return isNaN(d.getTime()) ? undefined : d
                          })()}
                          onSelect={(date) => {
                            if (date) {
                              const dd = String(date.getDate()).padStart(2, "0")
                              const mm = String(date.getMonth() + 1).padStart(2, "0")
                              const yyyy = date.getFullYear()
                              setInvoice({ ...invoice, invoiceDate: `${dd}/${mm}/${yyyy}` })
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {errors.invoiceDate ? <p className="text-sm text-red-600 mt-1">{errors.invoiceDate}</p> : null}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold">Buyer</h3>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-transparent gap-2"
                    onClick={() => setBuyerPickerOpen(true)}
                  >
                    <Users className="w-4 h-4" />
                    Search & select buyer
                  </Button>
                  <p className="text-sm text-gray-600">Buyer details are saved automatically on invoice save.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="md:col-span-2">
                    <Label>Legal name *</Label>
                    <Input
                      value={invoice.buyer.legalName}
                      onChange={(e) => setInvoice({ ...invoice, buyer: updateParty(invoice.buyer, { legalName: e.target.value }) })}
                    />
                    {errors.buyerName ? <p className="text-sm text-red-600 mt-1">{errors.buyerName}</p> : null}
                  </div>
                  <div className="md:col-span-2">
                    <Label>Address line 1</Label>
                    <Input
                      value={invoice.buyer.addressLine1}
                      onChange={(e) => setInvoice({ ...invoice, buyer: updateParty(invoice.buyer, { addressLine1: e.target.value }) })}
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={invoice.buyer.city}
                      onChange={(e) => setInvoice({ ...invoice, buyer: updateParty(invoice.buyer, { city: e.target.value }) })}
                    />
                  </div>
                  <div>
                    <Label>PIN</Label>
                    <Input
                      value={invoice.buyer.pinCode}
                      onChange={(e) => setInvoice({ ...invoice, buyer: updateParty(invoice.buyer, { pinCode: e.target.value }) })}
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <SearchableSelect
                      value={invoice.buyer.country || "India"}
                      placeholder="Select country"
                      searchPlaceholder="Search country..."
                      options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                      onChange={(v) => setInvoice({ ...invoice, buyer: updateParty(invoice.buyer, { country: v }) })}
                    />
                    {invoice.buyer.country !== "India" ? (
                      <p className="text-xs text-gray-500 mt-1">International buyer: enter prices in USD; we’ll show INR + USD.</p>
                    ) : null}
                  </div>
                  <div>
                    <Label>State</Label>
                    <SearchableSelect
                      value={normalizeStateCode(invoice.buyer.stateCode || "")}
                      placeholder={(invoice.buyer.country || "India") !== "India" ? "N/A" : "Select state"}
                      searchPlaceholder="Search state..."
                      disabled={(invoice.buyer.country || "India") !== "India"}
                      options={INDIA_GST_STATES.map((s) => ({ value: s.code, label: s.name, keywords: s.code }))}
                      onChange={(v) =>
                        setInvoice({
                          ...invoice,
                          buyer: updateParty(invoice.buyer, { stateCode: v, state: getIndiaStateNameByCode(v) }),
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Email (for sending invoice)</Label>
                    <Input
                      type="email"
                      value={invoice.buyer.email || ""}
                      onChange={(e) =>
                        setInvoice({
                          ...invoice,
                          buyer: updateParty(invoice.buyer, { email: e.target.value }),
                        })
                      }
                      placeholder="client@company.com"
                      autoComplete="email"
                    />
                    {errors.buyerEmail ? <p className="text-sm text-red-600 mt-1">{errors.buyerEmail}</p> : null}
                  </div>
                  <div className="md:col-span-2">
                    <Label>GSTIN (optional)</Label>
                    <Input
                      value={invoice.buyer.gstin || ""}
                      onChange={(e) =>
                        setInvoice({
                          ...invoice,
                          buyer: updateParty(invoice.buyer, { gstin: e.target.value.toUpperCase() }),
                        })
                      }
                      placeholder="Enter only if available"
                    />
                    <p className="text-xs text-gray-500 mt-1">If GSTIN is entered, invoice type becomes B2B.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Line items</h3>
                  <Button variant="outline" className="bg-transparent gap-2" onClick={addItem}>
                    <Plus className="w-4 h-4" />
                    Add item
                  </Button>
                </div>
                {errors.items ? <p className="text-sm text-red-600 mt-2">{errors.items}</p> : null}

                {invoice.pricingCurrency === "USD" ? (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>USD → INR rate</Label>
                      <Input
                        inputMode="decimal"
                        value={String(invoice.fxUsdInr || 0)}
                        onChange={(e) => setInvoice({ ...invoice, fxUsdInr: safeNumber(e.target.value, invoice.fxUsdInr || 83) })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-fetched, editable.</p>
                    </div>
                    <div className="flex items-end">
                      <div className="text-sm text-gray-700">
                        Prices are entered in <span className="font-semibold">USD</span> and converted to{" "}
                        <span className="font-semibold">INR</span> for totals/tax.
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 space-y-4">
                  {invoice.items.map((it, idx) => (
                    <Card key={it.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label>Description *</Label>
                            <Input value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} />
                            {errors[`item_${idx}_desc`] ? (
                              <p className="text-sm text-red-600 mt-1">{errors[`item_${idx}_desc`]}</p>
                            ) : null}
                          </div>
                          <div>
                            <Label>HSN/SAC</Label>
                            <Input
                              list="hsn-sac-list"
                              value={it.hsnSac || ""}
                              onChange={(e) => updateItem(it.id, { hsnSac: e.target.value.toUpperCase() })}
                              onBlur={async (e) => {
                                const val = e.currentTarget.value.trim().toUpperCase()
                                if (!val) return
                                try {
                                  await addGstHsn(val)
                                  await refreshWorkspace()
                                } catch {
                                  /* ignore */
                                }
                              }}
                              placeholder="Type to search or enter new"
                            />
                          </div>
                          <div>
                            <Label>GST Rate</Label>
                            <Select value={String(it.gstRate)} onValueChange={(v) => updateItem(it.id, { gstRate: Number(v) })}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="GST%" />
                              </SelectTrigger>
                              <SelectContent>
                                {GST_RATES.map((r) => (
                                  <SelectItem key={r} value={String(r)}>
                                    {r}%
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Qty *</Label>
                            <Input
                              inputMode="decimal"
                              value={String(it.qty)}
                              onChange={(e) => updateItem(it.id, { qty: safeNumber(e.target.value, 1) })}
                            />
                            {errors[`item_${idx}_qty`] ? <p className="text-sm text-red-600 mt-1">{errors[`item_${idx}_qty`]}</p> : null}
                          </div>
                          <div>
                            <Label>Rate *</Label>
                            <Input
                              inputMode="decimal"
                              value={String(it.unitPrice)}
                              onChange={(e) => updateItem(it.id, { unitPrice: safeNumber(e.target.value, 0) })}
                            />
                            {errors[`item_${idx}_price`] ? (
                              <p className="text-sm text-red-600 mt-1">{errors[`item_${idx}_price`]}</p>
                            ) : null}
                          </div>
                          <div>
                            <Label>Discount</Label>
                            <Input
                              inputMode="decimal"
                              value={String(it.discount)}
                              onChange={(e) => updateItem(it.id, { discount: safeNumber(e.target.value, 0) })}
                            />
                            {errors[`item_${idx}_discount`] ? (
                              <p className="text-sm text-red-600 mt-1">{errors[`item_${idx}_discount`]}</p>
                            ) : null}
                          </div>
                          <div className="flex items-end">
                            <div className="text-sm text-gray-600">
                              <div>Taxable</div>
                              <div className="font-semibold text-gray-900">
                                {computed ? fmtINR(computed.items[idx]?.taxableValue ?? 0) : "—"}
                              </div>
                              {invoice.pricingCurrency === "USD" && computed ? (
                                <div className="text-xs text-gray-500">
                                  USD line:{" "}
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 2,
                                  }).format((it.qty * it.unitPrice - it.discount) || 0)}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="bg-transparent text-red-600 hover:text-red-700"
                          onClick={() => removeItem(it.id)}
                          disabled={invoice.items.length === 1}
                          title={invoice.items.length === 1 ? "At least one item is required" : "Remove item"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Label>Notes</Label>
                <Textarea value={invoice.notes || ""} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })} />
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Preview</h2>
                    <p className="text-sm text-gray-600">
                      {computed?.supplyType === "INTRA_STATE" ? "CGST + SGST" : "IGST"} • Grand total{" "}
                      <span className="font-semibold">{computed ? fmtINR(computed.totals.grandTotal) : "—"}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-transparent gap-2" onClick={onDownloadPdf} disabled={downloading}>
                      <Download className="w-4 h-4" />
                      {downloading ? "Downloading…" : "Download"}
                    </Button>
                    <Button variant="outline" className="bg-transparent gap-2" onClick={onPrint}>
                      <Printer className="w-4 h-4" />
                      Print
                    </Button>
                  </div>
                </div>
              </Card>

              <div id="gst-invoice-preview">
                <GstInvoicePreview invoice={invoice} supplierProfile={supplierProfile} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Saved invoices</h2>
                <p className="text-gray-600 mt-1">Stored in this browser (localStorage).</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-nowrap items-end gap-3 overflow-x-auto pb-1">
                <div className="w-[220px] shrink-0">
                  <Label>Search</Label>
                  <Input
                    value={historyQuery}
                    onChange={(e) => setHistoryQuery(e.target.value)}
                    placeholder="Invoice no, buyer name, GSTIN..."
                  />
                </div>
                <div className="min-w-[180px]">
                  <Label>From</Label>
                  <Input type="date" value={historyFrom} onChange={(e) => setHistoryFrom(e.target.value)} />
                </div>
                <div className="min-w-[180px]">
                  <Label>To</Label>
                  <Input type="date" value={historyTo} onChange={(e) => setHistoryTo(e.target.value)} />
                </div>
                <div className="shrink-0 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-transparent"
                    onClick={() => exportInvoicesCsv(selectedInvoices.length ? "selected" : "filtered")}
                    disabled={!filteredHistory.length}
                    aria-label="Export CSV"
                    title="Export CSV"
                  >
                    <Download />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-transparent"
                    onClick={() => {
                      setHistoryQuery("")
                      setHistoryFrom("")
                      setHistoryTo("")
                      setSelectedIds({})
                    }}
                    disabled={!historyQuery && !historyFrom && !historyTo && !Object.keys(selectedIds).length}
                    aria-label="Clear filters and selection"
                    title="Clear filters and selection"
                  >
                    <X />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredHistory.length}</span> invoices
                {selectedInvoices.length ? (
                  <>
                    {" "}
                    • Selected <span className="font-medium">{selectedInvoices.length}</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={allFilteredSelected}
                        onCheckedChange={(v) => toggleSelectAllFiltered(Boolean(v))}
                        aria-label="Select all filtered invoices"
                      />
                    </TableHead>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bill to name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Grand total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length ? (
                    filteredHistory.map((inv) => {
                      const totals = computeInvoice(inv).totals
                      const totalQty = inv.items.reduce((sum, it) => sum + (it.qty || 0), 0)
                      const totalDiscount = inv.items.reduce((sum, it) => sum + (it.discount || 0), 0)
                      const discountStr = totalDiscount > 0
                        ? inv.pricingCurrency === "USD"
                          ? `$${totalDiscount.toFixed(2)}`
                          : `₹${totalDiscount.toFixed(2)}`
                        : "—"
                      const descriptions = inv.items.map((it) => it.description || "—").join(", ")

                      return (
                        <TableRow key={inv.id}>
                          <TableCell>
                            <Checkbox
                              checked={Boolean(selectedIds[inv.id])}
                              onCheckedChange={(v) => toggleSelected(inv.id, Boolean(v))}
                              aria-label={`Select ${inv.invoiceNo}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{inv.invoiceNo}</TableCell>
                          <TableCell>{formatDateToDDMMYYYY(inv.invoiceDate)}</TableCell>
                          <TableCell>{inv.buyer.legalName || "—"}</TableCell>
                          <TableCell>{inv.buyer.state || inv.buyer.stateCode || "—"}</TableCell>
                          <TableCell>{inv.invoiceType}</TableCell>
                          <TableCell className="max-w-[150px] truncate" title={descriptions}>
                            {descriptions}
                          </TableCell>
                          <TableCell className="text-right">{totalQty}</TableCell>
                          <TableCell className="text-right">{discountStr}</TableCell>
                          <TableCell className="text-right">{fmtINR(totals.grandTotal)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                className="bg-transparent"
                                size="sm"
                                onClick={() => onDownloadInvoicePdf(inv)}
                                disabled={downloading}
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" className="bg-transparent" size="sm" onClick={() => openFromHistory(inv)}>
                                Open
                              </Button>
                              <Button
                                variant="outline"
                                className="bg-transparent text-red-600 hover:text-red-700"
                                size="sm"
                                onClick={() => removeFromHistory(inv.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-gray-500 py-10">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <datalist id="hsn-sac-list">
        {hsnList.map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>

      <CommandDialog open={buyerPickerOpen} onOpenChange={setBuyerPickerOpen} title="Select buyer">
        <CommandInput placeholder="Search buyer by name / GSTIN..." />
        <CommandList>
          <CommandEmpty>No buyers saved yet.</CommandEmpty>
          <CommandGroup heading="Buyers">
            {buyers.map((b) => {
              const label = b.gstin ? `${b.legalName} • ${b.gstin}` : b.legalName
              const meta = b.stateCode ? `${normalizeStateCode(b.stateCode)} - ${getIndiaStateNameByCode(b.stateCode)}` : ""
              return (
                <CommandItem
                  key={(b.gstin || b.legalName).trim().toUpperCase()}
                  value={`${b.legalName} ${b.gstin || ""}`}
                  onSelect={() => selectBuyer(b)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{label}</span>
                    {meta ? <span className="text-xs text-gray-500">{meta}</span> : null}
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

