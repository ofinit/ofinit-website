"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Database, Download, Upload } from "lucide-react"

type DbInfo = {
  supported: boolean
  path?: string
  sizeBytes?: number
  modifiedAt?: string
  error?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function DatabaseBackupPanel() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [info, setInfo] = useState<DbInfo | null>(null)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [backingUp, setBackingUp] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const loadInfo = useCallback(async () => {
    setLoadingInfo(true)
    try {
      const res = await fetch("/api/admin/db/info")
      const data = (await res.json()) as DbInfo
      setInfo(data)
    } catch {
      setInfo({ supported: false, error: "Could not load database info" })
    } finally {
      setLoadingInfo(false)
    }
  }, [])

  useEffect(() => {
    loadInfo()
  }, [loadInfo])

  const handleDownloadBackup = async () => {
    setBackingUp(true)
    try {
      const res = await fetch("/api/admin/db/backup")
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error || "Backup failed")
      }
      const blob = await res.blob()
      const disposition = res.headers.get("Content-Disposition")
      const match = disposition?.match(/filename="([^"]+)"/)
      const filename = match?.[1] ?? `ofinit-backup-${Date.now()}.db`

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Backup failed")
    } finally {
      setBackingUp(false)
    }
  }

  const handleRestore = async () => {
    if (!selectedFile) {
      alert("Choose a .db backup file first")
      return
    }
    setRestoring(true)
    try {
      const fd = new FormData()
      fd.append("file", selectedFile)
      const res = await fetch("/api/admin/db/restore", { method: "POST", body: fd })
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string }
      if (!res.ok) throw new Error(data.error || "Restore failed")
      setSelectedFile(null)
      if (fileRef.current) fileRef.current.value = ""
      alert(data.message ?? "Database restored successfully")
      await loadInfo()
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Restore failed")
    } finally {
      setRestoring(false)
    }
  }

  if (loadingInfo) {
    return (
      <Card className="p-6">
        <p className="text-gray-600">Loading database info…</p>
      </Card>
    )
  }

  if (!info?.supported) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Database backup</h2>
        <p className="text-gray-600">
          Backup and restore are only available when using a SQLite <code className="text-sm">file:</code>{" "}
          database. Your current <code className="text-sm">DATABASE_URL</code> is not supported.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 mb-6">
        <Database className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <h2 className="text-xl font-semibold">Database backup & restore</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Download a full copy of the SQLite database, or replace it with a previous backup. On Coolify,
            keep a persistent volume on <code className="text-sm">/app/data</code> so backups survive redeploys.
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-gray-500">File path (server)</dt>
          <dd className="font-mono text-xs mt-1 break-all">{info.path}</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-gray-500">Size / last modified</dt>
          <dd className="mt-1">
            {info.sizeBytes != null ? formatBytes(info.sizeBytes) : "—"}
            {info.modifiedAt ? (
              <span className="text-gray-500 block text-xs mt-1">
                {new Date(info.modifiedAt).toLocaleString()}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      <div className="space-y-8">
        <section>
          <h3 className="font-medium text-gray-900 mb-2">Download backup</h3>
          <p className="text-sm text-gray-600 mb-4">
            Creates a point-in-time snapshot of all content (pages, services, blog, leads, settings).
          </p>
          <Button type="button" onClick={handleDownloadBackup} disabled={backingUp}>
            <Download className="w-4 h-4 mr-2" />
            {backingUp ? "Preparing…" : "Download .db backup"}
          </Button>
        </section>

        <section className="border-t pt-8">
          <h3 className="font-medium text-gray-900 mb-2">Restore from backup</h3>
          <p className="text-sm text-gray-600 mb-4">
            This replaces the live database with your uploaded file. The current database is copied to a{" "}
            <code className="text-sm">.pre-restore-*</code> file on the server before overwrite.
          </p>
          <div className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="db-backup-file">Backup file (.db)</Label>
              <Input
                id="db-backup-file"
                ref={fileRef}
                type="file"
                accept=".db,.sqlite,.sqlite3,application/octet-stream"
                className="mt-1"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={!selectedFile || restoring}>
                  <Upload className="w-4 h-4 mr-2" />
                  {restoring ? "Restoring…" : "Restore database"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Restore database?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All current data will be replaced with{" "}
                    <strong>{selectedFile?.name ?? "the selected backup"}</strong>. This cannot be undone
                    from the UI (a pre-restore copy is saved on the server). Continue only if you are sure.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleRestore}
                  >
                    Yes, restore
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </Card>
  )
}
