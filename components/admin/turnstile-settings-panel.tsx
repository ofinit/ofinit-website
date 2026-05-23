"use client"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Shield } from "lucide-react"
import { getTurnstileSettingsForAdmin, saveTurnstileSettings } from "@/app/actions/turnstile-actions"

export function TurnstileSettingsPanel() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [siteKey, setSiteKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [hasStoredSecret, setHasStoredSecret] = useState(false)
  const [secretMasked, setSecretMasked] = useState("")
  const [activeSource, setActiveSource] = useState<"database" | "environment" | "none">("none")
  const [envSite, setEnvSite] = useState(false)
  const [envSecret, setEnvSecret] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTurnstileSettingsForAdmin()
      setEnabled(data.enabled)
      setSiteKey(data.siteKey)
      setHasStoredSecret(data.hasSecretKey)
      setSecretMasked(data.secretKeyMasked)
      setActiveSource(data.activeSource)
      setEnvSite(data.envSiteKeyPresent)
      setEnvSecret(data.envSecretPresent)
      setSecretKey("")
    } catch {
      setMessage({ type: "error", text: "Could not load Turnstile settings." })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleSave() {
    setMessage(null)
    setSaving(true)
    const result = await saveTurnstileSettings({
      enabled,
      siteKey,
      secretKey,
    })
    setSaving(false)
    if (!result.ok) {
      setMessage({ type: "error", text: result.error })
      return
    }
    setMessage({
      type: "ok",
      text: "Turnstile settings saved. Contact and newsletter forms will use the widget after visitors refresh the page.",
    })
    await load()
  }

  async function handleClearSecret() {
    if (!confirm("Remove the stored secret key? Turnstile will stop working until you add a new secret.")) return
    setSaving(true)
    const result = await saveTurnstileSettings({
      enabled: false,
      siteKey,
      secretKey: "",
      clearSecret: true,
    })
    setSaving(false)
    if (!result.ok) {
      setMessage({ type: "error", text: result.error })
      return
    }
    setMessage({ type: "ok", text: "Secret key removed and Turnstile disabled." })
    await load()
  }

  return (
    <Card className="p-6 space-y-8">
      <div className="flex items-start gap-3">
        <Shield className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <h2 className="text-xl font-semibold">Cloudflare Turnstile</h2>
          <p className="text-sm text-gray-600 mt-1">
            Bot protection for the contact form and blog newsletter. Keys saved here take effect immediately (no
            redeploy required).
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50/80 p-4 text-sm text-gray-800 space-y-3">
        <p className="font-semibold text-gray-900">Setup instructions</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Sign in to{" "}
            <a
              href="https://dash.cloudflare.com/?to=/:account/turnstile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cloudflare Dashboard → Turnstile
            </a>
            .
          </li>
          <li>
            Click <strong>Add widget</strong>. Choose <strong>Managed</strong> (recommended) or Non-interactive.
          </li>
          <li>
            Under <strong>Domains</strong>, add your site hostnames, e.g.{" "}
            <code className="text-xs bg-white px-1 rounded">ofinit.com</code>,{" "}
            <code className="text-xs bg-white px-1 rounded">www.ofinit.com</code>, and your Coolify preview domain if
            you test there.
          </li>
          <li>
            After creating the widget, copy the <strong>Site key</strong> (public) and <strong>Secret key</strong>{" "}
            (private).
          </li>
          <li>
            Paste them below, enable Turnstile, and click <strong>Save Turnstile settings</strong>.
          </li>
          <li>
            Open your public contact page in a private window and confirm the Turnstile box appears above{" "}
            <strong>Send message</strong>.
          </li>
        </ol>
        <p className="text-gray-600">
          <strong>Coolify / Docker:</strong> You can still set{" "}
          <code className="text-xs bg-white px-1 rounded">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> and{" "}
          <code className="text-xs bg-white px-1 rounded">TURNSTILE_SECRET_KEY</code> as environment variables. Admin
          keys override env when both site and secret are saved here. Env-only keys apply if nothing is stored in the
          database.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="rounded-lg bg-gray-50 p-4 text-sm space-y-1">
            <p>
              <span className="text-gray-500">Active on site:</span>{" "}
              <strong>{activeSource === "none" ? "Off (honeypot + rate limits only)" : activeSource}</strong>
            </p>
            {envSite || envSecret ? (
              <p className="text-gray-600">
                Server env: site key {envSite ? "set" : "not set"}, secret {envSecret ? "set" : "not set"}
              </p>
            ) : null}
          </div>

          {message ? (
            <p
              className={`text-sm rounded-lg px-3 py-2 ${
                message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </p>
          ) : null}

          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <Checkbox
                id="turnstile-enabled"
                checked={enabled}
                onCheckedChange={(v) => setEnabled(v === true)}
                disabled={saving}
              />
              <Label htmlFor="turnstile-enabled" className="font-normal cursor-pointer">
                Enable Turnstile on contact and newsletter forms
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turnstile-site-key">Site key (public)</Label>
              <Input
                id="turnstile-site-key"
                value={siteKey}
                onChange={(e) => setSiteKey(e.target.value)}
                placeholder="0x4AAAAAAA..."
                autoComplete="off"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turnstile-secret-key">Secret key (private)</Label>
              <Input
                id="turnstile-secret-key"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder={hasStoredSecret ? "Leave blank to keep current secret" : "0x4AAAAAAA..."}
                autoComplete="new-password"
                disabled={saving}
              />
              {hasStoredSecret && secretMasked ? (
                <p className="text-xs text-gray-500">
                  Stored secret: <code>{secretMasked}</code> — enter a new value only to replace it.
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving…" : "Save Turnstile settings"}
              </Button>
              {hasStoredSecret ? (
                <Button type="button" variant="outline" onClick={handleClearSecret} disabled={saving}>
                  Remove stored keys
                </Button>
              ) : null}
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
