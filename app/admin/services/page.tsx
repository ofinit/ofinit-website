import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { deleteServiceForAdmin, listServicesForAdmin } from "@/app/actions/service-actions"

export const dynamic = "force-dynamic"

export default async function AdminServicesPage() {
  const services = await listServicesForAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-gray-600 mt-1">Manage service detail pages.</p>
        </div>
        <Link href="/admin/services/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No services found. Create your first service to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {services.map((s) => (
                <div key={s.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg truncate">{s.name}</h3>
                    <p className="text-gray-400 text-xs mt-1 font-mono">
                      /services/{s.slug} {s.published ? "" : "(draft)"}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/admin/services/edit/${s.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <form
                      action={async () => {
                        "use server"
                        await deleteServiceForAdmin(s.id)
                      }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

