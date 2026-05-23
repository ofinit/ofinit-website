"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload } from "lucide-react"
import { DatabaseBackupPanel } from "@/components/admin/database-backup-panel"
import { TurnstileSettingsPanel } from "@/components/admin/turnstile-settings-panel"
import { SearchableSelect } from "@/components/ui/searchable-select"

import type { GstParty } from "@/lib/gst/invoice"
import { getIndiaStateNameByCode, INDIA_GST_STATES } from "@/lib/gst/india-states"
import { changeAdminEmail, changeAdminPassword, getAdminAccountInfo } from "@/app/actions/admin-actions"
import { loadSupplierProfileFromDb, saveSupplierProfileToDb } from "@/app/actions/gst-actions"
import { getPublicContactSettings, savePublicContactSettings } from "@/app/actions/site-content-actions"
import Link from "next/link"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const [logoUploading, setLogoUploading] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "OfinIT Solutions Pvt. Ltd.",
    siteTagline: "Transforming Ideas into Digital Reality",
    contactEmail: "",
    supportEmail: "support@ofinit.com",
    phone: "",
    address: "",
  })
  const [generalMessage, setGeneralMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [loadingGeneral, setLoadingGeneral] = useState(true)

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "OfinIT Solutions - Web, Software & Mobile App Development",
    metaDescription:
      "Leading technology company specializing in web development, software solutions, mobile apps, AI integration, and DevOps services.",
    metaKeywords: "web development, software development, mobile apps, AI integration, DevOps",
    googleAnalyticsId: "",
    googleSearchConsole: "",
  })

  const [socialSettings, setSocialSettings] = useState({
    facebook: "https://facebook.com/ofinit",
    twitter: "https://twitter.com/ofinit",
    linkedin: "https://linkedin.com/company/ofinit",
    instagram: "https://instagram.com/ofinit",
    github: "https://github.com/ofinit",
  })

  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [emailSettings, setEmailSettings] = useState({
    newEmail: "",
    confirmEmail: "",
    currentPassword: "",
  })
  const [emailMessage, setEmailMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [smtpSettings, setSmtpSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    smtpFromEmail: "",
    smtpFromName: "OfinIT Solutions",
    smtpEncryption: "tls",
  })

  const [supplierProfile, setSupplierProfile] = useState<GstParty>({
    legalName: "OfinIT Solutions Pvt. Ltd.",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pinCode: "",
    country: "India",
    state: "",
    stateCode: "27",
    gstin: "",
  })

  useEffect(() => {
    loadSupplierProfileFromDb()
      .then((existing) => {
        if (existing) setSupplierProfile(existing)
      })
      .catch(() => {})

    getAdminAccountInfo()
      .then((info) => {
        if (info) setAdminEmail(info.email)
      })
      .catch(() => {})

    getPublicContactSettings()
      .then((contact) => {
        setGeneralSettings((g) => ({
          ...g,
          contactEmail: contact.contactEmail,
          phone: contact.contactPhone,
          address: contact.contactAddress,
        }))
      })
      .catch(() => {})
      .finally(() => setLoadingGeneral(false))
  }, [])

  const supplierStateLabel = useMemo(() => {
    const code = supplierProfile.stateCode
    const name = getIndiaStateNameByCode(code) || supplierProfile.state
    return `${code}${name ? ` - ${name}` : ""}`
  }, [supplierProfile.stateCode, supplierProfile.state])

  const handleSaveSupplier = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    await saveSupplierProfileToDb({
      ...supplierProfile,
      country: "India",
      state: getIndiaStateNameByCode(supplierProfile.stateCode) || supplierProfile.state,
    })
    setSaving(false)
    alert("Supplier profile saved successfully!")
  }

  async function onLogoFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setLogoUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok) throw new Error(data.error || "Upload failed")
      if (data.url) setSupplierProfile((p) => ({ ...p, logoUrl: data.url }))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setLogoUploading(false)
    }
  }

  const handleSaveGeneral = async () => {
    setGeneralMessage(null)
    if (!generalSettings.contactEmail.trim()) {
      setGeneralMessage({ type: "error", text: "Contact email is required." })
      return
    }
    setSaving(true)
    const result = await savePublicContactSettings({
      contactEmail: generalSettings.contactEmail,
      contactPhone: generalSettings.phone,
      contactAddress: generalSettings.address,
    })
    setSaving(false)
    if (!result.ok) {
      setGeneralMessage({ type: "error", text: result.error })
      return
    }
    setGeneralMessage({
      type: "ok",
      text: "Contact details saved. Refresh the public site to see the footer update.",
    })
  }

  const handleSaveSEO = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    alert("SEO settings saved successfully!")
  }

  const handleSaveSocial = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    alert("Social media settings saved successfully!")
  }

  const handleChangeEmail = async () => {
    setEmailMessage(null)
    setSavingEmail(true)
    const result = await changeAdminEmail({
      newEmail: emailSettings.newEmail,
      confirmEmail: emailSettings.confirmEmail,
      currentPassword: emailSettings.currentPassword,
    })
    setSavingEmail(false)

    if (!result.ok) {
      setEmailMessage({ type: "error", text: result.error })
      return
    }

    setAdminEmail(result.email)
    setEmailSettings({ newEmail: "", confirmEmail: "", currentPassword: "" })
    setEmailMessage({
      type: "ok",
      text: `Login email updated to ${result.email}. Use it the next time you sign in.`,
    })
  }

  const handleChangePassword = async () => {
    setPasswordMessage(null)
    setSavingPassword(true)
    const result = await changeAdminPassword({
      currentPassword: securitySettings.currentPassword,
      newPassword: securitySettings.newPassword,
      confirmPassword: securitySettings.confirmPassword,
    })
    setSavingPassword(false)

    if (!result.ok) {
      setPasswordMessage({ type: "error", text: result.error })
      return
    }

    setSecuritySettings({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setPasswordMessage({ type: "ok", text: "Password updated. Use the new password next time you sign in." })
  }

  const handleSaveSMTP = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    alert("SMTP settings saved successfully!")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your website and admin panel settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="turnstile">Turnstile</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">General Settings</h2>
            <p className="text-sm text-gray-600 mb-2">
              Contact email, phone, and address below update the <strong>Contact</strong> block in the site footer on
              every public page.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              You can also edit them under{" "}
              <Link href="/admin/site" className="text-primary hover:underline">
                Website → Footer
              </Link>
              .
            </p>
            {generalMessage ? (
              <p
                className={`text-sm mb-4 rounded-lg px-3 py-2 ${
                  generalMessage.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {generalMessage.text}
              </p>
            ) : null}
            {loadingGeneral ? <p className="text-sm text-gray-500 mb-4">Loading contact details…</p> : null}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">Site Name *</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    placeholder="OfinIT Solutions"
                  />
                </div>
                <div>
                  <Label htmlFor="siteTagline">Site Tagline</Label>
                  <Input
                    id="siteTagline"
                    value={generalSettings.siteTagline}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteTagline: e.target.value })}
                    placeholder="Your company tagline"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    placeholder="contact@ofinit.com"
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                    placeholder="support@ofinit.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    placeholder={"498-2, Gudem, Siolim\nBardez, North Goa, Goa - 403517"}
                    disabled={loadingGeneral}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use one line, or two lines (street on first line, city/state on second).
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral} disabled={saving || loadingGeneral}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save contact details"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">SEO Settings</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="metaTitle">Meta Title *</Label>
                <Input
                  id="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                  placeholder="Your site title for search engines"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">{seoSettings.metaTitle.length}/60 characters</p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description *</Label>
                <Textarea
                  id="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                  placeholder="Brief description of your website"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">{seoSettings.metaDescription.length}/160 characters</p>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={seoSettings.metaKeywords}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaKeywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={seoSettings.googleAnalyticsId}
                    onChange={(e) => setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="googleSearchConsole">Google Search Console</Label>
                  <Input
                    id="googleSearchConsole"
                    value={seoSettings.googleSearchConsole}
                    onChange={(e) => setSeoSettings({ ...seoSettings, googleSearchConsole: e.target.value })}
                    placeholder="Verification code"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSEO} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Social Media Links</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={socialSettings.facebook}
                  onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={socialSettings.twitter}
                  onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={socialSettings.linkedin}
                  onChange={(e) => setSocialSettings({ ...socialSettings, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={socialSettings.instagram}
                  onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>

              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={socialSettings.github}
                  onChange={(e) => setSocialSettings({ ...socialSettings, github: e.target.value })}
                  placeholder="https://github.com/yourorg"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSocial} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="supplier">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Supplier Profile</h2>
            <p className="text-gray-600 mb-6">Used for all invoices (GST Invoices → Place of supply is derived from supplier state).</p>

            <div className="space-y-6">
              <div>
                <Label>Legal name *</Label>
                <Input
                  value={supplierProfile.legalName}
                  onChange={(e) => setSupplierProfile({ ...supplierProfile, legalName: e.target.value })}
                />
              </div>

              <div>
                <Label>Company logo</Label>
                <p className="text-sm text-gray-500 mt-1 mb-2">
                  Shown on every invoice header. Default:{" "}
                  <span className="font-mono text-xs">/ofinit-invoice-logo.svg</span> (site branding). Upload a
                  custom image or URL to replace it.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Input
                    value={supplierProfile.logoUrl || ""}
                    onChange={(e) => setSupplierProfile({ ...supplierProfile, logoUrl: e.target.value || undefined })}
                    placeholder="https://… or /uploads/…"
                    className="max-w-xl"
                  />
                  <input
                    ref={logoFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onLogoFileSelected}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={logoUploading}
                    onClick={() => logoFileRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {logoUploading ? "Uploading…" : "Upload"}
                  </Button>
                </div>
                {supplierProfile.logoUrl ? (
                  <div className="mt-3 flex items-center gap-4">
                    <img
                      src={supplierProfile.logoUrl}
                      alt="Logo preview"
                      className="h-12 w-auto max-w-[200px] object-contain border rounded p-1 bg-white"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSupplierProfile({ ...supplierProfile, logoUrl: undefined })}
                    >
                      Remove logo
                    </Button>
                  </div>
                ) : null}
              </div>

              <div>
                <Label>GSTIN</Label>
                <Input
                  value={supplierProfile.gstin || ""}
                  onChange={(e) => setSupplierProfile({ ...supplierProfile, gstin: e.target.value.toUpperCase() })}
                  placeholder="27AAAAA0000A1Z5"
                />
              </div>

              <div>
                <Label>Address line 1</Label>
                <Input
                  value={supplierProfile.addressLine1}
                  onChange={(e) => setSupplierProfile({ ...supplierProfile, addressLine1: e.target.value })}
                />
              </div>

              <div>
                <Label>Address line 2</Label>
                <Input
                  value={supplierProfile.addressLine2 || ""}
                  onChange={(e) => setSupplierProfile({ ...supplierProfile, addressLine2: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>City</Label>
                  <Input value={supplierProfile.city} onChange={(e) => setSupplierProfile({ ...supplierProfile, city: e.target.value })} />
                </div>
                <div>
                  <Label>PIN</Label>
                  <Input
                    value={supplierProfile.pinCode}
                    onChange={(e) => setSupplierProfile({ ...supplierProfile, pinCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>State</Label>
                  <SearchableSelect
                    value={supplierProfile.stateCode}
                    placeholder="Select state"
                    searchPlaceholder="Search state..."
                    options={INDIA_GST_STATES.map((s) => ({ value: s.code, label: s.name, keywords: s.code }))}
                    onChange={(v) =>
                      setSupplierProfile({
                        ...supplierProfile,
                        stateCode: v,
                        state: getIndiaStateNameByCode(v),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>State code</Label>
                  <Input value={supplierStateLabel} readOnly />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSupplier} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Supplier"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6 space-y-10">
            <div>
              <h2 className="text-xl font-semibold mb-2">Login email</h2>
              {adminEmail ? (
                <p className="text-sm text-gray-600 mb-6">
                  Current login email: <span className="font-medium text-gray-900">{adminEmail}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600 mb-6">Change the email address used to sign in to the admin panel.</p>
              )}
              {emailMessage ? (
                <p
                  className={`text-sm mb-4 rounded-lg px-3 py-2 ${
                    emailMessage.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {emailMessage.text}
                </p>
              ) : null}
              <div className="space-y-6 max-w-md">
                <div>
                  <Label htmlFor="newAdminEmail">New email address *</Label>
                  <Input
                    id="newAdminEmail"
                    type="email"
                    value={emailSettings.newEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, newEmail: e.target.value })}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmAdminEmail">Confirm new email *</Label>
                  <Input
                    id="confirmAdminEmail"
                    type="email"
                    value={emailSettings.confirmEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, confirmEmail: e.target.value })}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="emailCurrentPassword">Current password *</Label>
                  <Input
                    id="emailCurrentPassword"
                    type="password"
                    value={emailSettings.currentPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, currentPassword: e.target.value })}
                    placeholder="Confirm with your password"
                    autoComplete="current-password"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleChangeEmail} disabled={savingEmail || savingPassword}>
                    <Save className="w-4 h-4 mr-2" />
                    {savingEmail ? "Updating..." : "Update login email"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-10">
              <h2 className="text-xl font-semibold mb-6">Change password</h2>
              {passwordMessage ? (
                <p
                  className={`text-sm mb-4 rounded-lg px-3 py-2 ${
                    passwordMessage.type === "ok"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {passwordMessage.text}
                </p>
              ) : null}
              <div className="space-y-6 max-w-md">
              <div>
                <Label htmlFor="currentPassword">Current Password *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={securitySettings.currentPassword}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={securitySettings.newPassword}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={securitySettings.confirmPassword}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={savingPassword || savingEmail}>
                  <Save className="w-4 h-4 mr-2" />
                  {savingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="smtp">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">SMTP Configuration</h2>
            <p className="text-gray-600 mb-6">Configure email server settings for sending emails</p>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host *</Label>
                  <Input
                    id="smtpHost"
                    value={smtpSettings.smtpHost}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port *</Label>
                  <Input
                    id="smtpPort"
                    value={smtpSettings.smtpPort}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtpPort: e.target.value })}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username *</Label>
                  <Input
                    id="smtpUsername"
                    value={smtpSettings.smtpUsername}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtpUsername: e.target.value })}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password *</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={smtpSettings.smtpPassword}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtpPassword: e.target.value })}
                    placeholder="Your SMTP password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpFromEmail">From Email *</Label>
                  <Input
                    id="smtpFromEmail"
                    type="email"
                    value={smtpSettings.smtpFromEmail}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtpFromEmail: e.target.value })}
                    placeholder="noreply@ofinit.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpFromName">From Name</Label>
                  <Input
                    id="smtpFromName"
                    value={smtpSettings.smtpFromName}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtpFromName: e.target.value })}
                    placeholder="OfinIT Solutions"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtpEncryption">Encryption</Label>
                <select
                  id="smtpEncryption"
                  value={smtpSettings.smtpEncryption}
                  onChange={(e) => setSmtpSettings({ ...smtpSettings, smtpEncryption: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSMTP} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save SMTP Settings"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <DatabaseBackupPanel />
        </TabsContent>

        <TabsContent value="turnstile">
          <TurnstileSettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
