"use client"

import type { GstInvoice, GstInvoiceComputed, GstParty } from "@/lib/gst/invoice"
import { computeInvoice } from "@/lib/gst/invoice"
import { resolveSupplierLogoUrl } from "@/lib/gst/supplier-defaults"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function fmtINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value)
}

function fmtUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function GstInvoicePreview({
  invoice,
  className,
  supplierProfile,
}: {
  invoice: GstInvoice
  className?: string
  /** Saved supplier settings (e.g. logo) when not embedded on the invoice */
  supplierProfile?: GstParty | null
}) {
  const computed: GstInvoiceComputed = computeInvoice(invoice)
  const isInternational = (invoice.buyer.country || "India") !== "India" || invoice.pricingCurrency === "USD"
  const supplierLogoUrl = resolveSupplierLogoUrl(invoice.supplier, supplierProfile)

  return (
    <div
      className={cn(
        "bg-white text-black border border-gray-200 rounded-lg p-6 print:border-0 print:rounded-none print:p-0",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 min-w-0">
          {supplierLogoUrl ? (
            <img
              src={supplierLogoUrl}
              alt=""
              className="h-14 w-auto max-w-[160px] shrink-0 object-contain object-left"
            />
          ) : null}
          <div className="min-w-0">
            <div className="text-xs text-gray-500">Tax Invoice</div>
            <h2 className="text-xl font-bold">{invoice.supplier.legalName || "Supplier Name"}</h2>
            <div className="text-sm text-gray-700 mt-1">
              <div>{invoice.supplier.addressLine1}</div>
              {invoice.supplier.addressLine2 ? <div>{invoice.supplier.addressLine2}</div> : null}
              <div>
                {invoice.supplier.city}
                {invoice.supplier.city ? ", " : ""}
                {invoice.supplier.state} {invoice.supplier.pinCode}
              </div>
              {invoice.supplier.tel ? <div className="mt-1">Tel.: {invoice.supplier.tel}</div> : null}
              {invoice.supplier.email ? <div>Email: {invoice.supplier.email}</div> : null}
              {invoice.supplier.gstin ? <div className="mt-1 font-medium">GSTIN: {invoice.supplier.gstin}</div> : null}
              {invoice.supplier.website ? (
                <div>
                  <a href={invoice.supplier.website} className="text-blue-600 hover:underline">
                    {invoice.supplier.website}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-800 text-right">
          <div className="font-semibold">Invoice</div>
          <div>Invoice No: {invoice.invoiceNo}</div>
          <div>Date: {invoice.invoiceDate}</div>
          <div className="mt-2">
            Supply type:{" "}
            <span className="font-medium">
              {computed.supplyType === "INTRA_STATE" ? "Intra-state (CGST+SGST)" : "Inter-state (IGST)"}
            </span>
          </div>
          <div>
            Place of supply: {invoice.placeOfSupplyState} ({invoice.placeOfSupplyStateCode})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="border border-gray-200 rounded-md p-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Bill To</div>
          <div className="font-semibold">{invoice.buyer.legalName || "Buyer Name"}</div>
          <div className="text-sm text-gray-700 mt-1">
            <div>{invoice.buyer.addressLine1}</div>
            {invoice.buyer.addressLine2 ? <div>{invoice.buyer.addressLine2}</div> : null}
            <div>
              {invoice.buyer.city}
              {invoice.buyer.city ? ", " : ""}
              {invoice.buyer.state}
              {(invoice.buyer.country || "India") === "India" && invoice.buyer.stateCode
                ? ` (${invoice.buyer.stateCode})`
                : ""}{" "}
              {invoice.buyer.pinCode}
            </div>
            <div className="mt-1">Country: {invoice.buyer.country || "India"}</div>
            {invoice.invoiceType === "B2B" && invoice.buyer.gstin ? (
              <div className="mt-1">GSTIN: {invoice.buyer.gstin}</div>
            ) : null}
          </div>
        </div>

        <div className="border border-gray-200 rounded-md p-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Invoice Details</div>
          <div className="text-sm text-gray-700 space-y-1">
            <div>
              Currency:{" "}
              <span className="font-medium">
                {isInternational ? "INR + USD (display)" : invoice.currency}
              </span>
            </div>
            <div>
              Supplier state code: <span className="font-medium">{invoice.supplier.stateCode}</span>
            </div>
            {isInternational ? (
              <div>
                USD→INR rate: <span className="font-medium">{invoice.fxUsdInr}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[110px]">HSN/SAC</TableHead>
              <TableHead className="w-[80px] text-right">Qty</TableHead>
              <TableHead className="w-[120px] text-right">Rate</TableHead>
              <TableHead className="w-[120px] text-right">Taxable</TableHead>
              <TableHead className="w-[80px] text-right">GST%</TableHead>
              <TableHead className="w-[120px] text-right">Tax</TableHead>
              <TableHead className="w-[140px] text-right">Line total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {computed.items.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="whitespace-normal">
                  <div className="font-medium">{item.description || "—"}</div>
                </TableCell>
                <TableCell>{item.hsnSac || "—"}</TableCell>
                <TableCell className="text-right">{item.qty}</TableCell>
                <TableCell className="text-right">
                  {isInternational && item.unitPriceUsd != null ? (
                    <div className="flex flex-col items-end">
                      <span>{fmtUSD(item.unitPriceUsd)}</span>
                      <span className="text-xs text-gray-500">{fmtINR(item.unitPriceInr)}</span>
                    </div>
                  ) : (
                    fmtINR(item.unitPriceInr)
                  )}
                </TableCell>
                <TableCell className="text-right">{fmtINR(item.taxableValue)}</TableCell>
                <TableCell className="text-right">{item.gstRate}%</TableCell>
                <TableCell className="text-right">
                  {computed.supplyType === "INTRA_STATE"
                    ? fmtINR(item.tax.cgstAmount + item.tax.sgstAmount)
                    : fmtINR(item.tax.igstAmount)}
                </TableCell>
                <TableCell className="text-right">{fmtINR(item.tax.lineTotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-sm text-gray-700">
          {invoice.notes ? (
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-xs font-semibold text-gray-600 mb-2">Notes</div>
              <div className="whitespace-pre-wrap">{invoice.notes}</div>
            </div>
          ) : null}
        </div>

        <div className="border border-gray-200 rounded-md p-4">
          <div className="flex justify-between text-sm">
            <span>Taxable value</span>
            <span className="font-medium">{fmtINR(computed.totals.taxableValue)}</span>
          </div>
          {computed.supplyType === "INTRA_STATE" ? (
            <>
              <div className="flex justify-between text-sm mt-2">
                <span>CGST</span>
                <span className="font-medium">{fmtINR(computed.totals.cgstAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>SGST</span>
                <span className="font-medium">{fmtINR(computed.totals.sgstAmount)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm mt-2">
              <span>IGST</span>
              <span className="font-medium">{fmtINR(computed.totals.igstAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mt-2">
            <span>Total tax</span>
            <span className="font-medium">{fmtINR(computed.totals.totalTax)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Invoice total</span>
            <span className="font-medium">{fmtINR(computed.totals.invoiceTotal)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Rounded off</span>
            <span className="font-medium">{fmtINR(computed.totals.roundedOff)}</span>
          </div>
          <div className="flex justify-between text-base mt-3 pt-3 border-t border-gray-200">
            <span className="font-semibold">Grand total</span>
            <span className="font-semibold">{fmtINR(computed.totals.grandTotal)}</span>
          </div>
          {isInternational ? (
            <div className="flex justify-between text-sm mt-2 text-gray-700">
              <span>Grand total (USD)</span>
              <span className="font-medium">{fmtUSD(computed.totals.grandTotal / (invoice.fxUsdInr || 1))}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bank details + PAN */}
      {invoice.supplier.bankDetails || invoice.supplier.pan ? (
        <div className="mt-6 border border-gray-200 rounded-md p-4">
          <div className="text-xs font-semibold text-gray-600 mb-3">Payment Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            {invoice.supplier.pan ? (
              <div className="flex gap-2">
                <span className="text-gray-500 shrink-0">Company PAN:</span>
                <span className="font-semibold tracking-wide">{invoice.supplier.pan}</span>
              </div>
            ) : null}
            {invoice.supplier.bankDetails ? (
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 shrink-0">A/c Name:</span>
                  <span className="font-medium">{invoice.supplier.bankDetails.accountName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 shrink-0">Bank:</span>
                  <span>{invoice.supplier.bankDetails.bankName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 shrink-0">A/c No.:</span>
                  <span className="font-mono font-medium tracking-wider">{invoice.supplier.bankDetails.accountNo}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 shrink-0">Branch:</span>
                  <span>{invoice.supplier.bankDetails.branch}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 shrink-0">IFSC:</span>
                  <span className="font-mono font-medium">{invoice.supplier.bankDetails.ifsc}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-6 text-xs text-gray-600 text-center italic print:mt-6">
        *This is a computer generated invoice and does not require signature*
      </div>
    </div>
  )
}

